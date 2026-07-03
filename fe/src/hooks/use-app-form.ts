import { createFormHook, createFormHookContexts } from '@tanstack/react-form';
import { NumberField, SubmitButton, SwitchButton, TextField } from '~/components/app-input';

export const { fieldContext, formContext, useFieldContext, useFormContext } =
  createFormHookContexts();

export const { useAppForm } = createFormHook({
  fieldComponents: {
    TextField,
    NumberField,
    SwitchButton,
  },
  formComponents: {
    SubmitButton,
  },
  fieldContext,
  formContext,
});
