'use no memo';

import type { Column } from '@tanstack/react-table';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';

export default function FilterSelect<TData, TValue>({ column }: { column: Column<TData, TValue> }) {
  const { t } = useTranslation('datatable');
  const meta = column.columnDef.meta;

  const options = useMemo(() => {
    if (meta?.selectOptions) {
      return meta.selectOptions();
    }
    const faceted = column.getFacetedUniqueValues();
    return Array.from(faceted.keys()).map(String).sort().slice(0, 5000);
  }, [meta, column]);

  const items = useMemo(
    () => [{ value: '__all__', label: t('all') }, ...options.map((v) => ({ value: v, label: v }))],
    [options, t],
  );

  return (
    <Select
      value={(column.getFilterValue() as string) ?? '__all__'}
      onValueChange={(value) => column.setFilterValue(value === '__all__' ? undefined : value)}
      items={items}
    >
      <SelectTrigger className='w-full'>
        <SelectValue placeholder={t('all')} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {items.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
