import '@tanstack/react-table';
declare module '@tanstack/react-table' {
  interface TableMeta {
    fullScreen: boolean;
    setFullScreen: (value: boolean) => void;
    showSearch: boolean;
    setShowSearch: (value: boolean) => void;
    showFilters: boolean;
    setShowFilters: (value: boolean) => void;
  }

  interface ColumnMeta {
    filterVariant?: 'text' | 'number-range' | 'select' | 'date' | 'date-range';
    selectOptions?: () => string[];
  }

  interface FilterFns {
    date: FilterFn<unknown>;
    dateRange: FilterFn<unknown>;
  }
}
