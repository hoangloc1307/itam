/*
  Warnings:

  - You are about to drop the column `assigned_to` on the `assets` table. All the data in the column will be lost.
  - You are about to drop the column `current_section` on the `assets` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "assets" DROP COLUMN "assigned_to",
DROP COLUMN "current_section";

-- CreateTable
CREATE TABLE "asset_allocations" (
    "id" SERIAL NOT NULL,
    "asset_id" VARCHAR(50) NOT NULL,
    "employee_id" CHAR(8),
    "section_id" CHAR(4),
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "assigned_date" DATE NOT NULL,
    "request_no" VARCHAR(50),
    "note" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_by" CHAR(8) NOT NULL,
    "created_at" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" CHAR(8),
    "updated_at" TIMESTAMPTZ(0),

    CONSTRAINT "asset_allocations_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "asset_allocations" ADD CONSTRAINT "asset_allocations_asset_id_fkey" FOREIGN KEY ("asset_id") REFERENCES "assets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
