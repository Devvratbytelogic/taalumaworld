import { useState } from 'react';
import { useGetCategoriesQuery } from '../../../store/api/categoriesApi';
import toast from '@/utils/toast';
import type { Category } from '../../../data/mockData';
import { AdminCategoriesHeader } from './AdminCategoriesHeader';
import { AdminCategoriesSearch } from './AdminCategoriesSearch';
import { CategoryListing } from './CategoryListing';
import { AddCategoryModal } from './AddCategoryModal';
import { EditCategoryModal } from './EditCategoryModal';
import { DeleteCategoryDialog } from './DeleteCategoryDialog';

export function AdminCategoriesTab() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deleteConfirmCategory, setDeleteConfirmCategory] = useState<Category | null>(null);

  const { data: categories = [] } = useGetCategoriesQuery();

  const filteredCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.subcategories.some((sub) =>
        sub.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
  };

  const handleDeleteCategory = (category: Category) => {
    setDeleteConfirmCategory(category);
  };

  const confirmDeleteCategory = () => {
    if (deleteConfirmCategory) {
      toast.success(`"${deleteConfirmCategory.name}" deleted`);
      setDeleteConfirmCategory(null);
    }
  };

  return (
    <div className="space-y-8">
      <AdminCategoriesHeader onCreateCategory={() => setIsCreateModalOpen(true)} />

      <AdminCategoriesSearch
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <CategoryListing
        categories={filteredCategories}
        searchQuery={searchQuery}
        onCreateCategory={() => setIsCreateModalOpen(true)}
        onEdit={handleEditCategory}
        onDelete={handleDeleteCategory}
      />

      <AddCategoryModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        categories={categories}
      />

      <EditCategoryModal
        category={editingCategory}
        open={!!editingCategory}
        onOpenChange={(open) => !open && setEditingCategory(null)}
        categories={categories}
      />

      <DeleteCategoryDialog
        category={deleteConfirmCategory}
        open={!!deleteConfirmCategory}
        onOpenChange={(open) => !open && setDeleteConfirmCategory(null)}
        onConfirm={confirmDeleteCategory}
      />
    </div>
  );
}
