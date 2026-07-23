'use no memo';

import { IconPlus } from '@tabler/icons-react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import type { AllocationDetail } from 'itam-shared/types';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { allocationQueries } from '~/api/allocation.queries';
import { ConfirmDialog } from '~/components/confirm-dialog';
import DataTable from '~/components/datatable/datatable';
import { Button } from '~/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '~/components/ui/dialog';
import { useDeleteAllocation, useReturnAllocation } from '~/hooks/mutations/use-allocation';
import useDatatable from '~/hooks/use-datatable';
import { getAllocationColumns } from '~/routes/_app/allocation/allocation.columns';
import { AllocationForm } from '~/routes/_app/allocation/allocation.form';

const AllocationPage = () => {
  const { t, i18n } = useTranslation('allocation');
  const [open, setOpen] = useState(false);
  const [returnTarget, setReturnTarget] = useState<AllocationDetail | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const { data } = useSuspenseQuery(allocationQueries.all());
  const deleteMutation = useDeleteAllocation();
  const returnMutation = useReturnAllocation();
  const allocations = data?.data ?? [];

  const columns = getAllocationColumns(t, i18n.language, {
    onReturn: (allocation) => setReturnTarget(allocation),
    onDelete: (id) => setDeleteId(id),
  });

  const table = useDatatable({
    columns,
    data: allocations,
  });

  const handleAdd = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleReturn = () => {
    if (returnTarget) {
      returnMutation.mutate({ id: returnTarget.id });
    }
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
            <DialogTitle className='text-lg capitalize'>{t('addNew')}</DialogTitle>
          </DialogHeader>
          <AllocationForm onSuccess={handleClose} />
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!returnTarget}
        onOpenChange={(open) => !open && setReturnTarget(null)}
        title={t('returnConfirm')}
        description={returnTarget ? t('returnDescription', { asset: returnTarget.asset.name }) : ''}
        onConfirm={handleReturn}
        variant='default'
      />

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title={t('deleteConfirm')}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export const Route = createFileRoute('/_app/allocation/')({ component: AllocationPage });
