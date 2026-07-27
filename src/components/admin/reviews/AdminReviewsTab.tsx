'use client';

import { useEffect, useState } from 'react';
import moment from 'moment';
import { type GridColDef } from '@mui/x-data-grid';
import { Eye, Star } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AdminPageHeader } from '@/components/admin/layout/AdminContent';
import CommonDataTable from '@/components/admin/CommonDataTable';
import { useDebounce } from '@/hooks/useDebounce';
import { openModal } from '@/store/slices/allModalSlice';
import { useGetAllAdminReviewsQuery } from '@/store/rtkQueries/adminReviewsApi';
import { AdminReviewsSearch } from './AdminReviewsSearch';
import ImageComponent from '@/components/ui/ImageComponent';

const STATUS_BADGE_CLASS: Record<string, string> = {
  pending: 'bg-amber-50 text-amber-700 border-amber-200!',
  approved: 'bg-emerald-50 text-emerald-700 border-emerald-200!',
  rejected: 'bg-red-50 text-red-700 border-red-200!',
};

function formatStatusLabel(status?: string) {
  if (!status) return '—';
  return status.charAt(0).toUpperCase() + status.slice(1);
}

function formatTypeLabel(type?: string) {
  if (type === 'Chapter') return 'Blueprint';
  if (type === 'Book') return 'Series';
  return type || '—';
}

export function AdminReviewsTab() {
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState('');
  const [status, setStatus] = useState('');
  const [type, setType] = useState('');
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
  const debouncedSearch = useDebounce(searchQuery, 400);

  useEffect(() => {
    setPaginationModel((prev) => ({ ...prev, page: 0 }));
  }, [debouncedSearch, status, type]);

  const { data, isLoading, isFetching } = useGetAllAdminReviewsQuery({
    page: paginationModel.page + 1,
    limit: paginationModel.pageSize,
    ...(debouncedSearch.trim() ? { search: debouncedSearch.trim() } : {}),
    ...(status ? { status: status as 'Pending' | 'Approved' | 'Rejected' } : {}),
    ...(type ? { type } : {}),
  });

  const reviews = data?.data?.data ?? [];
  const total = data?.data?.total ?? 0;

  const columns: GridColDef[] = [
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
      field: 'customer',
      headerName: 'Customer',
      minWidth: 200,
      flex: 1,
      sortable: false,
      renderCell: (params) => {
        const customer = params.row.customer;
        return (
          <div className="flex items-center gap-3 min-w-0">
            <div className="border h-9 w-9 rounded-full overflow-hidden shrink-0">
              <ImageComponent src={customer?.profile_pic ?? ''} alt={customer?.name ?? 'Customer'} object_cover={true} />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">{customer?.name || '—'}</p>
              <p className="text-xs text-muted-foreground truncate">{customer?.email || '—'}</p>
            </div>
          </div>
        );
      },
    },
    {
      field: 'rating',
      headerName: 'Rating',
      minWidth: 130,
      sortable: false,
      renderCell: (params) => (
        <div className="flex items-center gap-0.5">
          {[1, 2, 3, 4, 5].map((value) => (
            <Star
              key={value}
              className={`h-3.5 w-3.5 ${value <= (params.row.rating ?? 0) ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`}
            />
          ))}
        </div>
      ),
    },
    {
      field: 'comment',
      headerName: 'Comment',
      minWidth: 220,
      flex: 1.2,
      sortable: false,
      renderCell: (params) => (
        <span className="text-sm text-muted-foreground truncate" title={params.row.comment ?? ''}>
          {params.row.comment?.trim() || '—'}
        </span>
      ),
    },
    {
      field: 'item',
      headerName: 'Item',
      minWidth: 200,
      flex: 1,
      sortable: false,
      renderCell: (params) => {
        const item = params.row.item;
        return (
          <div className="min-w-0">
            <p className="text-sm font-medium truncate">{item?.title || '—'}</p>
            <p className="text-xs text-muted-foreground truncate">
              {formatTypeLabel(params.row.type)}
              {item?.series?.title ? ` · ${item.series.title}` : ''}
            </p>
          </div>
        );
      },
    },
    {
      field: 'createdBy',
      headerName: 'Mentor',
      minWidth: 200,
      flex: 1,
      sortable: false,
      renderCell: (params) => {
        const mentor = params.row.createdBy ?? params.row.item?.createdBy;
        return (
          <div className="flex items-center gap-3 min-w-0">
            <div className="border h-9 w-9 rounded-full overflow-hidden shrink-0">
              <ImageComponent src={mentor?.profile_pic ?? ''} alt={mentor?.name ?? 'Mentor'} object_cover={true} />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">{mentor?.name || '—'}</p>
              <p className="text-xs text-muted-foreground truncate">{mentor?.email || '—'}</p>
            </div>
          </div>
        );
      },
    },
    {
      field: 'status',
      headerName: 'Status',
      minWidth: 120,
      sortable: false,
      renderCell: (params) => {
        const key = String(params.row.status || 'pending').toLowerCase();
        return (
          <Badge variant="outline" className={STATUS_BADGE_CLASS[key] ?? STATUS_BADGE_CLASS.pending}>
            {formatStatusLabel(params.row.status)}
          </Badge>
        );
      },
    },
    {
      field: 'createdAt',
      headerName: 'Date',
      minWidth: 150,
      sortable: false,
      renderCell: (params) => (
        <span className="text-sm whitespace-nowrap text-muted-foreground">
          {params.row.createdAt ? moment(params.row.createdAt).format('DD/MM/YYYY hh:mm A') : '—'}
        </span>
      ),
    },
    {
      field: 'updatedBy',
      headerName: 'Updated by',
      minWidth: 200,
      flex: 1,
      sortable: false,
      renderCell: (params) => {
        const updatedBy = params.row.updatedBy;
        if (!updatedBy) {
          return <span className="text-sm text-muted-foreground">—</span>;
        }
        return (
          <div className="flex items-center gap-3 min-w-0">
            <div className="border h-9 w-9 rounded-full overflow-hidden shrink-0">
              <ImageComponent src={updatedBy?.profile_pic ?? ''} alt={updatedBy?.name ?? 'Updated by'} object_cover={true} />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">{updatedBy.name || '—'}</p>
              <p className="text-xs text-muted-foreground truncate">{updatedBy.email || '—'}</p>
            </div>
          </div>
        );
      },
    },
    {
      field: 'updatedAt',
      headerName: 'Updated date',
      minWidth: 150,
      sortable: false,
      renderCell: (params) => (
        <span className="text-sm whitespace-nowrap text-muted-foreground">
          {params.row.updatedAt ? moment(params.row.updatedAt).format('DD/MM/YYYY hh:mm A') : '—'}
        </span>
      ),
    },
    {
      field: 'actions',
      headerName: '',
      width: 80,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <div className="action_buttons">
          <button
            type="button"
            className="active_button"
            title="View / update status"
            onClick={() =>
              dispatch(
                openModal({
                  componentName: 'ReviewStatusModal',
                  data: params.row,
                })
              )
            }
          >
            <Eye className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Reviews & ratings"
        description="Monitor and moderate user reviews."
      >
        <Badge variant="outline" className="border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700">
          Total reviews: {total}
        </Badge>
      </AdminPageHeader>

      <AdminReviewsSearch
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        status={status}
        onStatusChange={setStatus}
        type={type}
        onTypeChange={setType}
      />

      <div className="border border-gray-200 rounded-md overflow-hidden">
        <CommonDataTable
          rows={reviews}
          columns={columns}
          getRowId={(row) => row.id}
          loading={isLoading || isFetching}
          paginationMode="server"
          rowCount={total}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
        />
      </div>
    </div>
  );
}
