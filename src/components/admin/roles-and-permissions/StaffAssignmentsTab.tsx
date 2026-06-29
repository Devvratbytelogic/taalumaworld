'use client';

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Button } from '@heroui/react';
import { Plus, Search, MoreVertical, UserCog, Trash2, CheckCircle, AlertCircle } from 'lucide-react';
import {
    useGetAllStaffQuery,
    useGetAllRolesQuery,
} from '@/store/rtkQueries/rolesPermissionsApi';
import { openModal } from '@/store/slices/allModalSlice';
import type { IStaffMember } from '@/types/rolesPermissions';
import { Badge } from '@/components/ui/badge';
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';

function formatDate(iso?: string) {
    if (!iso) return '—';
    return new Date(iso).toLocaleDateString('en-GB', {
        day: '2-digit', month: 'short', year: 'numeric',
    });
}

function StatusBadge({ status }: { status: IStaffMember['status'] }) {
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

function ActionMenu({
    onAssign,
    onDelete,
}: {
    onAssign: () => void;
    onDelete: () => void;
}) {
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
                    <div className="absolute right-0 top-8 z-20 bg-white border border-gray-200 rounded-xl shadow-lg py-1 w-44">
                        <button
                            onClick={() => { setOpen(false); onAssign(); }}
                            className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                            <UserCog className="h-3.5 w-3.5" /> Assign Role
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

export function StaffAssignmentsTab() {
    const dispatch = useDispatch();
    const [search, setSearch] = useState('');
    const { data: staffData, isLoading, isFetching } = useGetAllStaffQuery();
    const { data: rolesData } = useGetAllRolesQuery();

    const staff = staffData?.data ?? [];
    const roles = rolesData?.data ?? [];
    const roleNameMap = Object.fromEntries(roles.map((r) => [r.id, r.name]));

    const loading = isLoading || isFetching;

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by name, email, or role..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <Button
                    color="primary"
                    className="rounded-xl"
                    onPress={() => dispatch(openModal({ componentName: 'AddStaffModal', data: {} }))}
                    startContent={<Plus className="h-4 w-4" />}
                >
                    Add Staff
                </Button>
            </div>

            <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
                <Table className="table-fixed w-full">
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-10 px-4">#</TableHead>
                            <TableHead className="px-4">Staff Member</TableHead>
                            <TableHead className="w-[210px] px-4">Role</TableHead>
                            <TableHead className="w-[120px] px-4">Status</TableHead>
                            <TableHead className="w-[130px] px-4">Last Active</TableHead>
                            <TableHead className="w-12 px-2" />
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading
                            ? Array.from({ length: 5 }).map((_, i) => (
                                <TableRow key={i}>
                                    {Array.from({ length: 6 }).map((__, j) => (
                                        <TableCell key={j} className="px-4 py-3">
                                            <div className="h-4 bg-gray-100 rounded animate-pulse" />
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                            : staff.map((member, idx) => (
                                <TableRow key={member._id}>
                                    <TableCell className="px-4 py-3 text-muted-foreground text-sm align-middle">
                                        {idx + 1}
                                    </TableCell>
                                    <TableCell className="px-4 py-3 align-middle whitespace-normal">
                                        <p className="font-medium text-sm text-gray-900">{member.name}</p>
                                        <p className="text-xs text-muted-foreground mt-0.5 break-all">{member.email}</p>
                                    </TableCell>
                                    <TableCell className="px-4 py-3 align-middle">
                                        <Badge variant="secondary" className="whitespace-nowrap">
                                            {roleNameMap[member.role] ?? member.role}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="px-4 py-3 align-middle">
                                        <StatusBadge status={member.status} />
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-sm text-muted-foreground align-middle whitespace-nowrap">
                                        {formatDate(member.last_active)}
                                    </TableCell>
                                    <TableCell className="px-2 py-3 align-middle">
                                        <ActionMenu
                                            onAssign={() => dispatch(openModal({ componentName: 'AssignStaffRoleModal', data: { staff: member } }))}
                                            onDelete={() => {}}
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>

                {!loading && staff.length === 0 && (
                    <div className="p-12 text-center">
                        <p className="text-sm text-muted-foreground">
                            Click &quot;Add Staff&quot; to assign a role to a new team member.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
