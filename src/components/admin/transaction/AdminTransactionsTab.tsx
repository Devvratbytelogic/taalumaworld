/**
 * Admin Transactions Tab
 * View all payment transactions
 */

import { useState } from 'react';
import type { TransactionEntry } from './TransactionListing';
import { AdminTransactionsHeader } from './AdminTransactionsHeader';
import { AdminTransactionsSearch } from './AdminTransactionsSearch';
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
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTransactions = mockTransactions.filter(
    (txn) =>
      txn.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      txn.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      txn.item.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalRevenue = filteredTransactions.reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="space-y-8">
      <AdminTransactionsHeader />

      <AdminTransactionsSearch
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <TransactionStats
        totalRevenue={totalRevenue}
        transactionCount={filteredTransactions.length}
      />

      <TransactionListing
        transactions={filteredTransactions}
        searchQuery={searchQuery}
      />
    </div>
  );
}
