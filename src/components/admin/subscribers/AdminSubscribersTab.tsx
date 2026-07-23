'use client';

import { useState } from 'react';
import { Users, CheckCircle, XCircle, X } from 'lucide-react';
import { type GridColDef } from '@mui/x-data-grid';
import { useGetAllSubscribersQuery } from '@/store/rtkQueries/adminGetApi';
import type { SubscriberEntry } from '@/types/subscribers';
import { Badge } from '@/components/ui/badge';
import CommonDataTable from '@/components/admin/CommonDataTable';
import {
    AdminPageHeader,
    AdminSearchPanel,
    AdminSearchInput,
    AdminStatCard,
    adminFilterPillClass,
    adminSelectClass,
} from '@/components/admin/layout/AdminContent';
import { useDebounce } from '@/hooks/useDebounce';

const STATUS_OPTIONS = ['Active', 'Inactive'];

function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
}

export function AdminSubscribersTab() {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
    const debouncedSearch = useDebounce(searchQuery, 500);
    const queryParams = {
        page: paginationModel.page + 1,
        limit: paginationModel.pageSize,
        ...(debouncedSearch.trim() ? { search: debouncedSearch.trim() } : {}),
        ...(statusFilter ? { status: statusFilter } : {}),
    };
    const { data, isLoading, isFetching } = useGetAllSubscribersQuery(queryParams);

    const listData = data?.data;
    const subscribers = listData?.data ?? [];
    const totalSubscribers = listData?.total ?? 0;
    const loading = isLoading || isFetching;

    const hasActiveFilters = !!statusFilter;

    const resetToFirstPage = () => setPaginationModel((prev) => ({ ...prev, page: 0 }));

    const handleSearchChange = (value: string) => {
        setSearchQuery(value);
        resetToFirstPage();
    };

    const handleStatusChange = (value: string) => {
        setStatusFilter(value);
        resetToFirstPage();
    };

    const columns: GridColDef<SubscriberEntry>[] = [
        {
            field: 'email',
            headerName: 'Email',
            minWidth: 220,
            flex: 1,
            sortable: false,
            renderCell: (params) => (
                <a
                    href={`mailto:${params.row.email}`}
                    className="text-primary hover:underline truncate"
                >
                    {params.row.email}
                </a>
            ),
        },
        {
            field: 'status',
            headerName: 'Status',
            width: 130,
            sortable: false,
            renderCell: (params) => (
                params.row.status ? (
                    <Badge className="bg-green-100 text-green-700 border-green-200 gap-1">
                        <CheckCircle className="h-3 w-3" />
                        Active
                    </Badge>
                ) : (
                    <Badge variant="secondary" className="gap-1">
                        <XCircle className="h-3 w-3" />
                        Inactive
                    </Badge>
                )
            ),
        },
        {
            field: 'date_of_subscription',
            headerName: 'Subscribed On',
            minWidth: 160,
            sortable: false,
            renderCell: (params) => (
                <p className="text-sm text-muted-foreground whitespace-nowrap">
                    {params.row.date_of_subscription}
                </p>
            ),
        },
        {
            field: 'createdAt',
            headerName: 'Joining Date',
            minWidth: 140,
            sortable: false,
            renderCell: (params) => (
                <p className="text-sm text-muted-foreground whitespace-nowrap">
                    {formatDate(params.row.createdAt)}
                </p>
            ),
        },
    ];

    return (
        <div className="space-y-6">
            <AdminPageHeader
                title="Subscribers"
                description="Manage newsletter and email subscribers"
            >
                
            </AdminPageHeader>

            <AdminSearchPanel>
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
                    <AdminSearchInput
                        value={searchQuery}
                        onChange={handleSearchChange}
                        placeholder="Search by email, name or date…"
                    />

                    <div className="flex flex-wrap items-center gap-2 lg:shrink-0">
                        <select
                            value={statusFilter}
                            onChange={(e) => handleStatusChange(e.target.value)}
                            className={adminSelectClass}
                        >
                            <option value="">All statuses</option>
                            {STATUS_OPTIONS.map((s) => (
                                <option key={s} value={s}>
                                    {s}
                                </option>
                            ))}
                        </select>

                        {hasActiveFilters ? (
                            <button
                                type="button"
                                onClick={() => handleStatusChange('')}
                                className="inline-flex h-9 items-center gap-1.5 whitespace-nowrap rounded-lg border border-red-200 px-3 text-sm text-red-600 transition-colors hover:bg-red-50"
                            >
                                <X className="h-3.5 w-3.5" />
                                Clear
                            </button>
                        ) : null}
                    </div>
                </div>

                {hasActiveFilters ? (
                    <div className="flex flex-wrap gap-2">
                        <span className={adminFilterPillClass}>
                            {statusFilter}
                            <button type="button" onClick={() => handleStatusChange('')} className="hover:text-primary/70">
                                <X className="h-3 w-3" />
                            </button>
                        </span>
                    </div>
                ) : null}
            </AdminSearchPanel>

            <div className="border border-gray-200 rounded-md overflow-hidden">
                <CommonDataTable
                    rows={subscribers}
                    columns={columns}
                    getRowId={(row) => row._id}
                    loading={loading}
                    paginationMode="server"
                    rowCount={totalSubscribers}
                    paginationModel={paginationModel}
                    onPaginationModelChange={setPaginationModel}
                />
            </div>
        </div>
    );
}
