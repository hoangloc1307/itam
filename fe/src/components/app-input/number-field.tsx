import { useId } from 'react';
import { useTranslation } from 'react-i18next';
import { NumericFormat, type NumericFormatProps } from 'react-number-format';
import { Field, FieldError, FieldLabel } from '~/components/ui/field';
import { Input } from '~/components/ui/input';
import { useFieldContext } from '~/hooks/use-app-form';

type NumberFieldProps = Omit<NumericFormatProps, 'value' | 'onValueChange' | 'onBlur'> & {
  label?: string;
};

export const NumberField = ({ label, ...props }: NumberFieldProps) => {
  const id = useId();
  const { t } = useTranslation();
  const field = useFieldContext<number | null>();
  const isInvalid = field.state.meta.isTouched && field.state.meta.errors.length > 0;

  return (
    <Field data-invalid={isInvalid}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <NumericFormat
        id={id}
        customInput={Input}
        value={field.state.value ?? ''}
        onValueChange={(values) => {
          field.handleChange(values.floatValue ?? null);
        }}
        onBlur={field.handleBlur}
        aria-invalid={isInvalid}
        thousandSeparator=','
        {...props}
      />
      {isInvalid && <FieldError>{t(field.state.meta.errors[0].message)}</FieldError>}
    </Field>
  );
};
