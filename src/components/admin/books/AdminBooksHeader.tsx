import { Plus } from 'lucide-react';
import Button from '../../ui/Button';

interface AdminBooksHeaderProps {
  onCreateBook: () => void;
}

export function AdminBooksHeader({ onCreateBook }: AdminBooksHeaderProps) {
  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Books Management
          </h1>
          <p className="text-muted-foreground">
            Manage all books on the platform
          </p>
        </div>
        <Button onPress={onCreateBook} className="global_btn rounded_full bg_primary">
          <Plus className="h-4 w-4" />
          Create New Book
        </Button>
      </div>
    </div>
  );
}
