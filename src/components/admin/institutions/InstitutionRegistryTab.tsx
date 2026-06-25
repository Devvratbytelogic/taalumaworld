'use client';

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Button } from '@heroui/react';
import {
    Plus, Search, MoreVertical, CheckCircle, AlertCircle,
    XCircle, Edit2, Pause, Play, Trash2, Download,
} from 'lucide-react';
import {
    useGetAllInstitutionsQuery,
    useSuspendInstitutionMutation,
    useRestoreInstitutionMutation,
    useTerminateInstitutionMutation,
    useDeleteInstitutionMutation,
} from '@/store/rtkQueries/institutionApi';
import { openModal } from '@/store/slices/allModalSlice';
import type { IInstitution } from '@/types/institution';
import toast from '@/utils/toast';
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

function daysUntil(iso?: string) {
    if (!iso) return null;
    const diff = Math.ceil((new Date(iso).getTime() - Date.now()) / 86_400_000);
    return diff;
}

function StatusBadge({ status }: { status: IInstitution['status'] }) {
    if (status === 'active')
        return (
            <Badge className="bg-green-100 text-green-700 border-green-200 gap-1 capitalize">
                <CheckCircle className="h-3 w-3" /> Active
            </Badge>
        );
    if (status === 'suspended')
        return (
            <Badge className="bg-amber-100 text-amber-700 border-amber-200 gap-1 capitalize">
                <AlertCircle className="h-3 w-3" /> Suspended
            </Badge>
        );
    return (
        <Badge variant="secondary" className="gap-1 capitalize">
            <XCircle className="h-3 w-3" /> Terminated
        </Badge>
    );
}

interface ActionMenuProps {
    institution: IInstitution;
    onEdit: () => void;
    onSuspend: () => void;
    onRestore: () => void;
    onTerminate: () => void;
    onDelete: () => void;
}

function ActionMenu({ institution, onEdit, onSuspend, onRestore, onTerminate, onDelete }: ActionMenuProps) {
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
                            onClick={() => { setOpen(false); onEdit(); }}
                            className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                            <Edit2 className="h-3.5 w-3.5" /> Edit
                        </button>
                        {institution.status === 'active' && (
                            <button
                                onClick={() => { setOpen(false); onSuspend(); }}
                                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-amber-600 hover:bg-amber-50"
                            >
                                <Pause className="h-3.5 w-3.5" /> Suspend
                            </button>
                        )}
                        {institution.status === 'suspended' && (
                            <button
                                onClick={() => { setOpen(false); onRestore(); }}
                                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-green-600 hover:bg-green-50"
                            >
                                <Play className="h-3.5 w-3.5" /> Restore
                            </button>
                        )}
                        {institution.status !== 'terminated' && (
                            <button
                                onClick={() => { setOpen(false); onTerminate(); }}
                                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-orange-600 hover:bg-orange-50"
                            >
                                <XCircle className="h-3.5 w-3.5" /> Terminate
                            </button>
                        )}
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

export function InstitutionRegistryTab() {
    const dispatch = useDispatch();
    const [search, setSearch] = useState('');

    const { data, isLoading, isFetching } = useGetAllInstitutionsQuery();
    const [suspendInstitution] = useSuspendInstitutionMutation();
    const [restoreInstitution] = useRestoreInstitutionMutation();
    const [terminateInstitution] = useTerminateInstitutionMutation();
    const [deleteInstitution] = useDeleteInstitutionMutation();

    const institutions: IInstitution[] = data?.data ?? [];
    const q = search.toLowerCase();
    const filtered = institutions.filter(
        (i) =>
            i.name.toLowerCase().includes(q) ||
            i.country.toLowerCase().includes(q) ||
            i.email_domains.some((d) => d.domain.toLowerCase().includes(q))
    );

    const handleExportCSV = () => {
        const rows = [
            ['Institution', 'Country', 'Domains', 'Status', 'Promo Start', 'Promo End', 'Registrations', 'Active Users'],
            ...filtered.map((i) => [
                i.name,
                i.country,
                i.email_domains.map((d) => d.domain).join(' | '),
                i.status,
                formatDate(i.promotional_access?.start_date),
                formatDate(i.promotional_access?.end_date),
                String(i.total_registrations ?? 0),
                String(i.active_users ?? 0),
            ]),
        ];
        const csv = rows.map((r) => r.map((v) => `"${v}"`).join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'institutions.csv';
        a.click();
        URL.revokeObjectURL(url);
    };

    const loading = isLoading || isFetching;
    const activeCount = institutions.filter((i) => i.status === 'active').length;

    return (
        <div className="space-y-6">
            {/* Stats bar */}
            <div className="flex flex-wrap gap-4">
                <div className="bg-accent rounded-2xl px-5 py-3 text-center">
                    <p className="text-2xl font-bold text-primary">{institutions.length}</p>
                    <p className="text-xs text-muted-foreground">Total Partners</p>
                </div>
                <div className="bg-green-50 rounded-2xl px-5 py-3 text-center">
                    <p className="text-2xl font-bold text-green-600">{activeCount}</p>
                    <p className="text-xs text-muted-foreground">Active</p>
                </div>
                <div className="bg-amber-50 rounded-2xl px-5 py-3 text-center">
                    <p className="text-2xl font-bold text-amber-600">
                        {institutions.filter((i) => i.status === 'suspended').length}
                    </p>
                    <p className="text-xs text-muted-foreground">Suspended</p>
                </div>
            </div>

            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by name, country or domain..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <button
                    onClick={handleExportCSV}
                    disabled={loading || filtered.length === 0}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-primary text-primary text-sm font-medium hover:bg-primary/5 transition-colors disabled:opacity-50 whitespace-nowrap"
                >
                    <Download className="h-4 w-4" /> Export CSV
                </button>
                <Button
                    color="primary"
                    className="rounded-xl"
                    onPress={() => dispatch(openModal({ componentName: 'AddEditInstitutionModal', data: { institution: null } }))}
                    startContent={<Plus className="h-4 w-4" />}
                >
                    Add Institution
                </Button>
            </div>

            {/* Table */}
            <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-8">#</TableHead>
                            <TableHead>Institution</TableHead>
                            <TableHead>Email Domains</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="whitespace-nowrap">Promo End</TableHead>
                            <TableHead className="whitespace-nowrap">Days Left</TableHead>
                            <TableHead className="text-right">Registrations</TableHead>
                            <TableHead className="w-10" />
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading
                            ? Array.from({ length: 5 }).map((_, i) => (
                                <TableRow key={i}>
                                    {Array.from({ length: 8 }).map((__, j) => (
                                        <TableCell key={j}>
                                            <div className="h-4 bg-gray-100 rounded animate-pulse" />
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                            : filtered.map((inst, idx) => {
                                const days = daysUntil(inst.promotional_access?.end_date);
                                const urgent = days !== null && days <= 7 && days >= 0;
                                return (
                                    <TableRow key={inst._id}>
                                        <TableCell className="text-muted-foreground text-sm">
                                            {idx + 1}
                                        </TableCell>
                                        <TableCell>
                                            <div>
                                                <p className="font-medium text-sm">{inst.name}</p>
                                                <p className="text-xs text-muted-foreground">{inst.country}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col gap-0.5">
                                                {inst.email_domains.map((d) => (
                                                    <code
                                                        key={d.domain}
                                                        className="text-xs bg-gray-100 px-1.5 py-0.5 rounded"
                                                    >
                                                        @{d.domain}
                                                    </code>
                                                ))}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <StatusBadge status={inst.status} />
                                        </TableCell>
                                        <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                                            {formatDate(inst.promotional_access?.end_date)}
                                        </TableCell>
                                        <TableCell>
                                            {days === null ? (
                                                <span className="text-muted-foreground text-sm">—</span>
                                            ) : days < 0 ? (
                                                <span className="text-red-500 text-xs font-medium">Expired</span>
                                            ) : (
                                                <span
                                                    className={`text-sm font-medium ${urgent ? 'text-red-500' : 'text-gray-700'}`}
                                                >
                                                    {days}d
                                                </span>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right font-medium text-sm">
                                            {inst.total_registrations ?? 0}
                                        </TableCell>
                                        <TableCell>
                                        <ActionMenu
                                            institution={inst}
                                            onEdit={() => dispatch(openModal({ componentName: 'AddEditInstitutionModal', data: { institution: inst } }))}
                                                onSuspend={async () => {
                                                    try {
                                                        await suspendInstitution({ id: inst._id }).unwrap();
                                                        toast.success('Institution suspended');
                                                    } catch { /* handled */ }
                                                }}
                                                onRestore={async () => {
                                                    try {
                                                        await restoreInstitution({ id: inst._id }).unwrap();
                                                        toast.success('Institution restored');
                                                    } catch { /* handled */ }
                                                }}
                                                onTerminate={async () => {
                                                    if (!confirm(`Terminate partnership with ${inst.name}?`)) return;
                                                    try {
                                                        await terminateInstitution({ id: inst._id }).unwrap();
                                                        toast.success('Institution terminated');
                                                    } catch { /* handled */ }
                                                }}
                                                onDelete={async () => {
                                                    if (!confirm(`Permanently delete ${inst.name}? This cannot be undone.`)) return;
                                                    try {
                                                        await deleteInstitution({ id: inst._id }).unwrap();
                                                        toast.success('Institution deleted');
                                                    } catch { /* handled */ }
                                                }}
                                            />
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                    </TableBody>
                </Table>

                {!loading && filtered.length === 0 && (
                    <div className="p-12 text-center space-y-3">
                        <div className="mx-auto w-14 h-14 bg-accent rounded-full flex items-center justify-center">
                            <CheckCircle className="h-7 w-7 text-primary" />
                        </div>
                        <p className="font-semibold text-gray-800">No institutions found</p>
                        <p className="text-sm text-muted-foreground">
                            {search ? 'Try a different search term.' : 'Click "Add Institution" to register your first partner.'}
                        </p>
                    </div>
                )}
            </div>

        </div>
    );
}
