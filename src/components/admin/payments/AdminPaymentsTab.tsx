/**
 * Admin Payments Tab
 * Track transactions and revenue
 */

import { useState } from 'react';
import toast from '@/utils/toast';
import type { PaymentEntry } from './PaymentListing';
import { AdminPaymentsHeader } from './AdminPaymentsHeader';
import { AdminPaymentsSearch } from './AdminPaymentsSearch';
import { PaymentListing } from './PaymentListing';

interface AdminPaymentsTabProps {
  contentMode?: 'chapters' | 'books';
}

const mockPayments: PaymentEntry[] = [
  {
    id: 'PAY-001',
    user: 'Sarah Johnson',
    item: 'Introduction to Career Growth',
    type: 'chapter',
    amount: 4.99,
    date: '2024-01-20',
    status: 'completed',
  },
  {
    id: 'PAY-002',
    user: 'Michael Chen',
    item: 'Professional Development 101',
    type: 'book',
    amount: 29.99,
    date: '2024-01-19',
    status: 'completed',
  },
  {
    id: 'PAY-003',
    user: 'Emily Rodriguez',
    item: 'Leadership Essentials',
    type: 'chapter',
    amount: 4.99,
    date: '2024-01-18',
    status: 'completed',
  },
];

export function AdminPaymentsTab(props?: AdminPaymentsTabProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPayments = mockPayments.filter(
    (payment) =>
      payment.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.item.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalRevenue = mockPayments.reduce((sum, p) => sum + p.amount, 0);

  const handleExport = () => {
    toast.success('Export started. Download will begin shortly.');
    // TODO: wire to actual export API
  };

  return (
    <div className="space-y-8">
      <AdminPaymentsHeader
        totalRevenue={totalRevenue}
        onExport={handleExport}
      />

      <AdminPaymentsSearch
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <PaymentListing payments={filteredPayments} searchQuery={searchQuery} />
    </div>
  );
}
