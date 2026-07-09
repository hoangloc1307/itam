'use no memo';

import { IconPlus } from '@tabler/icons-react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { type Attribute } from 'itam-shared/types';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { attributeQueries } from '~/api/attribute.queries';
import { ConfirmDialog } from '~/components/confirm-dialog';
import DataTable from '~/components/datatable/datatable';
import { Button } from '~/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '~/components/ui/dialog';
import { useDeleteAttribute } from '~/hooks/mutations/use-attribute';
import useDatatable from '~/hooks/use-datatable';
import { getAttributeColumns } from '~/routes/_app/attribute/attribute.columns';
import { AttributeForm } from '~/routes/_app/attribute/attribute.form';

const AttributePage = () => {
  const { t, i18n } = useTranslation('attribute');
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Attribute | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const { data } = useSuspenseQuery(attributeQueries.all());
  const deleteMutation = useDeleteAttribute();
  const attributes = data?.data ?? [];

  const handleEdit = (attribute: Attribute) => {
    setEditing(attribute);
    setOpen(true);
  };

  const columns = getAttributeColumns(t, i18n.language, {
    onEdit: handleEdit,
    onDelete: (id) => setDeleteId(id),
  });

  const table = useDatatable({
    columns,
    data: attributes,
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
          <AttributeForm attribute={editing} onSuccess={handleClose} />
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

export const Route = createFileRoute('/_app/attribute/')({ component: AttributePage });
