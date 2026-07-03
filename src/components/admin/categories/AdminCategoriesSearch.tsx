import { AdminSearchInput, AdminSearchPanel } from '@/components/admin/layout/AdminContent';

interface AdminCategoriesSearchProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export function AdminCategoriesSearch({ searchQuery, onSearchChange }: AdminCategoriesSearchProps) {
  return (
    <AdminSearchPanel>
      <AdminSearchInput
        value={searchQuery}
        onChange={onSearchChange}
        placeholder="Search categories and subcategories..."
      />
    </AdminSearchPanel>
  );
}
