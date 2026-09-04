'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { ShoppingBag, BookOpen, FileText, Eye, Layers } from 'lucide-react';
import { type GridColDef } from '@mui/x-data-grid';
import { cn } from '@/components/ui/utils';
import { Badge } from '@/components/ui/badge';
import CommonDataTable from '@/components/admin/CommonDataTable';
import { OrderStats } from './OrderStats';
import { AdminOrdersSearch } from './AdminOrdersSearch';
import { useGetAllOrdersQuery } from '@/store/rtkQueries/adminGetApi';
import { useDebounce } from '@/hooks/useDebounce';
import { useAdminPermissions } from '@/hooks/useAdminPermissions';
import { getViewOrderRoutePath, isMentorPanelPath } from '@/routes/routes';
import moment from 'moment';
import { IAllOrdersAPIResponseDataEntityItemEntityItemItems } from '@/types/order';

const ORDERS_MODEL = 'Orders';

type OrderTab = 'all' | 'books' | 'blueprints';

/** Orders API expects `type: 'books' | 'chapter'`; omit for all */
const TAB_TO_TYPE: Record<OrderTab, 'books' | 'chapter' | undefined> = {
    all: undefined,
    books: 'books',
    blueprints: 'chapter',
};

const SEARCH_PLACEHOLDERS: Record<OrderTab, string> = {
    all: 'Search by customer, email, item, or status...',
    books: 'Search series orders by customer, email, or item...',
    blueprints: 'Search blueprint orders by customer, email, or item...',
};

export function AdminOrdersTab() {
    const router = useRouter();
    const pathname = usePathname();
    const isMentor = isMentorPanelPath(pathname);
    const [activeTab, setActiveTab] = useState<OrderTab>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [paymentStatus, setPaymentStatus] = useState('');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
    const { hasPermission } = useAdminPermissions();
    const canView = hasPermission(ORDERS_MODEL, 'view');
    const debouncedSearch = useDebounce(searchQuery, 400);

    const resetToFirstPage = () => setPaginationModel((prev) => ({ ...prev, page: 0 }));

    useEffect(() => {
        resetToFirstPage();
    }, [debouncedSearch, activeTab, paymentStatus, fromDate, toDate]);

    const orderType = TAB_TO_TYPE[activeTab];

    const { data, isLoading, isFetching } = useGetAllOrdersQuery({
        page: paginationModel.page + 1,
        limit: paginationModel.pageSize,
        ...(orderType ? { type: orderType } : {}),
        ...(debouncedSearch.trim() ? { search: debouncedSearch.trim() } : {}),
        ...(paymentStatus ? { payment_status: paymentStatus } : {}),
        ...(fromDate ? { fromDate } : {}),
        ...(toDate ? { toDate } : {}),
    });

    const handleSearchChange = (value: string) => {
        setSearchQuery(value);
        resetToFirstPage();
    };

    const handlePaymentStatusChange = (value: string) => {
        setPaymentStatus(value);
        resetToFirstPage();
    };

    const handleFromDateChange = (value: string) => {
        setFromDate(value);
        resetToFirstPage();
    };

    const handleToDateChange = (value: string) => {
        setToDate(value);
        resetToFirstPage();
    };

    const summary = data?.data?.summary;
    const listData = data?.data?.data;
    const orders = listData?.data ?? [];
    
    const totalOrders = listData?.total ?? 0;

    const columns: GridColDef[] = [
        {
            field: 'orderId',
            headerName: 'Order #',
            width: 110,
            sortable: false,
            renderCell: (params) => <span className="font-semibold text-sm">#{params.row.orderId}</span>,
        },
        {
            field: 'userName',
            headerName: 'Customer',
            minWidth: 180,
            flex: 1,
            sortable: false,
            renderCell: (params) => (
                <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{params.row.userName ?? '—'}</p>
                    <p className="text-xs text-muted-foreground truncate">{params.row.userEmail ?? '—'}</p>
                </div>
            ),
        },
        {
            field: 'transactionId',
            headerName: 'Transaction ID',
            minWidth: 180,
            flex: 1,
            sortable: false,
            renderCell: (params) => (
                <span className="text-sm truncate">{params.row.transactionId ?? '—'}</span>
            ),
        },
        {
            field: 'itemCount',
            headerName: 'Items',
            minWidth: 200,
            flex: 1,
            sortable: false,
            renderCell: (params) => {
                const items = params.row.items ?? [];
                const names = items.map((item: IAllOrdersAPIResponseDataEntityItemEntityItemItems) => item.name);
                const count = params.row.itemCount ?? names.length;
                const remaining = Math.max(names.length - 1, 0);
                const fullList = names.join(', ');

                if (names.length === 0) {
                    return (
                        <span className="text-sm text-muted-foreground">
                            {count} item{count === 1 ? '' : 's'}
                        </span>
                    );
                }

                return (
                    <div className="flex min-w-0 items-center gap-2 py-1" title={fullList}>
                        <p className="truncate text-sm font-medium text-slate-900">{names[0]}</p>
                        {remaining > 0 ? (
                            <Badge
                                variant="outline"
                                className="shrink-0 border-slate-200 bg-slate-50 text-xs text-slate-600"
                            >
                                +{remaining} more
                            </Badge>
                        ) : null}
                    </div>
                );
            },
        },
        {
            field: 'legacyType',
            headerName: 'Type',
            width: 130,
            sortable: false,
            renderCell: (params) => {
                const value = String(params.row.legacyType ?? '').toLowerCase();
                const isSeries = value === 'books' || value === 'book';
                const isBlueprint = value === 'chapter' || value === 'blueprint';
                const label = isSeries ? 'Series' : isBlueprint ? 'Blueprint' : params.row.legacyType || 'Cart';
                return (
                    <Badge
                        variant="outline"
                        className={cn(
                            'capitalize',
                            isSeries && 'border-sky-200! bg-sky-50 text-sky-700',
                            isBlueprint && 'border-violet-200! bg-violet-50 text-violet-700',
                            !isSeries && !isBlueprint && 'border-amber-200! bg-amber-50 text-amber-700',
                        )}
                    >
                        {label}
                    </Badge>
                );
            },
        },
        {
            field: 'amount',
            headerName: 'Amount',
            width: 130,
            sortable: false,
            renderCell: (params) => (
                <span className="text-sm font-semibold text-primary whitespace-nowrap">
                    KSH {(params.row.amount ?? 0).toFixed(2)}
                </span>
            ),
        },
        {
            field: 'status',
            headerName: 'Payment',
            width: 170,
            sortable: false,
            renderCell: (params) => {
                return (
                    <div className="flex items-center gap-2 min-w-0">
                        <span className="text-xs text-muted-foreground truncate">{params.row.paymentMethod}</span>
                        <Badge
                            variant="outline"
                            className={cn('capitalize shrink-0', params.row.status === 'completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-200!' : params.row.status === 'pending' ? 'bg-red-50 text-red-700 border-red-200!' : params.row.status === 'failed' ? 'bg-red-50 text-red-700 border-red-200!' : 'bg-amber-50 text-amber-700 border-amber-200!')}
                        >
                            {params.row.status === 'completed' ? 'Paid' : params.row.status === 'pending' ? 'Pending' : params.row.status}
                        </Badge>
                    </div>
                );
            },
        },
        {
            field: 'date',
            headerName: 'Date',
            width: 130,
            sortable: false,
            renderCell: (params) => (
                <span className="text-sm whitespace-nowrap text-muted-foreground">{params.row.date ? moment(params.row.date).format('DD/MM/YYYY HH:mm') : '—'}</span>
            ),
        },
        {
            field: 'actions',
            headerName: '',
            width: 80,
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
            renderCell: (params) => {
                if (!canView) return null;
                return (
                    <div className="action_buttons">
                        <button
                            type="button"
                            className="active_button"
                            title="View order"
                            onClick={() => router.push(getViewOrderRoutePath(params.row.id, isMentor))}
                        >
                            <Eye className="h-4 w-4" />
                        </button>
                    </div>
                );
            },
        },
    ];

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
                        <p className="text-muted-foreground">
                            {isMentor
                                ? 'View orders for your series and blueprints'
                                : 'View and manage all customer orders'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="admin-surface flex w-fit gap-2 p-2">
                <button
                    type="button"
                    onClick={() => setActiveTab('all')}
                    className={cn(
                        'flex items-center gap-2 rounded-2xl px-5 py-2.5 text-sm font-medium transition-all',
                        activeTab === 'all'
                            ? 'bg-primary text-white shadow-md'
                            : 'text-gray-600 hover:bg-gray-100',
                    )}
                >
                    <Layers className="h-4 w-4" />
                    All Orders
                    {activeTab === 'all' && totalOrders > 0 && (
                        <span className="ml-1 rounded-full bg-white/20 px-2 py-0.5 text-xs font-semibold text-white">
                            {totalOrders}
                        </span>
                    )}
                </button>
                <button
                    type="button"
                    onClick={() => setActiveTab('blueprints')}
                    className={cn(
                        'flex items-center gap-2 rounded-2xl px-5 py-2.5 text-sm font-medium transition-all',
                        activeTab === 'blueprints'
                            ? 'bg-primary text-white shadow-md'
                            : 'text-gray-600 hover:bg-gray-100',
                    )}
                >
                    <FileText className="h-4 w-4" />
                    Blueprint Orders
                    {activeTab === 'blueprints' && totalOrders > 0 && (
                        <span className="ml-1 rounded-full bg-white/20 px-2 py-0.5 text-xs font-semibold text-white">
                            {totalOrders}
                        </span>
                    )}
                </button>
                <button
                    type="button"
                    onClick={() => setActiveTab('books')}
                    className={cn(
                        'flex items-center gap-2 rounded-2xl px-5 py-2.5 text-sm font-medium transition-all',
                        activeTab === 'books'
                            ? 'bg-primary text-white shadow-md'
                            : 'text-gray-600 hover:bg-gray-100',
                    )}
                >
                    <BookOpen className="h-4 w-4" />
                    Series Orders
                    {activeTab === 'books' && totalOrders > 0 && (
                        <span className="ml-1 rounded-full bg-white/20 px-2 py-0.5 text-xs font-semibold text-white">
                            {totalOrders}
                        </span>
                    )}
                </button>
            </div>

            {/* Stats */}
            {summary && <OrderStats summary={summary} />}

            {/* Search & filters */}
            <AdminOrdersSearch
                searchQuery={searchQuery}
                onSearchChange={handleSearchChange}
                paymentStatus={paymentStatus}
                onPaymentStatusChange={handlePaymentStatusChange}
                fromDate={fromDate}
                onFromDateChange={handleFromDateChange}
                toDate={toDate}
                onToDateChange={handleToDateChange}
                placeholder={SEARCH_PLACEHOLDERS[activeTab]}
            />

            {/* Table */}
            <div className="border border-gray-200 rounded-md overflow-hidden">
                <CommonDataTable
                    rows={orders}
                    columns={columns}
                    getRowId={(row) => row.id}
                    loading={isLoading || isFetching}
                    paginationMode="server"
                    rowCount={totalOrders}
                    paginationModel={paginationModel}
                    onPaginationModelChange={setPaginationModel}
                />
            </div>
        </div>
    );
}
