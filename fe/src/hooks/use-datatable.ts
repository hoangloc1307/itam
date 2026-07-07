'use no memo';

import {
  getCoreRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type FilterFn,
  type SortingState,
  type VisibilityState,
} from '@tanstack/react-table';
import { isAfter, isBefore, isSameDay, startOfDay } from 'date-fns';
import { useState } from 'react';
import { type DateRange } from 'react-day-picker';

const dateFilterFn: FilterFn<unknown> = (row, columnId, filterValue: Date) => {
  const cellValue = row.getValue<string | Date>(columnId);
  if (!cellValue || !filterValue) return true;
  const cellDate = startOfDay(new Date(cellValue));
  const target = startOfDay(filterValue);
  return isSameDay(cellDate, target);
};

const dateRangeFilterFn: FilterFn<unknown> = (row, columnId, filterValue: DateRange) => {
  const cellValue = row.getValue<string | Date>(columnId);
  if (!cellValue) return true;
  if (!filterValue?.from) return true;
  const cellDate = startOfDay(new Date(cellValue));
  const from = startOfDay(filterValue.from);
  if (!filterValue.to) return isSameDay(cellDate, from) || isAfter(cellDate, from);
  const to = startOfDay(filterValue.to);
  return (
    (isSameDay(cellDate, from) || isAfter(cellDate, from)) &&
    (isSameDay(cellDate, to) || isBefore(cellDate, to))
  );
};

interface UseDataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export default function useDatatable<TData, TValue>({
  columns,
  data,
}: UseDataTableProps<TData, TValue>) {
  //  UI states
  const [fullScreen, setFullScreen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Table states
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState<string>('');
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    state: {
      columnVisibility,
      columnFilters,
      globalFilter,
      sorting,
    },
    filterFns: {
      date: dateFilterFn,
      dateRange: dateRangeFilterFn,
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    onColumnVisibilityChange: setColumnVisibility,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    enableGlobalFilter: true,
    globalFilterFn: 'includesString',
    meta: {
      fullScreen,
      setFullScreen,
      showSearch,
      setShowSearch,
      showFilters,
      setShowFilters,
    },
  });

  return table;
}
