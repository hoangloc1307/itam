'use no memo';

import {
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
} from '@tabler/icons-react';
import type { Table } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';
import { Button } from '~/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';

const DEFAULT_PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
  pageSizeOptions?: number[];
}

export function DataTablePagination<TData>({
  table,
  pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
}: DataTablePaginationProps<TData>) {
  const { t } = useTranslation('datatable');
  const page = table.getState().pagination.pageIndex + 1;
  const pageSize = table.getState().pagination.pageSize;
  const totalPages = table.getPageCount();

  return (
    <div className='flex items-center justify-between'>
      <div className='text-muted-foreground flex-1 text-sm'>
        {t('pagination.total', { count: table.getFilteredRowModel().rows.length })}
      </div>

      <div className='flex items-center gap-6 lg:gap-8'>
        {/* <==> ROWS PER PAGE <==> */}
        <div className='flex items-center gap-2'>
          <p className='text-sm font-medium'>{t('pagination.rowsPerPage')}</p>
          <Select
            value={pageSize.toString()}
            onValueChange={(value) => table.setPageSize(Number(value))}
          >
            <SelectTrigger className='h-8 w-[70px]'>
              <SelectValue placeholder={pageSize} />
            </SelectTrigger>
            <SelectContent side='top'>
              {pageSizeOptions.map((size) => (
                <SelectItem key={size} value={size.toString()}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* <==> PAGE COUNT <==> */}
        <div className='flex w-[100px] items-center justify-center text-sm font-medium'>
          {t('pagination.pageOf', { page, total: totalPages })}
        </div>

        {/* <==> NAVIGATE BUTTONS <==> */}
        <div className='flex items-center gap-1'>
          <Button
            variant='outline'
            size='icon-xs'
            title={t('pagination.first')}
            className='hidden lg:flex'
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <IconChevronsLeft />
          </Button>
          <Button
            variant='outline'
            size='icon-xs'
            title={t('pagination.prev')}
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <IconChevronLeft />
          </Button>
          <Button
            variant='outline'
            size='icon-xs'
            title={t('pagination.next')}
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <IconChevronRight />
          </Button>
          <Button
            variant='outline'
            size='icon-xs'
            title={t('pagination.last')}
            className='hidden lg:flex'
            onClick={() => table.setPageIndex(totalPages - 1)}
            disabled={!table.getCanNextPage()}
          >
            <IconChevronsRight />
          </Button>
        </div>
      </div>
    </div>
  );
}
