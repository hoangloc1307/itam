import { useId } from 'react';
import { useTranslation } from 'react-i18next';
import { NumericFormat, type NumericFormatProps } from 'react-number-format';
import { Field, FieldError, FieldLabel } from '~/components/ui/field';
import { Input } from '~/components/ui/input';
import { useFieldContext } from '~/hooks/use-app-form';

type NumberFieldProps = Omit<
  NumericFormatProps,
  'value' | 'onValueChange' | 'onBlur' | 'onChange'
> & {
  label?: string;
  required?: boolean;
  min?: number;
  onChange?: (value: number | null) => void;
};

export const NumberField = ({ label, required, min, onChange, ...props }: NumberFieldProps) => {
  const id = useId();
  const { t } = useTranslation();
  const field = useFieldContext<number | null>();
  const isInvalid = field.state.meta.isTouched && field.state.meta.errors.length > 0;

  const handleBlur = () => {
    if (min != null && (field.state.value == null || field.state.value < min)) {
      field.handleChange(min);
    }
    field.handleBlur();
  };

  return (
    <Field data-invalid={isInvalid}>
      <FieldLabel htmlFor={id}>
        {label}
        {required && <span className='text-destructive'>*</span>}
      </FieldLabel>
      <NumericFormat
        id={id}
        customInput={Input}
        value={field.state.value ?? ''}
        onValueChange={(values) => {
          const newValue = values.floatValue ?? null;
          field.handleChange(newValue);
          onChange?.(newValue);
        }}
        onBlur={handleBlur}
        aria-invalid={isInvalid}
        thousandSeparator=','
        {...props}
      />
      {isInvalid && <FieldError>{t(field.state.meta.errors[0].message)}</FieldError>}
    </Field>
  );
};
