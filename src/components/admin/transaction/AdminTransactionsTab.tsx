'use client';

import { useEffect, useState } from 'react';
import { type GridColDef } from '@mui/x-data-grid';
import { useDebounce } from '@/hooks/useDebounce';
import { Badge } from '@/components/ui/badge';
import CommonDataTable from '@/components/admin/CommonDataTable';
import { AdminTransactionsHeader } from './AdminTransactionsHeader';
import { AdminTransactionsSearch } from './AdminTransactionsSearch';
import { TransactionStats } from './TransactionStats';
import { useGetAllTransactionsQuery } from '@/store/rtkQueries/adminGetApi';
import { IAllTransactionsDataEntity } from '@/types/transaction';

const STATUS_BADGE_CLASS: Record<string, string> = {
  completed: 'bg-green-50 text-green-700 border-green-200',
  paid: 'bg-blue-50 text-blue-700 border-blue-200',
  failed: 'bg-red-50 text-red-700 border-red-200',
  pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  refunded: 'bg-purple-50 text-purple-700 border-purple-200',
  cancelled: 'bg-gray-50 text-gray-600 border-gray-200',
};

export function AdminTransactionsTab() {
  const [searchQuery, setSearchQuery] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [status, setStatus] = useState('');
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });

  const debouncedSearch = useDebounce(searchQuery, 400);

  const resetToFirstPage = () => setPaginationModel((prev) => ({ ...prev, page: 0 }));

  useEffect(() => {
    resetToFirstPage();
  }, [debouncedSearch, fromDate, toDate, status]);

  const { data, isLoading, isFetching } = useGetAllTransactionsQuery({
    search: debouncedSearch.trim() || undefined,
    fromDate: fromDate || undefined,
    toDate: toDate || undefined,
    status: status || undefined,
    page: paginationModel.page + 1,
    limit: paginationModel.pageSize,
  });

  const transactions = data?.data?.data?.data ?? [];
  const summary = data?.data?.summary;
  const totalTransactions = summary?.totalTransactions ?? 0;

  const columns: GridColDef<IAllTransactionsDataEntity>[] = [
    {
      field: 'index',
      headerName: '#',
      width: 60,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        const rowIndex = params.api.getRowIndexRelativeToVisibleRows(params.id);
        return (
          <span className="text-sm text-muted-foreground">
            {paginationModel.page * paginationModel.pageSize + rowIndex + 1}
          </span>
        );
      },
    },
    {
      field: 'transactionId',
      headerName: 'Transaction ID',
      minWidth: 160,
      sortable: false,
      renderCell: (params) => (
        <span className="font-mono text-sm truncate">{params.row.transactionId ?? '-'}</span>
      ),
    },
    {
      field: 'userName',
      headerName: 'User',
      minWidth: 200,
      flex: 1,
      sortable: false,
      renderCell: (params) => (
        <div className="min-w-0">
          <p className="text-sm font-medium truncate">{params.row.userName}</p>
          <p className="text-xs text-muted-foreground truncate">{params.row.userEmail}</p>
        </div>
      ),
    },
    {
      field: 'item',
      headerName: 'Item',
      minWidth: 200,
      flex: 1,
      sortable: false,
      renderCell: (params) => <span className="text-sm truncate">{params.row.item}</span>,
    },
    {
      field: 'type',
      headerName: 'Type',
      width: 120,
      sortable: false,
      renderCell: (params) => (
        <Badge variant="outline" className="capitalize">
          {params.row.type}
        </Badge>
      ),
    },
    {
      field: 'amount',
      headerName: 'Amount',
      width: 130,
      sortable: false,
      renderCell: (params) => (
        <span className="text-sm font-semibold text-primary whitespace-nowrap">
          KSH {Number(params.row.amount ?? 0).toFixed(2)}
        </span>
      ),
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 130,
      sortable: false,
      renderCell: (params) => {
        const s = (params.row.status || 'pending').toLowerCase();
        return (
          <Badge
            variant="outline"
            className={`capitalize ${STATUS_BADGE_CLASS[s] ?? STATUS_BADGE_CLASS.cancelled}`}
          >
            {params.row.status || 'pending'}
          </Badge>
        );
      },
    },
    {
      field: 'date',
      headerName: 'Date',
      width: 180,
      sortable: false,
      renderCell: (params) => (
        <span className="text-sm whitespace-nowrap">{params.row.date}</span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <AdminTransactionsHeader />

      <AdminTransactionsSearch
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        fromDate={fromDate}
        onFromDateChange={setFromDate}
        toDate={toDate}
        onToDateChange={setToDate}
        status={status}
        onStatusChange={setStatus}
      />

      <TransactionStats summary={summary} />

      <div className="border border-gray-200 rounded-md overflow-hidden">
        <CommonDataTable
          rows={transactions}
          columns={columns}
          getRowId={(row) => row.id}
          loading={isLoading || isFetching}
          paginationMode="server"
          rowCount={totalTransactions}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
        />
      </div>
    </div>
  );
}
