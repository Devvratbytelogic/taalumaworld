import { Badge } from '../../ui/badge';
import { AdminPageHeader } from '@/components/admin/layout/AdminContent';

interface AdminUsersHeaderProps {
  totalCount: number;
}

export function AdminUsersHeader({ totalCount }: AdminUsersHeaderProps) {
  return (
    <AdminPageHeader
      title="Customer management"
      description="View and manage all customers on the platform"
    >
      <Badge variant="outline" className="border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700">
        Total customers: {totalCount}
      </Badge>
    </AdminPageHeader>
  );
}
