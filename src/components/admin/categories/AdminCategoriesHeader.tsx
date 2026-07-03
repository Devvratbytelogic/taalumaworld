import { Plus } from 'lucide-react';
import { Button } from '@heroui/react';
import { AdminPageHeader } from '@/components/admin/layout/AdminContent';

interface AdminCategoriesHeaderProps {
  onCreateCategory: () => void;
}

export function AdminCategoriesHeader({ onCreateCategory }: AdminCategoriesHeaderProps) {
  return (
    <AdminPageHeader
      title="Categories"
      description="Organize content with categories and subcategories"
    >
      <Button
        color="primary"
        className="rounded-xl"
        onPress={onCreateCategory}
        startContent={<Plus className="h-4 w-4" />}
      >
        Add category
      </Button>
    </AdminPageHeader>
  );
}
