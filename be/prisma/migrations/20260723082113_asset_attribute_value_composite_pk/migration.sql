-- DropIndex
DROP INDEX IF EXISTS "asset_attribute_values_attribute_id_asset_id_key";

-- AlterTable
ALTER TABLE "asset_attribute_values" DROP CONSTRAINT "asset_attribute_values_pkey";
ALTER TABLE "asset_attribute_values" DROP COLUMN "id";
ALTER TABLE "asset_attribute_values" ADD CONSTRAINT "asset_attribute_values_pkey" PRIMARY KEY ("attribute_id", "asset_id");
