/*
  Warnings:

  - You are about to drop the column `logo` on the `Company` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Company" DROP COLUMN "logo",
ADD COLUMN     "logoUrl" TEXT;

-- AlterTable
ALTER TABLE "Partner" ADD COLUMN     "profileImageUrl" TEXT;
