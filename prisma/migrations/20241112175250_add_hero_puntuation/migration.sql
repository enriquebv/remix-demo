-- CreateTable
CREATE TABLE "HeroPuntuation" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "heroId" TEXT NOT NULL,
    "authorUsername" TEXT NOT NULL,
    "puntuation" INTEGER NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_HeroComment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "heroId" TEXT NOT NULL,
    "authorUsername" TEXT NOT NULL,
    "comment" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_HeroComment" ("authorUsername", "comment", "heroId", "id") SELECT "authorUsername", "comment", "heroId", "id" FROM "HeroComment";
DROP TABLE "HeroComment";
ALTER TABLE "new_HeroComment" RENAME TO "HeroComment";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;