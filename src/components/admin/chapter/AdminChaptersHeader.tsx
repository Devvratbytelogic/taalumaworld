import { Plus } from 'lucide-react';
import Button from '../../ui/Button';

interface AdminChaptersHeaderProps {
  onCreateChapter: () => void;
}

export function AdminChaptersHeader({ onCreateChapter }: AdminChaptersHeaderProps) {
  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Chapters Management
          </h1>
          <p className="text-muted-foreground">
            Manage all chapters across all books
          </p>
        </div>
        <Button onPress={onCreateChapter} className="global_btn rounded_full bg_primary">
          <Plus className="h-4 w-4" />
          Create New Chapter
        </Button>
      </div>
    </div>
  );
}
