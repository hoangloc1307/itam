'use no memo';

import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import type { SyncAttributePayload } from 'itam-shared/types';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { attributeQueries } from '~/api/attribute.queries';
import { categoryAttributeQueries } from '~/api/category-attribute.queries';
import { categoryQueries } from '~/api/category.queries';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';
import { useSyncCategoryAttributes } from '~/hooks/mutations/use-category-attribute';
import { TransferList } from '~/routes/_app/category-attribute/transfer-list';

const CategoryAttributePage = () => {
  const { t } = useTranslation('categoryAttribute');
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  const { data: categoriesData } = useQuery(categoryQueries.all());
  const { data: attributesData } = useQuery(attributeQueries.all());
  const { data: assignedData } = useQuery(categoryAttributeQueries.byCategory(selectedCategory));
  const syncMutation = useSyncCategoryAttributes();

  const categories = categoriesData?.data ?? [];
  const allAttributes = attributesData?.data ?? [];
  const assignedItems = assignedData?.data ?? [];

  const handleSync = (items: SyncAttributePayload[]) => {
    if (!selectedCategory) return;
    syncMutation.mutate({ categoryId: selectedCategory, attributes: items });
  };

  return (
    <div>
      <h1 className='text-foreground mb-4 text-2xl font-bold'>{t('title')}</h1>

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

      {selectedCategory && (
        <TransferList
          key={selectedCategory}
          allAttributes={allAttributes}
          assignedItems={assignedItems}
          onSync={handleSync}
        />
      )}
    </div>
  );
};

export const Route = createFileRoute('/_app/category-attribute/')({
  component: CategoryAttributePage,
});
