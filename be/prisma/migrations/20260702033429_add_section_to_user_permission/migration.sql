/*
  Warnings:

  - The primary key for the `user_permission` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[username,feature_code,action,section]` on the table `user_permission` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "user_permission" DROP CONSTRAINT "user_permission_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD COLUMN     "section" CHAR(4),
ADD CONSTRAINT "user_permission_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "user_permission_username_feature_code_action_section_key" ON "user_permission"("username", "feature_code", "action", "section");
