/*
  Warnings:

  - You are about to drop the column `logoUrl` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `profileImageUrl` on the `Partner` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Company" DROP COLUMN "logoUrl",
ADD COLUMN     "logo" BYTEA;

-- AlterTable
ALTER TABLE "Partner" DROP COLUMN "profileImageUrl",
ADD COLUMN     "profileImage" BYTEA;
