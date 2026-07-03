import '@tanstack/react-table';

declare module '@tanstack/react-table' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface TableMeta<TData extends RowData> {
    fullScreen: boolean;
    setFullScreen: (value: boolean) => void;
    showSearch: boolean;
    setShowSearch: (value: boolean) => void;
    showFilters: boolean;
    setShowFilters: (value: boolean) => void;
  }
}
