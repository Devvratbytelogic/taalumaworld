'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingBag, BookOpen, FileText, Eye } from 'lucide-react';
import { type GridColDef } from '@mui/x-data-grid';
import { cn } from '@/components/ui/utils';
import { Badge } from '@/components/ui/badge';
import CommonDataTable from '@/components/admin/CommonDataTable';
import { AdminSearchInput, AdminSearchPanel } from '@/components/admin/layout/AdminContent';
import { OrderStats } from './OrderStats';
import { useGetAllOrdersQuery } from '@/store/rtkQueries/adminGetApi';
import { useDebounce } from '@/hooks/useDebounce';
import { getViewOrderRoutePath } from '@/routes/routes';
import { IAllOrdersAPIResponseDataEntityItem } from '@/types/order';
import moment from 'moment';

type OrderTab = 'books' | 'blueprints';

/** Orders API expects `type: 'books' | 'chapter'` */
const TAB_TO_TYPE: Record<OrderTab, 'books' | 'chapter'> = {
    books: 'books',
    blueprints: 'chapter',
};

const PAYMENT_STATUS_BADGE_CLASS: Record<string, string> = {
    paid: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    unpaid: 'bg-red-50 text-red-700 border-red-200',
    partial: 'bg-amber-50 text-amber-700 border-amber-200',
};

export function AdminOrdersTab() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<OrderTab>('blueprints');
    const [searchQuery, setSearchQuery] = useState('');
    const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
    const debouncedSearch = useDebounce(searchQuery, 400);

    const resetToFirstPage = () => setPaginationModel((prev) => ({ ...prev, page: 0 }));

    useEffect(() => {
        resetToFirstPage();
    }, [debouncedSearch, activeTab]);

    const { data, isLoading, isFetching } = useGetAllOrdersQuery({
        type: TAB_TO_TYPE[activeTab],
        page: paginationModel.page + 1,
        limit: paginationModel.pageSize,
        ...(debouncedSearch.trim() ? { search: debouncedSearch.trim() } : {}),
    });

    const summary = data?.data?.summary;
    const listData = data?.data?.data;
    const orders = listData?.data ?? [];
    const totalOrders = listData?.total ?? 0;

    const columns: GridColDef<IAllOrdersAPIResponseDataEntityItem>[] = [
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
            width: 90,
            sortable: false,
            renderCell: (params) => (
                <span className="text-sm">{params.row.itemCount ?? 0}</span>
            ),
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
                const s = (params.row.status || '').toLowerCase();
                return (
                    <div className="flex items-center gap-2 min-w-0">
                        <span className="text-xs text-muted-foreground truncate">{params.row.paymentMethod}</span>
                        <Badge
                            variant="outline"
                            className={cn('capitalize shrink-0', PAYMENT_STATUS_BADGE_CLASS[s] ?? 'bg-gray-50 text-gray-600 border-gray-200')}
                        >
                            {params.row.status || '—'}
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
            renderCell: (params) => (
                <div className="action_buttons">
                    <button
                        type="button"
                        className="active_button"
                        title="View order"
                        onClick={() => router.push(getViewOrderRoutePath(params.row.id))}
                    >
                        <Eye className="h-4 w-4" />
                    </button>
                </div>
            ),
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
                        <p className="text-muted-foreground">View and manage all customer orders</p>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="admin-surface p-2 flex gap-2 w-fit">
                <button
                    type="button"
                    onClick={() => setActiveTab('blueprints')}
                    className={cn(
                        'flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-medium transition-all',
                        activeTab === 'blueprints'
                            ? 'bg-primary text-white shadow-md'
                            : 'text-gray-600 hover:bg-gray-100'
                    )}
                >
                    <FileText className="h-4 w-4" />
                    Blueprint Orders
                    {activeTab === 'blueprints' && totalOrders > 0 && (
                        <span className="ml-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-white/20 text-white">
                            {totalOrders}
                        </span>
                    )}
                </button>
                <button
                    type="button"
                    onClick={() => setActiveTab('books')}
                    className={cn(
                        'flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-medium transition-all',
                        activeTab === 'books'
                            ? 'bg-primary text-white shadow-md'
                            : 'text-gray-600 hover:bg-gray-100'
                    )}
                >
                    <BookOpen className="h-4 w-4" />
                    Series Orders
                    {activeTab === 'books' && totalOrders > 0 && (
                        <span className="ml-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-white/20 text-white">
                            {totalOrders}
                        </span>
                    )}
                </button>
            </div>

            {/* Stats */}
            {summary && <OrderStats summary={summary} />}

            {/* Search */}
            <AdminSearchPanel>
                <AdminSearchInput
                    value={searchQuery}
                    onChange={setSearchQuery}
                    placeholder={`Search ${activeTab === 'books' ? 'series' : 'blueprint'} orders by name, email, item or status...`}
                />
            </AdminSearchPanel>

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
