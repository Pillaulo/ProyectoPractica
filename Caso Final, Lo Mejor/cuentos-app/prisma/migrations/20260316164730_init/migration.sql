-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'TUTOR');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'BLOCKED');

-- CreateEnum
CREATE TYPE "ReadingLevel" AS ENUM ('PRE_READER', 'BEGINNER', 'BASIC', 'INTERMEDIATE');

-- CreateEnum
CREATE TYPE "StoryLength" AS ENUM ('TINY', 'SHORT', 'MEDIUM');

-- CreateEnum
CREATE TYPE "Tone" AS ENUM ('FUNNY', 'ADVENTURE', 'CALM', 'MYSTERY_SOFT', 'FRIENDSHIP');

-- CreateEnum
CREATE TYPE "SpanishVariant" AS ENUM ('NEUTRAL', 'LATAM', 'ES');

-- CreateEnum
CREATE TYPE "SegmentMode" AS ENUM ('NONE', 'SYLLABLES_ES', 'PHRASES', 'BOTH');

-- CreateEnum
CREATE TYPE "ModerationStatus" AS ENUM ('OK', 'FLAGGED', 'HIDDEN');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'TUTOR',
    "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChildProfile" (
    "id" TEXT NOT NULL,
    "tutorId" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "readingLevel" "ReadingLevel" NOT NULL,
    "language" TEXT NOT NULL DEFAULT 'es',
    "spanishVariant" "SpanishVariant" NOT NULL DEFAULT 'NEUTRAL',
    "preferredLength" "StoryLength" NOT NULL DEFAULT 'SHORT',
    "defaultSegmentMode" "SegmentMode" NOT NULL DEFAULT 'PHRASES',
    "interests" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "avoidTopics" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ChildProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Story" (
    "id" TEXT NOT NULL,
    "tutorId" TEXT NOT NULL,
    "childProfileId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "theme" TEXT,
    "contentText" TEXT NOT NULL,
    "contentJson" JSONB NOT NULL,
    "paramsJson" JSONB NOT NULL,
    "profileSnapshotJson" JSONB NOT NULL,
    "groqModel" TEXT,
    "tokenUsageJson" JSONB,
    "moderationStatus" "ModerationStatus" NOT NULL DEFAULT 'OK',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Story_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PromptTemplate" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "systemPrompt" TEXT NOT NULL,
    "developerPrompt" TEXT NOT NULL,
    "rulesJson" JSONB,
    "active" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PromptTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "ChildProfile" ADD CONSTRAINT "ChildProfile_tutorId_fkey" FOREIGN KEY ("tutorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Story" ADD CONSTRAINT "Story_tutorId_fkey" FOREIGN KEY ("tutorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Story" ADD CONSTRAINT "Story_childProfileId_fkey" FOREIGN KEY ("childProfileId") REFERENCES "ChildProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
