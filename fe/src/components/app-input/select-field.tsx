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
  options: {
    label: string;
    value: string;
  }[];
};

export const SelectField = ({ label, options }: SelectFieldProps) => {
  const id = useId();
  const { t } = useTranslation();
  const field = useFieldContext<string>();
  const isInvalid = field.state.meta.isTouched && field.state.meta.errors.length > 0;
  const selectedOption = options.find((opt) => opt.value === field.state.value);

  return (
    <Field data-invalid={isInvalid}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <Select value={field.state.value} onValueChange={(val) => val && field.handleChange(val)}>
        <SelectTrigger id={id} aria-invalid={isInvalid} onBlur={field.handleBlur}>
          <SelectValue>{selectedOption?.label}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {isInvalid && <FieldError>{t(field.state.meta.errors[0].message)}</FieldError>}
    </Field>
  );
};
