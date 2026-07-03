import { Badge } from '../../ui/badge';
import { AdminPageHeader } from '@/components/admin/layout/AdminContent';
import type { ContentMode } from '../../../types/admin';

interface AdminReportsHeaderProps {
  contentMode: ContentMode;
}

export function AdminReportsHeader({ contentMode }: AdminReportsHeaderProps) {
  return (
    <AdminPageHeader
      title="Reports & analytics"
      description="Generate and download detailed reports"
    >
      <Badge variant="outline" className="border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700">
        {contentMode === 'chapters' ? 'Blueprint mode' : 'Series mode'}
      </Badge>
    </AdminPageHeader>
  );
}
