'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import moment from 'moment';
import { type GridColDef } from '@mui/x-data-grid';
import { BadgeCheck, Eye, Undo2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { AdminPage, AdminPageHeader } from '@/components/admin/layout/AdminContent';
import CommonDataTable from '@/components/admin/CommonDataTable';
import { useDebounce } from '@/hooks/useDebounce';
import { useAdminPermissions } from '@/hooks/useAdminPermissions';
import { useGetAllMentorEquityQuery } from '@/store/rtkQueries/mentorEquityApis';
import { getAdminMentorDetailRoutePath } from '@/routes/routes';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AdminMentorEquitySearch } from './AdminMentorEquitySearch';
import { MentorEquityGrantModal } from './MentorEquityGrantModal';
import type { IMentorEquityEntity, MentorEquityListStatus } from '@/types/mentorEquity';

const MODEL = 'Mentor Equity';

function formatYesNo(value?: boolean) {
  return value ? 'Yes' : 'No';
}

export function AdminMentorEquityTab() {
  const router = useRouter();
  const { hasPermission } = useAdminPermissions();
  const canEdit = hasPermission(MODEL, 'edit');
  const [searchQuery, setSearchQuery] = useState('');
  const [status, setStatus] = useState('');
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
  const [grantTarget, setGrantTarget] = useState<{ mentor: IMentorEquityEntity; granted: boolean } | null>(null);
  const debouncedSearch = useDebounce(searchQuery, 400);

  useEffect(() => {
    setPaginationModel((prev) => ({ ...prev, page: 0 }));
  }, [debouncedSearch, status]);

  const { data, isLoading, isFetching } = useGetAllMentorEquityQuery({
    page: paginationModel.page + 1,
    limit: paginationModel.pageSize,
    ...(status ? { status: status as MentorEquityListStatus } : {}),
    ...(debouncedSearch.trim() ? { search: debouncedSearch.trim() } : {}),
  });

  const mentors = data?.data?.mentors ?? data?.data?.data ?? [];
  const total = data?.data?.pagination?.total ?? data?.data?.total ?? 0;

  const columns: GridColDef<IMentorEquityEntity>[] = [
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
      field: 'mentor',
      headerName: 'Mentor',
      minWidth: 220,
      flex: 1.2,
      sortable: false,
      renderCell: (params) => {
        const user = params.row.user;
        return (
          <div className="flex min-w-0 items-center gap-3">
            <Avatar className="h-9 w-9 shrink-0 border">
              <AvatarImage src={user?.profile_pic ?? ''} />
              <AvatarFallback>{user?.name?.substring(0, 2).toUpperCase() || 'M'}</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-slate-900">{user?.name || '—'}</p>
              <p className="truncate text-xs text-muted-foreground">{user?.email || '—'}</p>
            </div>
          </div>
        );
      },
    },
    {
      field: 'tier',
      headerName: 'Tier',
      width: 140,
      sortable: false,
      renderCell: (params) => (
        <Badge variant="outline">{params.row.tier?.code ?? '—'}</Badge>
      ),
    },
    {
      field: 'rating',
      headerName: 'Rating',
      width: 90,
      sortable: false,
      renderCell: (params) => (
        <span className="text-sm text-slate-700">
          {params.row.eligibility?.overall_rating == null ? '—' : params.row.eligibility.overall_rating}
        </span>
      ),
    },
    {
      field: 'qualifying',
      headerName: 'Qualifying Blueprints',
      minWidth: 160,
      sortable: false,
      renderCell: (params) => (
        <span className="text-sm text-slate-700">
          {params.row.eligibility?.qualifying_blueprint_count ?? '—'}
        </span>
      ),
    },
    {
      field: 'pool',
      headerName: 'Rank / slots',
      width: 130,
      sortable: false,
      renderCell: (params) => {
        const rank = params.row.pool?.rank;
        const slots = params.row.pool?.slots;
        if (rank == null && slots == null) return <span className="text-sm text-slate-400">—</span>;
        return (
          <span className="text-sm text-slate-700">
            {rank ?? '—'} / {slots ?? '—'}
          </span>
        );
      },
    },
    {
      field: 'eligible',
      headerName: 'Eligible',
      width: 110,
      sortable: false,
      renderCell: (params) => (
        <Badge
          variant="outline"
          className={
            params.row.equity?.is_eligible
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : 'bg-slate-100 text-slate-600 border-slate-200'
          }
        >
          {formatYesNo(params.row.equity?.is_eligible)}
        </Badge>
      ),
    },
    {
      field: 'granted',
      headerName: 'Granted',
      width: 140,
      sortable: false,
      renderCell: (params) => (
        <div className="min-w-0">
          <Badge
            variant="outline"
            className={
              params.row.equity?.is_granted
                ? 'bg-violet-50 text-violet-700 border-violet-200'
                : 'bg-slate-100 text-slate-600 border-slate-200'
            }
          >
            {formatYesNo(params.row.equity?.is_granted)}
          </Badge>
          {params.row.equity?.granted_at ? (
            <p className="mt-0.5 text-[11px] text-slate-400">
              {moment(params.row.equity.granted_at).format('DD MMM YYYY')}
            </p>
          ) : null}
        </div>
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 130,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        const profileId = params.row.user?.id;
        const isGranted = Boolean(params.row.equity?.is_granted);
        return (
          <div className="action_buttons">
            {profileId ? (
              <button
                type="button"
                className="active_button"
                title="View mentor"
                onClick={() => router.push(getAdminMentorDetailRoutePath(profileId))}
              >
                <Eye className="h-4 w-4" />
              </button>
            ) : null}
            {canEdit && !isGranted ? (
              <button
                type="button"
                className="edit_button"
                title="Mark granted"
                onClick={() => setGrantTarget({ mentor: params.row, granted: true })}
              >
                <BadgeCheck className="h-4 w-4" />
              </button>
            ) : null}
            {canEdit && isGranted ? (
              <button
                type="button"
                className="warning_button"
                title="Clear grant"
                onClick={() => setGrantTarget({ mentor: params.row, granted: false })}
              >
                <Undo2 className="h-4 w-4" />
              </button>
            ) : null}
          </div>
        );
      },
    },
  ];

  return (
    <AdminPage>
      <AdminPageHeader
        eyebrow="Mentor Management"
        title="Mentor equity"
        description="Equity eligibility flags only — this does not issue shares. Mark granted after the offline legal agreement exists."
      >
        <Badge variant="outline" className="border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700">
          Total: {total}
        </Badge>
      </AdminPageHeader>

      <AdminMentorEquitySearch
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        status={status}
        onStatusChange={setStatus}
      />

      <div className="overflow-hidden rounded-md border border-gray-200">
        <CommonDataTable
          rows={mentors}
          columns={columns}
          getRowId={(row) => row.mentor_id || row.user?.id || ''}
          loading={isLoading || isFetching}
          paginationMode="server"
          rowCount={total}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
        />
      </div>

      {canEdit ? (
        <MentorEquityGrantModal
          open={!!grantTarget}
          mentor={grantTarget?.mentor}
          granted={grantTarget?.granted ?? true}
          onOpenChange={(open) => !open && setGrantTarget(null)}
        />
      ) : null}
    </AdminPage>
  );
}
