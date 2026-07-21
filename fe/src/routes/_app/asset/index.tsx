'use no memo';

import { IconPlaylistAdd, IconPlus } from '@tabler/icons-react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { type Asset } from 'itam-shared/types';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { assetQueries } from '~/api/asset.queries';
import { ConfirmDialog } from '~/components/confirm-dialog';
import DataTable from '~/components/datatable/datatable';
import { Button } from '~/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '~/components/ui/dialog';
import { useDeleteAsset } from '~/hooks/mutations/use-asset';
import useDatatable from '~/hooks/use-datatable';
import { AssetBatchForm } from '~/routes/_app/asset/asset-batch.form';
import { getAssetColumns } from '~/routes/_app/asset/asset.columns';

const AssetPage = () => {
  const { t, i18n } = useTranslation('asset');
  const navigate = useNavigate();
  const [batchOpen, setBatchOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { data } = useSuspenseQuery(assetQueries.all());
  const deleteMutation = useDeleteAsset();
  const assets = data?.data ?? [];

  const handleEdit = (asset: Asset) => {
    navigate({ to: '/asset/$id/edit', params: { id: asset.id } });
  };

  const columns = getAssetColumns(t, i18n.language, {
    onEdit: handleEdit,
    onDelete: (id) => setDeleteId(id),
  });

  const table = useDatatable({
    columns,
    data: assets,
  });

  const handleAdd = () => {
    navigate({ to: '/asset/create' });
  };

  const handleBatchClose = () => {
    setBatchOpen(false);
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
        <div className='flex items-center gap-2'>
          <Button variant='outline' onClick={() => setBatchOpen(true)}>
            <IconPlaylistAdd data-icon='inline-start' />
            {t('batch.addBatch')}
          </Button>
          <Button onClick={handleAdd}>
            <IconPlus data-icon='inline-start' />
            {t('addNew')}
          </Button>
        </div>
      </div>

      <DataTable table={table} key={i18n.language} />

      <Dialog open={batchOpen} onOpenChange={setBatchOpen}>
        <DialogContent className='max-w-3xl'>
          <DialogHeader>
            <DialogTitle className='text-lg'>{t('batch.title')}</DialogTitle>
          </DialogHeader>
          <AssetBatchForm onSuccess={handleBatchClose} />
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

export const Route = createFileRoute('/_app/asset/')({ component: AssetPage });
