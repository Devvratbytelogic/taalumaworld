'use client';

import { useState, useEffect } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import type { TransactionEntry } from './TransactionListing';
import { AdminTransactionsHeader } from './AdminTransactionsHeader';
import { AdminTransactionsSearch } from './AdminTransactionsSearch';
import { TransactionStats } from './TransactionStats';
import { TransactionListing } from './TransactionListing';
import { useGetAllTransactionsQuery } from '@/store/rtkQueries/adminGetApi';
import AdminTransactionsSkeleton from '@/components/skeleton-loader/AdminTransactionsSkeleton';

export function AdminTransactionsTab() {
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery);
  const [fromDate, setFromDate] = useState<string>('');
  const [toDate, setToDate] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [limit, setLimit] = useState<number>(10);
  const [page, setPage] = useState<number>(1);

  const handleFilterChange = <T,>(setter: (v: T) => void) => (value: T) => {
    setter(value);
    setPage(1);
  };

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const { data, isLoading, isFetching } = useGetAllTransactionsQuery({
    search: debouncedSearch,
    fromDate,
    toDate,
    status,
    page,
    limit,
  });

  const transactions: TransactionEntry[] = (data?.data?.payments ?? []).map((p) => ({
    id: p.transactionId,
    user: p.userName,
    amount: p.amount,
    item: p.item,
    type: p.type,
    status: p.status,
    date: p.date,
  }));

  const totalRevenue = data?.data?.totalRevenue ?? 0;
  const pagination = data?.data?.pagination;
  const totalCount = pagination?.total ?? 0;
  const totalPages = pagination?.totalPages ?? 1;

  return (
    <div className="space-y-8">
      <AdminTransactionsHeader />

      <AdminTransactionsSearch
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        fromDate={fromDate}
        onFromDateChange={handleFilterChange(setFromDate)}
        toDate={toDate}
        onToDateChange={handleFilterChange(setToDate)}
        status={status}
        onStatusChange={handleFilterChange(setStatus)}
        limit={limit}
        onLimitChange={handleFilterChange(setLimit)}
      />

      <TransactionStats
        totalRevenue={totalRevenue}
        transactionCount={totalCount}
      />

      {isLoading || isFetching ? (
        <AdminTransactionsSkeleton />
      ) : (
        <TransactionListing
          transactions={transactions}
          searchQuery={debouncedSearch}
        />
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Page {page} of {totalPages} &middot; {totalCount} total transactions
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1 || isFetching}
              className="px-4 py-2 text-sm rounded-lg border bg-white disabled:opacity-40 hover:bg-gray-50 transition-colors"
            >
              Previous
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages || isFetching}
              className="px-4 py-2 text-sm rounded-lg border bg-white disabled:opacity-40 hover:bg-gray-50 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
