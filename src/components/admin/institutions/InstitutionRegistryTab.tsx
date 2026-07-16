'use client';

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Button } from '@heroui/react';
import { type GridColDef } from '@mui/x-data-grid';
import {
    Plus, Search, Edit2, Trash2, RotateCcw, Download, ArrowLeft, ChevronDown, Loader2,
    Building2, CheckCircle2, Ban,
} from 'lucide-react';
import {
    useGetAllInstitutionsQuery,
    useUpdateInstitutionMutation,
    useDeleteInstitutionMutation,
    useRestoreInstitutionMutation,
} from '@/store/rtkQueries/institutionApi';
import { closeModal, openModal } from '@/store/slices/allModalSlice';
import type { IAllInstitutionsDataEntity } from '@/types/institution';
import toast from '@/utils/toast';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useDebounce } from '@/hooks/useDebounce';
import { AdminStatCard } from '@/components/admin/layout/AdminContent';
import CommonDataTable from '../CommonDataTable';
import moment from 'moment';

const STATUS_CONFIG: Record<string, { badge: string; dot: string; label: string }> = {
    Active: {
        badge: 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100',
        dot: 'bg-green-500',
        label: 'Active',
    },
    Inactive: {
        badge: 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100',
        dot: 'bg-amber-500',
        label: 'Inactive',
    },
};

const STATUSES = ['Active', 'Inactive'] as const;

function daysUntil(iso?: string) {
    if (!iso) return null;
    return Math.ceil((new Date(iso).getTime() - Date.now()) / 86_400_000);
}

export function InstitutionRegistryTab() {
    const dispatch = useDispatch();
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState('');
    const [isTrashView, setIsTrashView] = useState(false);
    const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
    const [updatingId, setUpdatingId] = useState<string | null>(null);
    const debouncedSearch = useDebounce(search, 500);

    const { data: response, isLoading } = useGetAllInstitutionsQuery({
        page: paginationModel.page + 1,
        limit: paginationModel.pageSize,
        ...(debouncedSearch.trim() ? { search: debouncedSearch.trim() } : {}),
        ...(status ? { status } : {}),
        ...(isTrashView ? { isDeleted: true } : {}),
    });

    const [updateInstitution] = useUpdateInstitutionMutation();
    const [deleteInstitution] = useDeleteInstitutionMutation();
    const [restoreInstitution] = useRestoreInstitutionMutation();

    const institutions = response?.data?.data ?? [];
    const totalInstitutions = response?.data?.total ?? 0;
    const totalActive = response?.data?.active ?? 0;
    const totalInactive = response?.data?.inactive ?? 0;

    const resetToFirstPage = () => setPaginationModel((prev) => ({ ...prev, page: 0 }));

    const handleSearchChange = (value: string) => {
        setSearch(value);
        resetToFirstPage();
    };

    const handleStatusChange = (value: string) => {
        setStatus(value);
        resetToFirstPage();
    };

    const handleToggleTrash = () => {
        setIsTrashView((prev) => !prev);
        resetToFirstPage();
    };

    const handleExportCSV = () => {
        const rows = [
            ['Institution', 'Contact Email', 'Domains', 'Status', 'Promo End'],
            ...institutions.map((inst) => [
                inst.name,
                inst.contact_email,
                (inst.domains ?? []).join(' | '),
                inst.status,
                inst.promo_end && moment(inst.promo_end).isValid()
                    ? moment(inst.promo_end).format('DD MMM YYYY')
                    : '—',
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

    const onInstitutionStatusChange = async (institution: IAllInstitutionsDataEntity, newStatus: string) => {
        const id = institution._id;
        if (!id || newStatus === institution.status || updatingId) return;

        setUpdatingId(id);
        try {
            const res = await updateInstitution({ id, values: { status: newStatus } }).unwrap();
            if (res?.http_status_code === 200 || res?.http_status_code === 201) {
                toast.success(res.message ?? (newStatus === 'Inactive' ? 'Institution deactivated' : 'Institution activated'));
            }
        } catch {
            console.error('Failed to update institution status');
        } finally {
            setUpdatingId(null);
        }
    };

    const onDeleteInstitution = async (id: string) => {
        try {
            const res = await deleteInstitution({ id }).unwrap();
            if (res?.http_status_code === 200 || res?.http_status_code === 201) {
                toast.success(res.message ?? 'Institution deleted successfully');
                dispatch(closeModal());
            }
        } catch {
            console.error('Failed to delete institution');
        }
    };

    const onRestoreInstitution = async (id: string) => {
        try {
            const res = await restoreInstitution({ id }).unwrap();
            if (res?.http_status_code === 200 || res?.http_status_code === 201) {
                toast.success(res.message ?? 'Institution restored successfully');
                dispatch(closeModal());
            }
        } catch {
            console.error('Failed to restore institution');
        }
    };

    

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
            headerName: 'Institution',
            flex: 1,
            minWidth: 200,
            sortable: false,
            renderCell: (params) => (
                <div>
                    <p className="font-medium text-sm">{params.row.name}</p>
                    <p className="text-xs text-muted-foreground">{params.row.contact_email}</p>
                </div>
            ),
        },
        {
            field: 'domains',
            headerName: 'Email Domains',
            width: 180,
            sortable: false,
            renderCell: (params) => (
                <div className="flex flex-col gap-0.5">
                    {(params.row.domains ?? []).map((domain: string) => (
                        <code key={domain} className="text-xs bg-gray-100 px-1.5 py-0.5 rounded">
                            {domain}
                        </code>
                    ))}
                </div>
            ),
        },
        {
            field: 'status',
            headerName: 'Status',
            width: 150,
            sortable: false,
            renderCell: (params) => {
                const institution = params.row;
                const config = STATUS_CONFIG[institution.status] ?? STATUS_CONFIG.Active;

                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild disabled={!!updatingId}>
                            <button type="button" className="focus:outline-none">
                                <Badge
                                    variant="outline"
                                    className={`cursor-pointer select-none transition-colors flex items-center gap-1.5 ${config.badge}`}
                                >
                                    {updatingId === institution._id ? (
                                        <Loader2 className="h-3 w-3 animate-spin" />
                                    ) : (
                                        <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
                                    )}
                                    {config.label}
                                    <ChevronDown className="h-3 w-3 opacity-60" />
                                </Badge>
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-40">
                            <DropdownMenuLabel className="text-xs text-muted-foreground font-normal">
                                Change status
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {STATUSES.map((s) => (
                                <DropdownMenuItem
                                    key={s}
                                    onSelect={() => onInstitutionStatusChange(institution, s)}
                                    className="flex items-center gap-2"
                                    disabled={institution.status === s}
                                >
                                    <span className={`h-2 w-2 rounded-full ${STATUS_CONFIG[s]?.dot}`} />
                                    {STATUS_CONFIG[s]?.label}
                                    {institution?.status === s ? (
                                        <span className="ml-auto text-xs text-muted-foreground">current</span>
                                    ) : null}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
        {
            field: 'promo_end',
            headerName: 'Promo End',
            width: 130,
            sortable: false,
            valueFormatter: (value) =>
                value && moment(value).isValid() ? moment(value).format('DD MMM YYYY') : '—',
        },
        {
            field: 'days_left',
            headerName: 'Days Left',
            width: 100,
            sortable: false,
            renderCell: (params) => {
                const days = daysUntil(params.row.promo_end);
                if (days === null) return '—';
                if (days < 0) return <span className="text-red-500 text-xs font-medium">Expired</span>;
                const urgent = days <= 7;
                return (
                    <span className={`text-sm font-medium ${urgent ? 'text-red-500' : 'text-gray-700'}`}>
                        {days}d
                    </span>
                );
            },
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 100,
            sortable: false,
            renderCell: (params) => (
                <div className="action_buttons">
                    {isTrashView ? (
                        <button
                            type="button"
                            className="active_button"
                            title="Restore institution"
                            onClick={() =>
                                dispatch(
                                    openModal({
                                        componentName: 'RestoreConfirmation',
                                        data: {
                                            itemName: params.row.name,
                                            onRestore: () => onRestoreInstitution(params.row._id),
                                        },
                                    }),
                                )
                            }
                        >
                            <RotateCcw className="h-4 w-4" />
                        </button>
                    ) : (
                        <>
                            <button
                                type="button"
                                className="edit_button"
                                title="Edit institution"
                                onClick={() => dispatch(openModal({
                                    componentName: 'AddEditInstitutionModal',
                                    data: { institution: params.row },
                                }))}
                            >
                                <Edit2 className="h-4 w-4" />
                            </button>
                            <button
                                type="button"
                                className="delete_button"
                                title="Delete institution"
                                onClick={() =>
                                    dispatch(
                                        openModal({
                                            componentName: 'DeleteConfirmation',
                                            data: {
                                                itemName: params.row.name,
                                                onDelete: () => onDeleteInstitution(params.row._id),
                                            },
                                        }),
                                    )
                                }
                            >
                                <Trash2 className="h-4 w-4" />
                            </button>
                        </>
                    )}
                </div>
            ),
        },
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h2 className="text-lg font-semibold text-slate-900">Partner Institutions</h2>
                    <p className="text-sm text-slate-500">Manage registered universities and their access status.</p>
                </div>

                <Button
                    className={`global_btn rounded_full ${isTrashView ? 'outline_primary' : 'danger_outline'}`}
                    onPress={handleToggleTrash}
                    startContent={isTrashView ? <ArrowLeft className="h-4 w-4" /> : <Trash2 className="h-4 w-4" />}
                >
                    {isTrashView ? 'Back to institutions' : 'Trash'}
                </Button>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <AdminStatCard label="Total Partners" value={totalInstitutions} icon={Building2} tone="blue" />
                <AdminStatCard label="Active" value={totalActive} icon={CheckCircle2} tone="green" />
                <AdminStatCard label="Inactive" value={totalInactive} icon={Ban} tone="orange" />
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by name, country or domain..."
                        value={search}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        className="pl-10"
                    />
                </div>
                {!isTrashView && (
                    <select
                        value={status}
                        onChange={(e) => handleStatusChange(e.target.value)}
                        className="rounded-xl border border-gray-200 px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/30"
                    >
                        <option value="">All statuses</option>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                    </select>
                )}
                <button
                    onClick={handleExportCSV}
                    disabled={isLoading || institutions.length === 0}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-primary text-primary text-sm font-medium hover:bg-primary/5 transition-colors disabled:opacity-50 whitespace-nowrap"
                >
                    <Download className="h-4 w-4" /> Export CSV
                </button>
                {!isTrashView && (
                    <Button
                        color="primary"
                        className="rounded-xl"
                        onPress={() => dispatch(openModal({ componentName: 'AddEditInstitutionModal', data: { institution: null } }))}
                        startContent={<Plus className="h-4 w-4" />}
                    >
                        Add Institution
                    </Button>
                )}
            </div>

            <div className="border border-gray-200 rounded-md overflow-hidden">
                <CommonDataTable
                    rows={institutions}
                    columns={columns}
                    getRowId={(row) => row._id}
                    loading={isLoading}
                    paginationMode="server"
                    rowCount={totalInstitutions}
                    paginationModel={paginationModel}
                    onPaginationModelChange={setPaginationModel}
                />
            </div>
        </div>
    );
}
