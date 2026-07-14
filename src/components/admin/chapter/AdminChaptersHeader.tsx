import Link from 'next/link';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import Button from '../../ui/Button';
import { getCreateChapterRoutePath } from '@/routes/routes';
import { AdminPageHeader } from '@/components/admin/layout/AdminContent';
import { cn } from '@/components/ui/utils';

interface AdminChaptersHeaderProps {
  isTrashView: boolean;
  onToggleTrash: () => void;
}

export function AdminChaptersHeader({ isTrashView, onToggleTrash }: AdminChaptersHeaderProps) {
  return (
    <AdminPageHeader
      title={isTrashView ? 'Trash' : 'Blueprints management'}
      description={isTrashView ? 'View deleted blueprints' : 'Manage all blueprints across all series'}
    >
      <Button
        className={cn('global_btn rounded_full', isTrashView ? 'outline_primary' : 'danger_outline')}
        onPress={onToggleTrash}
        startContent={isTrashView ? <ArrowLeft className="h-4 w-4" /> : <Trash2 className="h-4 w-4" />}
      >
        {isTrashView ? 'Back to blueprints' : 'Trash'}
      </Button>
      {!isTrashView ? (
        <Button as={Link} href={getCreateChapterRoutePath()} className="global_btn rounded_full bg_primary">
          <Plus className="h-4 w-4" />
          Create new blueprint
        </Button>
      ) : null}
    </AdminPageHeader>
  );
}
