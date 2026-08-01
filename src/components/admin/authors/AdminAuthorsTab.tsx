'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { type GridColDef } from '@mui/x-data-grid';
import { Eye, Ban, CircleCheck, BadgeCheck, Edit2, KeyRound, Loader2 } from 'lucide-react';
import toast from '@/utils/toast';
import type { IAllUsersEntity } from '@/types/rolesPermissions';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import CommonDataTable from '@/components/admin/CommonDataTable';
import { AdminAuthorsHeader } from './AdminAuthorsHeader';
import { AdminAuthorsSearch } from './AdminAuthorsSearch';
import { SuspendUserDialog } from '@/components/admin/users/SuspendUserDialog';
import { EditUserModal } from '@/components/admin/users/EditUserModal';
import {
  useGetAllUsersQuery,
  useUpdateStaffStatusMutation,
  useGeneratePasswordResetLinkMutation,
} from '@/store/rtkQueries/rolesPermissionsApi';
import { useDebounce } from '@/hooks/useDebounce';
import { useAdminPermissions } from '@/hooks/useAdminPermissions';
import { getAdminMentorDetailRoutePath } from '@/routes/routes';
import { refreshAfterMentorChange } from '@/store/server-api/refreshCache';

const MENTORS_MODEL = 'Mentors';

const STATUS_BADGE_CLASS: Record<string, string> = {
  active: 'bg-green-50 text-green-700 border-green-200!',
  suspended: 'bg-red-50 text-red-700 border-red-200!',
};

const formatWalletBalance = (balance?: number | null, currency?: string | null) => {
  if (balance === undefined || balance === null) return '-';
  try {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: currency || 'USD' }).format(balance);
  } catch {
    return `${currency ?? ''} ${balance}`.trim();
  }
};

export function AdminAuthorsTab() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [editAuthor, setEditAuthor] = useState<IAllUsersEntity | null>(null);
  const [suspendAuthor, setSuspendAuthor] = useState<IAllUsersEntity | null>(null);
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
  const [resettingPasswordId, setResettingPasswordId] = useState<string | null>(null);
  const { hasPermission } = useAdminPermissions();

  const canView = hasPermission(MENTORS_MODEL, 'view');
  const canEdit = hasPermission(MENTORS_MODEL, 'edit');
  const canDelete = hasPermission(MENTORS_MODEL, 'delete');

  const debouncedSearch = useDebounce(searchQuery, 400);

  const { data: authorsResponse, isLoading } = useGetAllUsersQuery({
    page: paginationModel.page + 1,
    limit: paginationModel.pageSize,
    user_type: 'mentor',
    ...(debouncedSearch.trim() ? { search: debouncedSearch.trim() } : {}),
  });
  const [updateAuthorStatus, { isLoading: isSuspending }] = useUpdateStaffStatusMutation();
  const [generatePasswordResetLink] = useGeneratePasswordResetLinkMutation();

  const authors = authorsResponse?.data?.data ?? [];
  const totalAuthors = authorsResponse?.data?.total ?? 0;

  const resetToFirstPage = () => setPaginationModel((prev) => ({ ...prev, page: 0 }));

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    resetToFirstPage();
  };

  const handleViewProfile = (author: IAllUsersEntity) => {
    router.push(getAdminMentorDetailRoutePath(author._id));
  };

  const handleEditAuthor = (author: IAllUsersEntity) => {
    setEditAuthor(author);
  };

  const handleResetPassword = async (author: IAllUsersEntity) => {
    if (resettingPasswordId) return;
    setResettingPasswordId(author._id);
    try {
      const res = await generatePasswordResetLink(author._id).unwrap();
      if (res?.http_status_code === 200 || res?.http_status_code === 201) {
        toast.success(res.message ?? `Password reset link sent for "${author.name}"`);
      }
    } catch {
      toast.error(`Failed to generate password reset link for "${author.name}"`);
    } finally {
      setResettingPasswordId(null);
    }
  };

  const handleSuspend = (author: IAllUsersEntity) => {
    setSuspendAuthor(author);
  };

  const confirmSuspend = async (statusReason: string) => {
    if (suspendAuthor) {
      const newStatus = suspendAuthor.status === 'suspended' ? 'active' : 'suspended';
      try {
        const res = await updateAuthorStatus({
          id: suspendAuthor._id,
          payload: { status: newStatus, status_reason: statusReason },
        }).unwrap();
        if (res?.http_status_code === 200 || res?.http_status_code === 201) {
          void refreshAfterMentorChange(suspendAuthor.short_code);
          toast.success(res.message ?? `"${suspendAuthor.name}" has been ${newStatus === 'suspended' ? 'suspended' : 'activated'}`);
        }
      } catch {
        toast.error(`Failed to update "${suspendAuthor.name}"`);
      } finally {
        setSuspendAuthor(null);
      }
    }
  };

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
      field: 'name',
      headerName: 'Mentor',
      minWidth: 220,
      flex: 1,
      sortable: false,
      renderCell: (params) => (
        <div className="flex items-center gap-3 min-w-0">
          <Avatar className="border h-9 w-9 shrink-0">
            <AvatarImage src={params.row.profile_pic ?? ''} />
            <AvatarFallback>{params.row.name?.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <span className="font-medium text-sm truncate">{params.row.name}</span>
        </div>
      ),
    },
    {
      field: 'email',
      headerName: 'Email',
      minWidth: 200,
      flex: 1,
      sortable: false,
      renderCell: (params) => <span className="text-sm text-slate-700 truncate">{params.row.email}</span>,
    },
    {
      field: 'tier',
      headerName: 'Tier',
      width: 130,
      sortable: false,
      renderCell: (params) => <Badge variant="outline">{params.row.mentor_economy?.tier?.code ?? '-'}</Badge>,
    },
    {
      field: 'is_verified_mentor',
      headerName: 'Verified Mentor',
      width: 150,
      sortable: false,
      renderCell: (params) =>
        params.row.mentor_economy?.is_verified_mentor ? (
          <Badge variant="outline" className="gap-1 bg-blue-50 text-blue-700 border-blue-200!">
            <BadgeCheck className="h-3 w-3" /> Verified
          </Badge>
        ) : (
          <Badge variant="outline" className="bg-slate-100 text-slate-600 border-slate-200!">
            Unverified
          </Badge>
        ),
    },
    {
      field: 'wallet_balance',
      headerName: 'Wallet Balance',
      width: 140,
      sortable: false,
      renderCell: (params) => (
        <span className="text-sm text-slate-700">
          {formatWalletBalance(params.row.mentor_economy?.wallet?.balance, params.row.mentor_economy?.wallet?.currency)}
        </span>
      ),
    },
    {
      field: 'createdAt',
      headerName: 'Joining Date',
      width: 120,
      sortable: false,
      renderCell: (params) => (
        <span className="text-sm text-slate-700">
          {params.row.createdAt
            ? new Date(params.row.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })
            : '-'}
        </span>
      ),
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 110,
      sortable: false,
      renderCell: (params) => (
        <Badge variant="outline" className={STATUS_BADGE_CLASS[params.row.status] ?? STATUS_BADGE_CLASS.active}>
          {params.row.status || 'active'}
        </Badge>
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 200,
      sortable: false,
      renderCell: (params) => {
        const isSuspended = params.row.status === 'suspended';
        const isResetting = resettingPasswordId === params.row._id;
        if (!canView && !canEdit && !canDelete) return null;
        return (
          <div className="action_buttons">
            {canView ? (
              <button
                type="button"
                className="active_button"
                title="View profile"
                onClick={() => handleViewProfile(params.row)}
              >
                <Eye className="h-4 w-4" />
              </button>
            ) : null}
            {canEdit ? (
              <button
                type="button"
                className="edit_button"
                title="Edit mentor"
                onClick={() => handleEditAuthor(params.row)}
              >
                <Edit2 className="h-4 w-4" />
              </button>
            ) : null}
            {canEdit ? (
              <button
                type="button"
                className="warning_button"
                title="Reset password"
                disabled={!!resettingPasswordId}
                onClick={() => handleResetPassword(params.row)}
              >
                {isResetting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <KeyRound className="h-4 w-4" />
                )}
              </button>
            ) : null}
            {canDelete ? (
              <button
                type="button"
                className={isSuspended ? 'active_button' : 'delete_button'}
                title={isSuspended ? 'Activate mentor' : 'Suspend mentor'}
                onClick={() => handleSuspend(params.row)}
              >
                {isSuspended ? <CircleCheck className="h-4 w-4" /> : <Ban className="h-4 w-4" />}
              </button>
            ) : null}
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <AdminAuthorsHeader />

      <AdminAuthorsSearch searchQuery={searchQuery} onSearchChange={handleSearchChange} />

      <div className="border border-gray-200 rounded-md overflow-hidden">
        <CommonDataTable
          rows={authors}
          columns={columns}
          getRowId={(row) => row._id}
          loading={isLoading}
          paginationMode="server"
          rowCount={totalAuthors}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
        />
      </div>

      {canEdit ? (
        <EditUserModal
          user={editAuthor}
          open={!!editAuthor}
          onOpenChange={(open) => !open && setEditAuthor(null)}
        />
      ) : null}

      {canDelete ? (
        <SuspendUserDialog
          user={suspendAuthor}
          open={!!suspendAuthor}
          onOpenChange={(open) => !open && setSuspendAuthor(null)}
          onConfirm={confirmSuspend}
          isLoading={isSuspending}
        />
      ) : null}
    </div>
  );
}
