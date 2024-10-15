/*
  Warnings:

  - The values [SBA] on the enum `LoanType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the `Message` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "LoanType_new" AS ENUM ('EQUITY', 'HOME_PURCHASE', 'REFINANCE', 'GENERAL_PURPOSE');
ALTER TABLE "Loan" ALTER COLUMN "loanType" TYPE "LoanType_new" USING ("loanType"::text::"LoanType_new");
ALTER TYPE "LoanType" RENAME TO "LoanType_old";
ALTER TYPE "LoanType_new" RENAME TO "LoanType";
DROP TYPE "LoanType_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_loanId_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_senderId_fkey";

-- DropTable
DROP TABLE "Message";

-- CreateTable
CREATE TABLE "Note" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "loanId" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,

    CONSTRAINT "Note_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_loanId_fkey" FOREIGN KEY ("loanId") REFERENCES "Loan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "Partner"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
