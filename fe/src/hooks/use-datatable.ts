'use no memo';
import { getCoreRowModel, useReactTable, type ColumnDef } from '@tanstack/react-table';

interface UseDataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export default function useDatatable<TData, TValue>({
  columns,
  data,
}: UseDataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return table;
}
