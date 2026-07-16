import { useSuspenseQuery } from '@tanstack/react-query';
import {
  createAttributeSchema,
  attributeDataTypes,
  type CreateAttributeInput,
} from 'itam-shared/schemas/attribute';
import type { Attribute } from 'itam-shared/types';
import { useTranslation } from 'react-i18next';
import { attributeGroupQueries } from '~/api/attribute-group.queries';
import { FieldGroup } from '~/components/ui/field';
import { useCreateAttribute, useUpdateAttribute } from '~/hooks/mutations/use-attribute';
import { useAppForm } from '~/hooks/use-app-form';

interface AttributeFormProps {
  attribute: Attribute | null;
  onSuccess: () => void;
}

export function AttributeForm({ attribute, onSuccess }: AttributeFormProps) {
  const { t } = useTranslation('attribute');
  const createMutation = useCreateAttribute();
  const updateMutation = useUpdateAttribute();
  const isEditing = !!attribute;
  const { data: groupsData } = useSuspenseQuery(attributeGroupQueries.all());
  const groups = groupsData?.data ?? [];

  const groupOptions = groups.map((g) => ({
    label: g.name,
    value: String(g.id),
  }));

  const form = useAppForm({
    defaultValues: {
      name: attribute?.name ?? '',
      groupId: attribute?.groupId != null ? String(attribute.groupId) : '',
      measurementUnit: attribute?.measurementUnit ?? null,
      dataType: attribute?.dataType ?? 'TEXT',
      options: attribute?.options ?? null,
      isActive: attribute?.isActive ?? true,
    },
    onSubmit: async ({ value }) => {
      const payload: CreateAttributeInput = {
        name: value.name,
        groupId: value.groupId ? Number(value.groupId) : null,
        measurementUnit: value.measurementUnit,
        dataType: value.dataType,
        options: value.options,
        isActive: value.isActive,
      };

      const result = createAttributeSchema.safeParse(payload);
      if (!result.success) return;

      if (isEditing) {
        await updateMutation.mutateAsync({ id: attribute.id, ...payload });
      } else {
        await createMutation.mutateAsync(payload);
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
          name='name'
          children={(field) => <field.TextField label={t('form.name')} />}
        />

        <form.AppField
          name='groupId'
          children={(field) => (
            <field.ComboboxField
              label={t('form.group')}
              placeholder={t('form.groupPlaceholder')}
              options={groupOptions}
            />
          )}
        />

        <div className='grid grid-cols-2 gap-4'>
          <form.AppField
            name='measurementUnit'
            children={(field) => <field.TextField label={t('form.measurementUnit')} />}
          />

          <form.AppField
            name='dataType'
            children={(field) => (
              <field.SelectField
                label={t('form.dataType')}
                options={attributeDataTypes.map((type) => ({
                  value: type,
                  label: t(`dataTypes.${type}`),
                }))}
              />
            )}
          />
        </div>

        <form.AppField
          name='options'
          children={(field) => (
            <field.TagInput label={t('form.options')} placeholder={t('form.optionsPlaceholder')} />
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
