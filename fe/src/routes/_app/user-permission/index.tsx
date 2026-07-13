'use no memo';

import { IconPlus } from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { UserPermission } from 'itam-shared/types';
import { featureQueries } from '~/api/feature.queries';
import { userQueries } from '~/api/user.queries';
import { userPermissionQueries } from '~/api/user-permission.queries';
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
import { useDeleteUserPermission } from '~/hooks/mutations/use-user-permission';
import useDatatable from '~/hooks/use-datatable';
import { getUserPermissionColumns } from '~/routes/_app/user-permission/user-permission.columns';
import { UserPermissionForm } from '~/routes/_app/user-permission/user-permission.form';

const UserPermissionPage = () => {
  const { t } = useTranslation('userPermission');
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState<UserPermission | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const { data: usersData } = useQuery(userQueries.all());
  const { data: featuresData } = useQuery(featureQueries.all());
  const { data: permissionsData } = useQuery(userPermissionQueries.byUser(selectedUser));
  const deleteMutation = useDeleteUserPermission();

  const features = featuresData?.data ?? [];
  const permissions = useMemo(
    () => permissionsData?.data?.permissions ?? [],
    [permissionsData?.data?.permissions],
  );

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
      getUserPermissionColumns(t, {
        onEdit: (permission) => {
          setEditData(permission);
          setOpen(true);
        },
        onDelete: (id) => setDeleteId(id),
      }),
    [t],
  );

  const table = useDatatable({
    columns,
    data: permissions,
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
          <UserPermissionForm
            key={editData?.id ?? 'create'}
            username={selectedUser}
            features={features}
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

export const Route = createFileRoute('/_app/user-permission/')({
  component: UserPermissionPage,
});
