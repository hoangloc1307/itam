/*
  Warnings:

  - The primary key for the `categories` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "categories" DROP CONSTRAINT "categories_pkey",
ALTER COLUMN "id" SET DATA TYPE VARCHAR(30),
ALTER COLUMN "serial_key" SET DATA TYPE VARCHAR(30),
ADD CONSTRAINT "categories_pkey" PRIMARY KEY ("id");
