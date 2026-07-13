'use client';

import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Button } from '@heroui/react';
import { type GridColDef } from '@mui/x-data-grid';
import { AlertCircle, Ban, CheckCircle, Edit2, Plus } from 'lucide-react';
import { useGetAllUsersQuery } from '@/store/rtkQueries/rolesPermissionsApi';
import { openModal } from '@/store/slices/allModalSlice';
import { AdminSearchInput } from '@/components/admin/layout/AdminContent';
import { useDebounce } from '@/hooks/useDebounce';
import CommonDataTable from '../CommonDataTable';
import { Badge } from '@/components/ui/badge';
import moment from 'moment';


function StatusBadge({ status }: { status: string }) {
    if (status === 'active') {
        return (
            <Badge className="bg-green-100 text-green-700 border-green-200 gap-1 capitalize whitespace-nowrap">
                <CheckCircle className="h-3 w-3 shrink-0" /> Active
            </Badge>
        );
    }
    return (
        <Badge className="bg-amber-100 text-amber-700 border-amber-200 gap-1 capitalize whitespace-nowrap">
            <AlertCircle className="h-3 w-3 shrink-0" /> Suspended
        </Badge>
    );
}

export function StaffAssignmentsTab() {
    const dispatch = useDispatch();
    const [search, setSearch] = useState('');
    const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
    const debouncedSearch = useDebounce(search, 500);

    const { data: staffData, isLoading } = useGetAllUsersQuery({
        page: paginationModel.page + 1,
        limit: paginationModel.pageSize,
        search: debouncedSearch,
    });
    const staff = staffData?.data?.users ?? [];
    const totalStaff = staffData?.data?.pagination?.total ?? 0;

    useEffect(() => {
        setPaginationModel((prev) => ({ ...prev, page: 0 }));
    }, [debouncedSearch]);

    const columns: GridColDef[] = [
        {
            field: 'index',
            headerName: '#',
            width: 60,
            sortable: false,
            renderCell: (params) => {
                const rowIndex = params.api.getRowIndexRelativeToVisibleRows(params.id);
                return paginationModel.page * paginationModel.pageSize + rowIndex + 1;
            },
        },
        {
            field: 'name',
            headerName: 'Staff Member',
            flex: 1,
            minWidth: 220,
            sortable: false,
            renderCell: (params) => (
                <div>
                    <p className="font-medium text-sm">{params.row.name}</p>
                    <p className="text-xs text-muted-foreground">{params.row.email}</p>
                </div>
            ),
        },
        {
            field: 'role',
            headerName: 'Role',
            width: 180,
            sortable: false,
            renderCell: (params) => (
                <Badge variant="secondary" className="whitespace-nowrap">
                    {params.row.role?.name ?? params.row.role_id}
                </Badge>
            ),
        },
        {
            field: 'status',
            headerName: 'Status',
            width: 120,
            sortable: false,
            renderCell: (params) => <StatusBadge status={params.value} />,
        },
        {
            field: 'updatedAt',
            headerName: 'Last Active',
            width: 130,
            sortable: false,
            valueFormatter: (value) =>
                value && moment(value).isValid() ? moment(value).format('DD MMM YYYY') : '—',
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 120,
            sortable: false,
            renderCell: (params) => (
                <div className="action_buttons">
                    <button
                        className="edit_button"
                        onClick={() => dispatch(openModal({
                            componentName: 'AddEditStaffModal',
                            data: { staff: params.row, isEdit: true },
                        }))}
                    >
                        <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                        className={`${params.row.status === 'active' ? 'delete_button' : 'active_button'}`}
                        title={params.row.status === 'active' ? 'Suspend user' : 'Activate user'}
                        onClick={() => dispatch(openModal({
                            componentName: 'UpdateStaffStatusModal',
                            data: { staff: params.row },
                        }))}
                    >
                        {params.row.status === 'active' ? (
                            <Ban className="h-4 w-4" />
                        ) : (
                            <CheckCircle className="h-4 w-4" />
                        )}
                    </button>
                </div>
            ),
        },
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-3">
                <AdminSearchInput
                    placeholder="Search by name, email, or role..."
                    value={search}
                    onChange={setSearch}
                />
                <Button
                    color="primary"
                    className="rounded-xl"
                    onPress={() => dispatch(openModal({ componentName: 'AddEditStaffModal', }))}
                    startContent={<Plus className="h-4 w-4" />}
                >
                    Add Staff
                </Button>
            </div>

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
        </div>
    );
}
