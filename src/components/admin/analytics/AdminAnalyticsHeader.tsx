import { Badge } from '../../ui/badge';
import { AdminPageHeader } from '@/components/admin/layout/AdminContent';
import type { ContentMode } from '../../../types/admin';

interface AdminAnalyticsHeaderProps {
  contentMode: ContentMode;
}

export function AdminAnalyticsHeader({ contentMode }: AdminAnalyticsHeaderProps) {
  return (
    <AdminPageHeader
      title="Analytics dashboard"
      description="Track performance and engagement metrics"
    >
      <Badge variant="outline" className="border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700">
        {contentMode === 'chapters' ? 'Blueprint mode' : 'Series mode'}
      </Badge>
    </AdminPageHeader>
  );
}
