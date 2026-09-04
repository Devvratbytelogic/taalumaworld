'use client';

import { useState } from 'react';
import Link from 'next/link';
import moment from 'moment';
import { type GridColDef } from '@mui/x-data-grid';
import { ArrowLeft, UserX } from 'lucide-react';
import {
  AdminPage,
  AdminPageHeader,
  AdminPanel,
  AdminEmptyState,
} from '@/components/admin/layout/AdminContent';
import CommonDataTable from '@/components/admin/CommonDataTable';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useGetUserByIdQuery } from '@/store/rtkQueries/rolesPermissionsApi';
import { getAdminSectionRoutePath } from '@/routes/routes';
import type { ItemsEntity } from '@/types/rolesPermissions';

const STATUS_BADGE_CLASS: Record<string, string> = {
  active: 'bg-green-50 text-green-700 border-green-200!',
  suspended: 'bg-red-50 text-red-700 border-red-200!',
};

function formatUserType(value?: string | null) {
  if (!value) return '—';
  return value.replace(/_/g, ' ');
}

interface AdminUserDetailViewProps {
  userId: string;
}

export function AdminUserDetailView({ userId }: AdminUserDetailViewProps) {
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });

  const { data, isLoading, isFetching, isError } = useGetUserByIdQuery(userId, { skip: !userId });

  const user = data?.data;
  const agreement = user?.agreement_status;
  const consents = agreement?.items ?? [];

  const backLink = (
    <Link
      href={getAdminSectionRoutePath('users')}
      className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-slate-500 transition-colors hover:text-primary"
    >
      <ArrowLeft className="h-4 w-4" />
      Back to customers
    </Link>
  );

  if (isLoading) {
    return (
      <AdminPage>
        {backLink}
        <AdminPanel className="p-10 text-center text-sm text-slate-500">Loading customer...</AdminPanel>
      </AdminPage>
    );
  }

  if (isError || !user) {
    return (
      <AdminPage>
        {backLink}
        <AdminPanel>
          <AdminEmptyState
            icon={UserX}
            title="Customer not found"
            description="This customer may have been removed, or the link is invalid."
            action={
              <Link
                href={getAdminSectionRoutePath('users')}
                className="global_btn rounded_full bg_primary inline-flex items-center justify-center"
              >
                Back to customers
              </Link>
            }
          />
        </AdminPanel>
      </AdminPage>
    );
  }

  const columns: GridColDef<ItemsEntity>[] = [
    {
      field: 'title',
      headerName: 'Agreement',
      minWidth: 220,
      flex: 1,
      sortable: false,
      renderCell: (params) => (
        <p className="truncate text-sm font-medium text-slate-900">{params.row.title || '—'}</p>
      ),
    },
    {
      field: 'version',
      headerName: 'Version',
      width: 100,
      sortable: false,
    },
    {
      field: 'accepted_at',
      headerName: 'Accepted',
      minWidth: 180,
      sortable: false,
      renderCell: (params) => (
        <span className="text-sm whitespace-nowrap text-slate-600">
          {params.row.accepted_at ? moment(params.row.accepted_at).format('MMM D, YYYY h:mm A') : '—'}
        </span>
      ),
    },
    {
      field: 'is_consented_latest',
      headerName: 'Current version',
      width: 140,
      sortable: false,
      renderCell: (params) => (
        <Badge
          variant="outline"
          className={
            params.row.is_consented_latest
              ? 'bg-green-50 text-green-700 border-green-200!'
              : 'bg-red-50 text-red-700 border-red-200!'
          }
        >
          {params.row.is_consented_latest ? 'Yes' : 'No'}
        </Badge>
      ),
    },
  ];

  return (
    <AdminPage>
      {backLink}

      <AdminPageHeader
        eyebrow="Customers"
        title={user.name}
        description="Customer profile and the agreement versions this person accepted."
      />

      <AdminPanel className="p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <Avatar className="border h-16 w-16">
            <AvatarImage src={user.profile_pic ?? ''} alt={user.name} />
            <AvatarFallback className="text-xl">{user.name?.[0]?.toUpperCase() || '?'}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <h2 className="text-lg font-semibold text-slate-900">{user.name}</h2>
            <p className="text-sm text-slate-500">{user.email}</p>
          </div>
        </div>

        <dl className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">Role</dt>
            <dd className="mt-1">
              <Badge>{user.role?.name || '—'}</Badge>
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">Status</dt>
            <dd className="mt-1">
              <Badge
                variant="outline"
                className={STATUS_BADGE_CLASS[user.status] ?? STATUS_BADGE_CLASS.active}
              >
                {user.status || 'active'}
              </Badge>
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">Customer type</dt>
            <dd className="mt-1 text-sm capitalize text-slate-700">{formatUserType(user.user_type)}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">Phone</dt>
            <dd className="mt-1 text-sm text-slate-700">{user.phone || user.phone_number || '—'}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">Joining date</dt>
            <dd className="mt-1 text-sm text-slate-700">
              {user.createdAt ? moment(user.createdAt).format('MMM D, YYYY') : '—'}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">Verified</dt>
            <dd className="mt-1">
              <Badge
                variant="outline"
                className={
                  user.is_verified
                    ? 'bg-green-50 text-green-700 border-green-200!'
                    : 'bg-slate-100 text-slate-600 border-slate-200'
                }
              >
                {user.is_verified ? 'Yes' : 'No'}
              </Badge>
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">Mandatory accepted</dt>
            <dd className="mt-1">
              <Badge
                variant="outline"
                className={
                  agreement?.all_mandatory_accepted
                    ? 'bg-green-50 text-green-700 border-green-200!'
                    : 'bg-slate-100 text-slate-600 border-slate-200'
                }
              >
                {agreement?.all_mandatory_accepted ? 'Yes' : 'No'}
              </Badge>
            </dd>
          </div>
        </dl>
      </AdminPanel>

      <div className="overflow-hidden rounded-md border border-gray-200">
        <CommonDataTable
          rows={consents}
          columns={columns}
          getRowId={(row) => row.agreement_id}
          loading={isFetching}
          paginationMode="server"
          rowCount={consents.length}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
        />
      </div>
    </AdminPage>
  );
}
