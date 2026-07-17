'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import { type GridColDef } from '@mui/x-data-grid';
import { useGetAllContactusDataQuery } from '@/store/rtkQueries/adminGetApi';
import { Input } from '@/components/ui/input';
import CommonDataTable from '@/components/admin/CommonDataTable';
import { useDebounce } from '@/hooks/useDebounce';
import type { IAllContactusDataAPIResponseData } from '@/types/contactData';
import moment from 'moment';

export function AdminContactUsTab() {
    const [searchQuery, setSearchQuery] = useState('');
    const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
    const debouncedSearch = useDebounce(searchQuery, 500);
    const queryParams = {
        page: paginationModel.page + 1,
        limit: paginationModel.pageSize,
        ...(debouncedSearch.trim() ? { search: debouncedSearch.trim() } : {}),
    };
    const { data, isLoading, isFetching } = useGetAllContactusDataQuery(queryParams);

    const listData = data?.data;
    const entries = listData?.data ?? [];
    const totalEntries = listData?.total ?? 0;
    const loading = isLoading || isFetching;

    const handleSearchChange = (value: string) => {
        setSearchQuery(value);
        setPaginationModel((prev) => ({ ...prev, page: 0 }));
    };

    const columns: GridColDef<IAllContactusDataAPIResponseData>[] = [
        {
            field: 'name',
            headerName: 'Name',
            minWidth: 160,
            flex: 0.8,
            sortable: false,
            renderCell: (params) => (
                <p className="text-sm font-medium truncate">{params.row.name}</p>
            ),
        },
        {
            field: 'email',
            headerName: 'Email',
            minWidth: 200,
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
            field: 'subject',
            headerName: 'Subject',
            minWidth: 180,
            flex: 1,
            sortable: false,
            renderCell: (params) => (
                <p className="text-sm truncate">{params.row.subject}</p>
            ),
        },
        {
            field: 'message',
            headerName: 'Message',
            minWidth: 260,
            flex: 1.4,
            sortable: false,
            renderCell: (params) => (
                <p className="text-sm text-muted-foreground truncate">{params.row.message}</p>
            ),
        },
        {
            field: 'createdAt',
            headerName: 'Date',
            minWidth: 160,
            sortable: false,
            renderCell: (params) => (
                <p className="text-sm text-muted-foreground whitespace-nowrap">
                    {params.row.createdAt ? moment(params.row.createdAt).format('DD/MM/YYYY HH:mm') : '—'}
                </p>
            ),
        },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="admin-surface p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground mb-2">Contact Us</h1>
                        <p className="text-muted-foreground">
                            View all contact form submissions
                        </p>
                    </div>
                    <div className="bg-accent rounded-2xl px-5 py-3 text-center">
                        <p className="text-2xl font-bold text-primary">{totalEntries}</p>
                        <p className="text-xs text-muted-foreground">Total Messages</p>
                    </div>
                </div>
            </div>

            {/* Search */}
            <div className="admin-surface p-5">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search by name, email, subject or message..."
                        value={searchQuery}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        className="pl-10"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="border border-gray-200 rounded-md overflow-hidden">
                <CommonDataTable
                    rows={entries}
                    columns={columns}
                    getRowId={(row) => row._id}
                    loading={loading}
                    paginationMode="server"
                    rowCount={totalEntries}
                    paginationModel={paginationModel}
                    onPaginationModelChange={setPaginationModel}
                />
            </div>
        </div>
    );
}
