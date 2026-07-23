-- CreateEnum
CREATE TYPE "ResetCycle" AS ENUM ('DAILY', 'MONTHLY', 'YEARLY', 'NEVER');

-- CreateTable
CREATE TABLE "document_sequences" (
    "id" SERIAL NOT NULL,
    "code" VARCHAR(50) NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "prefix" VARCHAR(20) NOT NULL DEFAULT '',
    "separator" VARCHAR(5) NOT NULL DEFAULT '-',
    "date_format" VARCHAR(20) NOT NULL DEFAULT 'YYYYMMDD',
    "padding_length" INTEGER NOT NULL DEFAULT 4,
    "reset_cycle" "ResetCycle" NOT NULL DEFAULT 'DAILY',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "deleted_at" TIMESTAMPTZ(0),
    "created_by" CHAR(8) NOT NULL,
    "created_at" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" CHAR(8),
    "updated_at" TIMESTAMPTZ(0),

    CONSTRAINT "document_sequences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "document_sequence_counters" (
    "id" SERIAL NOT NULL,
    "sequence_id" INTEGER NOT NULL,
    "period_key" VARCHAR(10) NOT NULL,
    "last_number" INTEGER NOT NULL DEFAULT 0,
    "updated_at" TIMESTAMPTZ(0) NOT NULL,

    CONSTRAINT "document_sequence_counters_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "document_sequences_code_key" ON "document_sequences"("code");

-- CreateIndex
CREATE UNIQUE INDEX "document_sequence_counters_sequence_id_period_key_key" ON "document_sequence_counters"("sequence_id", "period_key");

-- AddForeignKey
ALTER TABLE "document_sequence_counters" ADD CONSTRAINT "document_sequence_counters_sequence_id_fkey" FOREIGN KEY ("sequence_id") REFERENCES "document_sequences"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
