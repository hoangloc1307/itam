import { IconCalendar } from '@tabler/icons-react';
import { format, parse } from 'date-fns';
import { useId } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '~/components/ui/button';
import { Calendar } from '~/components/ui/calendar';
import { Field, FieldError, FieldLabel } from '~/components/ui/field';
import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover';
import { cn } from '~/lib/utils';
import { useFieldContext } from '~/hooks/use-app-form';

type DatePickerFieldProps = {
  label?: string;
  placeholder?: string;
};

export const DatePickerField = ({ label, placeholder }: DatePickerFieldProps) => {
  const id = useId();
  const { t } = useTranslation();
  const field = useFieldContext<string | null>();
  const isInvalid = field.state.meta.isTouched && field.state.meta.errors.length > 0;

  const dateValue = field.state.value
    ? parse(field.state.value, 'yyyy-MM-dd', new Date())
    : undefined;

  const handleSelect = (date: Date | undefined) => {
    field.handleChange(date ? format(date, 'yyyy-MM-dd') : null);
  };

  return (
    <Field data-invalid={isInvalid}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <Popover>
        <PopoverTrigger
          render={
            <Button
              id={id}
              type='button'
              variant='outline'
              className={cn(
                'text-popover-foreground h-9 w-full justify-start px-2.5 text-left font-normal',
                !field.state.value && 'text-muted-foreground',
              )}
              onBlur={field.handleBlur}
              aria-invalid={isInvalid}
            />
          }
        >
          <IconCalendar className='mr-2 size-4' />
          {field.state.value
            ? format(dateValue!, 'dd/MM/yyyy')
            : (placeholder ?? t('common:selectDate'))}
        </PopoverTrigger>
        <PopoverContent className='w-auto p-0' align='start'>
          <Calendar mode='single' selected={dateValue} onSelect={handleSelect} />
        </PopoverContent>
      </Popover>
      {isInvalid && <FieldError>{t(field.state.meta.errors[0].message)}</FieldError>}
    </Field>
  );
};
