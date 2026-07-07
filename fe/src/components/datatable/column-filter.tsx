import type { Column } from '@tanstack/react-table';
import FilterDate from '~/components/datatable/filter/date';
import FilterDateRange from '~/components/datatable/filter/date-range';
import FilterNumberRange from '~/components/datatable/filter/number-range';
import FilterSelect from '~/components/datatable/filter/select';
import FilterText from '~/components/datatable/filter/text';

export default function DataTableColumnFilter<TData, TValue>({
  column,
}: {
  column: Column<TData, TValue>;
}) {
  const { filterVariant } = column.columnDef.meta ?? {};

  switch (filterVariant) {
    case 'date':
      return <FilterDate column={column} />;
    case 'date-range':
      return <FilterDateRange column={column} />;
    case 'number-range':
      return <FilterNumberRange column={column} />;
    case 'select':
      return <FilterSelect column={column} />;
    default:
      return <FilterText column={column} />;
  }
}
