-- DropForeignKey
ALTER TABLE "Loan" DROP CONSTRAINT "Loan_partnerId_fkey";

-- AlterTable
ALTER TABLE "Loan" ALTER COLUMN "partnerId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Loan" ADD CONSTRAINT "Loan_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES "Partner"("id") ON DELETE SET NULL ON UPDATE CASCADE;
