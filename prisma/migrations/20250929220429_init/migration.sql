-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "createdBy" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "finalized" BOOLEAN NOT NULL DEFAULT false,
    "finalizedAt" DATETIME,
    "selectedTimeOptionId" TEXT,
    CONSTRAINT "Event_selectedTimeOptionId_fkey" FOREIGN KEY ("selectedTimeOptionId") REFERENCES "TimeOption" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TimeOption" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "eventId" TEXT NOT NULL,
    "startTime" DATETIME NOT NULL,
    "endTime" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "TimeOption_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Invitee" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "eventId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "token" TEXT NOT NULL,
    "tokenCreatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "respondedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Invitee_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "InviteeTimeResponse" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "inviteeId" TEXT NOT NULL,
    "timeOptionId" TEXT NOT NULL,
    "available" BOOLEAN NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "InviteeTimeResponse_inviteeId_fkey" FOREIGN KEY ("inviteeId") REFERENCES "Invitee" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "InviteeTimeResponse_timeOptionId_fkey" FOREIGN KEY ("timeOptionId") REFERENCES "TimeOption" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "WineContribution" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "eventId" TEXT NOT NULL,
    "inviteeId" TEXT NOT NULL,
    "wineType" TEXT NOT NULL,
    "varietal" TEXT,
    "producer" TEXT,
    "region" TEXT,
    "vintage" INTEGER,
    "price" REAL,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "WineContribution_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "WineContribution_inviteeId_fkey" FOREIGN KEY ("inviteeId") REFERENCES "Invitee" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DuplicateFlag" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "originalWineId" TEXT NOT NULL,
    "duplicateWineId" TEXT NOT NULL,
    "flaggedBy" TEXT,
    "confidence" TEXT NOT NULL DEFAULT 'high',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "DuplicateFlag_originalWineId_fkey" FOREIGN KEY ("originalWineId") REFERENCES "WineContribution" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "DuplicateFlag_duplicateWineId_fkey" FOREIGN KEY ("duplicateWineId") REFERENCES "WineContribution" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Rating" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "wineContributionId" TEXT NOT NULL,
    "inviteeId" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Rating_wineContributionId_fkey" FOREIGN KEY ("wineContributionId") REFERENCES "WineContribution" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Rating_inviteeId_fkey" FOREIGN KEY ("inviteeId") REFERENCES "Invitee" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "VivinoReference" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "wineContributionId" TEXT NOT NULL,
    "vivinoId" TEXT,
    "vivinoUrl" TEXT,
    "averageRating" REAL,
    "ratingCount" INTEGER,
    "imageUrl" TEXT,
    "fetchedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "VivinoReference_wineContributionId_fkey" FOREIGN KEY ("wineContributionId") REFERENCES "WineContribution" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "Event_createdBy_idx" ON "Event"("createdBy");

-- CreateIndex
CREATE INDEX "Event_finalized_idx" ON "Event"("finalized");

-- CreateIndex
CREATE INDEX "TimeOption_eventId_idx" ON "TimeOption"("eventId");

-- CreateIndex
CREATE INDEX "TimeOption_startTime_idx" ON "TimeOption"("startTime");

-- CreateIndex
CREATE UNIQUE INDEX "Invitee_token_key" ON "Invitee"("token");

-- CreateIndex
CREATE INDEX "Invitee_eventId_idx" ON "Invitee"("eventId");

-- CreateIndex
CREATE INDEX "Invitee_token_idx" ON "Invitee"("token");

-- CreateIndex
CREATE INDEX "Invitee_email_idx" ON "Invitee"("email");

-- CreateIndex
CREATE INDEX "InviteeTimeResponse_inviteeId_idx" ON "InviteeTimeResponse"("inviteeId");

-- CreateIndex
CREATE INDEX "InviteeTimeResponse_timeOptionId_idx" ON "InviteeTimeResponse"("timeOptionId");

-- CreateIndex
CREATE UNIQUE INDEX "InviteeTimeResponse_inviteeId_timeOptionId_key" ON "InviteeTimeResponse"("inviteeId", "timeOptionId");

-- CreateIndex
CREATE INDEX "WineContribution_eventId_idx" ON "WineContribution"("eventId");

-- CreateIndex
CREATE INDEX "WineContribution_inviteeId_idx" ON "WineContribution"("inviteeId");

-- CreateIndex
CREATE INDEX "WineContribution_wineType_idx" ON "WineContribution"("wineType");

-- CreateIndex
CREATE INDEX "DuplicateFlag_originalWineId_idx" ON "DuplicateFlag"("originalWineId");

-- CreateIndex
CREATE INDEX "DuplicateFlag_duplicateWineId_idx" ON "DuplicateFlag"("duplicateWineId");

-- CreateIndex
CREATE UNIQUE INDEX "DuplicateFlag_originalWineId_duplicateWineId_key" ON "DuplicateFlag"("originalWineId", "duplicateWineId");

-- CreateIndex
CREATE INDEX "Rating_wineContributionId_idx" ON "Rating"("wineContributionId");

-- CreateIndex
CREATE INDEX "Rating_inviteeId_idx" ON "Rating"("inviteeId");

-- CreateIndex
CREATE INDEX "Rating_score_idx" ON "Rating"("score");

-- CreateIndex
CREATE UNIQUE INDEX "Rating_wineContributionId_inviteeId_key" ON "Rating"("wineContributionId", "inviteeId");

-- CreateIndex
CREATE UNIQUE INDEX "VivinoReference_wineContributionId_key" ON "VivinoReference"("wineContributionId");

-- CreateIndex
CREATE INDEX "VivinoReference_vivinoId_idx" ON "VivinoReference"("vivinoId");
