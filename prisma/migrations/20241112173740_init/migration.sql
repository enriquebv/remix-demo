-- CreateTable
CREATE TABLE "HeroLike" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "heroId" INTEGER NOT NULL,
    "authorUsername" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "HeroComment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "heroId" INTEGER NOT NULL,
    "authorUsername" TEXT NOT NULL,
    "comment" TEXT NOT NULL
);
