import { IconX } from '@tabler/icons-react';
import type { Column } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '~/components/ui/input-group';

export default function FilterText<TData, TValue>({ column }: { column: Column<TData, TValue> }) {
  const { t } = useTranslation('datatable');

  return (
    <InputGroup>
      <InputGroupInput
        type='text'
        className='w-full'
        placeholder={t('filterPlaceholder')}
        value={(column.getFilterValue() ?? '') as string}
        onChange={(e) => column.setFilterValue(e.target.value)}
      />
      {Boolean(column.getFilterValue()) && (
        <InputGroupAddon align={'inline-end'}>
          <InputGroupButton
            title={t('clearFilter')}
            size='icon-xs'
            onClick={() => {
              column.setFilterValue(undefined);
            }}
          >
            <IconX />
          </InputGroupButton>
        </InputGroupAddon>
      )}
    </InputGroup>
  );
}
