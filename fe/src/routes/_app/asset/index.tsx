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
import { useDeleteAsset } from '~/hooks/mutations/use-asset';
import useDatatable from '~/hooks/use-datatable';
import { getAssetColumns } from '~/routes/_app/asset/asset.columns';

const AssetPage = () => {
  const { t, i18n } = useTranslation('asset');
  const navigate = useNavigate();
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
          <Button variant='outline' onClick={() => navigate({ to: '/asset/batch' })}>
            <IconPlaylistAdd data-icon='inline-start' />
            {t('batch.addBatch')}
          </Button>
          <Button onClick={() => navigate({ to: '/asset/create' })}>
            <IconPlus data-icon='inline-start' />
            {t('addNew')}
          </Button>
        </div>
      </div>

      <DataTable table={table} key={i18n.language} />

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
