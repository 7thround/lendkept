-- AlterTable
ALTER TABLE "Borrower" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "phone" DROP NOT NULL,
ALTER COLUMN "employer" DROP NOT NULL,
ALTER COLUMN "position" DROP NOT NULL,
ALTER COLUMN "income" DROP NOT NULL,
ALTER COLUMN "credit" DROP NOT NULL;