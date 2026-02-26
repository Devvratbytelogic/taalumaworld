/**
 * Admin Transactions Tab
 * View all payment transactions
 */

import type { TransactionEntry } from './TransactionListing';
import { AdminTransactionsHeader } from './AdminTransactionsHeader';
import { TransactionStats } from './TransactionStats';
import { TransactionListing } from './TransactionListing';

const mockTransactions: TransactionEntry[] = [
  {
    id: 'TXN-001',
    user: 'Sarah Johnson',
    amount: 20.0,
    item: 'Leadership Fundamentals',
    status: 'completed',
    date: '2024-01-21',
  },
  {
    id: 'TXN-002',
    user: 'Michael Chen',
    amount: 35.0,
    item: 'Strategic Thinking',
    status: 'completed',
    date: '2024-01-21',
  },
  {
    id: 'TXN-003',
    user: 'Emily Rodriguez',
    amount: 20.0,
    item: 'Career Growth',
    status: 'pending',
    date: '2024-01-20',
  },
  {
    id: 'TXN-004',
    user: 'David Kim',
    amount: 40.0,
    item: 'Communication Skills',
    status: 'completed',
    date: '2024-01-20',
  },
];

export function AdminTransactionsTab() {
  const totalRevenue = mockTransactions.reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="space-y-6">
      <AdminTransactionsHeader />

      <TransactionStats
        totalRevenue={totalRevenue}
        transactionCount={mockTransactions.length}
      />

      <TransactionListing transactions={mockTransactions} />
    </div>
  );
}
