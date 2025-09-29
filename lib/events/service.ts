import { prisma } from '../prisma';
import { generateParticipationToken } from '../tokens';
import type { Event, WineContribution, Invitee, TimeOption } from '@prisma/client';

const MAX_PARTICIPANTS = 8;
const MIN_PARTICIPANTS = 2;

// ============================================================================
// Event CRUD Operations
// ============================================================================

export interface CreateEventInput {
  title: string;
  description?: string;
  createdBy: string;
  timeOptions: Array<{
    startTime: Date;
    endTime: Date;
  }>;
  invitees: Array<{
    name: string;
    email?: string;
  }>;
}

export async function createEvent(input: CreateEventInput): Promise<Event> {
  // Validate participant count
  if (input.invitees.length > MAX_PARTICIPANTS) {
    throw new Error(`Maximum ${MAX_PARTICIPANTS} participants allowed`);
  }

  if (input.invitees.length < MIN_PARTICIPANTS) {
    throw new Error(`Minimum ${MIN_PARTICIPANTS} participants required`);
  }

  const event = await prisma.event.create({
    data: {
      title: input.title,
      description: input.description,
      createdBy: input.createdBy,
      timeOptions: {
        create: input.timeOptions,
      },
      invitees: {
        create: input.invitees.map((invitee) => ({
          name: invitee.name,
          email: invitee.email,
          token: generateParticipationToken(),
        })),
      },
    },
    include: {
      timeOptions: true,
      invitees: true,
    },
  });

  return event;
}

export async function getEvent(eventId: string) {
  return prisma.event.findUnique({
    where: { id: eventId },
    include: {
      timeOptions: {
        include: {
          responses: {
            include: {
              invitee: true,
            },
          },
        },
      },
      invitees: true,
      wineContributions: {
        include: {
          invitee: true,
          duplicateFlags: true,
          flaggedAs: true,
          vivinoReference: true,
          ratings: true,
        },
      },
      selectedTimeOption: true,
    },
  });
}

export async function listEvents(createdBy?: string) {
  return prisma.event.findMany({
    where: createdBy ? { createdBy } : undefined,
    include: {
      timeOptions: true,
      invitees: true,
      _count: {
        select: {
          wineContributions: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}

export async function finalizeEvent(eventId: string, selectedTimeOptionId: string) {
  return prisma.event.update({
    where: { id: eventId },
    data: {
      finalized: true,
      finalizedAt: new Date(),
      selectedTimeOptionId,
    },
  });
}

export async function deleteEvent(eventId: string) {
  return prisma.event.delete({
    where: { id: eventId },
  });
}

// ============================================================================
// Participant Management
// ============================================================================

export async function addInvitee(eventId: string, name: string, email?: string): Promise<Invitee> {
  // Check current participant count
  const event = await prisma.event.findUnique({
    where: { id: eventId },
    include: {
      _count: {
        select: { invitees: true },
      },
    },
  });

  if (!event) {
    throw new Error('Event not found');
  }

  if (event._count.invitees >= MAX_PARTICIPANTS) {
    throw new Error(`Maximum ${MAX_PARTICIPANTS} participants reached`);
  }

  if (event.finalized) {
    throw new Error('Cannot add participants to a finalized event');
  }

  return prisma.invitee.create({
    data: {
      eventId,
      name,
      email,
      token: generateParticipationToken(),
    },
  });
}

export async function getInviteeByToken(token: string): Promise<Invitee | null> {
  return prisma.invitee.findUnique({
    where: { token },
    include: {
      event: true,
      timeResponses: true,
      wineContributions: true,
    },
  });
}

export async function submitAvailability(
  inviteeId: string,
  responses: Array<{ timeOptionId: string; available: boolean }>
) {
  // Delete existing responses
  await prisma.inviteeTimeResponse.deleteMany({
    where: { inviteeId },
  });

  // Create new responses
  await prisma.inviteeTimeResponse.createMany({
    data: responses.map((r) => ({
      inviteeId,
      timeOptionId: r.timeOptionId,
      available: r.available,
    })),
  });

  // Mark invitee as responded
  return prisma.invitee.update({
    where: { id: inviteeId },
    data: { respondedAt: new Date() },
  });
}

// ============================================================================
// Wine Contribution Management
// ============================================================================

export interface CreateWineInput {
  eventId: string;
  inviteeId: string;
  wineType: string;
  varietal?: string;
  producer?: string;
  region?: string;
  vintage?: number;
  price?: number;
  notes?: string;
}

export async function createWineContribution(input: CreateWineInput): Promise<WineContribution> {
  const wine = await prisma.wineContribution.create({
    data: input,
  });

  // Check for duplicates after creation
  await detectDuplicates(wine.id);

  return wine;
}

export async function updateWineContribution(
  wineId: string,
  data: Partial<CreateWineInput>
): Promise<WineContribution> {
  const wine = await prisma.wineContribution.update({
    where: { id: wineId },
    data,
  });

  // Re-check for duplicates after update
  await prisma.duplicateFlag.deleteMany({
    where: {
      OR: [{ originalWineId: wineId }, { duplicateWineId: wineId }],
    },
  });

  await detectDuplicates(wineId);

  return wine;
}

export async function deleteWineContribution(wineId: string) {
  return prisma.wineContribution.delete({
    where: { id: wineId },
  });
}

// ============================================================================
// Duplicate Detection
// ============================================================================

export async function detectDuplicates(wineId: string): Promise<void> {
  const wine = await prisma.wineContribution.findUnique({
    where: { id: wineId },
  });

  if (!wine) return;

  // Find potential duplicates in the same event
  const otherWines = await prisma.wineContribution.findMany({
    where: {
      eventId: wine.eventId,
      id: { not: wineId },
    },
  });

  for (const other of otherWines) {
    const similarity = calculateWineSimilarity(wine, other);

    if (similarity.isDuplicate) {
      // Create duplicate flag if not exists
      await prisma.duplicateFlag.upsert({
        where: {
          originalWineId_duplicateWineId: {
            originalWineId: wine.id,
            duplicateWineId: other.id,
          },
        },
        create: {
          originalWineId: wine.id,
          duplicateWineId: other.id,
          confidence: similarity.confidence,
          flaggedBy: 'system',
        },
        update: {
          confidence: similarity.confidence,
        },
      });
    }
  }
}

interface SimilarityResult {
  isDuplicate: boolean;
  confidence: 'high' | 'medium' | 'low';
  score: number;
}

function calculateWineSimilarity(
  wine1: WineContribution,
  wine2: WineContribution
): SimilarityResult {
  let score = 0;
  let maxScore = 0;

  // Compare producer (high weight)
  if (wine1.producer && wine2.producer) {
    maxScore += 30;
    if (normalizeString(wine1.producer) === normalizeString(wine2.producer)) {
      score += 30;
    }
  }

  // Compare varietal (high weight)
  if (wine1.varietal && wine2.varietal) {
    maxScore += 25;
    if (normalizeString(wine1.varietal) === normalizeString(wine2.varietal)) {
      score += 25;
    }
  }

  // Compare vintage (medium weight)
  if (wine1.vintage && wine2.vintage) {
    maxScore += 20;
    if (wine1.vintage === wine2.vintage) {
      score += 20;
    }
  }

  // Compare region (medium weight)
  if (wine1.region && wine2.region) {
    maxScore += 15;
    if (normalizeString(wine1.region) === normalizeString(wine2.region)) {
      score += 15;
    }
  }

  // Compare wine type (low weight)
  maxScore += 10;
  if (normalizeString(wine1.wineType) === normalizeString(wine2.wineType)) {
    score += 10;
  }

  const percentage = maxScore > 0 ? (score / maxScore) * 100 : 0;

  return {
    isDuplicate: percentage >= 70,
    confidence: percentage >= 90 ? 'high' : percentage >= 80 ? 'medium' : 'low',
    score: percentage,
  };
}

function normalizeString(str: string): string {
  return str.toLowerCase().trim().replace(/[^\w\s]/g, '');
}

// ============================================================================
// Vivino Integration (Placeholder)
// ============================================================================

export async function searchVivino(query: {
  producer?: string;
  varietal?: string;
  vintage?: number;
}): Promise<{ vivinoId?: string; url?: string; rating?: number } | null> {
  // TODO: Implement Vivino API integration
  // For now, return null to indicate no match found
  console.log('[Vivino] Search placeholder called with:', query);
  return null;
}

export async function attachVivinoReference(wineId: string) {
  const wine = await prisma.wineContribution.findUnique({
    where: { id: wineId },
  });

  if (!wine) return;

  const vivinoData = await searchVivino({
    producer: wine.producer ?? undefined,
    varietal: wine.varietal ?? undefined,
    vintage: wine.vintage ?? undefined,
  });

  if (vivinoData) {
    await prisma.vivinoReference.create({
      data: {
        wineContributionId: wineId,
        vivinoId: vivinoData.vivinoId ?? null,
        vivinoUrl: vivinoData.url ?? null,
        averageRating: vivinoData.rating ?? null,
      },
    });
  }
}

// ============================================================================
// Rating Management
// ============================================================================

export async function submitRating(
  wineContributionId: string,
  inviteeId: string,
  score: number,
  notes?: string
) {
  if (score < 0 || score > 100) {
    throw new Error('Score must be between 0 and 100');
  }

  return prisma.rating.upsert({
    where: {
      wineContributionId_inviteeId: {
        wineContributionId,
        inviteeId,
      },
    },
    create: {
      wineContributionId,
      inviteeId,
      score,
      notes,
    },
    update: {
      score,
      notes,
    },
  });
}

export async function getEventRatings(eventId: string) {
  const wines = await prisma.wineContribution.findMany({
    where: { eventId },
    include: {
      ratings: {
        include: {
          invitee: true,
        },
      },
      invitee: true,
    },
  });

  return wines.map((wine) => {
    const avgScore =
      wine.ratings.length > 0
        ? wine.ratings.reduce((sum, r) => sum + r.score, 0) / wine.ratings.length
        : null;

    return {
      ...wine,
      averageScore: avgScore,
      ratingCount: wine.ratings.length,
    };
  });
}