/*
  Warnings:

  - You are about to drop the column `projectMangeUserId` on the `Team` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Team" DROP COLUMN "projectMangeUserId",
ADD COLUMN     "projectManagerUserId" INTEGER;
