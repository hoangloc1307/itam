-- CreateTable
CREATE TABLE "categories" (
    "id" CHAR(30) NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "serial_key" CHAR(30) NOT NULL,
    "maintenance_interval_hours" INTEGER,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_by" CHAR(8) NOT NULL,
    "created_at" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" CHAR(8),
    "updated_at" TIMESTAMPTZ(0),

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);
