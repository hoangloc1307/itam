import type { SyncModelAttributeValuePayload } from 'itam-shared/types';
import { AppError } from '~/errors';
import { t } from '~/i18n';
import { prisma } from '~/lib/prisma';

const getByModelId = async (modelId: string) => {
  const model = await prisma.itemModel.findUnique({
    where: { id: modelId, deletedAt: null },
  });

  if (!model) {
    throw AppError.notFound(t('model:notFound'));
  }

  // Get category attributes for this model's category
  const categoryAttributes = await prisma.categoryAttribute.findMany({
    where: { categoryId: model.categoryId },
    include: {
      attribute: {
        select: {
          id: true,
          name: true,
          measurementUnit: true,
          dataType: true,
          options: true,
          groupId: true,
          group: { select: { name: true } },
        },
      },
    },
    orderBy: { sortOrder: 'asc' },
  });

  // Get existing values for this model
  const existingValues = await prisma.modelAttributeValue.findMany({
    where: { modelId },
  });

  const valueMap = new Map(existingValues.map((v) => [v.attributeId, v.value]));

  return categoryAttributes.map((ca) => ({
    attributeId: ca.attribute.id,
    name: ca.attribute.name,
    measurementUnit: ca.attribute.measurementUnit,
    dataType: ca.attribute.dataType,
    options: ca.attribute.options as string[] | null,
    groupId: ca.attribute.groupId,
    groupName: ca.attribute.group?.name ?? null,
    isRequired: ca.isRequired,
    value: valueMap.get(ca.attribute.id) ?? null,
  }));
};

const sync = async (modelId: string, values: SyncModelAttributeValuePayload[]) => {
  const model = await prisma.itemModel.findUnique({
    where: { id: modelId, deletedAt: null },
  });

  if (!model) {
    throw AppError.notFound(t('model:notFound'));
  }

  if (!Array.isArray(values)) {
    return getByModelId(modelId);
  }

  await prisma.$transaction(async (tx) => {
    // Delete all existing values for this model
    await tx.modelAttributeValue.deleteMany({ where: { modelId } });

    // Insert new values (only those with non-null/non-empty value)
    const toInsert = values.filter(
      (v) => v.value !== null && v.value !== undefined && v.value !== '',
    );
    if (toInsert.length > 0) {
      await tx.modelAttributeValue.createMany({
        data: toInsert.map((v) => ({
          modelId,
          attributeId: v.attributeId,
          value: String(v.value),
        })),
      });
    }
  });

  return getByModelId(modelId);
};

export const modelAttributeValueService = { getByModelId, sync };
