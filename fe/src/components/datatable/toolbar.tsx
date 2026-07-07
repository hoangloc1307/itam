'use no memo';

import {
  IconArrowsMaximize,
  IconArrowsMinimize,
  IconColumns3Filled,
  IconFilter2Plus,
  IconFilter2X,
  IconSearch,
} from '@tabler/icons-react';
import type { Table } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';
import { DataTableGlobalSearch } from '~/components/datatable/global-search';
import { Button } from '~/components/ui/button';
import { ButtonGroup } from '~/components/ui/button-group';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';

export function DataTableToolbar<TData>({ table }: { table: Table<TData> }) {
  const { t } = useTranslation('datatable');
  const meta = table.options.meta!;

  return (
    <div className='flex items-center justify-end gap-2'>
      <DataTableGlobalSearch table={table} showSearch={meta.showSearch} />
      <ButtonGroup>
        {/* <==> TOGGLE SEARCH <==> */}
        <Button
          size={'sm'}
          title={t('search')}
          variant={'outline'}
          onClick={() => meta.setShowSearch(!meta.showSearch)}
        >
          <IconSearch />
        </Button>

        {/* <==> TOGGLE FILTERS <==> */}
        <Button
          size={'sm'}
          title={t('filter')}
          variant={'outline'}
          onClick={() => meta.setShowFilters(!meta.showFilters)}
        >
          {meta.showFilters ? <IconFilter2X /> : <IconFilter2Plus />}
        </Button>

        {/* <==> SHOW / HIDE COLUMNS <==> */}
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button size={'sm'} variant={'outline'} title={t('columns')}>
                <IconColumns3Filled />
              </Button>
            }
          />
          <DropdownMenuContent align='end' className={'w-3xs'}>
            <DropdownMenuCheckboxItem
              checked={table.getIsAllColumnsVisible()}
              onCheckedChange={(value) => table.toggleAllColumnsVisible(!!value)}
            >
              {t('showAll')}
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={!table.getIsAllColumnsVisible() && !table.getIsSomeColumnsVisible()}
              onCheckedChange={() => table.toggleAllColumnsVisible(false)}
            >
              {t('hideAll')}
            </DropdownMenuCheckboxItem>
            <DropdownMenuSeparator />
            {table
              .getAllColumns()
              .filter((column) => typeof column.accessorFn !== 'undefined' && column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className='capitalize'
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                  >
                    {column.columnDef.header as React.ReactNode}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* <==> TOGGLE FULLSCREEN <==> */}
        <Button
          size={'sm'}
          title={t('fullScreen')}
          variant={'outline'}
          onClick={() => meta.setFullScreen(!meta.fullScreen)}
        >
          {meta.fullScreen ? <IconArrowsMinimize /> : <IconArrowsMaximize />}
        </Button>
      </ButtonGroup>
    </div>
  );
}
