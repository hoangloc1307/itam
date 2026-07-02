/*
  Warnings:

  - The primary key for the `user_role` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[username,role_code,section]` on the table `user_role` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "user_role" DROP CONSTRAINT "user_role_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD COLUMN     "section" CHAR(4),
ADD CONSTRAINT "user_role_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "user_role_username_role_code_section_key" ON "user_role"("username", "role_code", "section");
