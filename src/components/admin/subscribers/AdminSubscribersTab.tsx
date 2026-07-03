'use client';

import { useState } from 'react';
import { Users, Search, CheckCircle, XCircle, Download } from 'lucide-react';
import { useGetAllSubscribersQuery } from '@/store/rtkQueries/adminGetApi';
import type { SubscriberEntry } from '@/types/subscribers';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { useDebounce } from '@/hooks/useDebounce';

function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
}

export function AdminSubscribersTab() {
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(1);
    const [pageLimit, setPageLimit] = useState(10);
    const debouncedSearch = useDebounce(searchQuery, 500);
    const queryParams = {
        page,
        limit: pageLimit,
        ...(debouncedSearch.trim() ? { search: debouncedSearch.trim() } : {}),
    };
    const { data, isLoading, isFetching } = useGetAllSubscribersQuery(queryParams);

    const subscribers = data?.data ?? [];
    const activeCount = subscribers.filter((s: SubscriberEntry) => s.status).length;
    const loading = isLoading || isFetching;

    const handleExportCSV = () => {
        const rows = [
            ['#', 'Email', 'Status', 'Subscribed On'],
            ...(subscribers && subscribers?.length > 0 ? subscribers?.map((s: SubscriberEntry, i: number) => [
                String(i + 1),
                s.email,
                s.status ? 'Active' : 'Inactive',
                s.date_of_subscription,
            ]) : []),
        ];
        const csv = rows.map((r: string[]) => r.map((v: string) => `"${v}"`).join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'subscribers.csv';
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="admin-surface p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground mb-2">Subscribers</h1>
                        <p className="text-muted-foreground">Manage newsletter and email subscribers</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="bg-accent rounded-2xl px-5 py-3 text-center">
                            <p className="text-2xl font-bold text-primary">{subscribers.length}</p>
                            <p className="text-xs text-muted-foreground">Total</p>
                        </div>
                        <div className="bg-green-50 rounded-2xl px-5 py-3 text-center">
                            <p className="text-2xl font-bold text-green-600">{activeCount}</p>
                            <p className="text-xs text-muted-foreground">Active</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search + Export */}
            <div className="admin-surface p-5">
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search by email, name or date..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    <button
                        onClick={handleExportCSV}
                        disabled={loading || subscribers && subscribers?.length === 0}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-primary text-primary text-sm font-medium hover:bg-primary/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                    >
                        <Download className="h-4 w-4" />
                        Export CSV
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="admin-surface overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-12">#</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="whitespace-nowrap">Subscribed On</TableHead>
                            <TableHead className="whitespace-nowrap">Joined</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading
                            ? Array.from({ length: 8 }).map((_, i) => (
                                <TableRow key={i}>
                                    {Array.from({ length: 5 }).map((__, j) => (
                                        <TableCell key={j}>
                                            <div className="h-4 bg-gray-100 rounded animate-pulse" />
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                            : subscribers && subscribers?.length > 0 && subscribers?.map((sub: SubscriberEntry, idx: number) => (
                                <TableRow key={sub._id}>
                                    <TableCell className="text-muted-foreground text-sm">
                                        {idx + 1}
                                    </TableCell>
                                    <TableCell>
                                        <a
                                            href={`mailto:${sub.email}`}
                                            className="text-primary hover:underline truncate block max-w-56"
                                        >
                                            {sub.email}
                                        </a>
                                    </TableCell>
                                    <TableCell>
                                        {sub.status ? (
                                            <Badge className="bg-green-100 text-green-700 border-green-200 gap-1">
                                                <CheckCircle className="h-3 w-3" />
                                                Active
                                            </Badge>
                                        ) : (
                                            <Badge variant="secondary" className="gap-1">
                                                <XCircle className="h-3 w-3" />
                                                Inactive
                                            </Badge>
                                        )}
                                    </TableCell>
                                    <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                                        {sub.date_of_subscription}
                                    </TableCell>
                                    <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                                        {formatDate(sub.createdAt)}
                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>

                {!loading && subscribers && subscribers?.length === 0 && (
                    <div className="p-12">
                        <div className="text-center space-y-4">
                            <div className="mx-auto w-16 h-16 bg-accent rounded-full flex items-center justify-center">
                                <Users className="h-8 w-8 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-bold">No subscribers found</h3>
                                <p className="text-muted-foreground">
                                    {searchQuery
                                        ? 'Try adjusting your search query'
                                        : 'There are no subscribers to display'}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
