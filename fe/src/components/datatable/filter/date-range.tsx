import { IconX } from '@tabler/icons-react';
import type { Column } from '@tanstack/react-table';
import { format } from 'date-fns';
import { useRef, useState } from 'react';
import { type DateRange } from 'react-day-picker';
import { useTranslation } from 'react-i18next';
import { Calendar } from '~/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '~/components/ui/input-group';

export default function FilterDateRange<TData, TValue>({
  column,
}: {
  column: Column<TData, TValue>;
}) {
  const { t } = useTranslation('datatable');
  const filterValue = column.getFilterValue() as DateRange | undefined;
  const [open, setOpen] = useState(false);
  const clickCount = useRef(0);
  const selectingRef = useRef(false);

  const displayValue = () => {
    if (!filterValue?.from) return '';
    if (!filterValue.to) return format(filterValue.from, 'dd/MM/yyyy');
    return `${format(filterValue.from, 'dd/MM/yyyy')} - ${format(filterValue.to, 'dd/MM/yyyy')}`;
  };

  return (
    <Popover
      open={open}
      onOpenChange={(nextOpen) => {
        // Block close only when user is mid-selection (clicked first date inside calendar)
        if (!nextOpen && selectingRef.current) return;
        setOpen(nextOpen);
      }}
    >
      <PopoverTrigger
        className='w-full'
        onClick={() => {
          clickCount.current = 0;
          selectingRef.current = false;
          setOpen(true);
        }}
      >
        <InputGroup>
          <InputGroupInput
            readOnly
            className='w-full cursor-pointer'
            placeholder={t('selectDateRange')}
            value={displayValue()}
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
          mode='range'
          captionLayout='dropdown'
          selected={filterValue}
          onSelect={(range) => {
            clickCount.current += 1;
            column.setFilterValue(range ?? undefined);
            if (clickCount.current === 1) {
              selectingRef.current = true;
            }
            if (clickCount.current >= 2) {
              selectingRef.current = false;
              setOpen(false);
            }
          }}
          numberOfMonths={2}
        />
      </PopoverContent>
    </Popover>
  );
}
