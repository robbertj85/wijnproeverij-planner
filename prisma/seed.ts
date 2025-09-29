import { PrismaClient } from '@prisma/client';
import { generateParticipationToken } from '../lib/tokens';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create a sample event
  const event = await prisma.event.create({
    data: {
      title: 'Wine Tasting bij Jan',
      description: 'Een gezellige wijnproeverij met vrienden',
      createdBy: 'jan@example.com',
      finalized: false,
    },
  });

  console.log(`✓ Created event: ${event.title}`);

  // Create time options
  const timeOption1 = await prisma.timeOption.create({
    data: {
      eventId: event.id,
      startTime: new Date('2025-10-15T18:00:00Z'),
      endTime: new Date('2025-10-15T22:00:00Z'),
    },
  });

  const timeOption2 = await prisma.timeOption.create({
    data: {
      eventId: event.id,
      startTime: new Date('2025-10-16T18:00:00Z'),
      endTime: new Date('2025-10-16T22:00:00Z'),
    },
  });

  const timeOption3 = await prisma.timeOption.create({
    data: {
      eventId: event.id,
      startTime: new Date('2025-10-17T19:00:00Z'),
      endTime: new Date('2025-10-17T23:00:00Z'),
    },
  });

  console.log(`✓ Created ${3} time options`);

  // Create invitees
  const invitees = await Promise.all([
    prisma.invitee.create({
      data: {
        eventId: event.id,
        name: 'Piet',
        email: 'piet@example.com',
        token: generateParticipationToken(),
        respondedAt: new Date(),
      },
    }),
    prisma.invitee.create({
      data: {
        eventId: event.id,
        name: 'Marie',
        email: 'marie@example.com',
        token: generateParticipationToken(),
        respondedAt: new Date(),
      },
    }),
    prisma.invitee.create({
      data: {
        eventId: event.id,
        name: 'Tom',
        email: 'tom@example.com',
        token: generateParticipationToken(),
      },
    }),
  ]);

  console.log(`✓ Created ${invitees.length} invitees`);

  // Create availability responses
  await prisma.inviteeTimeResponse.createMany({
    data: [
      // Piet available for all
      { inviteeId: invitees[0].id, timeOptionId: timeOption1.id, available: true },
      { inviteeId: invitees[0].id, timeOptionId: timeOption2.id, available: true },
      { inviteeId: invitees[0].id, timeOptionId: timeOption3.id, available: true },
      // Marie available for option 2 and 3
      { inviteeId: invitees[1].id, timeOptionId: timeOption1.id, available: false },
      { inviteeId: invitees[1].id, timeOptionId: timeOption2.id, available: true },
      { inviteeId: invitees[1].id, timeOptionId: timeOption3.id, available: true },
    ],
  });

  console.log(`✓ Created availability responses`);

  // Create wine contributions
  const wine1 = await prisma.wineContribution.create({
    data: {
      eventId: event.id,
      inviteeId: invitees[0].id,
      wineType: 'Red',
      varietal: 'Cabernet Sauvignon',
      producer: 'Château Margaux',
      region: 'Bordeaux, France',
      vintage: 2015,
      price: 45.0,
      notes: 'Full-bodied with notes of black currant and cedar',
    },
  });

  const wine2 = await prisma.wineContribution.create({
    data: {
      eventId: event.id,
      inviteeId: invitees[1].id,
      wineType: 'White',
      varietal: 'Chardonnay',
      producer: 'Domaine Leflaive',
      region: 'Burgundy, France',
      vintage: 2018,
      price: 65.0,
      notes: 'Elegant with citrus and mineral notes',
    },
  });

  const wine3 = await prisma.wineContribution.create({
    data: {
      eventId: event.id,
      inviteeId: invitees[0].id,
      wineType: 'Red',
      varietal: 'Cabernet Sauvignon',
      producer: 'Château Margaux',
      region: 'Bordeaux, France',
      vintage: 2015,
      price: 45.0,
      notes: 'Duplicate entry for testing',
    },
  });

  console.log(`✓ Created ${3} wine contributions`);

  // Create duplicate flag
  await prisma.duplicateFlag.create({
    data: {
      originalWineId: wine1.id,
      duplicateWineId: wine3.id,
      confidence: 'high',
      flaggedBy: 'system',
    },
  });

  console.log(`✓ Created duplicate flag`);

  // Create Vivino reference (placeholder)
  await prisma.vivinoReference.create({
    data: {
      wineContributionId: wine1.id,
      vivinoId: '12345',
      vivinoUrl: 'https://www.vivino.com/wines/12345',
      averageRating: 4.3,
      ratingCount: 2847,
      imageUrl: 'https://images.vivino.com/thumbs/example.jpg',
    },
  });

  console.log(`✓ Created Vivino reference`);

  console.log('✅ Seeding complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });