'use no memo';

import { IconEdit, IconTrash } from '@tabler/icons-react';
import { type ColumnDef } from '@tanstack/react-table';
import type { TFunction } from 'i18next';
import type { Role } from 'itam-shared/types';
import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import { formatDate } from '~/lib/date';

interface ColumnActions {
  onEdit: (role: Role) => void;
  onDelete: (code: string) => void;
}

export const getRoleColumns = (
  t: TFunction,
  lang: string,
  actions: ColumnActions,
): ColumnDef<Role>[] => [
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
          onClick={() => actions.onDelete(row.original.code)}
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
    header: t('columns.code'),
    accessorKey: 'code',
  },
  {
    header: t('columns.name'),
    accessorKey: 'name',
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
