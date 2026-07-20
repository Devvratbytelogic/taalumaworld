import { Plus } from 'lucide-react';
import Button from '@/components/ui/Button';
import { AdminPageHeader } from '@/components/admin/layout/AdminContent';

interface AdminTaxesHeaderProps {
  onCreateTax: () => void;
}

export function AdminTaxesHeader({ onCreateTax }: AdminTaxesHeaderProps) {
  return (
    <AdminPageHeader
      eyebrow="Commerce"
      title="Taxes"
      description="Manage country tax rates used for checkout and invoicing."
    >
      <Button className="global_btn rounded_full bg_primary" onPress={onCreateTax} startContent={<Plus className="h-4 w-4" />}>
        Add tax
      </Button>
    </AdminPageHeader>
  );
}
