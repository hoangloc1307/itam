'use no memo';

import { IconDeviceFloppy } from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import type { SyncAttributePayload } from 'itam-shared/types';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { attributeQueries } from '~/api/attribute.queries';
import { categoryAttributeQueries } from '~/api/category-attribute.queries';
import { categoryQueries } from '~/api/category.queries';
import { TransferList, type AssignedItem, type TransferItem } from '~/components/transfer-list';
import { Button } from '~/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';
import { useSyncCategoryAttributes } from '~/hooks/mutations/use-category-attribute';

const CategoryAttributePage = () => {
  const { t } = useTranslation('categoryAttribute');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const assignedRef = useRef<AssignedItem[]>([]);

  const { data: categoriesData } = useQuery(categoryQueries.all());
  const { data: attributesData } = useQuery(attributeQueries.all());
  const { data: assignedData, isFetched: isAssignedFetched } = useQuery(
    categoryAttributeQueries.byCategory(selectedCategory),
  );
  const syncMutation = useSyncCategoryAttributes();

  const categories = categoriesData?.data ?? [];
  const allAttributes = attributesData?.data ?? [];
  const assignedItems = assignedData?.data ?? [];

  const availableSource: TransferItem[] = allAttributes.map((attr) => ({
    id: attr.id,
    label: attr.name,
    description: attr.measurementUnit ?? undefined,
    badge: attr.dataType,
    group: attr.group?.name ?? undefined,
    groupSortOrder: attr.group?.sortOrder ?? undefined,
  }));

  const assignedSource: AssignedItem[] = assignedItems.map((item) => ({
    id: item.attributeId,
    label: item.name,
    description: item.measurementUnit ?? undefined,
    badge: item.dataType,
    group: item.groupName ?? undefined,
    groupSortOrder: item.groupSortOrder ?? undefined,
    isRequired: item.isRequired,
  }));

  const handleSave = () => {
    if (!selectedCategory) return;
    const payload: SyncAttributePayload[] = assignedRef.current.map((item, index) => ({
      attributeId: item.id,
      sortOrder: index,
      isRequired: item.isRequired,
    }));
    syncMutation.mutate({ categoryId: selectedCategory, attributes: payload });
  };

  return (
    <div>
      <div className='mb-4 flex items-center justify-between'>
        <h1 className='text-foreground text-2xl font-bold'>{t('title')}</h1>
        <Button onClick={handleSave} disabled={!selectedCategory}>
          <IconDeviceFloppy data-icon='inline-start' />
          {t('save')}
        </Button>
      </div>

      <div className='mb-6'>
        <Select value={selectedCategory} onValueChange={(val) => val && setSelectedCategory(val)}>
          <SelectTrigger className='w-[300px]'>
            <SelectValue placeholder={t('selectCategory')}>
              {categories.find((cat) => cat.id === selectedCategory)?.name}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedCategory && isAssignedFetched && (
        <TransferList
          key={`${selectedCategory}-${assignedItems.length}`}
          availableSource={availableSource}
          assignedSource={assignedSource}
          onAssignedChange={(items) => {
            assignedRef.current = items;
          }}
          labels={{
            available: t('available'),
            assigned: t('assigned'),
            noAvailable: t('noAvailable'),
            noAssigned: t('noAssigned'),
            required: t('required'),
            ungrouped: t('ungrouped'),
          }}
        />
      )}
    </div>
  );
};

export const Route = createFileRoute('/_app/category-attribute/')({
  component: CategoryAttributePage,
});
