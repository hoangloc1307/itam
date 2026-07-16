'use no memo';

import { IconPencil, IconTrash } from '@tabler/icons-react';
import { type ColumnDef } from '@tanstack/react-table';
import type { TFunction } from 'i18next';
import type { UserPermission } from 'itam-shared/types';
import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';

interface ColumnActions {
  onEdit: (permission: UserPermission) => void;
  onDelete: (id: number) => void;
}

export const getUserPermissionColumns = (
  t: TFunction,
  actions: ColumnActions,
): ColumnDef<UserPermission & { feature?: { name: string } }>[] => [
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
          <IconPencil className='size-4' />
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
    cell: ({ row, table }) => {
      const { pageIndex, pageSize } = table.getState().pagination;
      const sortedRows = table.getRowModel().rows;
      const indexInPage = sortedRows.findIndex((r) => r.id === row.id);
      return pageIndex * pageSize + indexInPage + 1;
    },
    size: 50,
  },
  {
    header: t('columns.feature'),
    accessorKey: 'featureCode',
    cell: ({ row }) => {
      const feature = (row.original as UserPermission & { feature?: { name: string } }).feature;
      return feature ? feature.name : row.original.featureCode;
    },
  },
  {
    header: t('columns.action'),
    accessorKey: 'action',
  },
  {
    header: t('columns.decision'),
    accessorKey: 'decision',
    cell: ({ getValue }) => {
      const value = getValue<string>();
      return <Badge variant={value === 'ALLOW' ? 'default' : 'destructive'}>{value}</Badge>;
    },
  },
  {
    header: t('columns.section'),
    accessorKey: 'section',
    cell: ({ getValue }) => {
      const value = getValue<string | null>();
      return value ?? t('allSections');
    },
  },
];
