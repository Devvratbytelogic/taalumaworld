/**
 * Admin Activity Logs Tab
 * View user and admin activity logs
 */

import { useState } from 'react';
import { User, FileText, DollarSign, Settings } from 'lucide-react';
import { AdminActivityLogsHeader } from './AdminActivityLogsHeader';
import { AdminActivityLogsSearch } from './AdminActivityLogsSearch';
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
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLogs = mockLogs.filter(
    (log) =>
      log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.resource.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <AdminActivityLogsHeader />
      <AdminActivityLogsSearch
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      <ActivityLogListing logs={filteredLogs} searchQuery={searchQuery} />
    </div>
  );
}
