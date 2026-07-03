import { Plus, FolderTree, Edit, Trash2 } from 'lucide-react';
import { Button } from '@heroui/react';
import { Badge } from '../../ui/badge';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '../../ui/table';
import { AdminEmptyState, AdminTableShell } from '@/components/admin/layout/AdminContent';
import type { IAllCategoriesAPIResponseData, SubcategoriesEntity } from '@/types/categories';

interface CategoryListingProps {
  categories: IAllCategoriesAPIResponseData[];
  totalCount: number;
  searchQuery: string;
  onCreateCategory: () => void;
  onEdit: (category: IAllCategoriesAPIResponseData) => void;
  onDelete: (category: IAllCategoriesAPIResponseData) => void;
}

export function CategoryListing({
  categories,
  totalCount,
  searchQuery,
  onCreateCategory,
  onEdit,
  onDelete,
}: CategoryListingProps) {
  if (categories.length === 0) {
    return (
      <AdminTableShell>
        <AdminEmptyState
          icon={FolderTree}
          title="No categories found"
          description={
            searchQuery.trim()
              ? 'Try adjusting your search query.'
              : 'Create your first category to get started.'
          }
          action={
            !searchQuery.trim() ? (
              <Button
                color="primary"
                className="rounded-xl"
                onPress={onCreateCategory}
                startContent={<Plus className="h-4 w-4" />}
              >
                Add category
              </Button>
            ) : undefined
          }
        />
      </AdminTableShell>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-slate-500">
        Showing <span className="font-medium text-slate-900">{categories.length}</span>
        {categories.length !== totalCount ? (
          <> of <span className="font-medium text-slate-900">{totalCount}</span></>
        ) : null}{' '}
        categories
      </p>

      <AdminTableShell>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12 px-4">#</TableHead>
              <TableHead className="px-4">Category</TableHead>
              <TableHead className="px-4">Subcategories</TableHead>
              <TableHead className="w-24 px-4 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((category, idx) => {
              const subs = (category.subcategories ?? []).filter(Boolean) as SubcategoriesEntity[];

              return (
                <TableRow key={category.id}>
                  <TableCell className="px-4 text-sm text-muted-foreground">{idx + 1}</TableCell>
                  <TableCell className="px-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                        <FolderTree className="h-4 w-4 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-slate-900">{category.name}</p>
                        <p className="text-xs text-muted-foreground">{category.slug}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-4">
                    {subs.length === 0 ? (
                      <span className="text-sm text-slate-400">No subcategories</span>
                    ) : (
                      <div className="flex flex-wrap gap-1.5">
                        {subs.map((sub) => (
                          <Badge
                            key={sub.id ?? sub._id}
                            variant="outline"
                            className="border-slate-200 text-xs text-slate-600"
                          >
                            {sub.name}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="px-4">
                    <div className="flex justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => onEdit(category)}
                        aria-label={`Edit ${category.name}`}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-primary transition-colors hover:bg-primary/5"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(category)}
                        aria-label={`Delete ${category.name}`}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-red-600 transition-colors hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </AdminTableShell>
    </div>
  );
}
