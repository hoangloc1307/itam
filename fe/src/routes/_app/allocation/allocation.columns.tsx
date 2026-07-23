'use no memo';

import { IconArrowBack, IconTrash } from '@tabler/icons-react';
import { type ColumnDef } from '@tanstack/react-table';
import type { TFunction } from 'i18next';
import type { AllocationDetail } from 'itam-shared/types';
import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import { formatDate } from '~/lib/date';

interface ColumnActions {
  onReturn: (allocation: AllocationDetail) => void;
  onDelete: (id: number) => void;
}

export const getAllocationColumns = (
  t: TFunction,
  lang: string,
  actions: ColumnActions,
): ColumnDef<AllocationDetail>[] => [
  {
    id: 'actions',
    header: t('columns.actions'),
    enableColumnFilter: false,
    enableSorting: false,
    cell: ({ row }) => (
      <div className='flex items-center gap-1'>
        {row.original.isActive && (
          <>
            <Button
              variant='ghost'
              size='icon'
              title={t('return')}
              onClick={() => actions.onReturn(row.original)}
            >
              <IconArrowBack className='size-4' />
            </Button>
            <Button
              variant='ghost'
              size='icon'
              title={t('delete')}
              onClick={() => actions.onDelete(row.original.id)}
            >
              <IconTrash className='size-4' />
            </Button>
          </>
        )}
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
    header: t('columns.assetName'),
    accessorFn: (row) => row.asset.name,
    id: 'assetName',
  },
  {
    header: t('columns.assetCode'),
    accessorFn: (row) => row.asset.assetCode,
    id: 'assetCode',
  },
  {
    header: t('columns.categoryName'),
    accessorFn: (row) => row.asset.categoryName,
    id: 'categoryName',
  },
  {
    header: t('columns.modelName'),
    accessorFn: (row) => row.asset.modelName,
    id: 'modelName',
  },
  {
    header: t('columns.serialNumber'),
    accessorFn: (row) => row.asset.serialNumber,
    id: 'serialNumber',
  },
  {
    header: t('columns.employeeId'),
    accessorKey: 'employeeId',
  },
  {
    header: t('columns.sectionId'),
    accessorKey: 'sectionId',
  },
  {
    header: t('columns.quantity'),
    accessorKey: 'quantity',
    meta: {
      filterVariant: 'number-range',
    },
  },
  {
    header: t('columns.assignedDate'),
    accessorKey: 'assignedDate',
    filterFn: 'dateRange',
    cell: ({ getValue }) => {
      const value = getValue<string>();
      return value ? formatDate(value, 'P', lang) : '';
    },
    meta: {
      filterVariant: 'date-range',
    },
  },
  {
    header: t('columns.isActive'),
    accessorKey: 'isActive',
    filterFn: (row, _columnId, filterValue) => {
      if (!filterValue) return true;
      const isActive = row.getValue<boolean>('isActive');
      const label = isActive ? t('status.active') : t('status.returned');
      return label === filterValue;
    },
    cell: ({ getValue }) => {
      const isActive = getValue<boolean>();
      const label = isActive ? t('status.active') : t('status.returned');
      return <Badge variant={isActive ? 'success' : 'secondary'}>{label}</Badge>;
    },
    meta: {
      filterVariant: 'select',
      selectOptions: () => [t('status.active'), t('status.returned')],
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
