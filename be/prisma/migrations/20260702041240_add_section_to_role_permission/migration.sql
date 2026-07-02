/*
  Warnings:

  - The primary key for the `role_permission` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[role_code,feature_code,action,section]` on the table `role_permission` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "role_permission" DROP CONSTRAINT "role_permission_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD COLUMN     "section" CHAR(4),
ADD CONSTRAINT "role_permission_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "role_permission_role_code_feature_code_action_section_key" ON "role_permission"("role_code", "feature_code", "action", "section");
