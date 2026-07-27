'use client';

import { useEffect, useState } from 'react';
import moment from 'moment';
import { type GridColDef } from '@mui/x-data-grid';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import CommonDataTable from '@/components/admin/CommonDataTable';
import { AdminPageHeader } from '@/components/admin/layout/AdminContent';
import { useDebounce } from '@/hooks/useDebounce';
import { useGetAllFollowersQuery } from '@/store/rtkQueries/mentorApis';
import type { IFollowsAPIResponseDataEntity } from '@/types/follows';
import { MentorFollowersSearch } from './MentorFollowersSearch';

export function MentorFollowersTab() {
  const [searchQuery, setSearchQuery] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
  const debouncedSearch = useDebounce(searchQuery, 400);

  useEffect(() => {
    setPaginationModel((prev) => ({ ...prev, page: 0 }));
  }, [debouncedSearch, fromDate, toDate]);

  const { data, isLoading, isFetching } = useGetAllFollowersQuery({
    page: paginationModel.page + 1,
    limit: paginationModel.pageSize,
    ...(debouncedSearch.trim() ? { search: debouncedSearch.trim() } : {}),
    ...(fromDate ? { fromDate } : {}),
    ...(toDate ? { toDate } : {}),
  });

  const followers = data?.data?.data ?? [];
  const totalFollowers = data?.data?.total ?? 0;

  const columns: GridColDef<IFollowsAPIResponseDataEntity>[] = [
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
      field: 'userId',
      headerName: 'Follower',
      minWidth: 220,
      flex: 1,
      sortable: false,
      renderCell: (params) => {
        const user = params.row.userId;
        return (
          <div className="flex items-center gap-3 min-w-0">
            <Avatar className="border h-9 w-9 shrink-0">
              <AvatarImage src={user?.profile_pic ?? ''} alt={user?.name ?? 'Follower'} />
              <AvatarFallback>{user?.name?.substring(0, 2).toUpperCase() || '—'}</AvatarFallback>
            </Avatar>
            <span className="font-medium text-sm truncate">{user?.name || '—'}</span>
          </div>
        );
      },
    },
    {
      field: 'email',
      headerName: 'Email',
      minWidth: 200,
      flex: 1,
      sortable: false,
      valueGetter: (_value, row) => row.userId?.email ?? '',
      renderCell: (params) => {
        const email = params.row.userId?.email;
        return email ? (
          <a href={`mailto:${email}`} className="text-sm text-primary hover:underline truncate">
            {email}
          </a>
        ) : (
          <span className="text-sm text-muted-foreground">—</span>
        );
      },
    },
    {
      field: 'phone',
      headerName: 'Phone',
      minWidth: 140,
      sortable: false,
      valueGetter: (_value, row) => row.userId?.phone ?? '',
      renderCell: (params) => (
        <span className="text-sm text-slate-700 truncate">{params.row.userId?.phone || '—'}</span>
      ),
    },
    {
      field: 'createdAt',
      headerName: 'Followed On',
      minWidth: 160,
      sortable: false,
      renderCell: (params) => (
        <span className="text-sm whitespace-nowrap text-muted-foreground">
          {params.row.createdAt ? moment(params.row.createdAt).format('DD/MM/YYYY HH:mm') : '—'}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Followers"
        description="People who follow your mentor profile."
      />

      <MentorFollowersSearch
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        fromDate={fromDate}
        onFromDateChange={setFromDate}
        toDate={toDate}
        onToDateChange={setToDate}
      />

      <div className="border border-gray-200 rounded-md overflow-hidden">
        <CommonDataTable
          rows={followers}
          columns={columns}
          getRowId={(row) => row._id || row.id}
          loading={isLoading || isFetching}
          paginationMode="server"
          rowCount={totalFollowers}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
        />
      </div>
    </div>
  );
}
