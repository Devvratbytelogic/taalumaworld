import { Plus } from 'lucide-react';
import Button from '../../ui/Button';
import { AdminPageHeader } from '@/components/admin/layout/AdminContent';

interface AdminCategoriesHeaderProps {
  onCreateCategory: () => void;
}

export function AdminCategoriesHeader({ onCreateCategory }: AdminCategoriesHeaderProps) {
  return (
    <AdminPageHeader
      title="Categories management"
      description="Organize content with categories and subcategories"
    >
      <Button onPress={onCreateCategory} className="global_btn rounded_full bg_primary">
        <Plus className="h-4 w-4" />
        Add category
      </Button>
    </AdminPageHeader>
  );
}
