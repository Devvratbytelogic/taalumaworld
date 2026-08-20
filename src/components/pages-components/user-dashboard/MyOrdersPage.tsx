'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'nextjs-toploader/app';
import moment from 'moment';
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  FileDown,
  Search,
  ShoppingBag,
  X,
} from 'lucide-react';
import Button from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/components/ui/utils';
import { useDebounce } from '@/hooks/useDebounce';
import {
  useGetAllUserOrdersQuery,
  useLazyGetTransactionInvoiceQuery,
} from '@/store/rtkQueries/userGetAPI';
import { getHomeRoutePath, getUserDashboardMyOrderDetailRoutePath } from '@/routes/routes';
import type {
  IAllOrdersAPIResponseDataEntity,
  OrderItemsEntity,
} from '@/types/user/allOrders';
import { UserDashboardPageHeader } from './UserDashboardPageHeader';
import { formatKes } from '@/constants/common';

const PAGE_LIMIT = 10;

type OrderTypeFilter = 'all' | 'cart' | 'book' | 'chapter';

const TYPE_TABS: { key: OrderTypeFilter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'cart', label: 'Cart' },
  { key: 'book', label: 'Series' },
  { key: 'chapter', label: 'Blueprints' },
];

const STATUS_OPTIONS = [
  { value: 'all', label: 'All statuses' },
  { value: 'completed', label: 'Completed' },
  { value: 'pending', label: 'Pending' },
  { value: 'partial', label: 'Partial' },
  { value: 'cancelled', label: 'Cancelled' },
];

const PAYMENT_STATUS_OPTIONS = [
  { value: 'all', label: 'All payments' },
  { value: 'Paid', label: 'Paid' },
  { value: 'Pending', label: 'Pending' },
];

const STATUS_BADGE_CLASS: Record<string, string> = {
  completed: 'bg-emerald-50 text-emerald-700 border-emerald-200!',
  paid: 'bg-emerald-50 text-emerald-700 border-emerald-200!',
  pending: 'bg-amber-50 text-amber-700 border-amber-200!',
  partial: 'bg-sky-50 text-sky-700 border-sky-200!',
  cancelled: 'bg-red-50 text-red-700 border-red-200!',
  failed: 'bg-red-50 text-red-700 border-red-200!',
};

function formatLabel(value?: string | null) {
  if (!value) return '—';
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function formatOrderType(type?: string | null) {
  if (!type) return 'Order';
  const key = type.toLowerCase();
  if (key === 'book' || key === 'books') return 'Series';
  if (key === 'chapter' || key === 'chapters') return 'Blueprint';
  if (key === 'cart') return 'Cart';
  return formatLabel(type);
}

function formatItemTitle(item: OrderItemsEntity) {
  return (
    item.blueprint?.title ||
    item.series?.title ||
    (item.type?.toLowerCase() === 'chapter' || item.legacyType?.toLowerCase() === 'chapter'
      ? 'Blueprint'
      : item.type?.toLowerCase() === 'book' || item.legacyType?.toLowerCase() === 'book'
        ? 'Series'
        : 'Item')
  );
}

function badgeClass(value?: string | null) {
  const key = String(value || '').toLowerCase();
  return STATUS_BADGE_CLASS[key] ?? 'bg-gray-50 text-gray-700 border-gray-200!';
}

function OrderCard({
  order,
  onDownloadInvoice,
  isDownloading,
}: {
  order: IAllOrdersAPIResponseDataEntity;
  onDownloadInvoice: (orderId: string) => void;
  isDownloading: boolean;
}) {
  const items = order.Order_items ?? [];
  const visibleItems = items.slice(0, 3);
  const remainingCount = Math.max(0, items.length - visibleItems.length);
  const detailHref = getUserDashboardMyOrderDetailRoutePath(order._id);

  return (
    <article className="rounded-md border border-gray-200 bg-white p-4 sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href={detailHref}
              className="text-sm font-semibold text-gray-900 transition-colors hover:text-primary"
            >
              Order #{order.order_number ?? order.invoice_number ?? order.id}
            </Link>
            <Badge variant="outline" className="capitalize">
              {formatOrderType(order.type || order.purchase_type)}
            </Badge>
          </div>
          <p className="mt-1 text-xs text-gray-500">
            {order.createdAt ? moment(order.createdAt).format('DD MMM YYYY, hh:mm A') : '—'}
            {order.payment_method ? ` · ${order.payment_method}` : ''}
            {order.item_count != null ? ` · ${order.item_count} item${order.item_count !== 1 ? 's' : ''}` : ''}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* <Badge variant="outline" className={cn('capitalize', badgeClass(order.status))}>
            {formatLabel(order.status)}
          </Badge> */}
          <Badge variant="outline" className={cn('capitalize', badgeClass(order.payment_status))}>
            {formatLabel(order.payment_status)}
          </Badge>
        </div>
      </div>

      {visibleItems.length > 0 ? (
        <ul className="mt-4 space-y-2 border-t border-gray-100 pt-4">
          {visibleItems.map((item) => (
            <li key={item._id || item.id} className="flex items-start justify-between gap-3 text-sm">
              <div className="min-w-0">
                <p className="truncate font-medium text-gray-800">{formatItemTitle(item)}</p>
                <p className="text-xs text-gray-500">
                  {formatOrderType(item.type || item.legacyType)}
                  {item.quantity > 1 ? ` · Qty ${item.quantity}` : ''}
                </p>
              </div>
              <span className="shrink-0 font-medium text-gray-700">{formatKes(item.total)}</span>
            </li>
          ))}
          {remainingCount > 0 ? (
            <li className="text-xs text-gray-500">+{remainingCount} more item{remainingCount !== 1 ? 's' : ''}</li>
          ) : null}
        </ul>
      ) : null}

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-4">
        <div>
          <p className="text-xs text-gray-500">Total</p>
          <p className="text-base font-semibold text-primary">{formatKes(order.total_amount)}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href={detailHref}
            className="global_btn inline-flex items-center justify-center gap-2 rounded_full outline_primary px-4 py-2 text-sm"
          >
            <Eye className="h-4 w-4" />
            View
          </Link>
          <Button
            type="button"
            className="global_btn rounded_full outline_primary"
            isDisabled={isDownloading}
            onPress={() => onDownloadInvoice(order._id)}
          >
            <FileDown className="h-4 w-4" />
            {isDownloading ? 'Downloading…' : 'Invoice'}
          </Button>
        </div>
      </div>
    </article>
  );
}

export function MyOrdersPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [status, setStatus] = useState('all');
  const [paymentStatus, setPaymentStatus] = useState('all');
  const [type, setType] = useState<OrderTypeFilter>('all');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [page, setPage] = useState(1);
  const [invoiceDownloadingOrderId, setInvoiceDownloadingOrderId] = useState<string | null>(null);

  const debouncedSearch = useDebounce(searchQuery, 400);
  const [fetchTransactionInvoice] = useLazyGetTransactionInvoiceQuery();

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, status, paymentStatus, type, fromDate, toDate]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [page]);

  const { data, isLoading, isFetching } = useGetAllUserOrdersQuery({
    page,
    limit: PAGE_LIMIT,
    ...(debouncedSearch.trim() ? { search: debouncedSearch.trim() } : {}),
    ...(status !== 'all' ? { status } : {}),
    ...(paymentStatus !== 'all' ? { payment_status: paymentStatus } : {}),
    ...(type !== 'all' ? { type } : {}),
    ...(fromDate ? { fromDate } : {}),
    ...(toDate ? { toDate } : {}),
  });

  const orders = data?.data?.orders ?? [];
  const pagination = data?.data?.pagination;
  const total = pagination?.totalItems ?? 0;
  const totalPages = pagination?.totalPages ?? 1;
  const currentPage = pagination?.currentPage ?? page;

  const hasActiveFilters =
    !!searchQuery.trim() ||
    status !== 'all' ||
    paymentStatus !== 'all' ||
    type !== 'all' ||
    !!fromDate ||
    !!toDate;

  const clearFilters = () => {
    setSearchQuery('');
    setStatus('all');
    setPaymentStatus('all');
    setType('all');
    setFromDate('');
    setToDate('');
  };

  const scrollToContent = () => {
    router.push(getHomeRoutePath(), { scroll: false });
    window.setTimeout(() => {
      const contentSection = document.getElementById('content-section');
      if (contentSection) {
        contentSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const handleDownloadInvoice = async (orderId: string) => {
    setInvoiceDownloadingOrderId(orderId);
    try {
      const blob = await fetchTransactionInvoice({ orderId }).unwrap();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `invoice-${orderId}.pdf`;
      a.rel = 'noopener';
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } finally {
      setInvoiceDownloadingOrderId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <UserDashboardPageHeader
          title="My Orders"
          description="Track purchases and download invoices"
        />
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white animate-pulse">
          <div className="space-y-3 border-b border-gray-100 px-4 py-4 sm:px-6">
            <div className="h-10 w-full rounded-lg bg-gray-100" />
            <div className="flex gap-2">
              <div className="h-9 w-28 rounded-full bg-gray-100" />
              <div className="h-9 w-28 rounded-full bg-gray-100" />
              <div className="h-9 w-28 rounded-full bg-gray-100" />
            </div>
            <div className="flex gap-2">
              <div className="h-9 w-40 rounded-lg bg-gray-100" />
              <div className="h-9 w-40 rounded-lg bg-gray-100" />
            </div>
          </div>
          <div className="space-y-3 p-4 sm:p-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-36 rounded-xl border border-gray-200 bg-gray-50" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <UserDashboardPageHeader
        title="My Orders"
        description="Track purchases and download invoices"
      />

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
        <div className="space-y-3 border-b border-gray-100 px-4 py-4 sm:px-6">
          <div className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by order number, item, or status…"
              className="h-10 pl-9 text-sm"
            />
          </div>

          <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
            {TYPE_TABS.map(({ key, label }) => (
              <Button
                key={key}
                type="button"
                className={cn(
                  'global_btn shrink-0 rounded_full',
                  type === key ? 'bg_primary' : 'outline_primary',
                )}
                onPress={() => setType(key)}
              >
                {label}
              </Button>
            ))}
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-end sm:gap-2">
              <div className="col-span-2 flex min-w-0 flex-col gap-1 sm:col-span-1 sm:w-44">
                <label className="text-xs font-medium text-gray-500">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="h-9 w-full rounded-sm border border-gray-200 bg-white px-3 text-sm text-gray-700 outline-none transition-colors focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
                >
                  {STATUS_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-span-2 flex min-w-0 flex-col gap-1 sm:col-span-1 sm:w-44">
                <label className="text-xs font-medium text-gray-500">Payment</label>
                <select
                  value={paymentStatus}
                  onChange={(e) => setPaymentStatus(e.target.value)}
                  className="h-9 w-full rounded-sm border border-gray-200 bg-white px-3 text-sm text-gray-700 outline-none transition-colors focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
                >
                  {PAYMENT_STATUS_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex min-w-0 flex-col gap-1 sm:w-40">
                <label className="text-xs font-medium text-gray-500">From</label>
                <Input
                  type="date"
                  value={fromDate}
                  max={toDate || undefined}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="h-9 w-full text-sm rounded-sm!"
                />
              </div>
              <div className="flex min-w-0 flex-col gap-1 sm:w-40">
                <label className="text-xs font-medium text-gray-500">To</label>
                <Input
                  type="date"
                  value={toDate}
                  min={fromDate || undefined}
                  onChange={(e) => setToDate(e.target.value)}
                  className="h-9 w-full text-sm rounded-sm!"
                />
              </div>
              {hasActiveFilters ? (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="col-span-2 inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-red-200 px-3 text-sm text-red-600 transition-colors hover:bg-red-50 sm:col-span-1"
                >
                  <X className="h-3.5 w-3.5" />
                  Clear
                </button>
              ) : null}
            </div>
            <p className="shrink-0 text-sm text-gray-500">
              {total} order{total !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        <div className={cn('p-4 sm:p-6 transition-opacity', isFetching ? 'opacity-60' : '')}>
          {orders.length > 0 ? (
            <div className="space-y-3">
              {orders.map((order) => (
                <OrderCard
                  key={order._id || order.id}
                  order={order}
                  onDownloadInvoice={handleDownloadInvoice}
                  isDownloading={invoiceDownloadingOrderId === order._id}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-gray-200 bg-gray-50/60 px-6 py-12 text-center">
              <div className="mx-auto max-w-md">
                <span className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-md border border-gray-200 bg-white">
                  <ShoppingBag className="h-5 w-5 text-primary" aria-hidden />
                </span>
                <h3 className="mb-2 text-base font-semibold text-gray-900">
                  {hasActiveFilters ? 'No orders match your filters' : 'No orders yet'}
                </h3>
                <p className="mb-6 text-sm text-gray-500">
                  {hasActiveFilters
                    ? 'Try adjusting search, status, payment, type, or date range.'
                    : 'When you purchase a series or blueprint, your orders will show up here.'}
                </p>
                {hasActiveFilters ? (
                  <Button
                    type="button"
                    onPress={clearFilters}
                    className="global_btn mx-auto rounded_full outline_primary"
                  >
                    Clear Filters
                  </Button>
                ) : (
                  <Button
                    className="global_btn mx-auto rounded_full bg_primary"
                    onPress={scrollToContent}
                  >
                    Explore content
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>

        {totalPages > 1 ? (
          <div className="flex flex-col gap-3 border-t border-gray-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <p className="text-sm text-gray-500">
              Page <span className="font-medium text-gray-700">{currentPage}</span> of{' '}
              <span className="font-medium text-gray-700">{totalPages}</span>
            </p>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                className="global_btn rounded_full outline_primary"
                isDisabled={currentPage <= 1 || isFetching}
                onPress={() => setPage((prev) => Math.max(1, prev - 1))}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <Button
                type="button"
                className="global_btn rounded_full outline_primary"
                isDisabled={currentPage >= totalPages || isFetching}
                onPress={() => setPage((prev) => Math.min(totalPages, prev + 1))}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
