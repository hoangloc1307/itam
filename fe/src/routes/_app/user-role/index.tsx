'use no memo';

import { IconPlus } from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { UserRole } from 'itam-shared/types';
import { roleQueries } from '~/api/role.queries';
import { userQueries } from '~/api/user.queries';
import { userRoleQueries } from '~/api/user-role.queries';
import { ConfirmDialog } from '~/components/confirm-dialog';
import DataTable from '~/components/datatable/datatable';
import { Button } from '~/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '~/components/ui/dialog';
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from '~/components/ui/combobox';
import { useDeleteUserRole } from '~/hooks/mutations/use-user-role';
import useDatatable from '~/hooks/use-datatable';
import { getUserRoleColumns } from '~/routes/_app/user-role/user-role.columns';
import { UserRoleForm } from '~/routes/_app/user-role/user-role.form';

const UserRolePage = () => {
  const { t } = useTranslation('userRole');
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState<UserRole | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const { data: usersData } = useQuery(userQueries.all());
  const { data: rolesData } = useQuery(roleQueries.all());
  const { data: userRolesData } = useQuery(userRoleQueries.byUser(selectedUser));
  const deleteMutation = useDeleteUserRole();

  const roles = rolesData?.data ?? [];
  const userRoles = useMemo(() => userRolesData?.data?.roles ?? [], [userRolesData?.data?.roles]);

  const userOptions = useMemo(
    () =>
      (usersData?.data ?? []).map((user) => ({
        value: user.username,
        label: `${user.name} (${user.username})`,
      })),
    [usersData?.data],
  );

  const columns = useMemo(
    () =>
      getUserRoleColumns(t, {
        onEdit: (userRole) => {
          setEditData(userRole);
          setOpen(true);
        },
        onDelete: (id) => setDeleteId(id),
      }),
    [t],
  );

  const table = useDatatable({
    columns,
    data: userRoles,
  });

  const handleAdd = () => {
    setEditData(null);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditData(null);
  };

  const handleDelete = () => {
    if (deleteId) {
      deleteMutation.mutate({ id: deleteId, username: selectedUser });
    }
  };

  return (
    <div>
      <div className='mb-4 flex items-center justify-between'>
        <h1 className='text-foreground text-2xl font-bold'>{t('title')}</h1>
        <Button onClick={handleAdd} disabled={!selectedUser}>
          <IconPlus data-icon='inline-start' />
          {t('addNew')}
        </Button>
      </div>

      <div className='mb-6'>
        <Combobox
          items={userOptions}
          value={userOptions.find((opt) => opt.value === selectedUser) ?? null}
          onValueChange={(val) => setSelectedUser(val?.value ?? '')}
          itemToStringValue={(item) => item.label}
        >
          <ComboboxInput placeholder={t('selectUser')} className='w-[300px]' />
          <ComboboxContent>
            <ComboboxEmpty>{t('noUserFound')}</ComboboxEmpty>
            <ComboboxList>
              {(item) => (
                <ComboboxItem key={item.value} value={item}>
                  {item.label}
                </ComboboxItem>
              )}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
      </div>

      {selectedUser && <DataTable table={table} key={selectedUser} />}

      <Dialog
        open={open}
        onOpenChange={(val) => {
          if (!val) handleClose();
          else setOpen(true);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle className='text-lg capitalize'>
              {editData ? t('edit') : t('addNew')}
            </DialogTitle>
          </DialogHeader>
          <UserRoleForm
            key={editData?.id ?? 'create'}
            username={selectedUser}
            roles={roles}
            editData={editData}
            onSuccess={handleClose}
          />
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

export const Route = createFileRoute('/_app/user-role/')({
  component: UserRolePage,
});
