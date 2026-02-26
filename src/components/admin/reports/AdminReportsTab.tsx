/**
 * Admin Reports Tab
 * Generate and download detailed reports
 */

import type { ContentMode } from '../../../types/admin';
import type { ReportType } from './ReportsGrid';
import { AdminReportsHeader } from './AdminReportsHeader';
import { ReportsGrid } from './ReportsGrid';
import { CustomReportCard } from './CustomReportCard';

interface AdminReportsTabProps {
  contentMode: ContentMode;
}

const reportTypes: ReportType[] = [
  { id: 'sales', title: 'Sales Report', description: 'Detailed breakdown of all sales and revenue', lastGenerated: '2024-01-20', frequency: 'Weekly' },
  { id: 'users', title: 'User Activity Report', description: 'User engagement and activity metrics', lastGenerated: '2024-01-20', frequency: 'Daily' },
  { id: 'content', title: 'Content Performance', description: 'Most popular books and focus areas', lastGenerated: '2024-01-19', frequency: 'Monthly' },
  { id: 'revenue', title: 'Revenue Analysis', description: 'Financial performance and trends', lastGenerated: '2024-01-15', frequency: 'Monthly' },
];

export function AdminReportsTab({ contentMode }: AdminReportsTabProps) {
  return (
    <div className="space-y-8">
      <AdminReportsHeader contentMode={contentMode} />
      <ReportsGrid reports={reportTypes} />
      <CustomReportCard />
    </div>
  );
}
