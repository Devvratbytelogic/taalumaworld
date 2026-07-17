'use client';

import { useState } from 'react';
import { type GridColDef } from '@mui/x-data-grid';
import { Users, UserCheck, Eye, CreditCard, Percent, Search } from 'lucide-react';
import { useGetInstitutionKpisQuery } from '@/store/rtkQueries/institutionApi';
import { AdminStatCard } from '@/components/admin/layout/AdminContent';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useDebounce } from '@/hooks/useDebounce';
import CommonDataTable from '../CommonDataTable';
import moment from 'moment';

export function UsageReportTab() {
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState('');
    const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
    const debouncedSearch = useDebounce(search, 500);

    const { data: response, isLoading, isFetching } = useGetInstitutionKpisQuery({
        page: paginationModel.page + 1,
        limit: paginationModel.pageSize,
        ...(debouncedSearch.trim() ? { search: debouncedSearch.trim() } : {}),
        ...(status ? { status } : {}),
    });

    const summary = response?.data?.summary;
    const institutions = response?.data?.institutions ?? [];
    const totalInstitutions = response?.data?.pagination?.total ?? 0;

    const resetToFirstPage = () => setPaginationModel((prev) => ({ ...prev, page: 0 }));

    const handleSearchChange = (value: string) => {
        setSearch(value);
        resetToFirstPage();
    };

    const handleStatusChange = (value: string) => {
        setStatus(value);
        resetToFirstPage();
    };

    const columns: GridColDef[] = [
        {
            field: 'name',
            headerName: 'Institution',
            flex: 1,
            minWidth: 220,
            sortable: false,
            renderCell: (params) => {
                const initial = String(params.row.name ?? '?').trim().charAt(0).toUpperCase() || '?';
                return (
                    <div className="flex items-center gap-3 py-2 min-w-0">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                            {initial}
                        </div>
                        <div className="min-w-0 leading-tight">
                            <p className="truncate text-sm font-medium text-slate-800" title={params.row.name}>
                                {params.row.name}
                            </p>
                            <Badge
                                variant="outline"
                                className={`mt-1 h-5 gap-1 px-2 text-[11px] font-medium ${params.row.status === 'Active'
                                    ? 'bg-green-50 text-green-700 border-green-200'
                                    : 'bg-amber-50 text-amber-700 border-amber-200'}`}
                            >
                                <span
                                    className={`h-1.5 w-1.5 rounded-full ${params.row.status === 'Active' ? 'bg-green-500' : 'bg-amber-500'}`}
                                />
                                {params.row.status}
                            </Badge>
                        </div>
                    </div>
                );
            },
        },
        {
            field: 'registrations',
            headerName: 'Registrations',
            width: 130,
            sortable: false,
            align: 'right',
            headerAlign: 'right',
            renderCell: (params) => <span className="text-sm font-medium text-slate-700">{params.value}</span>,
        },
        {
            field: 'activeUsers',
            headerName: 'Active Users',
            width: 120,
            sortable: false,
            align: 'right',
            headerAlign: 'right',
            renderCell: (params) => <span className="text-sm font-medium text-slate-700">{params.value}</span>,
        },
        {
            field: 'blueprintViews',
            headerName: 'Blueprint Views',
            width: 140,
            sortable: false,
            align: 'right',
            headerAlign: 'right',
            renderCell: (params) => <span className="text-sm font-medium text-slate-700">{params.value}</span>,
        },
        {
            field: 'conversions',
            headerName: 'Conversions',
            width: 120,
            sortable: false,
            align: 'right',
            headerAlign: 'right',
            renderCell: (params) => <span className="text-sm font-medium text-slate-700">{params.value}</span>,
        },
        {
            field: 'conversionRate',
            headerName: 'Conversion Rate',
            width: 150,
            sortable: false,
            align: 'right',
            headerAlign: 'right',
            renderCell: (params) => (
                <span className={`text-sm font-semibold ${params.value >= 50 ? 'text-green-600' : 'text-slate-700'}`}>
                    {params.value}%
                </span>
            ),
        },
        {
            field: 'promoEnd',
            headerName: 'Promo End',
            width: 130,
            sortable: false,
            renderCell: (params) => (
                <span className="text-sm text-slate-600">
                    {params.value && moment(params.value).isValid() ? moment(params.value).format('DD MMM YYYY') : '—'}
                </span>
            ),
        },
        {
            field: 'daysLeft',
            headerName: 'Days Left',
            width: 110,
            sortable: false,
            align: 'right',
            headerAlign: 'right',
            renderCell: (params) => {
                const days = params.value as number;
                if (days == null) return <span className="text-sm text-slate-400">—</span>;
                if (days < 0) return <span className="text-xs font-semibold text-red-500">Expired</span>;
                const urgent = days <= 7;
                return (
                    <span className={`text-sm font-semibold ${urgent ? 'text-red-500' : 'text-slate-700'}`}>
                        {days}d
                    </span>
                );
            },
        },
    ];

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
                <AdminStatCard label="Total Registrations" value={summary?.totalRegistrations ?? 0} icon={Users} tone="blue" />
                <AdminStatCard label="Active Users" value={summary?.activeUsers ?? 0} icon={UserCheck} tone="green" />
                <AdminStatCard label="Blueprint Views" value={summary?.blueprintViews ?? 0} icon={Eye} tone="purple" />
                <AdminStatCard label="Paid Conversions" value={summary?.paidConversions ?? 0} icon={CreditCard} tone="orange" />
                <AdminStatCard label="Avg. Conversion Rate" value={`${summary?.averageConversionRate ?? 0}%`} icon={Percent} tone="slate" />
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by institution name..."
                        value={search}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <select
                    value={status}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    className="rounded-xl border border-gray-200 px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                    <option value="">All statuses</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                </select>
            </div>

            <div className="border border-gray-200 rounded-md overflow-hidden">
                <CommonDataTable
                    rows={institutions}
                    columns={columns}
                    getRowId={(row) => row.id}
                    loading={isLoading || isFetching}
                    paginationMode="server"
                    rowCount={totalInstitutions}
                    paginationModel={paginationModel}
                    onPaginationModelChange={setPaginationModel}
                />
            </div>
        </div>
    );
}
