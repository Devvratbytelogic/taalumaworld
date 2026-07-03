import { Download } from 'lucide-react';
import Button from '../../ui/Button';
import { Badge } from '../../ui/badge';
import { AdminPageHeader } from '@/components/admin/layout/AdminContent';

interface AdminPaymentsHeaderProps {
  totalRevenue: number;
  onExport?: () => void;
}

export function AdminPaymentsHeader({
  totalRevenue,
  onExport,
}: AdminPaymentsHeaderProps) {
  return (
    <AdminPageHeader
      title="Payment reports"
      description="Track all transactions and revenue"
    >
      <Badge variant="outline" className="border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700">
        Total revenue: KSH {totalRevenue.toFixed(2)}
      </Badge>
      <Button className="global_btn rounded_full bg_primary" onPress={onExport}>
        <Download className="h-4 w-4" />
        Export
      </Button>
    </AdminPageHeader>
  );
}
