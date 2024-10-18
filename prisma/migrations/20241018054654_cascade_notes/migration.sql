-- DropForeignKey
ALTER TABLE "Note" DROP CONSTRAINT "Note_loanId_fkey";

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_loanId_fkey" FOREIGN KEY ("loanId") REFERENCES "Loan"("id") ON DELETE CASCADE ON UPDATE CASCADE;
