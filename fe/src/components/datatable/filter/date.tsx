import { IconX } from '@tabler/icons-react';
import type { Column } from '@tanstack/react-table';
import { format } from 'date-fns';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar } from '~/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '~/components/ui/input-group';

export default function FilterDate<TData, TValue>({ column }: { column: Column<TData, TValue> }) {
  const { t } = useTranslation('datatable');
  const filterValue = column.getFilterValue() as Date | undefined;
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger className='w-full'>
        <InputGroup>
          <InputGroupInput
            readOnly
            className='w-full cursor-pointer'
            placeholder={t('selectDate')}
            value={filterValue ? format(filterValue, 'dd/MM/yyyy') : ''}
          />
          {filterValue && (
            <InputGroupAddon align='inline-end'>
              <InputGroupButton
                title={t('clearFilter')}
                size='icon-xs'
                onClick={(e) => {
                  e.stopPropagation();
                  column.setFilterValue(undefined);
                }}
              >
                <IconX />
              </InputGroupButton>
            </InputGroupAddon>
          )}
        </InputGroup>
      </PopoverTrigger>
      <PopoverContent align='start' className='w-auto p-0'>
        <Calendar
          mode='single'
          captionLayout='dropdown'
          selected={filterValue}
          onSelect={(date) => {
            column.setFilterValue(date ?? undefined);
            setOpen(false);
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
