/*
  Warnings:

  - You are about to drop the column `clientEmail` on the `Loan` table. All the data in the column will be lost.
  - You are about to drop the column `clientName` on the `Loan` table. All the data in the column will be lost.
  - You are about to drop the column `clientPhone` on the `Loan` table. All the data in the column will be lost.
  - Made the column `name` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "CreditRating" AS ENUM ('EXCELLENT', 'GOOD', 'FAIR', 'POOR');

-- AlterTable
ALTER TABLE "Loan" DROP COLUMN "clientEmail",
DROP COLUMN "clientName",
DROP COLUMN "clientPhone";

-- AlterTable
ALTER TABLE "Note" ADD COLUMN     "borrowerId" TEXT,
ALTER COLUMN "loanId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "name" SET NOT NULL;

-- CreateTable
CREATE TABLE "Borrower" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "addressId" TEXT NOT NULL,
    "employer" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "income" DOUBLE PRECISION NOT NULL,
    "credit" "CreditRating" NOT NULL,

    CONSTRAINT "Borrower_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_BorrowerToLoan" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_BorrowerToLoan_AB_unique" ON "_BorrowerToLoan"("A", "B");

-- CreateIndex
CREATE INDEX "_BorrowerToLoan_B_index" ON "_BorrowerToLoan"("B");

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_borrowerId_fkey" FOREIGN KEY ("borrowerId") REFERENCES "Borrower"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Borrower" ADD CONSTRAINT "Borrower_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BorrowerToLoan" ADD CONSTRAINT "_BorrowerToLoan_A_fkey" FOREIGN KEY ("A") REFERENCES "Borrower"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BorrowerToLoan" ADD CONSTRAINT "_BorrowerToLoan_B_fkey" FOREIGN KEY ("B") REFERENCES "Loan"("id") ON DELETE CASCADE ON UPDATE CASCADE;
