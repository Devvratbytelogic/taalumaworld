'use client';

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { type GridColDef } from '@mui/x-data-grid';
import { Ban, CircleCheck, Edit2, Eye, KeyRound, Loader2, Plus } from 'lucide-react';
import {
  useGeneratePasswordResetLinkMutation,
  useGetAllUsersQuery,
} from '@/store/rtkQueries/rolesPermissionsApi';
import { openModal } from '@/store/slices/allModalSlice';
import { AdminPageHeader, AdminSearchInput, AdminSearchPanel } from '@/components/admin/layout/AdminContent';
import Button from '@/components/ui/Button';
import { useDebounce } from '@/hooks/useDebounce';
import CommonDataTable from '../CommonDataTable';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import toast from '@/utils/toast';
import type { IAllUsersEntity } from '@/types/rolesPermissions';
import { ViewProfileModal } from '@/components/admin/users/ViewProfileModal';

const STATUS_BADGE_CLASS: Record<string, string> = {
  active: 'bg-green-50 text-green-700 border-green-200!',
  suspended: 'bg-red-50 text-red-700 border-red-200!',
};

export function StaffAssignmentsTab({ embedded = false }: { embedded?: boolean }) {
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState('');
  const [profileStaff, setProfileStaff] = useState<IAllUsersEntity | null>(null);
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
  const [resettingPasswordId, setResettingPasswordId] = useState<string | null>(null);

  const debouncedSearch = useDebounce(searchQuery, 400);

  const { data: staffData, isLoading } = useGetAllUsersQuery({
    page: paginationModel.page + 1,
    limit: paginationModel.pageSize,
    user_type: 'staff',
    ...(debouncedSearch.trim() ? { search: debouncedSearch.trim() } : {}),
  });
  const [generatePasswordResetLink] = useGeneratePasswordResetLinkMutation();

  const staff = staffData?.data?.data ?? [];
  const totalStaff = staffData?.data?.total ?? 0;

  const resetToFirstPage = () => setPaginationModel((prev) => ({ ...prev, page: 0 }));

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    resetToFirstPage();
  };

  const handleResetPassword = async (member: IAllUsersEntity) => {
    if (resettingPasswordId) return;
    setResettingPasswordId(member._id);
    try {
      const res = await generatePasswordResetLink(member._id).unwrap();
      if (res?.http_status_code === 200 || res?.http_status_code === 201) {
        toast.success(res.message ?? `Password reset link sent for "${member.name}"`);
      }
    } catch {
      toast.error(`Failed to generate password reset link for "${member.name}"`);
    } finally {
      setResettingPasswordId(null);
    }
  };

  const handleSuspendFromProfile = (member: IAllUsersEntity) => {
    setProfileStaff(null);
    dispatch(
      openModal({
        componentName: 'UpdateStaffStatusModal',
        data: { staff: member },
      }),
    );
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
      headerName: 'Staff',
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
      headerName: 'Role Type',
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
              onClick={() => setProfileStaff(params.row)}
            >
              <Eye className="h-4 w-4" />
            </button>
            <button
              type="button"
              className="edit_button"
              title="Edit staff"
              onClick={() =>
                dispatch(
                  openModal({
                    componentName: 'AddEditStaffModal',
                    data: { staff: params.row, isEdit: true },
                  }),
                )
              }
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
              title={isSuspended ? 'Activate staff' : 'Suspend staff'}
              onClick={() =>
                dispatch(
                  openModal({
                    componentName: 'UpdateStaffStatusModal',
                    data: { staff: params.row },
                  }),
                )
              }
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
      {!embedded ? (
        <AdminPageHeader
          title="Staff management"
          description="View and manage staff members and role assignments"
        >
          <Badge variant="outline" className="border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700">
            Total staff: {totalStaff}
          </Badge>
        </AdminPageHeader>
      ) : null}

      <AdminSearchPanel>
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <AdminSearchInput
            placeholder="Search by name, email, or role..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <Button
            className="global_btn rounded_full bg_primary lg:shrink-0"
            onPress={() => dispatch(openModal({ componentName: 'AddEditStaffModal' }))}
            startContent={<Plus className="h-4 w-4" />}
          >
            Add Staff
          </Button>
        </div>
      </AdminSearchPanel>

      <div className="border border-gray-200 rounded-md overflow-hidden">
        <CommonDataTable
          rows={staff}
          columns={columns}
          getRowId={(row) => row._id}
          loading={isLoading}
          paginationMode="server"
          rowCount={totalStaff}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
        />
      </div>

      <ViewProfileModal
        user={profileStaff}
        open={!!profileStaff}
        onOpenChange={(open) => !open && setProfileStaff(null)}
        onSuspend={handleSuspendFromProfile}
      />
    </div>
  );
}
