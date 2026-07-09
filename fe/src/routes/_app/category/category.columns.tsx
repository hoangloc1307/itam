'use no memo';

import { IconEdit, IconTrash } from '@tabler/icons-react';
import { type ColumnDef } from '@tanstack/react-table';
import type { TFunction } from 'i18next';
import type { Category } from 'itam-shared/types';
import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import { formatDate } from '~/lib/date';

interface ColumnActions {
  onEdit: (category: Category) => void;
  onDelete: (id: string) => void;
}

export const getCategoryColumns = (
  t: TFunction,
  lang: string,
  actions: ColumnActions,
): ColumnDef<Category>[] => [
  {
    id: 'actions',
    header: t('columns.actions'),
    enableColumnFilter: false,
    enableSorting: false,
    cell: ({ row }) => (
      <div className='flex items-center gap-1'>
        <Button variant='ghost' size='icon' onClick={() => actions.onEdit(row.original)}>
          <IconEdit className='size-4' />
        </Button>
        <Button variant='ghost' size='icon' onClick={() => actions.onDelete(row.original.id)}>
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
