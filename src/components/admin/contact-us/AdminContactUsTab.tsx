'use client';

import { useState } from 'react';
import { Mail, Search } from 'lucide-react';
import { useGetAllContactusDataQuery } from '@/store/rtkQueries/adminGetApi';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

export function AdminContactUsTab() {
    const [searchQuery, setSearchQuery] = useState('');
    const { data, isLoading, isFetching } = useGetAllContactusDataQuery();

    const entries = data?.data ?? [];

    const filtered = entries.filter(
        (e) =>
            e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            e.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            e.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
            e.message.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const loading = isLoading || isFetching;

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="bg-white rounded-3xl p-8 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground mb-2">Contact Us</h1>
                        <p className="text-muted-foreground">
                            View all contact form submissions
                        </p>
                    </div>
                    <div className="bg-accent rounded-2xl px-5 py-3 text-center">
                        <p className="text-2xl font-bold text-primary">{entries.length}</p>
                        <p className="text-xs text-muted-foreground">Total Messages</p>
                    </div>
                </div>
            </div>

            {/* Search */}
            <div className="bg-white rounded-3xl p-6 shadow-sm">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search by name, email, subject or message..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>#</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Subject</TableHead>
                            <TableHead>Message</TableHead>
                            <TableHead className="whitespace-nowrap">Date</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading
                            ? Array.from({ length: 6 }).map((_, i) => (
                                <TableRow key={i}>
                                    {Array.from({ length: 6 }).map((__, j) => (
                                        <TableCell key={j}>
                                            <div className="h-4 bg-gray-100 rounded animate-pulse" />
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                            : filtered.map((entry, idx) => (
                                <TableRow key={entry._id}>
                                    <TableCell className="text-muted-foreground text-sm w-10">
                                        {idx + 1}
                                    </TableCell>
                                    <TableCell className="font-medium max-w-36 truncate">
                                        {entry.name}
                                    </TableCell>
                                    <TableCell className="max-w-48">
                                        <a
                                            href={`mailto:${entry.email}`}
                                            className="text-primary hover:underline truncate block max-w-48"
                                        >
                                            {entry.email}
                                        </a>
                                    </TableCell>
                                    <TableCell className="max-w-48 truncate">
                                        {entry.subject}
                                    </TableCell>
                                    <TableCell className="max-w-64">
                                        <p className="truncate text-muted-foreground text-sm">
                                            {entry.message}
                                        </p>
                                    </TableCell>
                                    <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                                        {formatDate(entry.createdAt)}
                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>

                {!loading && filtered.length === 0 && (
                    <div className="p-12">
                        <div className="text-center space-y-4">
                            <div className="mx-auto w-16 h-16 bg-accent rounded-full flex items-center justify-center">
                                <Mail className="h-8 w-8 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-bold">No messages found</h3>
                                <p className="text-muted-foreground">
                                    {searchQuery
                                        ? 'Try adjusting your search query'
                                        : 'There are no contact submissions to display'}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
