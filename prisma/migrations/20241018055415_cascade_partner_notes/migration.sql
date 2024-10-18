-- DropForeignKey
ALTER TABLE "Note" DROP CONSTRAINT "Note_senderId_fkey";

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "Partner"("id") ON DELETE SET NULL ON UPDATE CASCADE;
