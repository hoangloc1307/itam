/* eslint-disable @typescript-eslint/no-unused-vars */
import type { RowData } from '@tanstack/react-table';

declare module '@tanstack/react-table' {
  interface TableMeta<TData extends RowData> {
    fullScreen?: boolean;
    setFullScreen?: (v: boolean) => void;
  }
}
