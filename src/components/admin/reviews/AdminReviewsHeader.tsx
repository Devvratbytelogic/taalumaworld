import { Badge } from '../../ui/badge';
import { AdminPageHeader } from '@/components/admin/layout/AdminContent';

interface AdminReviewsHeaderProps {
  totalCount: number;
}

export function AdminReviewsHeader({ totalCount }: AdminReviewsHeaderProps) {
  return (
    <AdminPageHeader
      title="Reviews & ratings"
      description="Monitor and moderate user reviews"
    >
      <Badge variant="outline" className="border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700">
        Total reviews: {totalCount}
      </Badge>
    </AdminPageHeader>
  );
}
