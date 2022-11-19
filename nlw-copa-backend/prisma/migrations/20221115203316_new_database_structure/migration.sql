/*
  Warnings:

  - You are about to drop the column `ownerId` on the `Pool` table. All the data in the column will be lost.
  - You are about to drop the column `gameId` on the `Guess` table. All the data in the column will be lost.
  - You are about to drop the column `participantId` on the `Guess` table. All the data in the column will be lost.
  - You are about to drop the column `poolId` on the `Participant` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Participant` table. All the data in the column will be lost.
  - Added the required column `game_id` to the `Guess` table without a default value. This is not possible if the table is not empty.
  - Added the required column `participant_id` to the `Guess` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pool_id` to the `Participant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `Participant` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Pool" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "owner_id" TEXT,
    "title" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Pool_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Pool" ("code", "created_at", "id", "title") SELECT "code", "created_at", "id", "title" FROM "Pool";
DROP TABLE "Pool";
ALTER TABLE "new_Pool" RENAME TO "Pool";
CREATE UNIQUE INDEX "Pool_code_key" ON "Pool"("code");
CREATE TABLE "new_Guess" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "game_id" TEXT NOT NULL,
    "participant_id" TEXT NOT NULL,
    "first_team_points" INTEGER NOT NULL,
    "second_team_points" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Guess_participant_id_fkey" FOREIGN KEY ("participant_id") REFERENCES "Participant" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Guess_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "Game" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Guess" ("created_at", "first_team_points", "id", "second_team_points") SELECT "created_at", "first_team_points", "id", "second_team_points" FROM "Guess";
DROP TABLE "Guess";
ALTER TABLE "new_Guess" RENAME TO "Guess";
CREATE TABLE "new_Participant" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "pool_id" TEXT NOT NULL,
    CONSTRAINT "Participant_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Participant_pool_id_fkey" FOREIGN KEY ("pool_id") REFERENCES "Pool" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Participant" ("id") SELECT "id" FROM "Participant";
DROP TABLE "Participant";
ALTER TABLE "new_Participant" RENAME TO "Participant";
CREATE UNIQUE INDEX "Participant_user_id_pool_id_key" ON "Participant"("user_id", "pool_id");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
