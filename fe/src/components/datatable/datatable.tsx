'use no memo';

import { type Table as TableType } from '@tanstack/react-table';
import { useRef } from 'react';
import { DataTableBody } from '~/components/datatable/body';
import { DataTableHeader } from '~/components/datatable/header';
import { DataTablePagination } from '~/components/datatable/pagination';
import { DataTableToolbar } from '~/components/datatable/toolbar';
import { Table, TableContainer } from '~/components/ui/table';
import { cn } from '~/lib/utils';

export default function DataTable<TData>({ table }: { table: TableType<TData> }) {
  const meta = table.options.meta!;
  const tableContainerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      className={cn(
        'space-y-2',
        meta.fullScreen && 'bg-background fixed top-0 left-0 z-50 h-dvh w-dvw p-2',
      )}
    >
      {/* <==> TOOLBAR <==> */}
      <DataTableToolbar table={table} />

      {/* <==> TABLE <==> */}
      <div
        className={cn(
          'overflow-auto rounded-md border',
          meta.fullScreen && 'h-[calc(100dvh-100px)]',
        )}
      >
        <TableContainer ref={tableContainerRef} className='max-h-[calc(100dvh-100px)]'>
          <Table className='grid'>
            <DataTableHeader table={table} />
            <DataTableBody table={table} />
          </Table>
        </TableContainer>
      </div>

      {/* <==> PAGINATION <==> */}
      <DataTablePagination table={table} />
    </div>
  );
}
