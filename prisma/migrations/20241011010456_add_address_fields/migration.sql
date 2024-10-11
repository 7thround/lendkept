/*
  Warnings:

  - You are about to drop the column `address` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `address` on the `Partner` table. All the data in the column will be lost.
  - Added the required column `addressLine1` to the `Company` table without a default value. This is not possible if the table is not empty.
  - Added the required column `city` to the `Company` table without a default value. This is not possible if the table is not empty.
  - Added the required column `state` to the `Company` table without a default value. This is not possible if the table is not empty.
  - Added the required column `zip` to the `Company` table without a default value. This is not possible if the table is not empty.
  - Added the required column `addressLine1` to the `Partner` table without a default value. This is not possible if the table is not empty.
  - Added the required column `city` to the `Partner` table without a default value. This is not possible if the table is not empty.
  - Added the required column `state` to the `Partner` table without a default value. This is not possible if the table is not empty.
  - Added the required column `zip` to the `Partner` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Company" DROP COLUMN "address",
ADD COLUMN     "addressLine1" TEXT NOT NULL,
ADD COLUMN     "addressLine2" TEXT,
ADD COLUMN     "city" TEXT NOT NULL,
ADD COLUMN     "state" TEXT NOT NULL,
ADD COLUMN     "zip" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Partner" DROP COLUMN "address",
ADD COLUMN     "addressLine1" TEXT NOT NULL,
ADD COLUMN     "addressLine2" TEXT,
ADD COLUMN     "city" TEXT NOT NULL,
ADD COLUMN     "state" TEXT NOT NULL,
ADD COLUMN     "zip" TEXT NOT NULL;
