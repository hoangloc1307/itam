'use no memo';

import { IconPlus } from '@tabler/icons-react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { type Role } from 'itam-shared/types';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { roleQueries } from '~/api/role.queries';
import { ConfirmDialog } from '~/components/confirm-dialog';
import DataTable from '~/components/datatable/datatable';
import { Button } from '~/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '~/components/ui/dialog';
import { useDeleteRole } from '~/hooks/mutations/use-role';
import useDatatable from '~/hooks/use-datatable';
import { getRoleColumns } from '~/routes/_app/role/role.columns';
import { RoleForm } from '~/routes/_app/role/role.form';

const RolePage = () => {
  const { t, i18n } = useTranslation('role');
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Role | null>(null);
  const [deleteCode, setDeleteCode] = useState<string | null>(null);
  const { data } = useSuspenseQuery(roleQueries.all());
  const deleteMutation = useDeleteRole();
  const roles = data?.data ?? [];

  const handleEdit = (role: Role) => {
    setEditing(role);
    setOpen(true);
  };

  const columns = getRoleColumns(t, i18n.language, {
    onEdit: handleEdit,
    onDelete: (code) => setDeleteCode(code),
  });

  const table = useDatatable({
    columns,
    data: roles,
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
          <RoleForm role={editing} onSuccess={handleClose} />
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

export const Route = createFileRoute('/_app/role/')({ component: RolePage });
