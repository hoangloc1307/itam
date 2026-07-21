import type { AssetAttributeValueItem } from 'itam-shared/types';
import { useTranslation } from 'react-i18next';
import { NumericFormat } from 'react-number-format';
import { Field, FieldLabel } from '~/components/ui/field';
import { Input } from '~/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';

interface AttributeValueEntry {
  attributeId: number;
  value: string | null;
}

interface AssetAttributeFormProps {
  attributes: AssetAttributeValueItem[];
  values: AttributeValueEntry[];
  onChange: (values: AttributeValueEntry[]) => void;
}

export function AssetAttributeForm({ attributes, values, onChange }: AssetAttributeFormProps) {
  const { t } = useTranslation('asset');

  if (attributes.length === 0) {
    return (
      <p className='text-muted-foreground text-sm italic'>{t('attributeForm.noAttributes')}</p>
    );
  }

  const valueMap = new Map(values.map((v) => [v.attributeId, v.value]));

  const handleChange = (attributeId: number, value: string | null) => {
    const existing = values.find((v) => v.attributeId === attributeId);
    if (existing) {
      onChange(values.map((v) => (v.attributeId === attributeId ? { ...v, value } : v)));
    } else {
      onChange([...values, { attributeId, value }]);
    }
  };

  // Group attributes by group name
  const grouped = attributes.reduce(
    (acc, attr) => {
      const group = attr.groupName ?? t('attributeForm.ungrouped');
      if (!acc[group]) acc[group] = [];
      acc[group].push(attr);
      return acc;
    },
    {} as Record<string, AssetAttributeValueItem[]>,
  );

  return (
    <div className='space-y-6'>
      {Object.entries(grouped).map(([groupName, groupAttrs]) => (
        <div key={groupName} className='space-y-4'>
          <h4 className='text-foreground text-sm font-medium'>{groupName}</h4>
          <div className='grid grid-cols-12 gap-4'>
            {groupAttrs.map((attr) => {
              const currentValue = valueMap.get(attr.attributeId) ?? '';

              return (
                <div className='col-span-6 md:col-span-4 lg:col-span-3 xl:col-span-2'>
                  <Field key={attr.attributeId}>
                    <FieldLabel className='gap-1'>
                      {attr.name}
                      {attr.measurementUnit && (
                        <span className='text-muted-foreground'>({attr.measurementUnit})</span>
                      )}
                      {attr.isRequired && <span className='text-destructive'>*</span>}
                    </FieldLabel>

                    {attr.dataType === 'SELECT' && attr.options ? (
                      <Select
                        value={currentValue}
                        onValueChange={(val) => handleChange(attr.attributeId, val || null)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={t('attributeForm.selectPlaceholder')} />
                        </SelectTrigger>
                        <SelectContent>
                          {attr.options.map((opt) => (
                            <SelectItem key={opt} value={opt}>
                              {opt}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : attr.dataType === 'NUMBER' ? (
                      <NumericFormat
                        customInput={Input}
                        value={currentValue}
                        onValueChange={(vals) => handleChange(attr.attributeId, vals.value || null)}
                        thousandSeparator=','
                        placeholder={attr.name}
                      />
                    ) : (
                      <Input
                        type='text'
                        value={currentValue}
                        onChange={(e) => handleChange(attr.attributeId, e.target.value || null)}
                        placeholder={attr.name}
                      />
                    )}
                  </Field>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
