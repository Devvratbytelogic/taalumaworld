import { Plus } from 'lucide-react';
import Button from '@/components/ui/Button';
import { AdminPageHeader } from '@/components/admin/layout/AdminContent';

interface AdminSentencesHeaderProps {
  onCreateSentence: () => void;
  canAdd?: boolean;
}

export function AdminSentencesHeader({ onCreateSentence, canAdd = true }: AdminSentencesHeaderProps) {
  return (
    <AdminPageHeader
      eyebrow="Legal"
      title="Sentences"
      description="Build the checkbox lines users see, and link phrases to agreement types."
    >
      {canAdd ? (
        <Button className="global_btn rounded_full bg_primary" onPress={onCreateSentence} startContent={<Plus className="h-4 w-4" />}>
          Add sentence
        </Button>
      ) : null}
    </AdminPageHeader>
  );
}
