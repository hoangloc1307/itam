import type { Table } from '@tanstack/react-table';
import { flexRender } from '@tanstack/react-table';
import { Fragment } from 'react';
import { TableHead, TableHeader, TableRow } from '~/components/ui/table';

interface DataTableHeaderProps<TData> extends React.HTMLAttributes<HTMLDivElement> {
  table: Table<TData>;
}

export function DataTableHeader<TData>({ table }: DataTableHeaderProps<TData>) {
  //   const showFilters = table.options.meta?.showFilters;
  //   const hasSorting = table.options.meta?.hasSorting;

  return (
    <TableHeader className='bg-muted shadow-border sticky top-0 z-10 grid shadow [&_tr]:border-b-0'>
      {table.getHeaderGroups().map((headerGroup) => (
        <Fragment key={headerGroup.id}>
          {/* <==> HEADER ROW <==> */}
          <TableRow className='flex h-full w-full'>
            {headerGroup.headers.map((header) => {
              //   const canSort = header.column.getCanSort();
              //   const sortDir = header.column.getIsSorted();

              if (header.isPlaceholder) {
                return (
                  <TableHead
                    key={header.id}
                    colSpan={header.colSpan}
                    style={{
                      width: header.getSize(),
                      flex: `${header.getSize()} 0 auto`,
                    }}
                  />
                );
              }

              const title =
                typeof header.column.columnDef.header === 'string'
                  ? (header.column.columnDef.header as string)
                  : flexRender(header.column.columnDef.header, header.getContext());

              return (
                <TableHead
                  key={header.id}
                  colSpan={header.colSpan}
                  className='flex h-full min-h-10 items-center px-2'
                  style={{
                    width: header.getSize(),
                    flex: `${header.getSize()} 0 auto`,
                  }}
                  //   onClick={(e) => {
                  //     if (!hasSorting || !canSort) return;
                  //     header.column.toggleSorting(undefined, (e as React.MouseEvent).shiftKey);
                  //   }}
                >
                  <p className='max-w-[calc(100%-16x)] whitespace-break-spaces capitalize select-none'>
                    {title}
                  </p>
                  {/* {Boolean(canSort && hasSorting) && (
                    <Fragment>
                      {sortDir === 'desc' ? (
                        <ChevronDown className='size-4' />
                      ) : sortDir === 'asc' ? (
                        <ChevronUp className='size-4' />
                      ) : null}
                    </Fragment>
                  )} */}
                </TableHead>
              );
            })}
          </TableRow>

          {/* <==> FILTER ROW <==> */}
          {/* {showFilters && (
            <TableRow className='flex w-full'>
              {headerGroup.headers.map((header) => {
                const column = header.column;

                if (!column.getCanFilter()) {
                  return (
                    <TableHead
                      key={header.id}
                      style={{
                        width: header.getSize(),
                        flex: `${header.getSize()} 0 auto`,
                      }}
                    />
                  );
                }

                return (
                  <TableHead
                    key={header.id}
                    className='font-normal'
                    style={{
                      width: header.getSize(),
                      flex: `${header.getSize()} 0 auto`,
                    }}
                  >
                    <DataTableColumnFilter column={header.column} />
                  </TableHead>
                );
              })}
            </TableRow>
          )} */}
        </Fragment>
      ))}
    </TableHeader>
  );
}
