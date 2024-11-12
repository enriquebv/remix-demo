/*
  Warnings:

  - The required column `uuid` was added to the `HeroComment` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_HeroComment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "uuid" TEXT NOT NULL,
    "heroId" TEXT NOT NULL,
    "authorUsername" TEXT NOT NULL,
    "comment" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_HeroComment" ("authorUsername", "comment", "createdAt", "heroId", "id") SELECT "authorUsername", "comment", "createdAt", "heroId", "id" FROM "HeroComment";
DROP TABLE "HeroComment";
ALTER TABLE "new_HeroComment" RENAME TO "HeroComment";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
