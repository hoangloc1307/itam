import { createFormHook, createFormHookContexts } from '@tanstack/react-form';
import {
  NumberField,
  SelectField,
  SubmitButton,
  SwitchButton,
  TextField,
} from '~/components/app-input';

export const { fieldContext, formContext, useFieldContext, useFormContext } =
  createFormHookContexts();

export const { useAppForm } = createFormHook({
  fieldComponents: {
    TextField,
    NumberField,
    SelectField,
    SwitchButton,
  },
  formComponents: {
    SubmitButton,
  },
  fieldContext,
  formContext,
});
