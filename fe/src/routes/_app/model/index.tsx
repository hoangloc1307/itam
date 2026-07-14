'use no memo';

import { IconPlus } from '@tabler/icons-react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { type Model } from 'itam-shared/types';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { categoryQueries } from '~/api/category.queries';
import { modelQueries } from '~/api/model.queries';
import { ConfirmDialog } from '~/components/confirm-dialog';
import DataTable from '~/components/datatable/datatable';
import { Button } from '~/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '~/components/ui/dialog';
import { useDeleteModel } from '~/hooks/mutations/use-model';
import useDatatable from '~/hooks/use-datatable';
import { getModelColumns } from '~/routes/_app/model/model.columns';
import { ModelForm } from '~/routes/_app/model/model.form';

const ModelPage = () => {
  const { t, i18n } = useTranslation('model');
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Model | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { data } = useSuspenseQuery(modelQueries.all());
  const { data: categoryData } = useSuspenseQuery(categoryQueries.all());
  const deleteMutation = useDeleteModel();
  const models = data?.data ?? [];
  const categories = categoryData?.data ?? [];

  const handleEdit = (model: Model) => {
    setEditing(model);
    setOpen(true);
  };

  const columns = getModelColumns(
    t,
    i18n.language,
    {
      onEdit: handleEdit,
      onDelete: (id) => setDeleteId(id),
    },
    categories,
  );

  const table = useDatatable({
    columns,
    data: models,
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
          <ModelForm model={editing} categories={categories} onSuccess={handleClose} />
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

export const Route = createFileRoute('/_app/model/')({ component: ModelPage });
