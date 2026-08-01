import { Plus } from 'lucide-react';
import Button from '@/components/ui/Button';
import { AdminPageHeader } from '@/components/admin/layout/AdminContent';

interface AdminAgreementsHeaderProps {
  onCreateAgreement: () => void;
  canAdd?: boolean;
}

export function AdminAgreementsHeader({ onCreateAgreement, canAdd = true }: AdminAgreementsHeaderProps) {
  return (
    <AdminPageHeader
      eyebrow="Legal"
      title="Agreements"
      description="Manage the agreements users must accept at registration, checkout, and other key touchpoints."
    >
      {canAdd ? (
        <Button className="global_btn rounded_full bg_primary" onPress={onCreateAgreement} startContent={<Plus className="h-4 w-4" />}>
          Add agreement
        </Button>
      ) : null}
    </AdminPageHeader>
  );
}
