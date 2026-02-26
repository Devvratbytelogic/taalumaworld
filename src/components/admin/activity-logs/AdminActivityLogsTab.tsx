/**
 * Admin Activity Logs Tab
 * View user and admin activity logs
 */

import { User, FileText, DollarSign, Settings } from 'lucide-react';
import { AdminActivityLogsHeader } from './AdminActivityLogsHeader';
import { ActivityLogListing } from './ActivityLogListing';
import type { ActivityLogEntry } from './ActivityLogListing';

const mockLogs: ActivityLogEntry[] = [
  {
    id: 1,
    user: 'Admin User',
    action: 'Updated settings',
    resource: 'System Settings',
    time: '2 min ago',
    type: 'system',
    icon: Settings,
  },
  {
    id: 2,
    user: 'Sarah Johnson',
    action: 'Purchased chapter',
    resource: 'Leadership Fundamentals',
    time: '15 min ago',
    type: 'purchase',
    icon: DollarSign,
  },
  {
    id: 3,
    user: 'Content Manager',
    action: 'Created new book',
    resource: 'Career Mastery',
    time: '1 hour ago',
    type: 'content',
    icon: FileText,
  },
  {
    id: 4,
    user: 'Michael Chen',
    action: 'Registered account',
    resource: 'User Registration',
    time: '2 hours ago',
    type: 'user',
    icon: User,
  },
];

export function AdminActivityLogsTab() {
  return (
    <div className="space-y-6">
      <AdminActivityLogsHeader />
      <ActivityLogListing logs={mockLogs} />
    </div>
  );
}
