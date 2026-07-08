'use client';

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Button } from '@heroui/react';
import { Plus, MoreVertical, Edit2, Trash2, Shield, Lock } from 'lucide-react';
import {
    useGetAllRolesQuery,
} from '@/store/rtkQueries/rolesPermissionsApi';
import { openModal } from '@/store/slices/allModalSlice';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from '@/components/ui/table';
import { AdminSearchInput, AdminStatCard, AdminTableShell } from '@/components/admin/layout/AdminContent';
import { useDebounce } from '@/hooks/useDebounce';

function ActionMenu({ onEdit, onDelete }: { onEdit: () => void; onDelete: () => void }) {
    const [open, setOpen] = useState(false);
    return (
        <div className="relative">
            <button
                onClick={() => setOpen((p) => !p)}
                className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            >
                <MoreVertical className="h-4 w-4 text-gray-500" />
            </button>
            {open && (
                <>
                    <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
                    <div className="absolute right-0 top-8 z-20 bg-white border border-gray-200 rounded-xl shadow-lg py-1 w-40">
                        <button
                            onClick={() => { setOpen(false); onEdit(); }}
                            className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                            <Edit2 className="h-3.5 w-3.5" /> Edit
                        </button>
                        <hr className="my-1 border-gray-100" />
                        <button
                            onClick={() => { setOpen(false); onDelete(); }}
                            className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                            <Trash2 className="h-3.5 w-3.5" /> Delete
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}


export function RolesRegistryTab() {
    const dispatch = useDispatch();
    const [search, setSearch] = useState('');
    const debouncedSearch = useDebounce(search, 500);
    const { data: res, isLoading } = useGetAllRolesQuery({ page: 1, limit: 10, search: debouncedSearch });
    const roles = res?.data?.data ?? [];
    const totalRoles = res?.data?.total ?? 0;

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

            <AdminTableShell>
                <Table className="table-fixed">
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-10 px-4">#</TableHead>
                            <TableHead className="w-[200px] px-4">Role</TableHead>
                            <TableHead className="px-4">Description</TableHead>
                            <TableHead className="w-[100px] px-4 text-right">Permissions</TableHead>
                            <TableHead className="w-[90px] px-4 text-right">Assigned</TableHead>
                            <TableHead className="w-12 px-2">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading
                            ? Array.from({ length: 4 }).map((_, i) => (
                                <TableRow key={i}>
                                    {Array.from({ length: 7 }).map((__, j) => (
                                        <TableCell key={j} className="px-4 py-3">
                                            <div className="h-4 bg-gray-100 rounded animate-pulse" />
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                            : roles.map((role, index) => (
                                <TableRow key={index}>
                                    <TableCell className="px-4 py-3 text-muted-foreground text-sm align-top">
                                        {index + 1}
                                    </TableCell>
                                    <TableCell className="px-4 py-3 align-top whitespace-normal">
                                        <div className="flex items-start gap-2">
                                            <Shield className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                                            <div className="min-w-0">
                                                <p className="font-medium text-sm">{role?.name}</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-4 py-3 align-top whitespace-normal">
                                        <p className="text-sm text-muted-foreground leading-relaxed">
                                            {role.description}
                                        </p>
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-center text-sm font-medium align-top">
                                        {role?.permissions?.length}
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-center text-sm font-medium align-top">
                                        {role?.number_of_users}
                                    </TableCell>
                                    <TableCell className="px-2 py-3 align-top">
                                        <ActionMenu
                                            onEdit={() => dispatch(openModal({ componentName: 'AddEditRoleModal', data: { role } }))}
                                            onDelete={() => { }}
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>

                {!isLoading && roles.length === 0 && (
                    <div className="p-12 text-center space-y-3">
                        <Shield className="h-10 w-10 text-primary mx-auto opacity-50" />
                        <p className="font-semibold text-gray-800">No roles found</p>
                        <p className="text-sm text-muted-foreground">
                            Click &quot;Create Role&quot; to add a custom role.
                        </p>
                    </div>
                )}
            </AdminTableShell>
        </div>
    );
}
