-- AlterTable
ALTER TABLE "Loan" ADD COLUMN     "loanAdminId" TEXT;

-- AddForeignKey
ALTER TABLE "Loan" ADD CONSTRAINT "Loan_loanAdminId_fkey" FOREIGN KEY ("loanAdminId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
