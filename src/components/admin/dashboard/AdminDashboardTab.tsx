/**
 * Admin Dashboard Tab
 * Overview with stats, charts, and quick actions
 */

import { Users, Book, FileText, DollarSign, ShoppingCart } from 'lucide-react';
import type { AdminUser, ContentMode } from '../../../types/admin';
import type { StatCard } from './DashboardStatsGrid';
import type { ActivityItem } from './DashboardRecentActivity';
import type { TopContentItem } from './DashboardTopContent';
import { DashboardWelcomeHeader } from './DashboardWelcomeHeader';
import { DashboardStatsGrid } from './DashboardStatsGrid';
import { DashboardRecentActivity } from './DashboardRecentActivity';
import { DashboardTopContent } from './DashboardTopContent';
import { DashboardQuickActions } from './DashboardQuickActions';

interface AdminDashboardTabProps {
  contentMode: ContentMode;
  adminUser: AdminUser;
}

export function AdminDashboardTab({ contentMode, adminUser }: AdminDashboardTabProps) {
  const stats: StatCard[] = [
    { title: 'Total Users', value: '2,847', change: 12.5, icon: Users, color: 'blue' },
    {
      title: contentMode === 'chapters' ? 'Total Focus Areas' : 'Total Books',
      value: contentMode === 'chapters' ? '156' : '42',
      change: 8.3,
      icon: contentMode === 'chapters' ? FileText : Book,
      color: 'purple',
    },
    { title: 'Revenue (30d)', value: '$18,492', change: 23.1, icon: DollarSign, color: 'green' },
    { title: 'Active Sales', value: '94', change: -4.2, icon: ShoppingCart, color: 'orange' },
  ];

  const recentActivity: ActivityItem[] = [
    { id: 1, user: 'Sarah Johnson', action: 'purchased', item: 'Leadership Fundamentals', time: '2 minutes ago' },
    { id: 2, user: 'Michael Chen', action: 'left a review on', item: 'Strategic Thinking', time: '15 minutes ago' },
    { id: 3, user: 'Emily Rodriguez', action: 'registered', item: '', time: '1 hour ago' },
    { id: 4, user: 'David Kim', action: 'purchased', item: 'Career Growth Strategies', time: '2 hours ago' },
    { id: 5, user: 'Jessica Lee', action: 'started reading', item: 'Professional Communication', time: '3 hours ago' },
  ];

  const topContent: TopContentItem[] = [
    { id: 1, title: 'Leadership Fundamentals', sales: 234, revenue: 4680, trend: 15 },
    { id: 2, title: 'Strategic Thinking', sales: 189, revenue: 3780, trend: 8 },
    { id: 3, title: 'Career Growth Strategies', sales: 167, revenue: 3340, trend: -3 },
    { id: 4, title: 'Professional Communication', sales: 145, revenue: 2900, trend: 12 },
    { id: 5, title: 'Time Management Mastery', sales: 132, revenue: 2640, trend: 5 },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <DashboardWelcomeHeader adminUser={adminUser} contentMode={contentMode} />
      <DashboardStatsGrid stats={stats} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DashboardRecentActivity items={recentActivity} />
        <DashboardTopContent items={topContent} contentMode={contentMode} />
      </div>
      <DashboardQuickActions />
    </div>
  );
}
