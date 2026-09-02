'use client';

import type { ReactNode } from 'react';
import { useState } from 'react';
import Link from 'next/link';
import moment from 'moment';
import { ArrowLeft, FileDown, ShoppingBag, TicketPercent } from 'lucide-react';
import Button from '@/components/ui/Button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/components/ui/utils';
import { useLazyGetTransactionInvoiceQuery, useUserGetOrderByIdQuery } from '@/store/rtkQueries/userGetAPI';
import { getUserDashboardMyOrdersRoutePath } from '@/routes/routes';
import { formatKes, formatKesOrFree, isZeroPrice } from '@/constants/common';
import { UserDashboardPageHeader } from './UserDashboardPageHeader';

function isPercentCouponType(couponType?: string | null) {
  const normalized = (couponType ?? '').toLowerCase();
  return normalized === 'percent' || normalized === 'percentage';
}

function getOrderTypeLabel(type?: string | null) {
  const value = (type ?? '').toLowerCase();
  if (value === 'books' || value === 'book') return 'Series';
  if (value === 'chapter' || value === 'blueprint') return 'Blueprint';
  if (value === 'cart') return 'Cart';
  if (!value) return 'Order';
  return type;
}

const PAYMENT_STATUS_BADGE_CLASS: Record<string, string> = {
  paid: 'bg-emerald-50 text-emerald-700 border-emerald-200!',
  unpaid: 'bg-red-50 text-red-700 border-red-200!',
  pending: 'bg-amber-50 text-amber-700 border-amber-200!',
  partial: 'bg-sky-50 text-sky-700 border-sky-200!',
};

function DetailRow({ label, value }: { label: string; value?: ReactNode }) {
  return (
    <div className="min-w-0">
      <dt className="text-xs font-medium uppercase tracking-wide text-gray-400">{label}</dt>
      <dd className="mt-1 text-sm text-gray-700 wrap-break-word">
        {value === undefined || value === null || value === '' ? '—' : value}
      </dd>
    </div>
  );
}

function Panel({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn('rounded-lg border border-gray-200 bg-white p-4 sm:p-6', className)}>
      {children}
    </div>
  );
}

function PanelTitle({ children }: { children: ReactNode }) {
  return <h2 className="mb-4 text-sm font-semibold text-gray-900">{children}</h2>;
}

export function MyOrderDetailPage({ orderId }: { orderId: string }) {
  const { data, isLoading } = useUserGetOrderByIdQuery(orderId);
  const [fetchTransactionInvoice] = useLazyGetTransactionInvoiceQuery();
  const [isDownloading, setIsDownloading] = useState(false);
  const order = data?.data;

  const handleDownloadInvoice = async () => {
    if (!order?.id) return;
    setIsDownloading(true);
    try {
      const blob = await fetchTransactionInvoice({ orderId: order.id }).unwrap();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `invoice-${order.invoiceNumber ?? order.id}.pdf`;
      a.rel = 'noopener';
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } finally {
      setIsDownloading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-5 w-32 animate-pulse rounded bg-gray-100" />
        <div className="h-24 animate-pulse rounded-lg border border-gray-200 bg-white" />
        <div className="h-48 animate-pulse rounded-lg border border-gray-200 bg-white" />
        <div className="h-40 animate-pulse rounded-lg border border-gray-200 bg-white" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="space-y-6">
        <Link
          href={getUserDashboardMyOrdersRoutePath()}
          className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-gray-500 transition-colors hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to orders
        </Link>
        <Panel className="py-12 text-center text-sm text-gray-500">Order not found.</Panel>
      </div>
    );
  }

  const isFree = isZeroPrice(order.totalAmount);
  const paymentStatusKey = isFree ? 'paid' : (order.paymentStatus || '').toLowerCase();
  const couponTypeLabel = order.couponType;
  const isPercentCoupon = isPercentCouponType(order.couponType);
  const couponValueLabel =
    order.coupon_value != null
      ? isPercentCoupon
        ? `${Number(order.coupon_value)}%`
        : formatKesOrFree(Number(order.coupon_value))
      : null;

  return (
    <div className="space-y-6">
      <Link
        href={getUserDashboardMyOrdersRoutePath()}
        className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-gray-500 transition-colors hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to orders
      </Link>

      <UserDashboardPageHeader
        title={`Order #${order.orderId}`}
        description="Full details for this order"
      >
        {!isFree ? (
          <Button
            type="button"
            className="global_btn rounded_full bg_primary"
            isDisabled={isDownloading}
            onPress={handleDownloadInvoice}
          >
            <FileDown className="h-4 w-4" />
            {isDownloading ? 'Downloading…' : 'Download Invoice'}
          </Button>
        ) : null}
      </UserDashboardPageHeader>

      <Panel>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <ShoppingBag className="h-6 w-6" />
            </div>
            <div>
              <p className="text-lg font-semibold text-gray-900">{order.item}</p>
              <p className="text-sm text-gray-500 capitalize">
                {getOrderTypeLabel(order.paymentType ?? order.type)}
              </p>
            </div>
          </div>
          <Badge
            variant="outline"
            className={cn(
              'capitalize',
              PAYMENT_STATUS_BADGE_CLASS[paymentStatusKey] ?? 'bg-gray-50 text-gray-600 border-gray-200!',
            )}
          >
            {isFree ? 'Free' : order.paymentStatus || '—'}
          </Badge>
        </div>
        <p className="mt-4 text-3xl font-bold text-primary">{formatKesOrFree(order.totalAmount)}</p>
      </Panel>

      <Panel>
        <PanelTitle>Billing Address</PanelTitle>
        <dl className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3">
          <DetailRow label="Full Name" value={order.billing_address?.full_name} />
          <DetailRow label="Phone" value={order.billing_address?.phone} />
          <DetailRow label="Address Line 1" value={order.billing_address?.address_line1} />
          <DetailRow label="Address Line 2" value={order.billing_address?.address_line2} />
          <DetailRow label="Landmark" value={order.billing_address?.landmark} />
          <DetailRow label="City" value={order.billing_address?.city} />
          <DetailRow label="State" value={order.billing_address?.state} />
          <DetailRow label="Country" value={order.billing_address?.country} />
          <DetailRow label="Postal Code" value={order.billing_address?.postal_code} />
        </dl>
      </Panel>

      <Panel>
        <PanelTitle>Payment</PanelTitle>
        <dl className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3">
          <DetailRow label="Order #" value={order.orderId} />
          {!isFree ? <DetailRow label="Invoice #" value={order.invoiceNumber} /> : null}
          <DetailRow label="Transaction ID" value={order.transactionId} />
          <DetailRow label="Payment Method" value={order.paymentMethod} />
          <DetailRow label="Coupon Code" value={order.couponCode} />
          <DetailRow label="Coupon Type" value={couponTypeLabel} />
          <DetailRow label="Coupon Value" value={couponValueLabel} />
          <DetailRow
            label="Coupon Discount"
            value={order.couponDiscount != null ? formatKesOrFree(Number(order.couponDiscount)) : null}
          />
          {!isFree ? (
            <DetailRow
              label="Tax Percent"
              value={order.tax_percent != null ? `${Number(order.tax_percent)}%` : null}
            />
          ) : null}
          <DetailRow
            label={isFree ? 'Completed' : 'Paid At'}
            value={order.paidAt ? moment(order.paidAt).format('DD MMM YYYY, hh:mm A') : null}
          />
          <DetailRow
            label="Created"
            value={order.createdAt ? moment(order.createdAt).format('DD MMM YYYY, hh:mm A') : null}
          />
        </dl>
      </Panel>

      <Panel>
        <PanelTitle>{`Items (${order.itemCount ?? order.items?.length ?? 0})`}</PanelTitle>
        <div className="divide-y divide-gray-100">
          {(order.items ?? []).map((item) => (
            <div key={item.id} className="flex items-center justify-between gap-4 py-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-gray-900">{item.title}</p>
                <p className="text-xs text-gray-500">
                  {getOrderTypeLabel(item.legacyType ?? item.type)} · Qty {item.quantity}
                </p>
              </div>
              <p className="shrink-0 text-sm font-semibold text-primary">
                {formatKesOrFree(item.total)}
              </p>
            </div>
          ))}
        </div>
      </Panel>

      <Panel>
        <PanelTitle>Order Summary</PanelTitle>
        <dl className="space-y-2.5">
          <div className="flex items-center justify-between text-sm">
            <dt className="text-gray-500">Items</dt>
            <dd className="font-medium text-gray-800">{order.itemCount ?? order.items?.length ?? 0}</dd>
          </div>
          {(order.discountAmount ?? 0) > 0 || (order.couponDiscount ?? 0) > 0 ? (
            <div className="flex items-center justify-between text-sm">
              <dt className="text-gray-500">
                Discount
                {isPercentCoupon && order.coupon_value != null
                  ? ` (${Number(order.coupon_value)}%)`
                  : ''}
              </dt>
              <dd className="font-medium text-emerald-600">
                -{formatKes(Number(order.couponDiscount ?? order.discountAmount ?? 0))}
              </dd>
            </div>
          ) : null}
          {(order.taxAmount ?? 0) > 0 || !isFree ? (
            <div className="flex items-center justify-between text-sm">
              <dt className="text-gray-500">
                Tax{order.tax_percent != null ? ` (${Number(order.tax_percent)}%)` : ''}
              </dt>
              <dd className="font-medium text-gray-800">{formatKes(order.taxAmount ?? 0)}</dd>
            </div>
          ) : null}
        </dl>

        {order.couponCode ? (
          <div className="mt-4 flex items-center justify-between gap-2 rounded-md border border-emerald-200 bg-emerald-50/60 px-3 py-2.5">
            <div className="flex min-w-0 items-center gap-2 text-sm">
              <TicketPercent className="h-4 w-4 shrink-0 text-emerald-600" />
              <span className="truncate font-semibold text-emerald-700">{order.couponCode}</span>
              <span className="text-gray-500">applied</span>
              {couponTypeLabel || couponValueLabel ? (
                <span className="truncate text-gray-500">
                  ({[couponTypeLabel, couponValueLabel].filter(Boolean).join(' · ')})
                </span>
              ) : null}
            </div>
          </div>
        ) : null}

        <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3 text-base">
          <span className="font-semibold text-gray-900">Total</span>
          <span className="font-bold text-primary">{formatKesOrFree(order.totalAmount)}</span>
        </div>
      </Panel>
    </div>
  );
}
