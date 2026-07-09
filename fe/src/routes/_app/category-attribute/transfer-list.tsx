import { useTranslation } from 'react-i18next';
import type { Attribute, CategoryAttributeItem, SyncAttributePayload } from 'itam-shared/types';
import {
  TransferList as TransferListBase,
  type AssignedItem,
  type TransferItem,
} from '~/components/transfer-list';

interface Props {
  allAttributes: Attribute[];
  assignedItems: CategoryAttributeItem[];
  onSync: (items: SyncAttributePayload[]) => void;
}

export function TransferList({ allAttributes, assignedItems, onSync }: Props) {
  const { t } = useTranslation('categoryAttribute');

  const availableSource: TransferItem[] = allAttributes
    .filter((attr) => !attr.deletedAt)
    .map((attr) => ({
      id: attr.id,
      label: attr.name,
      description: attr.measurementUnit ?? undefined,
      badge: attr.dataType,
    }));

  const assignedSource: AssignedItem[] = assignedItems.map((item) => ({
    id: item.attributeId,
    label: item.name,
    description: item.measurementUnit ?? undefined,
    badge: item.dataType,
    isRequired: item.isRequired,
  }));

  const handleSave = (assigned: AssignedItem[]) => {
    onSync(
      assigned.map((item, index) => ({
        attributeId: item.id,
        sortOrder: index,
        isRequired: item.isRequired,
      })),
    );
  };

  return (
    <TransferListBase
      availableSource={availableSource}
      assignedSource={assignedSource}
      onSave={handleSave}
      labels={{
        available: t('available'),
        assigned: t('assigned'),
        noAvailable: t('noAvailable'),
        noAssigned: t('noAssigned'),
        required: t('required'),
        save: t('save'),
      }}
    />
  );
}
