/*
  Warnings:

  - You are about to drop the `model_attribute_values` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "model_attribute_values" DROP CONSTRAINT "model_attribute_values_attribute_id_fkey";

-- DropForeignKey
ALTER TABLE "model_attribute_values" DROP CONSTRAINT "model_attribute_values_model_id_fkey";

-- DropTable
DROP TABLE "model_attribute_values";
