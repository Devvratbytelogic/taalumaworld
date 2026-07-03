import { Plus } from 'lucide-react';
import Button from '../../ui/Button';
import { AdminPageHeader } from '@/components/admin/layout/AdminContent';

interface AdminBooksHeaderProps {
  onCreateBook: () => void;
}

export function AdminBooksHeader({ onCreateBook }: AdminBooksHeaderProps) {
  return (
    <AdminPageHeader
      title="Series management"
      description="Manage all series on the platform"
    >
      <Button
        onPress={onCreateBook}
        onClick={(e) => { e.preventDefault(); onCreateBook(); }}
        className="global_btn rounded_full bg_primary"
      >
        <Plus className="h-4 w-4" />
        Create new series
      </Button>
    </AdminPageHeader>
  );
}
