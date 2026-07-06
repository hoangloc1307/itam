import type { Column } from '@tanstack/react-table';
import { NumericFormat } from 'react-number-format';
import { useTranslation } from 'react-i18next';
import { InputGroup, InputGroupInput } from '~/components/ui/input-group';
import { Separator } from '~/components/ui/separator';

export default function FilterNumberRange<TData, TValue>({
  column,
}: {
  column: Column<TData, TValue>;
}) {
  const { t } = useTranslation('datatable');
  const columnFilterValue = column.getFilterValue() as
    | [number | undefined, number | undefined]
    | undefined;

  const [min, max] = columnFilterValue ?? ['', ''];

  return (
    <InputGroup>
      <NumericFormat
        customInput={InputGroupInput}
        inputMode='decimal'
        allowNegative={true}
        thousandSeparator
        placeholder={t('min')}
        value={min}
        onValueChange={({ value }) => {
          const nextMin = value === '' ? undefined : Number(value);
          column.setFilterValue([nextMin, max]);
        }}
      />
      <Separator orientation='vertical' />
      <NumericFormat
        customInput={InputGroupInput}
        inputMode='decimal'
        allowNegative={true}
        thousandSeparator
        placeholder={t('max')}
        value={max}
        onValueChange={({ value }) => {
          const nextMax = value === '' ? undefined : Number(value);
          column.setFilterValue([min, nextMax]);
        }}
      />
    </InputGroup>
  );
}
