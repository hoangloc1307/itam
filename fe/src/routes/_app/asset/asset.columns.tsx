'use no memo';

import { IconEdit, IconTrash } from '@tabler/icons-react';
import { type ColumnDef } from '@tanstack/react-table';
import type { TFunction } from 'i18next';
import type { Asset } from 'itam-shared/types';
import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import { formatDate } from '~/lib/date';

interface ColumnActions {
  onEdit: (asset: Asset) => void;
  onDelete: (id: string) => void;
}

const statusVariant = (status: string) => {
  switch (status) {
    case 'AVAILABLE':
      return 'success';
    case 'IN_USE':
      return 'info';
    case 'UNDER_REPAIR':
      return 'warning';
    case 'DISPOSED':
      return 'purple';
    case 'LOST':
      return 'destructive';
    default:
      return 'default';
  }
};

export const getAssetColumns = (
  t: TFunction,
  lang: string,
  actions: ColumnActions,
): ColumnDef<Asset>[] => [
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
    cell: ({ row, table }) => {
      const { pageIndex, pageSize } = table.getState().pagination;
      const sortedRows = table.getRowModel().rows;
      const indexInPage = sortedRows.findIndex((r) => r.id === row.id);
      return pageIndex * pageSize + indexInPage + 1;
    },
    size: 50,
  },
  {
    header: t('columns.id'),
    accessorKey: 'id',
  },
  {
    header: t('columns.assetCode'),
    accessorKey: 'assetCode',
  },
  {
    header: t('columns.name'),
    accessorKey: 'name',
  },
  {
    header: t('columns.categoryId'),
    accessorKey: 'categoryId',
  },
  {
    header: t('columns.serialNumber'),
    accessorKey: 'serialNumber',
  },
  {
    header: t('columns.location'),
    accessorKey: 'location',
  },
  {
    header: t('columns.assetStatus'),
    accessorKey: 'assetStatus',
    filterFn: (row, _columnId, filterValue) => {
      if (!filterValue) return true;
      const status = row.getValue<string>('assetStatus');
      const label = t(`assetStatus.${status}`);
      return label === filterValue;
    },
    cell: ({ getValue }) => {
      const status = getValue<string>();
      const label = t(`assetStatus.${status}`);
      return <Badge variant={statusVariant(status)}>{label}</Badge>;
    },
    meta: {
      filterVariant: 'select',
      selectOptions: () => [
        t('assetStatus.AVAILABLE'),
        t('assetStatus.IN_USE'),
        t('assetStatus.UNDER_REPAIR'),
        t('assetStatus.DISPOSED'),
        t('assetStatus.LOST'),
      ],
    },
  },
  {
    header: t('columns.assignedTo'),
    accessorKey: 'assignedTo',
  },
  {
    header: t('columns.currentSection'),
    accessorKey: 'currentSection',
  },
  {
    header: t('columns.quantity'),
    accessorKey: 'quantity',
    meta: {
      filterVariant: 'number-range',
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
];
