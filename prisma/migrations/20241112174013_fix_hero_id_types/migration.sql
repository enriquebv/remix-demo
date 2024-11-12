-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_HeroComment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "heroId" TEXT NOT NULL,
    "authorUsername" TEXT NOT NULL,
    "comment" TEXT NOT NULL
);
INSERT INTO "new_HeroComment" ("authorUsername", "comment", "heroId", "id") SELECT "authorUsername", "comment", "heroId", "id" FROM "HeroComment";
DROP TABLE "HeroComment";
ALTER TABLE "new_HeroComment" RENAME TO "HeroComment";
CREATE TABLE "new_HeroLike" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "heroId" TEXT NOT NULL,
    "authorUsername" TEXT NOT NULL
);
INSERT INTO "new_HeroLike" ("authorUsername", "heroId", "id") SELECT "authorUsername", "heroId", "id" FROM "HeroLike";
DROP TABLE "HeroLike";
ALTER TABLE "new_HeroLike" RENAME TO "HeroLike";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
