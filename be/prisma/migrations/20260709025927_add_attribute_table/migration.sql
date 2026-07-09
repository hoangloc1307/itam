-- CreateEnum
CREATE TYPE "AttributeDataType" AS ENUM ('TEXT', 'NUMBER', 'DATE', 'SELECT', 'BOOLEAN');

-- CreateTable
CREATE TABLE "attributes" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "measurement_unit" VARCHAR(50),
    "data_type" "AttributeDataType" NOT NULL DEFAULT 'TEXT',
    "options" JSON,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "deleted_at" TIMESTAMPTZ(0),
    "created_by" CHAR(8) NOT NULL,
    "created_at" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" CHAR(8),
    "updated_at" TIMESTAMPTZ(0),

    CONSTRAINT "attributes_pkey" PRIMARY KEY ("id")
);
