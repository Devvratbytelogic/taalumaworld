import { useState } from 'react';
import { FolderTree, Layers, Tags } from 'lucide-react';
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
import { useDebounce } from '@/hooks/useDebounce';
import { AdminPage, AdminStatCard } from '@/components/admin/layout/AdminContent';

export function AdminCategoriesTab() {
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 400);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<IAllCategoriesAPIResponseData | null>(null);
  const [deleteConfirmCategory, setDeleteConfirmCategory] = useState<IAllCategoriesAPIResponseData | null>(null);

  const { data: categoriesResponse, isLoading, isFetching } = useGetAllCategoriesQuery();
  const [addCategory] = useAddCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();
  const [deleteCategory, { isLoading: isDeleting }] = useDeleteCategoryMutation();

  const categories = categoriesResponse?.data ?? [];

  const searchText = debouncedSearch.trim().toLowerCase();
  const filteredCategories = searchText
    ? categories.filter(
        (category) =>
          category.name.toLowerCase().includes(searchText) ||
          category.slug.toLowerCase().includes(searchText) ||
          (category.subcategories ?? []).some((sub) =>
            sub?.name?.toLowerCase().includes(searchText)
          )
      )
    : categories;

  const subcategoryCount = categories.reduce(
    (count, category) => count + (category.subcategories ?? []).filter(Boolean).length,
    0
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
      const res = await deleteCategory({ id: deleteConfirmCategory.id }).unwrap();
      if (res?.http_status_code === 200 || res?.http_status_code === 201) {
        toast.success(res.message ?? `"${deleteConfirmCategory.name}" deleted`);
        setDeleteConfirmCategory(null);
      }
    } catch {
      // Error toast handled by API layer
    }
  };

  const handleAddCategory = async (payload: { name: string; slug: string; subcategories: unknown[] }) => {
    try {
      const res = await addCategory(payload).unwrap();
      if (res?.http_status_code === 200 || res?.http_status_code === 201) {
        toast.success(res.message ?? 'Category created successfully');
        setIsCreateModalOpen(false);
      }
    } catch {
      // Error toast handled by API layer
    }
  };

  const handleUpdateCategory = async (
    id: string,
    values: { name: string; slug: string; subcategories: unknown[] }
  ) => {
    try {
      const res = await updateCategory({ id, values }).unwrap();
      if (res?.http_status_code === 200 || res?.http_status_code === 201) {
        toast.success(res.message ?? 'Category updated successfully');
        setEditingCategory(null);
      }
    } catch {
      // Error toast handled by API layer
    }
  };

  return (
    <AdminPage>
      <AdminCategoriesHeader onCreateCategory={() => setIsCreateModalOpen(true)} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <AdminStatCard label="Categories" value={categories.length} icon={FolderTree} tone="blue" />
        <AdminStatCard label="Subcategories" value={subcategoryCount} icon={Layers} tone="green" />
        <AdminStatCard
          label="Empty categories"
          value={categories.filter((c) => !(c.subcategories ?? []).length).length}
          icon={Tags}
          tone="slate"
        />
      </div>

      <AdminCategoriesSearch
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {isLoading || isFetching ? (
        <AdminCategoriesSkeleton />
      ) : (
        <CategoryListing
          categories={filteredCategories}
          totalCount={categories.length}
          searchQuery={debouncedSearch}
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
    </AdminPage>
  );
}
