import type { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import Button from '../../ui/Button';
import { getCreateChapterRoutePath, isMentorPanelPath } from '@/routes/routes';
import { AdminPageHeader } from '@/components/admin/layout/AdminContent';
import { cn } from '@/components/ui/utils';

interface AdminChaptersHeaderProps {
  isTrashView: boolean;
  onToggleTrash: () => void;
  canAdd?: boolean;
  tourAction?: ReactNode;
  headerTourId?: string;
  trashTourId?: string;
  createTourId?: string;
}

export function AdminChaptersHeader({
  isTrashView,
  onToggleTrash,
  canAdd = false,
  tourAction,
  headerTourId,
  trashTourId,
  createTourId,
}: AdminChaptersHeaderProps) {
  const pathname = usePathname();
  const isMentor = isMentorPanelPath(pathname);

  return (
    <AdminPageHeader
      title={isTrashView ? 'Trash' : 'Books management'}
      description={isTrashView ? 'View deleted books' : 'Manage all books across all series'}
      tourId={headerTourId}
    >
      {tourAction}
      <span data-mentor-tour={trashTourId} className="inline-flex">
        <Button
          className={cn('global_btn rounded_full', isTrashView ? 'outline_primary' : 'danger_outline')}
          onPress={onToggleTrash}
          startContent={isTrashView ? <ArrowLeft className="h-4 w-4" /> : <Trash2 className="h-4 w-4" />}
        >
          {isTrashView ? 'Back to books' : 'Trash'}
        </Button>
      </span>
      {!isTrashView && canAdd ? (
        <span data-mentor-tour={createTourId} className="inline-flex">
          <Button as={Link} href={getCreateChapterRoutePath(isMentor)} className="global_btn rounded_full bg_primary">
            <Plus className="h-4 w-4" />
            Create new book
          </Button>
        </span>
      ) : null}
    </AdminPageHeader>
  );
}
