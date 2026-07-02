import { createFileRoute } from '@tanstack/react-router';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { IconEdit, IconPlus, IconTrash } from '@tabler/icons-react';
import { type Category } from '~/api/category';
import { categoryQueries } from '~/api/category.queries';
import { Button } from '~/components/ui/button';
import { Badge } from '~/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '~/components/ui/dialog';
import { ConfirmDialog } from '~/components/confirm-dialog';
import { CategoryForm } from '~/components/category-form';
import { useDeleteCategory } from '~/hooks/mutations/use-category';

const CategoryPage = () => {
  const { t } = useTranslation('category');
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { data } = useSuspenseQuery(categoryQueries.all());
  const deleteMutation = useDeleteCategory();
  const categories = data?.data ?? [];

  const handleEdit = (category: Category) => {
    setEditing(category);
    setOpen(true);
  };

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
        <h1 className='text-2xl font-bold'>{t('title')}</h1>
        <Button onClick={handleAdd}>
          <IconPlus data-icon='inline-start' />
          {t('addNew')}
        </Button>
      </div>

      <div className='rounded-lg border'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('columns.id')}</TableHead>
              <TableHead>{t('columns.name')}</TableHead>
              <TableHead>{t('columns.serialKey')}</TableHead>
              <TableHead>{t('columns.maintenanceIntervalHours')}</TableHead>
              <TableHead>{t('columns.status')}</TableHead>
              <TableHead className='w-24'>{t('columns.actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className='text-muted-foreground text-center'>
                  No data
                </TableCell>
              </TableRow>
            ) : (
              categories.map((cat) => (
                <TableRow key={cat.id}>
                  <TableCell className='font-mono'>{cat.id}</TableCell>
                  <TableCell>{cat.name}</TableCell>
                  <TableCell className='font-mono'>{cat.serialKey}</TableCell>
                  <TableCell>{cat.maintenanceIntervalHours ?? '-'}</TableCell>
                  <TableCell>
                    <Badge variant={cat.isActive ? 'default' : 'secondary'}>
                      {cat.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className='flex gap-1'>
                      <Button size='icon-xs' variant='ghost' onClick={() => handleEdit(cat)}>
                        <IconEdit />
                      </Button>
                      <Button size='icon-xs' variant='ghost' onClick={() => setDeleteId(cat.id)}>
                        <IconTrash />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className='text-lg capitalize'>
              {editing ? t('edit') : t('addNew')}
            </DialogTitle>
          </DialogHeader>
          <CategoryForm category={editing} onSuccess={handleClose} />
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

export const Route = createFileRoute('/_app/category')({ component: CategoryPage });
