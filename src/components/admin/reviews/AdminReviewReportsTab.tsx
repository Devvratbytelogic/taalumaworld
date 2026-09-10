'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import moment from 'moment';
import { type GridColDef } from '@mui/x-data-grid';
import { Check, Eye, Star, X } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { Badge } from '@/components/ui/badge';
import { AdminPageHeader } from '@/components/admin/layout/AdminContent';
import CommonDataTable from '@/components/admin/CommonDataTable';
import { useDebounce } from '@/hooks/useDebounce';
import { openModal } from '@/store/slices/allModalSlice';
import { useGetAllAdminReviewReportsQuery } from '@/store/rtkQueries/adminReviewReportsApi';
import { getReviewReportDetailRoutePath, isMentorPanelPath } from '@/routes/routes';
import ImageComponent from '@/components/ui/ImageComponent';
import { AdminReviewReportsSearch } from './AdminReviewReportsSearch';
import type { IAdminReviewReportEntity } from '@/types/adminReviewReports';
import { useAdminPermissions } from '@/hooks/useAdminPermissions';
import { AdminReviewReportsSkeleton } from '@/components/skeleton-loader/admin';

const REVIEW_REPORTS_MODEL = 'Review Reports';

const STATUS_BADGE_CLASS: Record<string, string> = {
  pending: 'bg-amber-50 text-amber-700 border-amber-200!',
  accepted: 'bg-emerald-50 text-emerald-700 border-emerald-200!',
  ignored: 'bg-slate-50 text-slate-700 border-slate-200!',
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

export function AdminReviewReportsTab() {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const isMentor = isMentorPanelPath(pathname);
  const { hasPermission } = useAdminPermissions();
  const canProcessReports = hasPermission(REVIEW_REPORTS_MODEL, 'edit');
  const [searchQuery, setSearchQuery] = useState('');
  const [status, setStatus] = useState('');
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
  const debouncedSearch = useDebounce(searchQuery, 400);

  useEffect(() => {
    setPaginationModel((prev) => ({ ...prev, page: 0 }));
  }, [debouncedSearch, status]);

  const { data, isLoading, isFetching } = useGetAllAdminReviewReportsQuery({
    page: paginationModel.page + 1,
    limit: paginationModel.pageSize,
    ...(status ? { status: status as 'pending' | 'accepted' | 'ignored' } : {}),
    ...(debouncedSearch.trim() ? { search: debouncedSearch.trim() } : {}),
  });

  const reports = data?.data?.data ?? [];
  const total = data?.data?.total ?? 0;

  const openProcessModal = (row: IAdminReviewReportEntity, action: 'accept' | 'ignore') => {
    dispatch(
      openModal({
        componentName: 'ReviewReportProcessModal',
        data: {
          id: row.id,
          action,
          reason: row.reason,
        },
      }),
    );
  };

  const columns: GridColDef<IAdminReviewReportEntity>[] = [
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
      field: 'reported_by',
      headerName: 'Reporter',
      minWidth: 200,
      flex: 1,
      sortable: false,
      renderCell: (params) => {
        const reporter = params.row.reported_by;
        return (
          <div className="flex items-center gap-3 min-w-0">
            <div className="border h-9 w-9 rounded-full overflow-hidden shrink-0">
              <ImageComponent src={reporter?.profile_pic ?? ''} alt={reporter?.name ?? 'Reporter'} object_cover={true} />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">{reporter?.name || '—'}</p>
              <p className="text-xs text-muted-foreground truncate">{reporter?.email || '—'}</p>
            </div>
          </div>
        );
      },
    },
    {
      field: 'reason',
      headerName: 'Reason',
      minWidth: 200,
      flex: 1.1,
      sortable: false,
      renderCell: (params) => (
        <span className="text-sm text-muted-foreground truncate" title={params.row.reason ?? ''}>
          {params.row.reason?.trim() || '—'}
        </span>
      ),
    },
    {
      field: 'review',
      headerName: 'Review',
      minWidth: 240,
      flex: 1.2,
      sortable: false,
      renderCell: (params) => {
        const review = params.row.review;
        return (
          <div className="min-w-0">
            <div className="flex items-center gap-0.5 mb-0.5">
              {[1, 2, 3, 4, 5].map((value) => (
                <Star
                  key={value}
                  className={`h-3 w-3 ${value <= (review?.rating ?? 0) ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`}
                />
              ))}
            </div>
            <p className="text-sm text-muted-foreground truncate" title={review?.comment ?? ''}>
              {review?.comment?.trim() || '—'}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {formatTypeLabel(review?.type)}
              {review?.item?.title ? ` · ${review.item.title}` : ''}
            </p>
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
      field: 'actions',
      headerName: '',
      width: 150,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <div className="action_buttons">
          <button
            type="button"
            className="active_button"
            title="View report"
            onClick={() => router.push(getReviewReportDetailRoutePath(params.row.id, isMentor))}
          >
            <Eye className="h-4 w-4" />
          </button>
          {params.row.can_process && canProcessReports ? (
            <>
              <button
                type="button"
                className="active_button"
                title="Accept — hide review"
                onClick={() => openProcessModal(params.row, 'accept')}
              >
                <Check className="h-4 w-4" />
              </button>
              <button
                type="button"
                className="warning_button"
                title="Ignore"
                onClick={() => openProcessModal(params.row, 'ignore')}
              >
                <X className="h-4 w-4" />
              </button>
            </>
          ) : null}
        </div>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <AdminPageHeader
          title="Review reports"
          description="Accept a report to hide the review, or ignore it if it is not a policy violation."
        >
          <Badge variant="outline" className="border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700">
            Total reports: {total}
          </Badge>
        </AdminPageHeader>
        <AdminReviewReportsSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Review reports"
        description="Accept a report to hide the review, or ignore it if it is not a policy violation."
      >
        <Badge variant="outline" className="border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700">
          Total reports: {total}
        </Badge>
      </AdminPageHeader>

      <AdminReviewReportsSearch
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        status={status}
        onStatusChange={setStatus}
      />

      <div className="border border-gray-200 rounded-md overflow-hidden">
        <CommonDataTable
          rows={reports}
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
