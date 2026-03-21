import { useState } from 'react';
import toast from '@/utils/toast';
import type { IAllCategoriesAPIResponseData } from '@/types/categories';
import { useGetAllCategoriesQuery } from '@/store/rtkQueries/adminGetApi';
import {
  useAddCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} from '@/store/rtkQueries/adminPostApi';
import { AdminCategoriesHeader } from './AdminCategoriesHeader';
import { AdminCategoriesSearch } from './AdminCategoriesSearch';
import { CategoryListing } from './CategoryListing';
import { AddCategoryModal } from './AddCategoryModal';
import { EditCategoryModal } from './EditCategoryModal';
import { DeleteCategoryDialog } from './DeleteCategoryDialog';
import AdminCategoriesSkeleton from '@/components/skeleton-loader/AdminCategoriesSkeleton';

export function AdminCategoriesTab() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<IAllCategoriesAPIResponseData | null>(null);
  const [deleteConfirmCategory, setDeleteConfirmCategory] = useState<IAllCategoriesAPIResponseData | null>(null);

  const { data: categoriesResponse, isLoading, isFetching } = useGetAllCategoriesQuery();
  const [addCategory] = useAddCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();
  const [deleteCategory, { isLoading: isDeleting }] = useDeleteCategoryMutation();

  const categories = categoriesResponse?.data ?? [];

  const filteredCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (category.subcategories ?? []).some((sub) =>
        sub?.name?.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  const handleEditCategory = (category: IAllCategoriesAPIResponseData) => {
    setEditingCategory(category);
  };

  const handleDeleteCategory = (category: IAllCategoriesAPIResponseData) => {
    setDeleteConfirmCategory(category);
  };

  const confirmDeleteCategory = async () => {
    if (!deleteConfirmCategory) return;
    try {
      await deleteCategory({ id: deleteConfirmCategory.id }).unwrap();
      toast.success(`"${deleteConfirmCategory.name}" deleted`);
      setDeleteConfirmCategory(null);
    } catch {
      // Error toast handled by API layer
    }
  };

  const handleAddCategory = async (payload: { name: string; slug: string; subcategories: unknown[] }) => {
    try {
      await addCategory(payload).unwrap();
      toast.success('Category created successfully');
      setIsCreateModalOpen(false);
    } catch {
      // Error toast handled by API layer
    }
  };

  const handleUpdateCategory = async (
    id: string,
    values: { name: string; slug: string; subcategories: unknown[] }
  ) => {
    try {
      await updateCategory({ id, values }).unwrap();
      toast.success('Category updated successfully');
      setEditingCategory(null);
    } catch {
      // Error toast handled by API layer
    }
  };

  return (
    <div className="space-y-8">
      <AdminCategoriesHeader onCreateCategory={() => setIsCreateModalOpen(true)} />

      <AdminCategoriesSearch
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {isLoading || isFetching ? (
        <AdminCategoriesSkeleton />
      ) : (
      <CategoryListing
        categories={filteredCategories}
        searchQuery={searchQuery}
        onCreateCategory={() => setIsCreateModalOpen(true)}
        onEdit={handleEditCategory}
        onDelete={handleDeleteCategory}
      />
      )}

      <AddCategoryModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        categories={categories}
        onSubmit={handleAddCategory}
      />

      <EditCategoryModal
        category={editingCategory}
        open={!!editingCategory}
        onOpenChange={(open) => !open && setEditingCategory(null)}
        categories={categories}
        onSubmit={handleUpdateCategory}
      />

      <DeleteCategoryDialog
        category={deleteConfirmCategory}
        open={!!deleteConfirmCategory}
        onOpenChange={(open) => !open && setDeleteConfirmCategory(null)}
        onConfirm={confirmDeleteCategory}
        isDeleting={isDeleting}
      />
    </div>
  );
}
