'use client';

import { useEffect, useState } from 'react';
import { Input } from '@heroui/react';
import { Tooltip } from '@heroui/react';
import { Search, ShoppingBag, BookOpen, FileText, Download, Loader2 } from 'lucide-react';
import { type GridColDef } from '@mui/x-data-grid';
import Cookies from 'js-cookie';
import { cn } from '@/components/ui/utils';
import { Badge } from '@/components/ui/badge';
import CommonDataTable from '@/components/admin/CommonDataTable';
import { OrderStats } from './OrderStats';
import { useGetAllOrdersQuery } from '@/store/rtkQueries/adminGetApi';
import { useDebounce } from '@/hooks/useDebounce';
import { API_BASE_URL } from '@/utils/config';
import { IAllOrdersDataEntity } from '@/types/order';

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

function DownloadInvoiceButton({ orderId, orderNumber }: { orderId: string; orderNumber: number }) {
    const [isDownloading, setIsDownloading] = useState(false);

    async function handleDownload() {
        setIsDownloading(true);
        try {
            const token = Cookies.get('auth_token') || '';
            const deviceId = Cookies.get('device') || '';
            const userId = Cookies.get('userID') || '';
            const res = await fetch(`${API_BASE_URL}/admin/invoice/${orderId}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                    device: deviceId,
                    userID: userId,
                },
            });
            if (!res.ok) throw new Error('Failed to download invoice');
            const blob = await res.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `invoice-${orderNumber}.pdf`;
            a.click();
            URL.revokeObjectURL(url);
        } catch {
            // handled by disabling the button state below
        } finally {
            setIsDownloading(false);
        }
    }

    return (
        <button
            type="button"
            disabled={isDownloading}
            onClick={handleDownload}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-primary/10 text-primary hover:bg-primary/20 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
            {isDownloading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Download className="h-3.5 w-3.5" />}
            Invoice
        </button>
    );
}

export function AdminOrdersTab() {
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

    const columns: GridColDef<IAllOrdersDataEntity>[] = [
        {
            field: 'orderNumber',
            headerName: 'Order #',
            width: 110,
            sortable: false,
            renderCell: (params) => <span className="font-semibold text-sm">#{params.row.orderNumber}</span>,
        },
        {
            field: 'customer',
            headerName: 'Customer',
            minWidth: 180,
            flex: 1,
            sortable: false,
            renderCell: (params) => (
                <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{params.row.customer?.name ?? '—'}</p>
                    <p className="text-xs text-muted-foreground truncate">{params.row.customer?.email ?? '—'}</p>
                </div>
            ),
        },
        {
            field: 'items',
            headerName: 'Items',
            minWidth: 200,
            flex: 1,
            sortable: false,
            renderCell: (params) => {
                const items = params.row.items ?? [];
                const firstItem = items[0];
                const extraCount = items.length - 1;
                if (!firstItem) return <span className="text-sm text-muted-foreground">—</span>;
                return (
                    <div className="min-w-0">
                        <div className="text-sm truncate">{firstItem.title}</div>
                        {extraCount > 0 && (
                            <Tooltip
                                content={
                                    <div className="py-1 px-0.5 space-y-1.5 max-w-56">
                                        {items.slice(1).map((item) => (
                                            <div key={item.id} className="flex items-center gap-2">
                                                <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                                                <span className="text-xs leading-snug">{item.title}</span>
                                            </div>
                                        ))}
                                    </div>
                                }
                                placement="right"
                                delay={100}
                                closeDelay={0}
                            >
                                <span className="cursor-default text-xs text-primary font-medium underline decoration-dotted underline-offset-2">
                                    +{extraCount} more
                                </span>
                            </Tooltip>
                        )}
                    </div>
                );
            },
        },
        {
            field: 'totalAmount',
            headerName: 'Amount',
            width: 130,
            sortable: false,
            renderCell: (params) => (
                <span className="text-sm font-semibold text-primary whitespace-nowrap">
                    KSH {(params.row.totalAmount ?? 0).toFixed(2)}
                </span>
            ),
        },
        {
            field: 'paymentStatus',
            headerName: 'Payment',
            width: 170,
            sortable: false,
            renderCell: (params) => {
                const s = (params.row.paymentStatus || '').toLowerCase();
                return (
                    <div className="flex items-center gap-2 min-w-0">
                        <span className="text-xs text-muted-foreground truncate">{params.row.paymentMethod}</span>
                        <Badge
                            variant="outline"
                            className={cn('capitalize shrink-0', PAYMENT_STATUS_BADGE_CLASS[s] ?? 'bg-gray-50 text-gray-600 border-gray-200')}
                        >
                            {params.row.paymentStatus || '—'}
                        </Badge>
                    </div>
                );
            },
        },
        {
            field: 'createdAt',
            headerName: 'Date',
            width: 130,
            sortable: false,
            renderCell: (params) => (
                <span className="text-sm whitespace-nowrap text-muted-foreground">{params.row.createdAt}</span>
            ),
        },
        {
            field: 'actions',
            headerName: '',
            width: 120,
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
            renderCell: (params) => (
                <DownloadInvoiceButton orderId={params.row.id} orderNumber={params.row.orderNumber} />
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
