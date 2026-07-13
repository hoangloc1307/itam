'use no memo';

import { IconPlus } from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { RolePermission } from 'itam-shared/types';
import { featureQueries } from '~/api/feature.queries';
import { rolePermissionQueries } from '~/api/role-permission.queries';
import { roleQueries } from '~/api/role.queries';
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
import { useDeleteRolePermission } from '~/hooks/mutations/use-role-permission';
import useDatatable from '~/hooks/use-datatable';
import { getRolePermissionColumns } from '~/routes/_app/role-permission/role-permission.columns';
import { RolePermissionForm } from '~/routes/_app/role-permission/role-permission.form';

const RolePermissionPage = () => {
  const { t } = useTranslation('rolePermission');
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState<RolePermission | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const { data: rolesData } = useQuery(roleQueries.all());
  const { data: featuresData } = useQuery(featureQueries.all());
  const { data: permissionsData } = useQuery(rolePermissionQueries.byRole(selectedRole));
  const deleteMutation = useDeleteRolePermission();

  const roles = rolesData?.data ?? [];
  const features = featuresData?.data ?? [];
  const permissions = useMemo(
    () => permissionsData?.data?.permissions ?? [],
    [permissionsData?.data?.permissions],
  );

  const roleOptions = useMemo(
    () =>
      (rolesData?.data ?? []).map((role) => ({
        value: role.code,
        label: role.name,
      })),
    [rolesData?.data],
  );

  const columns = useMemo(
    () =>
      getRolePermissionColumns(t, {
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
      deleteMutation.mutate({ id: deleteId, roleCode: selectedRole });
    }
  };

  return (
    <div>
      <div className='mb-4 flex items-center justify-between'>
        <h1 className='text-foreground text-2xl font-bold'>{t('title')}</h1>
        <Button onClick={handleAdd} disabled={!selectedRole}>
          <IconPlus data-icon='inline-start' />
          {t('addNew')}
        </Button>
      </div>

      <div className='mb-6'>
        <Combobox
          items={roleOptions}
          value={roleOptions.find((opt) => opt.value === selectedRole) ?? null}
          onValueChange={(val) => setSelectedRole(val?.value ?? '')}
          itemToStringValue={(item) => item.label}
        >
          <ComboboxInput placeholder={t('selectRole')} className='w-[300px]' />
          <ComboboxContent>
            <ComboboxEmpty>{t('noRoleFound')}</ComboboxEmpty>
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

      {selectedRole && <DataTable table={table} key={selectedRole} />}

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
          <RolePermissionForm
            key={editData?.id ?? 'create'}
            roleCode={selectedRole}
            roles={roles}
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

export const Route = createFileRoute('/_app/role-permission/')({
  component: RolePermissionPage,
});
