import { Badge } from '../../ui/badge';
import type { ContentMode } from '../../../types/admin';

interface AdminReportsHeaderProps {
  contentMode: ContentMode;
}

export function AdminReportsHeader({ contentMode }: AdminReportsHeaderProps) {
  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Reports & Analytics
          </h1>
          <p className="text-muted-foreground">
            Generate and download detailed reports
          </p>
        </div>
        <Badge variant="outline" className="h-fit">
          {contentMode === 'chapters' ? 'Chapter Mode' : 'Book Mode'}
        </Badge>
      </div>
    </div>
  );
}
