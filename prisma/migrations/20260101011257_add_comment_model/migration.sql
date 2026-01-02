/*
  Warnings:

  - Made the column `imageUrl` on table `Category` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Category" ALTER COLUMN "imageUrl" SET NOT NULL;

-- CreateTable
CREATE TABLE "Comment" (
    "id" TEXT NOT NULL,
    "userName" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;
