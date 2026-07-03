import { Plus } from 'lucide-react';
import { Button } from '@heroui/react';
import { AdminPageHeader } from '@/components/admin/layout/AdminContent';

interface AdminBooksHeaderProps {
  onCreateBook: () => void;
}

export function AdminBooksHeader({ onCreateBook }: AdminBooksHeaderProps) {
  return (
    <AdminPageHeader
      title="Series"
      description="Manage all series on the platform"
    >
      <Button
        color="primary"
        className="rounded-xl"
        onPress={onCreateBook}
        startContent={<Plus className="h-4 w-4" />}
      >
        Create series
      </Button>
    </AdminPageHeader>
  );
}
