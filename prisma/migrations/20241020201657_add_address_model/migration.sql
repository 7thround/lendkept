/*
  Warnings:

  - You are about to drop the column `addressLine1` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `addressLine2` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `city` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `state` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `zip` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `addressLine1` on the `Loan` table. All the data in the column will be lost.
  - You are about to drop the column `addressLine2` on the `Loan` table. All the data in the column will be lost.
  - You are about to drop the column `city` on the `Loan` table. All the data in the column will be lost.
  - You are about to drop the column `state` on the `Loan` table. All the data in the column will be lost.
  - You are about to drop the column `zip` on the `Loan` table. All the data in the column will be lost.
  - You are about to drop the column `addressLine1` on the `Partner` table. All the data in the column will be lost.
  - You are about to drop the column `addressLine2` on the `Partner` table. All the data in the column will be lost.
  - You are about to drop the column `city` on the `Partner` table. All the data in the column will be lost.
  - You are about to drop the column `state` on the `Partner` table. All the data in the column will be lost.
  - You are about to drop the column `zip` on the `Partner` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[addressId]` on the table `Company` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[addressId]` on the table `Loan` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[addressId]` on the table `Partner` will be added. If there are existing duplicate values, this will fail.
  - Made the column `senderId` on table `Note` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Note" DROP CONSTRAINT "Note_senderId_fkey";

-- AlterTable
ALTER TABLE "Company" DROP COLUMN "addressLine1",
DROP COLUMN "addressLine2",
DROP COLUMN "city",
DROP COLUMN "state",
DROP COLUMN "zip",
ADD COLUMN     "addressId" TEXT;

-- AlterTable
ALTER TABLE "Loan" DROP COLUMN "addressLine1",
DROP COLUMN "addressLine2",
DROP COLUMN "city",
DROP COLUMN "state",
DROP COLUMN "zip",
ADD COLUMN     "addressId" TEXT;

-- AlterTable
ALTER TABLE "Note" ALTER COLUMN "senderId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Partner" DROP COLUMN "addressLine1",
DROP COLUMN "addressLine2",
DROP COLUMN "city",
DROP COLUMN "state",
DROP COLUMN "zip",
ADD COLUMN     "addressId" TEXT;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "name" SET DEFAULT 'User';

-- CreateTable
CREATE TABLE "Address" (
    "id" TEXT NOT NULL,
    "addressLine1" TEXT NOT NULL,
    "addressLine2" TEXT,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "zip" TEXT NOT NULL,

    CONSTRAINT "Address_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Company_addressId_key" ON "Company"("addressId");

-- CreateIndex
CREATE UNIQUE INDEX "Loan_addressId_key" ON "Loan"("addressId");

-- CreateIndex
CREATE UNIQUE INDEX "Partner_addressId_key" ON "Partner"("addressId");

-- AddForeignKey
ALTER TABLE "Partner" ADD CONSTRAINT "Partner_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Company" ADD CONSTRAINT "Company_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Loan" ADD CONSTRAINT "Loan_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address"("id") ON DELETE SET NULL ON UPDATE CASCADE;
