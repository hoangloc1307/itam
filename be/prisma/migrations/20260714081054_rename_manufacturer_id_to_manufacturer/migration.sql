/*
  Warnings:

  - You are about to drop the column `manufacturer_id` on the `models` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "models" DROP COLUMN "manufacturer_id",
ADD COLUMN     "manufacturer" VARCHAR(150);
