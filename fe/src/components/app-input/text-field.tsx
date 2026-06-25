import { useId, type ComponentProps } from 'react';
import { Field, FieldError, FieldLabel } from '~/components/ui/field';
import { Input } from '~/components/ui/input';
import { useFieldContext } from '~/hooks/use-app-form';

type TextFieldProps = Omit<ComponentProps<'input'>, 'value' | 'onChange' | 'onBlur'> & {
  label?: string;
};

export const TextField = ({ label, ...props }: TextFieldProps) => {
  const id = useId();
  const field = useFieldContext<string>();
  const isInvalid = field.state.meta.isTouched && field.state.meta.errors.length > 0;

  return (
    <Field data-invalid={isInvalid}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <Input
        id={id}
        value={field.state.value}
        onChange={(e) => field.handleChange(e.target.value)}
        onBlur={field.handleBlur}
        aria-invalid={isInvalid}
        {...props}
      />
      {isInvalid && <FieldError>{field.state.meta.errors[0].message}</FieldError>}
    </Field>
  );
};
