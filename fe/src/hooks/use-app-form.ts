import { createFormHook, createFormHookContexts } from '@tanstack/react-form';
import {
  NumberField,
  SelectField,
  SubmitButton,
  SwitchButton,
  TagInput,
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
    TagInput,
  },
  formComponents: {
    SubmitButton,
  },
  fieldContext,
  formContext,
});
