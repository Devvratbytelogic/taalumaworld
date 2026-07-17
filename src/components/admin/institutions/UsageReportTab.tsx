'use client';

import { useState } from 'react';
import { type GridColDef } from '@mui/x-data-grid';
import { Users, UserCheck, Eye, CreditCard, Percent, Download, Search } from 'lucide-react';
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

    const handleExportCSV = () => {
        const rows = [
            ['Institution', 'Status', 'Registrations', 'Active Users', 'Blueprint Views', 'Conversions', 'Conversion Rate', 'Promo End', 'Days Left'],
            ...institutions.map((inst) => [
                inst.name,
                inst.status,
                inst.registrations,
                inst.activeUsers,
                inst.blueprintViews,
                inst.conversions,
                `${inst.conversionRate}%`,
                inst.promoEnd && moment(inst.promoEnd).isValid() ? moment(inst.promoEnd).format('DD MMM YYYY') : '—',
                inst.daysLeft,
            ]),
        ];
        const csv = rows.map((r) => r.map((v) => `"${v}"`).join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'institution-usage-report.csv';
        a.click();
        URL.revokeObjectURL(url);
    };

    const columns: GridColDef[] = [
        {
            field: 'name',
            headerName: 'Institution',
            flex: 1,
            minWidth: 200,
            sortable: false,
            renderCell: (params) => (
                <div>
                    <p className="font-medium text-sm">{params.row.name}</p>
                    <Badge
                        variant="outline"
                        className={params.row.status === 'Active'
                            ? 'bg-green-50 text-green-700 border-green-200 mt-0.5'
                            : 'bg-amber-50 text-amber-700 border-amber-200 mt-0.5'}
                    >
                        {params.row.status}
                    </Badge>
                </div>
            ),
        },
        {
            field: 'registrations',
            headerName: 'Registrations',
            width: 130,
            sortable: false,
            renderCell: (params) => <span className="text-sm font-medium">{params.value}</span>,
        },
        {
            field: 'activeUsers',
            headerName: 'Active Users',
            width: 120,
            sortable: false,
            renderCell: (params) => <span className="text-sm font-medium">{params.value}</span>,
        },
        {
            field: 'blueprintViews',
            headerName: 'Blueprint Views',
            width: 140,
            sortable: false,
            renderCell: (params) => <span className="text-sm font-medium">{params.value}</span>,
        },
        {
            field: 'conversions',
            headerName: 'Conversions',
            width: 120,
            sortable: false,
            renderCell: (params) => <span className="text-sm font-medium">{params.value}</span>,
        },
        {
            field: 'conversionRate',
            headerName: 'Conversion Rate',
            width: 140,
            sortable: false,
            renderCell: (params) => <span className="text-sm font-medium">{params.value}%</span>,
        },
        {
            field: 'promoEnd',
            headerName: 'Promo End',
            width: 130,
            sortable: false,
            valueFormatter: (value) =>
                value && moment(value).isValid() ? moment(value).format('DD MMM YYYY') : '—',
        },
        {
            field: 'daysLeft',
            headerName: 'Days Left',
            width: 100,
            sortable: false,
            renderCell: (params) => {
                const days = params.value as number;
                if (days == null) return '—';
                if (days < 0) return <span className="text-red-500 text-xs font-medium">Expired</span>;
                const urgent = days <= 7;
                return (
                    <span className={`text-sm font-medium ${urgent ? 'text-red-500' : 'text-gray-700'}`}>
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
                <button
                    type="button"
                    onClick={handleExportCSV}
                    disabled={isLoading || institutions.length === 0}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-primary text-primary text-sm font-medium hover:bg-primary/5 transition-colors disabled:opacity-50 whitespace-nowrap"
                >
                    <Download className="h-4 w-4" /> Export CSV
                </button>
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
