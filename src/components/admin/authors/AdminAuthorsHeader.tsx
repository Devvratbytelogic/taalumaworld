import { Plus } from 'lucide-react';
import Button from '../../ui/Button';

interface AdminAuthorsHeaderProps {
  onCreateAuthor: () => void;
}

export function AdminAuthorsHeader({ onCreateAuthor }: AdminAuthorsHeaderProps) {
  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Thought Leaders
          </h1>
          <p className="text-muted-foreground">
            Manage authors and content creators
          </p>
        </div>
        <Button onPress={onCreateAuthor} className="global_btn rounded_full bg_primary">
          <Plus className="h-4 w-4" />
          Add Thought Leader
        </Button>
      </div>
    </div>
  );
}
