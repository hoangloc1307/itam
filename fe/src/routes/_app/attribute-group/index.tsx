'use no memo';

import { IconPlus } from '@tabler/icons-react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { type AttributeGroup } from 'itam-shared/types';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { attributeGroupQueries } from '~/api/attribute-group.queries';
import { ConfirmDialog } from '~/components/confirm-dialog';
import DataTable from '~/components/datatable/datatable';
import { Button } from '~/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '~/components/ui/dialog';
import { useDeleteAttributeGroup } from '~/hooks/mutations/use-attribute-group';
import useDatatable from '~/hooks/use-datatable';
import { getAttributeGroupColumns } from '~/routes/_app/attribute-group/attribute-group.columns';
import { AttributeGroupForm } from '~/routes/_app/attribute-group/attribute-group.form';

const AttributeGroupPage = () => {
  const { t, i18n } = useTranslation('attributeGroup');
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<AttributeGroup | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const { data } = useSuspenseQuery(attributeGroupQueries.all());
  const deleteMutation = useDeleteAttributeGroup();
  const groups = data?.data ?? [];

  const handleEdit = (group: AttributeGroup) => {
    setEditing(group);
    setOpen(true);
  };

  const columns = getAttributeGroupColumns(t, i18n.language, {
    onEdit: handleEdit,
    onDelete: (id) => setDeleteId(id),
  });

  const table = useDatatable({
    columns,
    data: groups,
  });

  const handleAdd = () => {
    setEditing(null);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditing(null);
  };

  const handleDelete = () => {
    if (deleteId) {
      deleteMutation.mutate(deleteId);
    }
  };

  return (
    <div>
      <div className='mb-4 flex items-center justify-between'>
        <h1 className='text-foreground text-2xl font-bold'>{t('title')}</h1>
        <Button onClick={handleAdd}>
          <IconPlus data-icon='inline-start' />
          {t('addNew')}
        </Button>
      </div>

      <DataTable table={table} key={i18n.language} />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className='text-lg capitalize'>
              {editing ? t('edit') : t('addNew')}
            </DialogTitle>
          </DialogHeader>
          <AttributeGroupForm group={editing} onSuccess={handleClose} />
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title={t('deleteConfirm')}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export const Route = createFileRoute('/_app/attribute-group/')({ component: AttributeGroupPage });
