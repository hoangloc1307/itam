import type { SyncAttributePayload } from 'itam-shared/types';
import { AppError } from '~/errors';
import { t } from '~/i18n';
import { prisma } from '~/lib/prisma';

const getByCategoryId = async (categoryId: string) => {
  const category = await prisma.category.findUnique({
    where: { id: categoryId, deletedAt: null },
  });

  if (!category) {
    throw AppError.notFound(t('category:notFound'));
  }

  const items = await prisma.categoryAttribute.findMany({
    where: { categoryId },
    include: {
      attribute: {
        select: {
          id: true,
          name: true,
          measurementUnit: true,
          dataType: true,
          options: true,
          group: { select: { name: true, sortOrder: true } },
        },
      },
    },
    orderBy: { sortOrder: 'asc' },
  });

  return items.map((item) => ({
    attributeId: item.attributeId,
    name: item.attribute.name,
    measurementUnit: item.attribute.measurementUnit,
    dataType: item.attribute.dataType,
    options: item.attribute.options as string[] | null,
    groupName: item.attribute.group?.name ?? null,
    groupSortOrder: item.attribute.group?.sortOrder ?? null,
    sortOrder: item.sortOrder,
    isRequired: item.isRequired,
  }));
};

const sync = async (categoryId: string, attributes: SyncAttributePayload[], username: string) => {
  const category = await prisma.category.findUnique({
    where: { id: categoryId, deletedAt: null },
  });

  if (!category) {
    throw AppError.notFound(t('category:notFound'));
  }

  await prisma.$transaction(async (tx) => {
    // Delete all existing
    await tx.categoryAttribute.deleteMany({ where: { categoryId } });

    // Insert new
    if (attributes.length > 0) {
      await tx.categoryAttribute.createMany({
        data: attributes.map((attr) => ({
          categoryId,
          attributeId: attr.attributeId,
          sortOrder: attr.sortOrder,
          isRequired: attr.isRequired,
          createdBy: username,
        })),
      });
    }
  });

  return getByCategoryId(categoryId);
};

export const categoryAttributeService = { getByCategoryId, sync };
