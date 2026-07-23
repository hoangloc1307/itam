'use no memo';

import { IconPlus } from '@tabler/icons-react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { type Feature } from 'itam-shared/types';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { featureQueries } from '~/api/feature.queries';
import { ConfirmDialog } from '~/components/confirm-dialog';
import DataTable from '~/components/datatable/datatable';
import { Button } from '~/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '~/components/ui/dialog';
import { useDeleteFeature } from '~/hooks/mutations/use-feature';
import useDatatable from '~/hooks/use-datatable';
import { getFeatureColumns } from '~/routes/_app/feature/feature.columns';
import { FeatureForm } from '~/routes/_app/feature/feature.form';

const FeaturePage = () => {
  const { t, i18n } = useTranslation('feature');
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Feature | null>(null);
  const [deleteCode, setDeleteCode] = useState<string | null>(null);
  const { data } = useSuspenseQuery(featureQueries.all());
  const deleteMutation = useDeleteFeature();
  const features = data?.data ?? [];

  const handleEdit = (feature: Feature) => {
    setEditing(feature);
    setOpen(true);
  };

  const columns = getFeatureColumns(t, i18n.language, {
    onEdit: handleEdit,
    onDelete: (code) => setDeleteCode(code),
  });

  const table = useDatatable({
    columns,
    data: features,
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
    if (deleteCode) {
      deleteMutation.mutate(deleteCode);
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
          <FeatureForm
            feature={editing}
            existingCodes={features.map((f) => f.code)}
            onSuccess={handleClose}
          />
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteCode}
        onOpenChange={(open) => !open && setDeleteCode(null)}
        title={t('deleteConfirm')}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export const Route = createFileRoute('/_app/feature/')({ component: FeaturePage });
