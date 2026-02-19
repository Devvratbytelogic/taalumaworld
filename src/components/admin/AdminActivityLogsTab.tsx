/**
 * Admin Activity Logs Tab
 * View user and admin activity logs
 */

import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Activity, User, FileText, DollarSign, Settings } from 'lucide-react';

export function AdminActivityLogsTab() {
  const logs = [
    { id: 1, user: 'Admin User', action: 'Updated settings', resource: 'System Settings', time: '2 min ago', type: 'system', icon: Settings },
    { id: 2, user: 'Sarah Johnson', action: 'Purchased chapter', resource: 'Leadership Fundamentals', time: '15 min ago', type: 'purchase', icon: DollarSign },
    { id: 3, user: 'Content Manager', action: 'Created new book', resource: 'Career Mastery', time: '1 hour ago', type: 'content', icon: FileText },
    { id: 4, user: 'Michael Chen', action: 'Registered account', resource: 'User Registration', time: '2 hours ago', type: 'user', icon: User },
  ];

  const typeColors: Record<string, string> = {
    system: 'bg-purple-50 text-purple-600',
    purchase: 'bg-green-50 text-green-600',
    content: 'bg-blue-50 text-blue-600',
    user: 'bg-orange-50 text-orange-600',
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Activity Logs</h2>
        <p className="text-muted-foreground">Monitor platform activity and user actions</p>
      </div>

      <Card className="p-6">
        <div className="space-y-4">
          {logs.map((log) => {
            const Icon = log.icon;
            return (
              <div key={log.id} className="flex items-start gap-4 pb-4 border-b last:border-0">
                <div className={`p-2 rounded-lg ${typeColors[log.type]}`}>
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
      </Card>
    </div>
  );
}
