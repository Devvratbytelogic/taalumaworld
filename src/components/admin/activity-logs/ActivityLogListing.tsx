import { Activity } from 'lucide-react';
import { Card } from '../../ui/card';
import { Badge } from '../../ui/badge';
import type { LucideIcon } from 'lucide-react';

export interface ActivityLogEntry {
  id: number;
  user: string;
  action: string;
  resource: string;
  time: string;
  type: string;
  icon: LucideIcon;
}

const TYPE_COLORS: Record<string, string> = {
  system: 'bg-purple-50 text-purple-600',
  purchase: 'bg-green-50 text-green-600',
  content: 'bg-blue-50 text-blue-600',
  user: 'bg-orange-50 text-orange-600',
};

interface ActivityLogListingProps {
  logs: ActivityLogEntry[];
  searchQuery?: string;
}

export function ActivityLogListing({ logs, searchQuery = '' }: ActivityLogListingProps) {
  return (
    <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
      <div className="p-6 space-y-4">
        {logs.map((log) => {
          const Icon = log.icon;
          const typeColor = TYPE_COLORS[log.type] ?? 'bg-gray-50 text-gray-600';
          return (
            <div
              key={log.id}
              className="flex items-start gap-4 pb-4 border-b last:border-0"
            >
              <div className={`p-2 rounded-lg ${typeColor}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="font-medium">{log.action}</p>
                <p className="text-sm text-muted-foreground">
                  {log.user} · {log.resource}
                </p>
                <p className="text-xs text-muted-foreground mt-1">{log.time}</p>
              </div>
              <Badge variant="secondary">{log.type}</Badge>
            </div>
          );
        })}
      </div>

      {logs.length === 0 && (
        <div className="p-12 border-t">
          <div className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-accent rounded-full flex items-center justify-center">
              <Activity className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h3 className="font-bold">No activity found</h3>
              <p className="text-muted-foreground">
                {searchQuery
                  ? 'Try adjusting your search query'
                  : 'There is no activity to display'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
