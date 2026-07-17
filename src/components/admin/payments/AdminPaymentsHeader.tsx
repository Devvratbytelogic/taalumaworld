import { Badge } from '../../ui/badge';
import { AdminPageHeader } from '@/components/admin/layout/AdminContent';

interface AdminPaymentsHeaderProps {
  totalRevenue: number;
}

export function AdminPaymentsHeader({
  totalRevenue,
}: AdminPaymentsHeaderProps) {
  return (
    <AdminPageHeader
      title="Payment reports"
      description="Track all transactions and revenue"
    >
      <Badge variant="outline" className="border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700">
        Total revenue: KSH {totalRevenue.toFixed(2)}
      </Badge>
    </AdminPageHeader>
  );
}
