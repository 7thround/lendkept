/*
  Warnings:

  - Made the column `partnerId` on table `Loan` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Loan" DROP CONSTRAINT "Loan_partnerId_fkey";

-- AlterTable
ALTER TABLE "Loan" ALTER COLUMN "partnerId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Loan" ADD CONSTRAINT "Loan_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES "Partner"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
