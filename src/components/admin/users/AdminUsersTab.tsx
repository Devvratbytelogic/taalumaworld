/**
 * Admin Customers Tab
 * View and manage platform customers
 */

'use client';

import { useState } from 'react';
import { type GridColDef } from '@mui/x-data-grid';
import { Eye, Ban, CircleCheck, Edit2, KeyRound, Loader2 } from 'lucide-react';
import toast from '@/utils/toast';
import type { IAllUsersEntity } from '@/types/rolesPermissions';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import CommonDataTable from '@/components/admin/CommonDataTable';
import { AdminUsersHeader } from './AdminUsersHeader';
import { AdminUsersSearch } from './AdminUsersSearch';
import { ViewProfileModal } from './ViewProfileModal';
import { EditUserModal } from './EditUserModal';
import { SuspendUserDialog } from './SuspendUserDialog';
import {
  useGetAllUsersQuery,
  useUpdateStaffStatusMutation,
  useGeneratePasswordResetLinkMutation,
} from '@/store/rtkQueries/rolesPermissionsApi';
import { useDebounce } from '@/hooks/useDebounce';

const STATUS_BADGE_CLASS: Record<string, string> = {
  active: 'bg-green-50 text-green-700 border-green-200!',
  suspended: 'bg-red-50 text-red-700 border-red-200!',
};

export function AdminUsersTab() {
  const [searchQuery, setSearchQuery] = useState('');
  const [profileUser, setProfileUser] = useState<IAllUsersEntity | null>(null);
  const [editUser, setEditUser] = useState<IAllUsersEntity | null>(null);
  const [suspendUser, setSuspendUser] = useState<IAllUsersEntity | null>(null);
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
  const [resettingPasswordId, setResettingPasswordId] = useState<string | null>(null);

  const debouncedSearch = useDebounce(searchQuery, 400);

  const { data: usersResponse, isLoading } = useGetAllUsersQuery({
    page: paginationModel.page + 1,
    limit: paginationModel.pageSize,
    user_type: 'user',
    ...(debouncedSearch.trim() ? { search: debouncedSearch.trim() } : {}),
  });
  const [updateUserStatus, { isLoading: isSuspending }] = useUpdateStaffStatusMutation();
  const [generatePasswordResetLink] = useGeneratePasswordResetLinkMutation();

  const users = usersResponse?.data?.data ?? [];
  const totalUsers = usersResponse?.data?.total ?? 0;

  const resetToFirstPage = () => setPaginationModel((prev) => ({ ...prev, page: 0 }));

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    resetToFirstPage();
  };

  const handleViewProfile = (user: IAllUsersEntity) => {
    setProfileUser(user);
  };

  const handleEditUser = (user: IAllUsersEntity) => {
    setEditUser(user);
  };

  const handleResetPassword = async (user: IAllUsersEntity) => {
    if (resettingPasswordId) return;
    setResettingPasswordId(user._id);
    try {
      const res = await generatePasswordResetLink(user._id).unwrap();
      if (res?.http_status_code === 200 || res?.http_status_code === 201) {
        toast.success(res.message ?? `Password reset link sent for "${user.name}"`);
      }
    } catch {
      toast.error(`Failed to generate password reset link for "${user.name}"`);
    } finally {
      setResettingPasswordId(null);
    }
  };

  const handleSuspend = (user: IAllUsersEntity) => {
    setSuspendUser(user);
  };

  const confirmSuspend = async (statusReason: string) => {
    if (suspendUser) {
      const newStatus = suspendUser.status === 'suspended' ? 'active' : 'suspended';
      try {
        const res = await updateUserStatus({
          id: suspendUser._id,
          payload: { status: newStatus, status_reason: statusReason },
        }).unwrap();
        if (res?.http_status_code === 200 || res?.http_status_code === 201) {
          toast.success(res.message ?? `"${suspendUser.name}" has been ${newStatus === 'suspended' ? 'suspended' : 'activated'}`);
        }
      } catch {
        toast.error(`Failed to update "${suspendUser.name}"`);
      } finally {
        setSuspendUser(null);
        setProfileUser(null);
      }
    }
  };

  const handleSuspendFromProfile = (user: IAllUsersEntity) => {
    setProfileUser(null);
    setSuspendUser(user);
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
      headerName: 'Customer',
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
      field: 'phone_number',
      headerName: 'Phone',
      minWidth: 140,
      sortable: false,
      renderCell: (params) => (
        <span className="text-sm text-slate-700 truncate">
          {params.row.phone || params.row.phone_number || '-'}
        </span>
      ),
    },
    {
      field: 'role',
      headerName: 'Customer Type',
      minWidth: 200,
      flex: 1,
      sortable: false,
      renderCell: (params) => <Badge>{params.row.role?.name ?? '-'}</Badge>,
    },
    {
      field: 'createdAt',
      headerName: 'Joining Date',
      width: 130,
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
      width: 120,
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
        return (
          <div className="action_buttons">
            <button
              type="button"
              className="active_button"
              title="View profile"
              onClick={() => handleViewProfile(params.row)}
            >
              <Eye className="h-4 w-4" />
            </button>
            <button
              type="button"
              className="edit_button"
              title="Edit customer"
              onClick={() => handleEditUser(params.row)}
            >
              <Edit2 className="h-4 w-4" />
            </button>
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
            <button
              type="button"
              className={isSuspended ? 'active_button' : 'delete_button'}
              title={isSuspended ? 'Activate customer' : 'Suspend customer'}
              onClick={() => handleSuspend(params.row)}
            >
              {isSuspended ? <CircleCheck className="h-4 w-4" /> : <Ban className="h-4 w-4" />}
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <AdminUsersHeader totalCount={totalUsers} />

      <AdminUsersSearch searchQuery={searchQuery} onSearchChange={handleSearchChange} />

      <div className="border border-gray-200 rounded-md overflow-hidden">
        <CommonDataTable
          rows={users}
          columns={columns}
          getRowId={(row) => row._id}
          loading={isLoading}
          paginationMode="server"
          rowCount={totalUsers}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
        />
      </div>

      <ViewProfileModal
        user={profileUser}
        open={!!profileUser}
        onOpenChange={(open) => !open && setProfileUser(null)}
        onSuspend={handleSuspendFromProfile}
      />

      <EditUserModal
        user={editUser}
        open={!!editUser}
        onOpenChange={(open) => !open && setEditUser(null)}
      />

      <SuspendUserDialog
        user={suspendUser}
        open={!!suspendUser}
        onOpenChange={(open) => !open && setSuspendUser(null)}
        onConfirm={confirmSuspend}
        isLoading={isSuspending}
      />
    </div>
  );
}
