import Link from 'next/link';
import { Plus } from 'lucide-react';
import Button from '@/components/ui/Button';
import { AdminPageHeader } from '@/components/admin/layout/AdminContent';
import { getCreateAgreementRoutePath } from '@/routes/routes';

interface AdminAgreementsHeaderProps {
  canAdd?: boolean;
}

export function AdminAgreementsHeader({ canAdd = true }: AdminAgreementsHeaderProps) {
  return (
    <AdminPageHeader
      eyebrow="Legal"
      title="Agreements"
      description="Manage the legal documents users accept. Versions stay under the same agreement type."
    >
      {canAdd ? (
        <Button
          as={Link}
          href={getCreateAgreementRoutePath()}
          className="global_btn rounded_full bg_primary"
          startContent={<Plus className="h-4 w-4" />}
        >
          Add agreement
        </Button>
      ) : null}
    </AdminPageHeader>
  );
}
