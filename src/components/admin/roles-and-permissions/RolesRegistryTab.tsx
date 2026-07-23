'use client';

import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { type GridColDef } from '@mui/x-data-grid';
import { Plus, Edit2, Shield } from 'lucide-react';
import { useGetAllRolesQuery } from '@/store/rtkQueries/rolesPermissionsApi';
import { openModal } from '@/store/slices/allModalSlice';
import { AdminSearchInput, AdminSearchPanel } from '@/components/admin/layout/AdminContent';
import Button from '@/components/ui/Button';
import { USER_TYPE } from '@/constants/common';
import { useDebounce } from '@/hooks/useDebounce';
import { cn } from '@/components/ui/utils';
import CommonDataTable from '../CommonDataTable';

const PROTECTED_ROLE_NAMES = new Set<string>(Object.values(USER_TYPE));

function isProtectedRole(name?: string | null) {
    return PROTECTED_ROLE_NAMES.has(String(name ?? '').trim());
}

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

    useEffect(() => {
        setPaginationModel((prev) => ({ ...prev, page: 0 }));
    }, [debouncedSearch]);

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
            minWidth: 250,
            flex: 1.5,
            sortable: false,
            renderCell: (params) => {
                const protectedRole = isProtectedRole(params.row.name);
                return (
                    <div className="flex items-center gap-2 whitespace-nowrap">
                        <Shield className="h-4 w-4 shrink-0 text-primary" />
                        <span className="text-sm font-medium">{params.value}</span>
                        {protectedRole ? (
                            <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-slate-500">
                                System
                            </span>
                        ) : null}
                    </div>
                );
            },
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
        // {
        //     field: 'permissions',
        //     headerName: 'Permissions',
        //     width: 100,
        //     sortable: false,
        //     valueGetter: (value: string[]) => value?.length ?? 0,
        //     renderCell: (params) => (
        //         <span className="text-sm font-medium">{params.value}</span>
        //     ),
        // },
        {
            field: 'number_of_users',
            headerName: 'Number of Users',
            width: 100,
            flex: 1,
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
            renderCell: (params) => {
                const protectedRole = isProtectedRole(params.row.name);
                return (
                    <div className="action_buttons">
                        <button
                            type="button"
                            className={cn('edit_button', protectedRole && 'pointer-events-none opacity-40')}
                            title={protectedRole ? 'System roles cannot be edited' : 'Edit role'}
                            disabled={protectedRole}
                            onClick={() => {
                                if (protectedRole) return;
                                dispatch(openModal({
                                    componentName: 'AddEditRoleModal',
                                    data: { role: params.row, isEdit: true },
                                }));
                            }}
                        >
                            <Edit2 className="h-4 w-4" />
                        </button>
                    </div>
                );
            },
        },
    ];

    return (
        <div className="space-y-6">
            <AdminSearchPanel>
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
                    <AdminSearchInput
                        placeholder="Search roles..."
                        value={search}
                        onChange={setSearch}
                    />
                    <Button
                        className="global_btn rounded_full bg_primary lg:shrink-0"
                        onPress={() => dispatch(openModal({ componentName: 'AddEditRoleModal', data: { role: null } }))}
                        startContent={<Plus className="h-4 w-4" />}
                    >
                        Create Role
                    </Button>
                </div>
            </AdminSearchPanel>

            <div className="overflow-hidden rounded-md border border-gray-200">
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
