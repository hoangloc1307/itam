import { createFeatureSchema, type CreateFeatureInput } from 'itam-shared/schemas/feature';
import { FEATURES } from 'itam-shared/constants';
import type { Feature } from 'itam-shared/types';
import { useTranslation } from 'react-i18next';
import { FieldGroup } from '~/components/ui/field';
import { useCreateFeature, useUpdateFeature } from '~/hooks/mutations/use-feature';
import { useAppForm } from '~/hooks/use-app-form';

interface FeatureFormProps {
  feature: Feature | null;
  existingCodes: string[];
  onSuccess: () => void;
}

export function FeatureForm({ feature, existingCodes, onSuccess }: FeatureFormProps) {
  const { t } = useTranslation('feature');
  const createMutation = useCreateFeature();
  const updateMutation = useUpdateFeature();
  const isEditing = !!feature;

  const featureCodeOptions = Object.values(FEATURES)
    .filter((code) => !existingCodes.includes(code))
    .map((code) => ({
      label: code,
      value: code,
    }));

  const form = useAppForm({
    defaultValues: {
      code: feature?.code ?? '',
      name: feature?.name ?? '',
      isActive: feature?.isActive ?? true,
    } satisfies CreateFeatureInput,
    validators: {
      onSubmit: createFeatureSchema,
    },
    onSubmit: async ({ value }) => {
      if (isEditing) {
        const { code: _code, ...rest } = value;
        await updateMutation.mutateAsync({ code: feature.code, ...rest });
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
            <field.SelectField
              label={t('form.code')}
              required
              placeholder={t('form.codePlaceholder')}
              options={featureCodeOptions}
              disabled={isEditing}
            />
          )}
        />
        <form.AppField
          name='name'
          children={(field) => <field.TextField label={t('form.name')} required />}
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
