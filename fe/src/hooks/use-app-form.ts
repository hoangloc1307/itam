import { createFormHook, createFormHookContexts } from '@tanstack/react-form';
import {
  ComboboxField,
  DatePickerField,
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
    ComboboxField,
    SwitchButton,
    TagInput,
    DatePickerField,
  },
  formComponents: {
    SubmitButton,
  },
  fieldContext,
  formContext,
});
