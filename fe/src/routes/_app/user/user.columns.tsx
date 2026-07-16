'use no memo';

import { IconEdit, IconKey, IconTrash } from '@tabler/icons-react';
import { type ColumnDef } from '@tanstack/react-table';
import type { TFunction } from 'i18next';
import type { User } from 'itam-shared/types';
import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import { formatDate } from '~/lib/date';

interface ColumnActions {
  onEdit: (user: User) => void;
  onDelete: (username: string) => void;
  onResetPassword: (username: string) => void;
}

export const getUserColumns = (
  t: TFunction,
  lang: string,
  actions: ColumnActions,
): ColumnDef<User>[] => [
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
          title={t('resetPassword')}
          onClick={() => actions.onResetPassword(row.original.username)}
        >
          <IconKey className='size-4' />
        </Button>
        <Button
          variant='ghost'
          size='icon'
          title={t('deleteConfirm')}
          onClick={() => actions.onDelete(row.original.username)}
        >
          <IconTrash className='size-4' />
        </Button>
      </div>
    ),
    size: 130,
  },
  {
    id: 'rowNumber',
    header: '#',
    enableColumnFilter: false,
    enableSorting: false,
    cell: ({ row, table }) => {
      const { pageIndex, pageSize } = table.getState().pagination;
      const sortedRows = table.getRowModel().rows;
      const indexInPage = sortedRows.findIndex((r) => r.id === row.id);
      return pageIndex * pageSize + indexInPage + 1;
    },
    size: 50,
  },
  {
    header: t('columns.username'),
    accessorKey: 'username',
  },
  {
    header: t('columns.name'),
    accessorKey: 'name',
  },
  {
    header: t('columns.email'),
    accessorKey: 'email',
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
