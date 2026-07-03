'use client';

import { useState, useEffect } from 'react';
import { Input } from '@heroui/react';
import { Search, ShoppingBag, BookOpen, FileText } from 'lucide-react';
import { cn } from '@/components/ui/utils';
import { OrderListing } from './OrderListing';
import { AdminPagination } from '@/components/admin/shared/AdminPagination';
import { useGetAllBookOrdersQuery, useGetAllBlueprintOrdersQuery } from '@/store/rtkQueries/adminGetApi';
import AdminOrdersSkeleton from '@/components/skeleton-loader/AdminOrdersSkeleton';
import { useDebounce } from '@/hooks/useDebounce';

type OrderTab = 'books' | 'blueprints';

export function AdminOrdersTab() {
    const [activeTab, setActiveTab] = useState<OrderTab>('blueprints');
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(1);
    const [pageLimit, setPageLimit] = useState(10);
    const debouncedSearch = useDebounce(searchQuery, 400);

    useEffect(() => {
        setPage(1);
    }, [debouncedSearch]);

    const queryParams = {
        page,
        limit: pageLimit,
        ...(debouncedSearch.trim() ? { search: debouncedSearch.trim() } : {}),
    };

    const { data: bookData, isLoading: bookLoading, isFetching: bookFetching } = useGetAllBookOrdersQuery(queryParams, { skip: activeTab !== 'books' });
    const { data: blueprintData, isLoading: blueprintLoading, isFetching: blueprintFetching } = useGetAllBlueprintOrdersQuery(queryParams, { skip: activeTab !== 'blueprints' });

    const activeData = activeTab === 'books' ? bookData : blueprintData;
    const orders = activeData?.data?.orders ?? [];
    const pagination = activeData?.data?.pagination;

    const isLoading = activeTab === 'books' ? bookLoading || bookFetching : blueprintLoading || blueprintFetching;
    const isFetching = activeTab === 'books' ? bookFetching : blueprintFetching;

    const totalPages = pagination?.totalPages ?? 1;
    const totalOrders = pagination?.total ?? 0;

    return (
        <div className="space-y-6">

            {/* Header */}
            <div className="admin-surface p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <ShoppingBag className="h-7 w-7 text-primary" />
                            <h1 className="text-3xl font-bold text-foreground">Orders</h1>
                        </div>
                        <p className="text-muted-foreground">View and manage all customer orders</p>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="admin-surface p-2 flex gap-2 w-fit">
                <button
                    type="button"
                    onClick={() => {
                        setActiveTab('blueprints');
                        setSearchQuery('');
                        setPage(1);
                    }}
                    className={cn(
                        'flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-medium transition-all',
                        activeTab === 'blueprints'
                            ? 'bg-primary text-white shadow-md'
                            : 'text-gray-600 hover:bg-gray-100'
                    )}
                >
                    <FileText className="h-4 w-4" />
                    Blueprint Orders
                    {(blueprintData?.data?.pagination?.total ?? 0) > 0 && (
                        <span className={cn(
                            'ml-1 px-2 py-0.5 rounded-full text-xs font-semibold',
                            activeTab === 'blueprints' ? 'bg-white/20 text-white' : 'bg-primary/10 text-primary'
                        )}>
                            {blueprintData?.data?.pagination?.total}
                        </span>
                    )}
                </button>
                <button
                    type="button"
                    onClick={() => {
                        setActiveTab('books');
                        setSearchQuery('');
                        setPage(1);
                    }}
                    className={cn(
                        'flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-medium transition-all',
                        activeTab === 'books'
                            ? 'bg-primary text-white shadow-md'
                            : 'text-gray-600 hover:bg-gray-100'
                    )}
                >
                    <BookOpen className="h-4 w-4" />
                    Series Orders
                    {(bookData?.data?.pagination?.total ?? 0) > 0 && (
                        <span className={cn(
                            'ml-1 px-2 py-0.5 rounded-full text-xs font-semibold',
                            activeTab === 'books' ? 'bg-white/20 text-white' : 'bg-primary/10 text-primary'
                        )}>
                            {bookData?.data?.pagination?.total}
                        </span>
                    )}
                </button>
            </div>

            {/* Search */}
            <div className="admin-surface p-5">
                <Input
                    startContent={<Search className="h-4 w-4 text-muted-foreground" />}
                    type="search"
                    placeholder={`Search ${activeTab === 'books' ? 'series' : 'blueprint'} orders by name, email, item or status...`}
                    radius="full"
                    className="w-full max-w-xl"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {/* Table */}
            {isLoading ? (
                <AdminOrdersSkeleton />
            ) : (
                <OrderListing
                    orders={orders}
                    searchQuery={debouncedSearch}
                    orderType={activeTab}
                />
            )}

            {/* Pagination */}
            {!isLoading && pagination && totalOrders > 0 && (
                <AdminPagination
                    page={page}
                    limit={pageLimit}
                    total={totalOrders}
                    totalPages={totalPages}
                    itemLabel="orders"
                    disabled={isFetching}
                    onPageChange={setPage}
                    onLimitChange={(limit) => {
                        setPageLimit(limit);
                        setPage(1);
                    }}
                />
            )}
        </div>
    );
}
