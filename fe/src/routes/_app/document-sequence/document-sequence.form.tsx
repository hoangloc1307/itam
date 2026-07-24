import {
  createDocumentSequenceSchema,
  type CreateDocumentSequenceInput,
  type ResetCycle,
} from 'itam-shared/schemas/document-sequence';
import { RESET_CYCLES } from 'itam-shared/constants';
import type { DocumentSequence } from 'itam-shared/types';
import { useTranslation } from 'react-i18next';
import { FieldGroup } from '~/components/ui/field';
import {
  useCreateDocumentSequence,
  useUpdateDocumentSequence,
} from '~/hooks/mutations/use-document-sequence';
import { useAppForm } from '~/hooks/use-app-form';

interface DocumentSequenceFormProps {
  sequence: DocumentSequence | null;
  onSuccess: () => void;
}

export function DocumentSequenceForm({ sequence, onSuccess }: DocumentSequenceFormProps) {
  const { t } = useTranslation('documentSequence');
  const createMutation = useCreateDocumentSequence();
  const updateMutation = useUpdateDocumentSequence();
  const isEditing = !!sequence;

  const resetCycleOptions = RESET_CYCLES.map((value) => ({
    label: t(`resetCycle.${value}`),
    value,
  }));

  const form = useAppForm({
    defaultValues: {
      code: sequence?.code ?? '',
      name: sequence?.name ?? '',
      prefix: sequence?.prefix ?? '',
      separator: sequence?.separator ?? '-',
      dateFormat: sequence?.dateFormat ?? 'YYYYMMDD',
      paddingLength: sequence?.paddingLength ?? 4,
      resetCycle: (sequence?.resetCycle ?? 'DAILY') as ResetCycle,
      isActive: sequence?.isActive ?? true,
    } satisfies CreateDocumentSequenceInput,
    validators: {
      onSubmit: createDocumentSequenceSchema,
    },
    onSubmit: async ({ value }) => {
      if (isEditing) {
        const { code: _code, ...rest } = value;
        await updateMutation.mutateAsync({ id: sequence.id, ...rest });
      } else {
        await createMutation.mutateAsync(value);
      }
      onSuccess();
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      className='space-y-4'
    >
      <FieldGroup>
        <form.AppField
          name='code'
          children={(field) => (
            <field.TextField label={t('form.code')} required disabled={isEditing} />
          )}
        />
        <form.AppField
          name='name'
          children={(field) => <field.TextField label={t('form.name')} required />}
        />

        <div className='grid grid-cols-2 gap-4'>
          <form.AppField
            name='prefix'
            children={(field) => <field.TextField label={t('form.prefix')} />}
          />
          <form.AppField
            name='separator'
            children={(field) => <field.TextField label={t('form.separator')} />}
          />
        </div>

        <div className='grid grid-cols-2 gap-4'>
          <form.AppField
            name='dateFormat'
            children={(field) => (
              <field.TextField label={t('form.dateFormat')} placeholder='YYYY/MM/DD' />
            )}
          />
          <form.AppField
            name='resetCycle'
            children={(field) => (
              <field.SelectField label={t('form.resetCycle')} options={resetCycleOptions} />
            )}
          />
        </div>

        <form.AppField
          name='paddingLength'
          children={(field) => (
            <field.NumberField
              label={t('form.paddingLength')}
              allowNegative={false}
              decimalScale={0}
            />
          )}
        />

        <form.AppField
          name='isActive'
          children={(field) => <field.SwitchButton label={t('form.isActive')} />}
        />

        <form.AppForm>
          <form.SubmitButton>{isEditing ? t('edit') : t('addNew')}</form.SubmitButton>
        </form.AppForm>
      </FieldGroup>
    </form>
  );
}
