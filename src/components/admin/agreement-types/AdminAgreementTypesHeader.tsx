import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import Button from '@/components/ui/Button';
import { AdminPageHeader } from '@/components/admin/layout/AdminContent';
import { cn } from '@/components/ui/utils';

interface AdminAgreementTypesHeaderProps {
  isTrashView: boolean;
  onToggleTrash: () => void;
  onCreateType: () => void;
}

export function AdminAgreementTypesHeader({ isTrashView, onToggleTrash, onCreateType }: AdminAgreementTypesHeaderProps) {
  return (
    <AdminPageHeader
      eyebrow="Legal"
      title={isTrashView ? 'Agreement Types Trash' : 'Agreement Types'}
      description={
        isTrashView
          ? 'View and restore deleted agreement types.'
          : 'Manage the agreement types used when drafting mentor and institutional agreements.'
      }
    >
      <Button
        className={cn('global_btn rounded_full', isTrashView ? 'outline_primary' : 'danger_outline')}
        onPress={onToggleTrash}
        startContent={isTrashView ? <ArrowLeft className="h-4 w-4" /> : <Trash2 className="h-4 w-4" />}
      >
        {isTrashView ? 'Back to agreement types' : 'Trash'}
      </Button>
      {!isTrashView ? (
        <Button className="global_btn rounded_full bg_primary" onPress={onCreateType} startContent={<Plus className="h-4 w-4" />}>
          Add agreement type
        </Button>
      ) : null}
    </AdminPageHeader>
  );
}
