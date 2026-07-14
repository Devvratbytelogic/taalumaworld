import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { Button } from '@heroui/react';
import { AdminPageHeader } from '@/components/admin/layout/AdminContent';

interface AdminBooksHeaderProps {
  onCreateBook: () => void;
  isTrashView: boolean;
  onToggleTrash: () => void;
}

export function AdminBooksHeader({ onCreateBook, isTrashView, onToggleTrash }: AdminBooksHeaderProps) {
  return (
    <AdminPageHeader
      title={isTrashView ? 'Trash' : 'Series'}
      description={isTrashView ? 'View deleted series' : 'Manage all series on the platform'}
    >
      <Button
        className={`global_btn rounded_full ${isTrashView ? 'outline_primary' : 'danger_outline'}`}
        onPress={onToggleTrash}
        startContent={isTrashView ? <ArrowLeft className="h-4 w-4" /> : <Trash2 className="h-4 w-4" />}
      >
        {isTrashView ? 'Back to series' : 'Trash'}
      </Button>
      {!isTrashView ? (
        <Button
          className="global_btn rounded_full bg_primary"
          onPress={onCreateBook}
          startContent={<Plus className="h-4 w-4" />}
        >
          Create series
        </Button>
      ) : null}
    </AdminPageHeader>
  );
}
