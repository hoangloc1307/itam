'use no memo';

import { IconEdit, IconTrash } from '@tabler/icons-react';
import { type ColumnDef } from '@tanstack/react-table';
import type { TFunction } from 'i18next';
import type { Attribute } from 'itam-shared/types';
import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import { formatDate } from '~/lib/date';

interface ColumnActions {
  onEdit: (attribute: Attribute) => void;
  onDelete: (id: number) => void;
}

export const getAttributeColumns = (
  t: TFunction,
  lang: string,
  actions: ColumnActions,
): ColumnDef<Attribute>[] => [
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
          <IconEdit className='size-5' />
        </Button>
        <Button
          variant='ghost'
          size='icon'
          title={t('deleteConfirm')}
          onClick={() => actions.onDelete(row.original.id)}
        >
          <IconTrash className='size-5' />
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
    header: t('columns.name'),
    accessorKey: 'name',
  },
  {
    header: t('columns.measurementUnit'),
    accessorKey: 'measurementUnit',
    cell: ({ getValue }) => getValue<string | null>(),
  },
  {
    header: t('columns.dataType'),
    accessorKey: 'dataType',
    cell: ({ getValue }) => {
      const value = getValue<string>();
      return t(`dataTypes.${value}`);
    },
    meta: {
      filterVariant: 'select',
      selectOptions: () => [
        t('dataTypes.TEXT'),
        t('dataTypes.NUMBER'),
        t('dataTypes.DATE'),
        t('dataTypes.SELECT'),
        t('dataTypes.BOOLEAN'),
      ],
    },
    filterFn: (row, _columnId, filterValue) => {
      if (!filterValue) return true;
      const dataType = row.getValue<string>('dataType');
      return t(`dataTypes.${dataType}`) === filterValue;
    },
  },
  {
    header: t('columns.options'),
    accessorKey: 'options',
    cell: ({ getValue }) => {
      const options = getValue<string[] | null>();
      return options?.join(', ');
    },
    filterFn: (row, _columnId, filterValue) => {
      if (!filterValue) return true;
      const options = row.getValue<string[] | null>('options');
      if (!options) return false;
      const search = (filterValue as string).toLowerCase();
      return options.some((opt) => opt.toLowerCase().includes(search));
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
];
