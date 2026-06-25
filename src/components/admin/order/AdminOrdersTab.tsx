'use client';

import { useState, useEffect } from 'react';
import { Input } from '@heroui/react';
import { Search, ShoppingBag, BookOpen, FileText, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/components/ui/utils';
import { OrderListing } from './OrderListing';
import { OrderStats } from './OrderStats';
import { useGetAllBookOrdersQuery, useGetAllBlueprintOrdersQuery } from '@/store/rtkQueries/adminGetApi';
import AdminOrdersSkeleton from '@/components/skeleton-loader/AdminOrdersSkeleton';
import { useDebounce } from '@/hooks/useDebounce';

type OrderTab = 'books' | 'blueprints';

const PAGE_LIMIT = 10;

export function AdminOrdersTab() {
    const [activeTab, setActiveTab] = useState<OrderTab>('blueprints');
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(1);

    const debouncedSearch = useDebounce(searchQuery, 400);

    useEffect(() => {
        setPage(1);
    }, [debouncedSearch]);

    const queryParams = {
        page,
        limit: PAGE_LIMIT,
        ...(debouncedSearch.trim() ? { search: debouncedSearch.trim() } : {}),
    };

    const {
        data: bookData,
        isLoading: bookLoading,
        isFetching: bookFetching,
    } = useGetAllBookOrdersQuery(queryParams, { skip: activeTab !== 'books' });

    const {
        data: blueprintData,
        isLoading: blueprintLoading,
        isFetching: blueprintFetching,
    } = useGetAllBlueprintOrdersQuery(queryParams, { skip: activeTab !== 'blueprints' });

    const activeData = activeTab === 'books' ? bookData : blueprintData;
    const orders = activeData?.data?.orders ?? [];
    const pagination = activeData?.data?.pagination;

    const isLoading =
        activeTab === 'books' ? bookLoading || bookFetching : blueprintLoading || blueprintFetching;

    function handleTabSwitch(tab: OrderTab) {
        setActiveTab(tab);
        setSearchQuery('');
        setPage(1);
    }

    return (
        <div className="space-y-8">

            {/* Header */}
            <div className="bg-white rounded-3xl p-8 shadow-sm">
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
            <div className="bg-white rounded-3xl p-2 shadow-sm flex gap-2 w-fit">
                <button
                    type="button"
                    onClick={() => handleTabSwitch('blueprints')}
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
                    onClick={() => handleTabSwitch('books')}
                    className={cn(
                        'flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-medium transition-all',
                        activeTab === 'books'
                            ? 'bg-primary text-white shadow-md'
                            : 'text-gray-600 hover:bg-gray-100'
                    )}
                >
                    <BookOpen className="h-4 w-4" />
                    Book Orders
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
            <div className="bg-white rounded-3xl p-6 shadow-sm">
                <Input
                    startContent={<Search className="h-4 w-4 text-muted-foreground" />}
                    type="search"
                    placeholder={`Search ${activeTab === 'books' ? 'book' : 'blueprint'} orders by name, email, item or status...`}
                    radius="full"
                    className="w-full max-w-xl"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {/* Stats */}
            {/* <OrderStats
                totalOrders={pagination?.total ?? 0}
                pageOrders={orders}
            /> */}

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
            {!isLoading && pagination && pagination.totalPages > 1 && (
                <div className="flex items-center justify-between bg-white rounded-3xl px-6 py-4 shadow-sm">
                    <p className="text-sm text-muted-foreground">
                        Page {pagination.page} of {pagination.totalPages}&nbsp;&middot;&nbsp;{pagination.total} total orders
                    </p>
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            disabled={page <= 1}
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            className="p-2 rounded-xl hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </button>
                        <span className="text-sm font-medium px-2">{page}</span>
                        <button
                            type="button"
                            disabled={page >= (pagination.totalPages ?? 1)}
                            onClick={() => setPage((p) => Math.min(pagination.totalPages ?? 1, p + 1))}
                            className="p-2 rounded-xl hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
