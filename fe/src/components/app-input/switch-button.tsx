import { useId } from 'react';
import { useTranslation } from 'react-i18next';
import { Field, FieldError, FieldLabel } from '~/components/ui/field';
import { Switch } from '~/components/ui/switch';
import { useFieldContext } from '~/hooks/use-app-form';

type SwitchButtonProps = {
  label?: string;
};

export const SwitchButton = ({ label }: SwitchButtonProps) => {
  const id = useId();
  const { t } = useTranslation();
  const field = useFieldContext<boolean>();
  const isInvalid = field.state.meta.isTouched && field.state.meta.errors.length > 0;

  return (
    <Field data-invalid={isInvalid}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <Switch
        id={id}
        defaultChecked={false}
        checked={field.state.value}
        onCheckedChange={(checked) => field.handleChange(checked)}
        onBlur={field.handleBlur}
        aria-invalid={isInvalid}
      />
      {isInvalid && <FieldError>{t(field.state.meta.errors[0].message)}</FieldError>}
    </Field>
  );
};
