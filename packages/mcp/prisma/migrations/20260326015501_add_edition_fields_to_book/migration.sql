/*
  Warnings:

  - You are about to drop the column `isbn` on the `Book` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Book" DROP COLUMN "isbn",
ADD COLUMN     "format" TEXT,
ADD COLUMN     "fullTitle" TEXT,
ADD COLUMN     "isbn10" TEXT,
ADD COLUMN     "isbn13" TEXT,
ADD COLUMN     "revision" INTEGER,
ADD COLUMN     "type" TEXT;
