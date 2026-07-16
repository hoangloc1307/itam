import { useQuery } from '@tanstack/react-query';
import type { ModelAttributeValueItem } from 'itam-shared/types';
import { useTranslation } from 'react-i18next';
import { modelAttributeValueQueries } from '~/api/model-attribute-value.queries';
import { FieldGroup } from '~/components/ui/field';
import { useSyncModelAttributeValues } from '~/hooks/mutations/use-model-attribute-value';
import { useAppForm } from '~/hooks/use-app-form';

interface ModelAttributeValuesProps {
  modelId: string;
  onSuccess: () => void;
}

export function ModelAttributeValues({ modelId, onSuccess }: ModelAttributeValuesProps) {
  const { t } = useTranslation('model');
  const { data, isLoading } = useQuery(modelAttributeValueQueries.byModelId(modelId));

  const attributes: ModelAttributeValueItem[] = data?.data ?? [];

  if (isLoading) {
    return (
      <div className='text-muted-foreground py-4 text-center text-sm'>
        {t('attributeValues.loading')}
      </div>
    );
  }

  if (attributes.length === 0) {
    return (
      <div className='text-muted-foreground py-4 text-center text-sm'>
        {t('attributeValues.noAttributes')}
      </div>
    );
  }

  return (
    <ModelAttributeValuesForm modelId={modelId} attributes={attributes} onSuccess={onSuccess} />
  );
}

interface FormProps {
  modelId: string;
  attributes: ModelAttributeValueItem[];
  onSuccess: () => void;
}

function ModelAttributeValuesForm({ modelId, attributes, onSuccess }: FormProps) {
  const { t } = useTranslation('model');
  const syncMutation = useSyncModelAttributeValues();

  // Build default values: { "1": "DDR5", "2": "16GB", ... }
  const defaultValues: Record<string, string> = {};
  for (const attr of attributes) {
    defaultValues[String(attr.attributeId)] = attr.value ?? '';
  }

  const form = useAppForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      await syncMutation.mutateAsync({
        modelId,
        values: attributes.map((attr) => ({
          attributeId: attr.attributeId,
          value: value[String(attr.attributeId)] || null,
        })),
      });
      onSuccess();
    },
  });

  // Group attributes by groupName
  const grouped = attributes.reduce<Record<string, ModelAttributeValueItem[]>>((acc, attr) => {
    const groupKey = attr.groupName ?? t('attributeValues.ungrouped');
    if (!acc[groupKey]) acc[groupKey] = [];
    acc[groupKey].push(attr);
    return acc;
  }, {});

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      className='space-y-6'
    >
      {Object.entries(grouped).map(([groupName, attrs]) => (
        <div key={groupName} className='space-y-3'>
          <h4 className='text-muted-foreground text-sm font-semibold'>{groupName}</h4>
          <FieldGroup>
            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
              {attrs.map((attr) => {
                const fieldName = String(attr.attributeId);
                const label = attr.measurementUnit
                  ? `${attr.name} (${attr.measurementUnit})`
                  : attr.name;

                if (attr.dataType === 'SELECT' && attr.options) {
                  return (
                    <div key={fieldName}>
                      <form.AppField
                        name={fieldName}
                        children={(field) => (
                          <field.SelectField
                            label={label}
                            options={attr.options!.map((opt) => ({ value: opt, label: opt }))}
                          />
                        )}
                      />
                    </div>
                  );
                }

                if (attr.dataType === 'BOOLEAN') {
                  return (
                    <div key={fieldName}>
                      <form.AppField
                        name={fieldName}
                        children={(field) => (
                          <field.SelectField
                            label={label}
                            options={[
                              { value: 'true', label: t('attributeValues.yes') },
                              { value: 'false', label: t('attributeValues.no') },
                            ]}
                          />
                        )}
                      />
                    </div>
                  );
                }

                if (attr.dataType === 'NUMBER') {
                  return (
                    <div key={fieldName}>
                      <form.AppField
                        name={fieldName}
                        children={(field) => <field.NumberField label={label} />}
                      />
                    </div>
                  );
                }

                return (
                  <div key={fieldName}>
                    <form.AppField
                      name={fieldName}
                      children={(field) => <field.TextField label={label} />}
                    />
                  </div>
                );
              })}
            </div>
          </FieldGroup>
        </div>
      ))}

      <form.AppForm>
        <form.SubmitButton>{t('attributeValues.save')}</form.SubmitButton>
      </form.AppForm>
    </form>
  );
}
