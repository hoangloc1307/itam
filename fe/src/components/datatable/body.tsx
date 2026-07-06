'use no memo';

import type { Cell, Table } from '@tanstack/react-table';
import { flexRender } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';
import { TableBody, TableCell, TableRow } from '~/components/ui/table';

export function DataTableBody<TData>({ table }: { table: Table<TData> }) {
  const { t } = useTranslation('datatable');
  const emptyBody = Boolean(!table.getRowModel().rows?.length);

  return (
    <>
      {/* <==> EMPTY BODY <==> */}
      {emptyBody && (
        <TableBody className='grid'>
          <TableRow className='flex w-full'>
            <TableCell
              colSpan={table.getAllLeafColumns().length}
              className='flex h-14 w-full items-center justify-center text-center'
            >
              {t('empty')}
            </TableCell>
          </TableRow>
        </TableBody>
      )}

      {/* <==> BODY WITH DATA AND NOT ENABLE VIRTUAL <==> */}
      {Boolean(!emptyBody) && (
        <TableBody className='grid'>
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id} className='flex w-full'>
              {row.getVisibleCells().map((cell) => (
                <DataTableCell cell={cell} key={cell.id} />
              ))}
            </TableRow>
          ))}
        </TableBody>
      )}
    </>
  );
}

function DataTableCell<TData>({ cell }: { cell: Cell<TData, unknown> }) {
  return (
    <TableCell
      key={cell.id}
      style={{
        width: cell.column.getSize(),
        flex: `${cell.column.getSize()} 0 auto`,
      }}
      className='flex items-center overflow-hidden text-ellipsis whitespace-nowrap'
    >
      {flexRender(cell.column.columnDef.cell, cell.getContext())}
    </TableCell>
  );
}
