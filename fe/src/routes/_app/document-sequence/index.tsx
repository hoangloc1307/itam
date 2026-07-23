'use no memo';

import { IconPlus } from '@tabler/icons-react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { type DocumentSequence } from 'itam-shared/types';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { documentSequenceQueries } from '~/api/document-sequence.queries';
import { ConfirmDialog } from '~/components/confirm-dialog';
import DataTable from '~/components/datatable/datatable';
import { Button } from '~/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '~/components/ui/dialog';
import { useDeleteDocumentSequence } from '~/hooks/mutations/use-document-sequence';
import useDatatable from '~/hooks/use-datatable';
import { getDocumentSequenceColumns } from '~/routes/_app/document-sequence/document-sequence.columns';
import { DocumentSequenceForm } from '~/routes/_app/document-sequence/document-sequence.form';

const DocumentSequencePage = () => {
  const { t, i18n } = useTranslation('documentSequence');
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<DocumentSequence | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const { data } = useSuspenseQuery(documentSequenceQueries.all());
  const deleteMutation = useDeleteDocumentSequence();
  const sequences = data?.data ?? [];

  const handleEdit = (item: DocumentSequence) => {
    setEditing(item);
    setOpen(true);
  };

  const columns = getDocumentSequenceColumns(t, i18n.language, {
    onEdit: handleEdit,
    onDelete: (id) => setDeleteId(id),
  });

  const table = useDatatable({
    columns,
    data: sequences,
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
          <DocumentSequenceForm sequence={editing} onSuccess={handleClose} />
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

export const Route = createFileRoute('/_app/document-sequence/')({
  component: DocumentSequencePage,
});
