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
  const debouncedSearch = useDebounce(searchQuery, 400);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [status, setStatus] = useState('');
  const [pageLimit, setPageLimit] = useState(10);
  const [page, setPage] = useState(1);

  const handleFilterChange = <T,>(setter: (v: T) => void) => (value: T) => {
    setter(value);
    setPage(1);
  };

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const { data, isLoading, isFetching } = useGetAllTransactionsQuery({
    search: debouncedSearch.trim() || undefined,
    fromDate: fromDate || undefined,
    toDate: toDate || undefined,
    status: status || undefined,
    page,
    limit: pageLimit,
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
  const totalTransactions = pagination?.total ?? 0;
  const totalPages = pagination?.totalPages ?? 1;

  return (
    <div className="space-y-6">
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
      />

      <TransactionStats
        totalRevenue={totalRevenue}
        transactionCount={totalTransactions}
      />

      {isLoading ? (
        <AdminTransactionsSkeleton />
      ) : (
        <TransactionListing
          transactions={transactions}
          searchQuery={debouncedSearch}
          page={page}
          pageLimit={pageLimit}
          totalTransactions={totalTransactions}
          totalPages={totalPages}
          isFetching={isFetching}
          onPageChange={setPage}
          onPageLimitChange={(limit) => {
            setPageLimit(limit);
            setPage(1);
          }}
        />
      )}
    </div>
  );
}
