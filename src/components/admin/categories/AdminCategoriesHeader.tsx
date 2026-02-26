import { Plus } from 'lucide-react';
import Button from '../../ui/Button';

interface AdminCategoriesHeaderProps {
  onCreateCategory: () => void;
}

export function AdminCategoriesHeader({ onCreateCategory }: AdminCategoriesHeaderProps) {
  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Categories Management
          </h1>
          <p className="text-muted-foreground">
            Organize content with categories and subcategories
          </p>
        </div>
        <Button onPress={onCreateCategory} className="global_btn rounded_full bg_primary">
          <Plus className="h-4 w-4" />
          Add Category
        </Button>
      </div>
    </div>
  );
}
