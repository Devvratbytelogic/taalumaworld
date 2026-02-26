/**
 * Admin Analytics Tab
 * Track performance and engagement metrics
 */

import { Users, DollarSign, BookOpen, Eye } from 'lucide-react';
import type { ContentMode } from '../../../types/admin';
import type { AnalyticsStat } from './AnalyticsStatsGrid';
import { AdminAnalyticsHeader } from './AdminAnalyticsHeader';
import { AnalyticsStatsGrid } from './AnalyticsStatsGrid';
import { AnalyticsChartsSection } from './AnalyticsChartsSection';

interface AdminAnalyticsTabProps {
  contentMode: ContentMode;
}

export function AdminAnalyticsTab({ contentMode }: AdminAnalyticsTabProps) {
  const stats: AnalyticsStat[] = [
    { title: 'Total Users', value: '2,543', change: '+12.5%', changeType: 'positive', icon: Users },
    {
      title: `Total ${contentMode === 'chapters' ? 'Focus Areas' : 'Books'}`,
      value: contentMode === 'chapters' ? '156' : '42',
      change: '+8.2%',
      changeType: 'positive',
      icon: BookOpen,
    },
    { title: 'Total Revenue', value: '$45,231', change: '+23.1%', changeType: 'positive', icon: DollarSign },
    { title: 'Page Views', value: '128,543', change: '+15.3%', changeType: 'positive', icon: Eye },
  ];

  return (
    <div className="space-y-8">
      <AdminAnalyticsHeader contentMode={contentMode} />
      <AnalyticsStatsGrid stats={stats} />
      <AnalyticsChartsSection />
    </div>
  );
}
