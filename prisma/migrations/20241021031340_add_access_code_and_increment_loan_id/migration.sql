/*
  Warnings:

  - The primary key for the `Loan` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Loan` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[accessCode]` on the table `Loan` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `accessCode` to the `Loan` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `loanId` on the `Note` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "Note" DROP CONSTRAINT "Note_loanId_fkey";

-- AlterTable
ALTER TABLE "Loan" DROP CONSTRAINT "Loan_pkey",
ADD COLUMN     "accessCode" TEXT NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Loan_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Note" DROP COLUMN "loanId",
ADD COLUMN     "loanId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Loan_accessCode_key" ON "Loan"("accessCode");

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_loanId_fkey" FOREIGN KEY ("loanId") REFERENCES "Loan"("id") ON DELETE CASCADE ON UPDATE CASCADE;
