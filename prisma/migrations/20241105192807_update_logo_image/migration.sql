/*
  Warnings:

  - You are about to drop the column `logo` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `profileImage` on the `Partner` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Company" DROP COLUMN "logo";

-- AlterTable
ALTER TABLE "Partner" DROP COLUMN "profileImage";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "profileImage" BYTEA;
