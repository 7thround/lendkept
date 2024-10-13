/*
  Warnings:

  - You are about to drop the column `defaultBonus` on the `Company` table. All the data in the column will be lost.
  - Made the column `slug` on table `Company` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Company" DROP COLUMN "defaultBonus",
ALTER COLUMN "slug" SET NOT NULL;
