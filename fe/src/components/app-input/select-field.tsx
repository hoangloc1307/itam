import { useId } from 'react';
import { useTranslation } from 'react-i18next';
import { Field, FieldError, FieldLabel } from '~/components/ui/field';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';
import { useFieldContext } from '~/hooks/use-app-form';

type SelectFieldProps = {
  label?: string;
  required?: boolean;
  placeholder?: string;
  emptyText?: string;
  options: {
    label: string;
    value: string;
  }[];
  disabled?: boolean;
};

export const SelectField = ({
  label,
  required,
  placeholder,
  emptyText,
  options,
  disabled,
}: SelectFieldProps) => {
  const id = useId();
  const { t } = useTranslation();
  const field = useFieldContext<string>();
  const isInvalid = field.state.meta.isTouched && field.state.meta.errors.length > 0;
  const selectedOption = options.find((opt) => opt.value === field.state.value);

  return (
    <Field data-invalid={isInvalid}>
      <FieldLabel htmlFor={id}>
        {label}
        {required && <span className='text-destructive'>*</span>}
      </FieldLabel>
      <Select
        value={field.state.value}
        onValueChange={(val) => val && field.handleChange(val)}
        disabled={disabled}
      >
        <SelectTrigger id={id} aria-invalid={isInvalid} onBlur={field.handleBlur}>
          <SelectValue placeholder={placeholder}>{selectedOption?.label}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          {options.length === 0 ? (
            <p className='text-muted-foreground px-2 py-4 text-center text-sm'>
              {emptyText ?? t('common:noOptions')}
            </p>
          ) : (
            options.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
      {isInvalid && <FieldError>{t(field.state.meta.errors[0].message)}</FieldError>}
    </Field>
  );
};
