import { Badge } from '../../ui/badge';
import type { ContentMode } from '../../../types/admin';

interface AdminAnalyticsHeaderProps {
  contentMode: ContentMode;
}

export function AdminAnalyticsHeader({ contentMode }: AdminAnalyticsHeaderProps) {
  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Analytics Dashboard
          </h1>
          <p className="text-muted-foreground">
            Track performance and engagement metrics
          </p>
        </div>
        <Badge variant="outline" className="h-fit">
          {contentMode === 'chapters' ? 'Chapter Mode' : 'Book Mode'}
        </Badge>
      </div>
    </div>
  );
}
