'use client';

import { useState } from 'react';
import type { TransactionEntry } from './TransactionListing';
import { AdminTransactionsHeader } from './AdminTransactionsHeader';
import { AdminTransactionsSearch } from './AdminTransactionsSearch';
import { TransactionStats } from './TransactionStats';
import { TransactionListing } from './TransactionListing';
import { useGetAllTransactionsQuery } from '@/store/rtkQueries/adminGetApi';
import AdminTransactionsSkeleton from '@/components/skeleton-loader/AdminTransactionsSkeleton';

export function AdminTransactionsTab() {
  const [searchQuery, setSearchQuery] = useState('');
  const { data, isLoading, isFetching } = useGetAllTransactionsQuery();

  const transactions: TransactionEntry[] = (data?.data?.payments ?? []).map((p) => ({
    id: p.transactionId,
    user: p.userName,
    amount: p.amount,
    item: p.item,
    type: p.type,
    status: p.status,
    date: p.date,
  }));

  const filteredTransactions = transactions.filter((txn) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      (txn.id ?? '').toLowerCase().includes(q) ||
      (txn.user ?? '').toLowerCase().includes(q) ||
      (txn.item ?? '').toLowerCase().includes(q) ||
      (txn.type ?? '').toLowerCase().includes(q) ||
      (txn.status ?? '').toLowerCase().includes(q)
    );
  });

  const totalRevenue = data?.data?.totalRevenue ?? 0;

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

      {isLoading || isFetching ? (
        <AdminTransactionsSkeleton />
      ) : (
        <TransactionListing
          transactions={filteredTransactions}
          searchQuery={searchQuery}
        />
      )}
    </div>
  );
}
