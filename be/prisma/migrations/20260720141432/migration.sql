-- CreateEnum
CREATE TYPE "AssetStatus" AS ENUM ('AVAILABLE', 'IN_USE', 'UNDER_REPAIR', 'DISPOSED', 'LOST');

-- CreateEnum
CREATE TYPE "AssetHistoryType" AS ENUM ('ASSIGN', 'TRANSFER', 'RETURN', 'REPAIR', 'DISPOSE');

-- CreateTable
CREATE TABLE "assets" (
    "id" VARCHAR(50) NOT NULL,
    "asset_code" VARCHAR(50),
    "name" VARCHAR(200) NOT NULL,
    "category_id" VARCHAR(30) NOT NULL,
    "model_id" VARCHAR(30),
    "vendor_id" VARCHAR(30),
    "purchase_date" DATE,
    "purchase_price" DECIMAL(15,2),
    "warranty_start_date" DATE,
    "warranty_end_date" DATE,
    "warranty_month" INTEGER,
    "serial_number" VARCHAR(100),
    "location" VARCHAR(200),
    "maintenance_interval_hours" INTEGER,
    "last_maintenance_date" TIMESTAMPTZ(0),
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "remain_quantity" INTEGER NOT NULL DEFAULT 1,
    "qr_code" VARCHAR(255),
    "asset_status" "AssetStatus" NOT NULL DEFAULT 'AVAILABLE',
    "assigned_to" CHAR(8),
    "current_section" CHAR(4),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "deleted_at" TIMESTAMPTZ(0),
    "created_by" CHAR(8) NOT NULL,
    "created_at" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" CHAR(8),
    "updated_at" TIMESTAMPTZ(0),

    CONSTRAINT "assets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "asset_attribute_values" (
    "id" SERIAL NOT NULL,
    "attribute_id" INTEGER NOT NULL,
    "asset_id" VARCHAR(50) NOT NULL,
    "value" TEXT,

    CONSTRAINT "asset_attribute_values_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "asset_history" (
    "id" SERIAL NOT NULL,
    "asset_id" VARCHAR(50) NOT NULL,
    "type" "AssetHistoryType" NOT NULL,
    "location" VARCHAR(200),
    "employee_id" VARCHAR(30),
    "section_id" CHAR(4),
    "employee_receive_id" VARCHAR(30),
    "section_receive_id" CHAR(4),
    "quantity" INTEGER,
    "note" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_by" CHAR(8) NOT NULL,
    "created_at" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" CHAR(8),
    "updated_at" TIMESTAMPTZ(0),

    CONSTRAINT "asset_history_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "assets_asset_code_key" ON "assets"("asset_code");

-- CreateIndex
CREATE UNIQUE INDEX "asset_attribute_values_attribute_id_asset_id_key" ON "asset_attribute_values"("attribute_id", "asset_id");

-- AddForeignKey
ALTER TABLE "assets" ADD CONSTRAINT "assets_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assets" ADD CONSTRAINT "assets_model_id_fkey" FOREIGN KEY ("model_id") REFERENCES "models"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asset_attribute_values" ADD CONSTRAINT "asset_attribute_values_attribute_id_fkey" FOREIGN KEY ("attribute_id") REFERENCES "attributes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asset_attribute_values" ADD CONSTRAINT "asset_attribute_values_asset_id_fkey" FOREIGN KEY ("asset_id") REFERENCES "assets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asset_history" ADD CONSTRAINT "asset_history_asset_id_fkey" FOREIGN KEY ("asset_id") REFERENCES "assets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
