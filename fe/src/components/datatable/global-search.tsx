'use no memo';

import { IconListSearch, IconX } from '@tabler/icons-react';
import type { Table } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '~/components/ui/input-group';

export function DataTableGlobalSearch<TData>({
  table,
  showSearch,
}: {
  table: Table<TData>;
  showSearch: boolean;
}) {
  const { t } = useTranslation('datatable');

  return (
    <>
      {showSearch && (
        <InputGroup className='h-8 w-[150px] lg:w-[250px]'>
          <InputGroupInput
            autoFocus
            placeholder={t('searchPlaceholder')}
            value={table.getState().globalFilter ?? ''}
            onChange={(event) => table.setGlobalFilter(event.target.value)}
          />
          <InputGroupAddon>
            <IconListSearch />
          </InputGroupAddon>
          {table.getState().globalFilter && (
            <InputGroupAddon align='inline-end'>
              <InputGroupButton
                title={t('clearSearch')}
                size='icon-xs'
                onClick={() => {
                  table.setGlobalFilter('');
                }}
              >
                <IconX />
              </InputGroupButton>
            </InputGroupAddon>
          )}
        </InputGroup>
      )}
    </>
  );
}
