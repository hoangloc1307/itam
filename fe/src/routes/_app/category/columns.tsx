'use no memo';

import { type ColumnDef } from '@tanstack/react-table';
import type { TFunction } from 'i18next';
import type { Category } from '~/api/category';
import { Badge } from '~/components/ui/badge';
import { formatDate } from '~/lib/date';

export const getCategoryColumns = (t: TFunction, lang: string): ColumnDef<Category>[] => [
  {
    header: t('columns.id'),
    accessorKey: 'id',
  },
  {
    header: t('columns.name'),
    accessorKey: 'name',
  },
  {
    header: t('columns.serialKey'),
    accessorKey: 'serialKey',
  },
  {
    header: t('columns.maintenanceIntervalHours'),
    accessorKey: 'maintenanceIntervalHours',
    meta: {
      filterVariant: 'number-range',
    },
  },
  {
    header: t('columns.isActive'),
    accessorKey: 'isActive',
    filterFn: (row, _columnId, filterValue) => {
      if (!filterValue) return true;
      const isActive = row.getValue<boolean>('isActive');
      const label = isActive ? t('status.active') : t('status.inactive');
      return label === filterValue;
    },
    cell: ({ getValue }) => {
      const isActive = getValue<boolean>();
      const label = isActive ? t('status.active') : t('status.inactive');
      return <Badge variant={isActive ? 'success' : 'destructive'}>{label}</Badge>;
    },
    meta: {
      filterVariant: 'select',
      selectOptions: () => [t('status.active'), t('status.inactive')],
    },
  },
  {
    header: t('columns.createdBy'),
    accessorKey: 'createdBy',
  },
  {
    header: t('columns.createdAt'),
    accessorKey: 'createdAt',
    cell: ({ getValue }) => {
      const value = getValue<string>();
      return value ? formatDate(value, 'Pp', lang) : '';
    },
  },
  {
    header: t('columns.updatedBy'),
    accessorKey: 'updatedBy',
  },
  {
    header: t('columns.updatedAt'),
    accessorKey: 'updatedAt',
    cell: ({ getValue }) => {
      const value = getValue<string>();
      return value ? formatDate(value, 'Pp', lang) : '';
    },
  },
];
