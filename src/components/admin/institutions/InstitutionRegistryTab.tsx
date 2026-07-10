'use client';

import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Button } from '@heroui/react';
import { type GridColDef } from '@mui/x-data-grid';
import {
    Plus, Search, CheckCircle, AlertCircle,
    XCircle, Edit2, Pause, Play, Trash2, Download,
} from 'lucide-react';
import {
    useGetAllInstitutionsQuery,
    useSuspendInstitutionMutation,
    useRestoreInstitutionMutation,
    useDeleteInstitutionMutation,
} from '@/store/rtkQueries/institutionApi';
import { openModal } from '@/store/slices/allModalSlice';
import type { IInstitution } from '@/types/institution';
import toast from '@/utils/toast';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useDebounce } from '@/hooks/useDebounce';
import CommonDataTable from '../CommonDataTable';
import moment from 'moment';

function daysUntil(iso?: string) {
    if (!iso) return null;
    return Math.ceil((new Date(iso).getTime() - Date.now()) / 86_400_000);
}

function StatusBadge({ status }: { status: string }) {
    if (status === 'active') {
        return (
            <Badge className="bg-green-100 text-green-700 border-green-200 gap-1 capitalize whitespace-nowrap">
                <CheckCircle className="h-3 w-3 shrink-0" /> Active
            </Badge>
        );
    }
    if (status === 'suspended') {
        return (
            <Badge className="bg-amber-100 text-amber-700 border-amber-200 gap-1 capitalize whitespace-nowrap">
                <AlertCircle className="h-3 w-3 shrink-0" /> Suspended
            </Badge>
        );
    }
    return (
        <Badge variant="secondary" className="gap-1 capitalize whitespace-nowrap">
            <XCircle className="h-3 w-3 shrink-0" /> {status}
        </Badge>
    );
}

export function InstitutionRegistryTab() {
    const dispatch = useDispatch();
    const [search, setSearch] = useState('');
    const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
    const [status, setStatus] = useState('');
    const [isDeleted, setIsDeleted] = useState(false);
    const debouncedSearch = useDebounce(search, 500);

    const { data: response, isLoading } = useGetAllInstitutionsQuery({
        search: debouncedSearch,
        status,
        page: paginationModel.page + 1,
        limit: paginationModel.pageSize,
        isDeleted,
    });

    const [suspendInstitution] = useSuspendInstitutionMutation();
    const [restoreInstitution] = useRestoreInstitutionMutation();
    const [deleteInstitution] = useDeleteInstitutionMutation();

    const institutions = response?.data?.data ?? [];
    const totalInstitutions = response?.data?.total ?? 0;

    useEffect(() => {
        setPaginationModel((prev) => ({ ...prev, page: 0 }));
    }, [debouncedSearch, status, isDeleted]);

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

    const activeCount = institutions.filter((i) => i.status === 'active').length;

    const columns: GridColDef<IInstitution>[] = [
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
                    {(params.row.domains ?? []).map((domain) => (
                        <code key={domain} className="text-xs bg-gray-100 px-1.5 py-0.5 rounded">
                            @{domain}
                        </code>
                    ))}
                </div>
            ),
        },
        {
            field: 'status',
            headerName: 'Status',
            width: 130,
            sortable: false,
            renderCell: (params) => <StatusBadge status={params.value} />,
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
            width: 140,
            sortable: false,
            renderCell: (params) => (
                <div className="action_buttons">
                    <button
                        className="edit_button"
                        onClick={() => dispatch(openModal({
                            componentName: 'AddEditInstitutionModal',
                            data: { institution: params.row },
                        }))}
                    >
                        <Edit2 className="h-4 w-4" />
                    </button>
                    {params.row.status === 'active' ? (
                        <button
                            className="delete_button"
                            title="Suspend institution"
                            onClick={async () => {
                                try {
                                    await suspendInstitution({ id: params.row._id }).unwrap();
                                    toast.success('Institution suspended');
                                } catch {
                                    toast.error('Failed to suspend institution');
                                }
                            }}
                        >
                            <Pause className="h-4 w-4" />
                        </button>
                    ) : (
                        <button
                            className="active_button"
                            title="Restore institution"
                            onClick={async () => {
                                try {
                                    await restoreInstitution({ id: params.row._id }).unwrap();
                                    toast.success('Institution restored');
                                } catch {
                                    toast.error('Failed to restore institution');
                                }
                            }}
                        >
                            <Play className="h-4 w-4" />
                        </button>
                    )}
                    <button
                        className="delete_button"
                        title="Delete institution"
                        onClick={async () => {
                            if (!confirm(`Permanently delete ${params.row.name}? This cannot be undone.`)) return;
                            try {
                                await deleteInstitution({ id: params.row._id }).unwrap();
                                toast.success('Institution deleted');
                            } catch {
                                toast.error('Failed to delete institution');
                            }
                        }}
                    >
                        <Trash2 className="h-4 w-4" />
                    </button>
                </div>
            ),
        },
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap gap-4">
                <div className="bg-accent rounded-2xl px-5 py-3 text-center">
                    <p className="text-2xl font-bold text-primary">{totalInstitutions}</p>
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
                    disabled={isLoading || institutions.length === 0}
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
