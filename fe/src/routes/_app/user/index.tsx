'use no memo';

import { IconPlus } from '@tabler/icons-react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { type User } from 'itam-shared/types';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { userQueries } from '~/api/user.queries';
import { ConfirmDialog } from '~/components/confirm-dialog';
import DataTable from '~/components/datatable/datatable';
import { Button } from '~/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '~/components/ui/dialog';
import { useResetPassword, useDeleteUser } from '~/hooks/mutations/use-user';
import useDatatable from '~/hooks/use-datatable';
import { getUserColumns } from '~/routes/_app/user/user.columns';
import { UserForm } from '~/routes/_app/user/user.form';

const UserPage = () => {
  const { t, i18n } = useTranslation('user');
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);
  const [resetUsername, setResetUsername] = useState<string | null>(null);
  const [deleteUsername, setDeleteUsername] = useState<string | null>(null);
  const { data } = useSuspenseQuery(userQueries.all());
  const resetPasswordMutation = useResetPassword();
  const deleteMutation = useDeleteUser();
  const users = data?.data ?? [];

  const handleEdit = (user: User) => {
    setEditing(user);
    setOpen(true);
  };

  const columns = getUserColumns(t, i18n.language, {
    onEdit: handleEdit,
    onDelete: (username) => setDeleteUsername(username),
    onResetPassword: (username) => setResetUsername(username),
  });

  const table = useDatatable({
    columns,
    data: users,
  });

  const handleAdd = () => {
    setEditing(null);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditing(null);
  };

  const handleResetPassword = () => {
    if (resetUsername) {
      resetPasswordMutation.mutate(resetUsername);
    }
  };

  const handleDelete = () => {
    if (deleteUsername) {
      deleteMutation.mutate(deleteUsername);
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
          <UserForm user={editing} onSuccess={handleClose} />
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!resetUsername}
        onOpenChange={(open) => !open && setResetUsername(null)}
        title={t('resetPasswordConfirm')}
        onConfirm={handleResetPassword}
      />

      <ConfirmDialog
        open={!!deleteUsername}
        onOpenChange={(open) => !open && setDeleteUsername(null)}
        title={t('deleteConfirm')}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export const Route = createFileRoute('/_app/user/')({ component: UserPage });
