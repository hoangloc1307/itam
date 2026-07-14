'use no memo';

import { IconEdit, IconTrash } from '@tabler/icons-react';
import { type ColumnDef } from '@tanstack/react-table';
import type { TFunction } from 'i18next';
import type { Category, Model } from 'itam-shared/types';
import { MANAGE_TYPES } from 'itam-shared/constants';
import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import { formatDate } from '~/lib/date';

interface ColumnActions {
  onEdit: (model: Model) => void;
  onDelete: (id: string) => void;
}

export const getModelColumns = (
  t: TFunction,
  lang: string,
  actions: ColumnActions,
  categories: Category[],
): ColumnDef<Model>[] => [
  {
    id: 'actions',
    header: t('columns.actions'),
    enableColumnFilter: false,
    enableSorting: false,
    cell: ({ row }) => (
      <div className='flex items-center gap-1'>
        <Button
          variant='ghost'
          size='icon'
          title={t('edit')}
          onClick={() => actions.onEdit(row.original)}
        >
          <IconEdit className='size-4' />
        </Button>
        <Button
          variant='ghost'
          size='icon'
          title={t('deleteConfirm')}
          onClick={() => actions.onDelete(row.original.id)}
        >
          <IconTrash className='size-4' />
        </Button>
      </div>
    ),
    size: 100,
  },
  {
    id: 'rowNumber',
    header: '#',
    enableColumnFilter: false,
    enableSorting: false,
    cell: ({ row }) => row.index + 1,
    size: 50,
  },
  {
    header: t('columns.id'),
    accessorKey: 'id',
  },
  {
    header: t('columns.name'),
    accessorKey: 'name',
    size: 250,
  },
  {
    header: t('columns.categoryId'),
    accessorKey: 'categoryId',
    cell: ({ getValue }) => {
      const categoryId = getValue<string>();
      const category = categories.find((c) => c.id === categoryId);
      return category?.name ?? categoryId;
    },
  },
  {
    header: t('columns.manufacturer'),
    accessorKey: 'manufacturer',
  },
  {
    header: t('columns.manageType'),
    accessorKey: 'manageType',
    filterFn: (row, _columnId, filterValue) => {
      if (!filterValue) return true;
      const value = row.getValue<string | null>('manageType');
      if (!value) return false;
      const label =
        value === MANAGE_TYPES.INDIVIDUAL ? t('manageTypes.individual') : t('manageTypes.bulk');
      return label === filterValue;
    },
    cell: ({ getValue }) => {
      const value = getValue<string | null>();
      if (!value) return '';
      return value === MANAGE_TYPES.INDIVIDUAL
        ? t('manageTypes.individual')
        : t('manageTypes.bulk');
    },
    meta: {
      filterVariant: 'select',
      selectOptions: () => [t('manageTypes.individual'), t('manageTypes.bulk')],
    },
  },
  {
    header: t('columns.modelCode'),
    accessorKey: 'modelCode',
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
    filterFn: 'dateRange',
    cell: ({ getValue }) => {
      const value = getValue<string>();
      return value ? formatDate(value, 'Pp', lang) : '';
    },
    meta: {
      filterVariant: 'date-range',
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
