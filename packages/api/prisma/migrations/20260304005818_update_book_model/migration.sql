/*
  Warnings:

  - You are about to drop the column `googleBooksId` on the `Book` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[openLibraryId]` on the table `Book` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `openLibraryId` to the `Book` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Book_googleBooksId_key";

-- AlterTable
ALTER TABLE "Book" DROP COLUMN "googleBooksId",
ADD COLUMN     "openLibraryId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Book_openLibraryId_key" ON "Book"("openLibraryId");
