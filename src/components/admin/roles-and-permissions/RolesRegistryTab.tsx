'use client';

import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Button } from '@heroui/react';
import { type GridColDef } from '@mui/x-data-grid';
import { Plus, Edit2, Trash2, Shield } from 'lucide-react';
import { useGetAllRolesQuery, } from '@/store/rtkQueries/rolesPermissionsApi';
import { closeModal, openModal } from '@/store/slices/allModalSlice';
import { AdminSearchInput } from '@/components/admin/layout/AdminContent';
import { useDebounce } from '@/hooks/useDebounce';
import CommonDataTable from '../CommonDataTable';
import { useDeleteRoleMutation } from '@/store/rtkQueries/rolesPermissionsApi';
import toast from '@/utils/toast'


export function RolesRegistryTab() {
    const dispatch = useDispatch();
    const [search, setSearch] = useState('');
    const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
    const debouncedSearch = useDebounce(search, 500);
    const { data: res, isLoading } = useGetAllRolesQuery({
        page: paginationModel.page + 1,
        limit: paginationModel.pageSize,
        search: debouncedSearch,
    });
    const roles = res?.data?.data ?? [];
    const totalRoles = res?.data?.total ?? 0;
    const [deleteRole] = useDeleteRoleMutation();

    useEffect(() => {
        setPaginationModel((prev) => ({ ...prev, page: 0 }));
    }, [debouncedSearch]);

    // const onDeleteRole = async (id: string) => {
    //     try {
    //         const res = await deleteRole({ id }).unwrap();
    //         if (res?.http_status_code === 200 || res?.http_status_code === 201) {
    //             toast.success(res?.message ?? 'Role deleted successfully');
    //             dispatch(closeModal());
    //         }
    //     } catch (error) {
    //         console.error('Error deleting role', error);
    //     }
    // }
    
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
            headerName: 'Role',
            minWidth: 200,
            flex: 1,
            sortable: false,
            renderCell: (params) => (
                <div className="flex items-center gap-2 whitespace-nowrap">
                    <Shield className="h-4 w-4 text-primary shrink-0" />
                    <span className="font-medium text-sm">{params.value}</span>
                </div>
            ),
        },
        {
            field: 'description',
            headerName: 'Description',
            flex: 1,
            minWidth: 200,
            sortable: false,
            renderCell: (params) => (
                <p className="text-sm text-muted-foreground whitespace-nowrap">
                    {params.value}
                </p>
            ),
        },
        {
            field: 'permissions',
            headerName: 'Permissions',
            width: 100,
            sortable: false,
            valueGetter: (value: string[]) => value?.length ?? 0,
            renderCell: (params) => (
                <span className="text-sm font-medium">{params.value}</span>
            ),
        },
        {
            field: 'number_of_users',
            headerName: 'Assigned',
            width: 100,
            sortable: false,
            renderCell: (params) => (
                <span className="text-sm font-medium">{params.value}</span>
            ),
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 150,
            sortable: false,
            renderCell: (params) => (
                <div className='action_buttons'>
                    <button
                        className="edit_button"
                        onClick={() => dispatch(openModal({ componentName: 'AddEditRoleModal', data: { role: params.row, isEdit: true } }))}
                    >
                        <Edit2 className="h-4 w-4" />
                    </button>
                    {/* <button
                        className="delete_button"
                        onClick={() => dispatch(openModal({
                            componentName: 'DeleteConfirmation',
                            data: {
                                itemName: params.row.name,
                                onDelete: () => onDeleteRole(params.row._id),
                            },
                        }))}
                    >
                        <Trash2 className="h-4 w-4" />
                    </button> */}
                </div>
            ),
        },
    ]

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-3">
                <AdminSearchInput
                    placeholder="Search roles..."
                    value={search}
                    onChange={setSearch}
                />
                <Button
                    color="primary"
                    className="rounded-xl"
                    onPress={() => dispatch(openModal({ componentName: 'AddEditRoleModal', data: { role: null } }))}
                    startContent={<Plus className="h-4 w-4" />}
                >
                    Create Role
                </Button>
            </div>

            <div className='border border-gray-200 rounded-md overflow-hidden'>
                <CommonDataTable
                    rows={roles}
                    columns={columns}
                    getRowId={(row) => row._id}
                    loading={isLoading}
                    paginationMode="server"
                    rowCount={totalRoles}
                    paginationModel={paginationModel}
                    onPaginationModelChange={setPaginationModel}
                />
            </div>
        </div>
    );
}
