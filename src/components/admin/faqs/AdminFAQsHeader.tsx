import { Plus } from 'lucide-react';
import Button from '../../ui/Button';
import { AdminPageHeader } from '@/components/admin/layout/AdminContent';

interface AdminFAQsHeaderProps {
  totalCount: number;
  onAddFAQ: () => void;
  canAdd?: boolean;
}

export function AdminFAQsHeader({ totalCount, onAddFAQ, canAdd = true }: AdminFAQsHeaderProps) {
  return (
    <AdminPageHeader
      title="FAQs management"
      description={`${totalCount} question${totalCount !== 1 ? 's' : ''} total`}
    >
      {canAdd ? (
        <Button onPress={onAddFAQ} className="global_btn rounded_full bg_primary">
          <Plus className="h-4 w-4" />
          Add FAQ
        </Button>
      ) : null}
    </AdminPageHeader>
  );
}
