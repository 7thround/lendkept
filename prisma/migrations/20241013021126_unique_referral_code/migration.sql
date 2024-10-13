/*
  Warnings:

  - A unique constraint covering the columns `[referralCode]` on the table `Partner` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Partner_referralCode_key" ON "Partner"("referralCode");
