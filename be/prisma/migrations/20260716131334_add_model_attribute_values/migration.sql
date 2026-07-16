-- CreateTable
CREATE TABLE "model_attribute_values" (
    "attribute_id" INTEGER NOT NULL,
    "model_id" VARCHAR(30) NOT NULL,
    "value" TEXT,

    CONSTRAINT "model_attribute_values_pkey" PRIMARY KEY ("attribute_id","model_id")
);

-- AddForeignKey
ALTER TABLE "model_attribute_values" ADD CONSTRAINT "model_attribute_values_attribute_id_fkey" FOREIGN KEY ("attribute_id") REFERENCES "attributes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "model_attribute_values" ADD CONSTRAINT "model_attribute_values_model_id_fkey" FOREIGN KEY ("model_id") REFERENCES "models"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
