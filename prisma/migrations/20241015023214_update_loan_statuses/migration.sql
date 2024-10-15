/*
  Warnings:

  - The values [APPLICATION,RUN_CREDIT,BORROWER_DOCUMENTS,LOAN_SUBMITTED,DISCLOSURES_SENT,APPRAISAL,CONDITIONAL_APPROVAL,SUBMITTED_TO_UNDERWRITING,FINALS_CLOSING_DISCLOSURE,LOAN_DOCS_SUBMITTED] on the enum `LoanStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "LoanStatus_new" AS ENUM ('POSSIBLE_LOAN', 'APPLICATION_SUBMITTED', 'CREDIT_AND_DOCUMENTS', 'UNDERWRITING', 'LOAN_FUNDED', 'ON_HOLD', 'CANCELLED', 'NOT_QUALIFIED');
ALTER TABLE "Loan" ALTER COLUMN "status" TYPE "LoanStatus_new" USING ("status"::text::"LoanStatus_new");
ALTER TYPE "LoanStatus" RENAME TO "LoanStatus_old";
ALTER TYPE "LoanStatus_new" RENAME TO "LoanStatus";
DROP TYPE "LoanStatus_old";
COMMIT;
