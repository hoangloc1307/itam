import { useId } from 'react';
import { useTranslation } from 'react-i18next';
import { Field, FieldError, FieldLabel } from '~/components/ui/field';
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from '~/components/ui/combobox';
import { useFieldContext } from '~/hooks/use-app-form';

interface Option {
  label: string;
  value: string;
}

type ComboboxFieldProps = {
  label?: string;
  options: Option[];
  placeholder?: string;
  onChange?: (value: string) => void;
};

export const ComboboxField = ({ label, options, placeholder, onChange }: ComboboxFieldProps) => {
  const id = useId();
  const { t } = useTranslation();
  const field = useFieldContext<string>();
  const isInvalid = field.state.meta.isTouched && field.state.meta.errors.length > 0;
  const selectedOption = options.find((opt) => opt.value === field.state.value) ?? null;

  return (
    <Field data-invalid={isInvalid}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <Combobox
        items={options}
        value={selectedOption}
        onValueChange={(val) => {
          const newValue = val?.value ?? '';
          field.handleChange(newValue);
          onChange?.(newValue);
        }}
        itemToStringValue={(item) => item.label}
      >
        <ComboboxInput
          id={id}
          placeholder={placeholder}
          showClear={!!field.state.value}
          onBlur={field.handleBlur}
          aria-invalid={isInvalid}
        />
        <ComboboxContent>
          <ComboboxEmpty>{t('common:noResults', { defaultValue: 'Không tìm thấy' })}</ComboboxEmpty>
          <ComboboxList>
            {(item) => (
              <ComboboxItem key={item.value} value={item}>
                {item.label}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
      {isInvalid && <FieldError>{t(field.state.meta.errors[0].message)}</FieldError>}
    </Field>
  );
};
