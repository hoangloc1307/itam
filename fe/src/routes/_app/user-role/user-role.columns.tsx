'use no memo';

import { IconPencil, IconTrash } from '@tabler/icons-react';
import { type ColumnDef } from '@tanstack/react-table';
import type { TFunction } from 'i18next';
import type { UserRole } from 'itam-shared/types';
import { Button } from '~/components/ui/button';

interface ColumnActions {
  onEdit: (userRole: UserRole) => void;
  onDelete: (id: number) => void;
}

export const getUserRoleColumns = (
  t: TFunction,
  actions: ColumnActions,
): ColumnDef<UserRole & { role?: { name: string } }>[] => [
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
    header: t('columns.role'),
    accessorKey: 'roleCode',
    cell: ({ row }) => {
      const role = (row.original as UserRole & { role?: { name: string } }).role;
      return role ? role.name : row.original.roleCode;
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
