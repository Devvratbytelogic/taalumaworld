import Link from 'next/link';
import { Plus } from 'lucide-react';
import Button from '../../ui/Button';
import { getCreateChapterRoutePath } from '@/routes/routes';
import { AdminPageHeader } from '@/components/admin/layout/AdminContent';

export function AdminChaptersHeader() {
  return (
    <AdminPageHeader
      title="Blueprints management"
      description="Manage all blueprints across all series"
    >
      <Button as={Link} href={getCreateChapterRoutePath()} className="global_btn rounded_full bg_primary">
        <Plus className="h-4 w-4" />
        Create new blueprint
      </Button>
    </AdminPageHeader>
  );
}
