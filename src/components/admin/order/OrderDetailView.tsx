'use client';

import type { ReactNode } from 'react';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import moment from 'moment';
import { ArrowLeft, Download, ShoppingBag, TicketPercent, User } from 'lucide-react';
import Button from '@/components/ui/Button';
import { Badge } from '@/components/ui/badge';
import {
  AdminPage,
  AdminPageHeader,
  AdminPanel,
  AdminSectionHeader,
} from '@/components/admin/layout/AdminContent';
import { useGetOrderByIdQuery } from '@/store/rtkQueries/adminGetApi';
import { getOrdersListRoutePath, isMentorPanelPath } from '@/routes/routes';
import { API_BASE_URL } from '@/utils/config';
import { authFetch } from '@/utils/refreshSession';

function isPercentCouponType(couponType?: string | null) {
  const normalized = (couponType ?? '').toLowerCase();
  return normalized === 'percent' || normalized === 'percentage';
}

/** Maps API type values (book/chapter/etc.) to admin-facing labels. */
function getOrderTypeLabel(type?: string | null) {
  const value = (type ?? '').toLowerCase();
  if (value === 'books' || value === 'book') return 'Series';
  if (value === 'chapter' || value === 'blueprint') return 'Blueprint';
  if (!value) return 'Cart';
  return type;
}

const PAYMENT_STATUS_BADGE_CLASS: Record<string, string> = {
  paid: 'bg-emerald-50 text-emerald-700 border-emerald-200!',
  unpaid: 'bg-red-50 text-red-700 border-red-200!',
  partial: 'bg-amber-50 text-amber-700 border-amber-200!',
  failed: 'bg-red-50 text-red-700 border-red-200!',
};


function DetailRow({ label, value }: { label: string; value?: ReactNode }) {
  return (
    <div className="min-w-0">
      <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">{label}</dt>
      <dd className="mt-1 text-sm text-slate-700 wrap-break-word">
        {value === undefined || value === null || value === '' ? '-' : value}
      </dd>
    </div>
  );
}

interface DownloadInvoiceButtonProps {
  orderId: string;
  invoiceNumber?: number;
}

function DownloadInvoiceButton({ orderId, invoiceNumber }: DownloadInvoiceButtonProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  async function handleDownload() {
    setIsDownloading(true);
    try {
      const res = await authFetch(`${API_BASE_URL}/admin/invoice/${orderId}`, {
        method: 'GET',
      });
      if (!res.ok) throw new Error('Failed to download invoice');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `invoice-${invoiceNumber ?? orderId}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      // handled by disabling the button state below
    } finally {
      setIsDownloading(false);
    }
  }

  return (
    <Button
      type="button"
      className="global_btn rounded_full bg_primary"
      isLoading={isDownloading}
      isDisabled={isDownloading}
      onPress={handleDownload}
      startContent={!isDownloading && <Download className="h-4 w-4" />}
    >
      {isDownloading ? 'Downloading...' : 'Download Invoice'}
    </Button>
  );
}

interface OrderDetailViewProps {
  orderId: string;
}

export function OrderDetailView({ orderId }: OrderDetailViewProps) {
  const pathname = usePathname();
  const isMentor = isMentorPanelPath(pathname);
  const { data, isLoading } = useGetOrderByIdQuery(orderId);
  const order = data?.data;

  if (isLoading) {
    return (
      <AdminPage>
        <AdminPanel className="p-10 text-center text-sm text-slate-500">Loading order...</AdminPanel>
      </AdminPage>
    );
  }

  if (!order) {
    return (
      <AdminPage>
        <AdminPanel className="p-10 text-center text-sm text-slate-500">Order not found.</AdminPanel>
      </AdminPage>
    );
  }

  const paymentStatusKey = (order.paymentStatus || '').toLowerCase();
  const couponTypeLabel = order.couponType;
  const isPercentCoupon = isPercentCouponType(order.couponType);
  const couponValueLabel =
    order.coupon_value != null
      ? isPercentCoupon
        ? `${Number(order.coupon_value)}%`
        : `KSH ${Number(order.coupon_value).toFixed(2)}`
      : null;

  return (
    <AdminPage>
      <Link
        href={getOrdersListRoutePath(isMentor)}
        className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-slate-500 transition-colors hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to orders
      </Link>

      <AdminPageHeader title={`Order #${order.orderId}`} description="Full details for this order.">
        <DownloadInvoiceButton orderId={order.id} invoiceNumber={order.invoiceNumber} />
      </AdminPageHeader>

      {/* Summary */}
      <AdminPanel className="p-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
              <ShoppingBag className="h-6 w-6" />
            </div>
            <div>
              <p className="text-lg font-semibold">{order.item}</p>
              <p className="text-sm text-muted-foreground capitalize">
                {getOrderTypeLabel(order.paymentType ?? order.type)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge
              variant="outline"
              className={`capitalize ${PAYMENT_STATUS_BADGE_CLASS[paymentStatusKey] ?? 'bg-gray-50 text-gray-600 border-gray-200'}`}
            >
              {order.paymentStatus || '—'}
            </Badge>
          </div>
        </div>
        <p className="mt-4 text-3xl font-bold text-primary">KSH {(order.totalAmount ?? 0).toFixed(2)}</p>
      </AdminPanel>

      {/* Customer */}
      <AdminPanel className="p-6">
        <AdminSectionHeader title="Customer" />
        <div className="flex items-center gap-3 mb-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-muted-foreground shrink-0">
            <User className="h-4 w-4" />
          </div>
          <div>
            <p className="text-sm font-medium">{order.customer?.name ?? '—'}</p>
            <p className="text-xs text-muted-foreground">{order.customer?.email ?? '—'}</p>
          </div>
        </div>
        <dl className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          <DetailRow label="Phone" value={order.customer?.phone} />
        </dl>

        <div className="mt-6 border-t border-border pt-5">
          <p className="mb-4 text-xs font-medium uppercase tracking-wide text-slate-400">Billing Address</p>
          <dl className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
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
        </div>
      </AdminPanel>

      {/* Payment */}
      <AdminPanel className="p-6">
        <AdminSectionHeader title="Payment" />
        <dl className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          <DetailRow label="Order #" value={order.orderId} />
          <DetailRow label="Invoice #" value={order.invoiceNumber} />
          <DetailRow label="Transaction ID" value={order.transactionId} />
          <DetailRow label="Payment Method" value={order.paymentMethod} />
          <DetailRow label="Coupon Code" value={order.couponCode} />
          <DetailRow label="Coupon Type" value={couponTypeLabel} />
          <DetailRow label="Coupon Value" value={couponValueLabel} />
          <DetailRow
            label="Coupon Discount"
            value={order.couponDiscount != null ? `KSH ${Number(order.couponDiscount).toFixed(2)}` : null}
          />
          <DetailRow
            label="Tax Percent"
            value={order.tax_percent != null ? `${Number(order.tax_percent)}%` : null}
          />
          <DetailRow
            label="Paid At"
            value={order.paidAt ? moment(order.paidAt).format('DD MMM YYYY, hh:mm A') : null}
          />
          <DetailRow label="Created" value={moment(order.createdAt).format('DD MMM YYYY, hh:mm A')} />
        </dl>
      </AdminPanel>

      {/* Items */}
      <AdminPanel className="p-6">
        <AdminSectionHeader title={`Items (${order.itemCount ?? order.items?.length ?? 0})`} />
        <div className="divide-y divide-border">
          {(order.items ?? []).map((item) => (
            <div key={item.id} className="flex items-center justify-between gap-4 py-3">
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">{item.title}</p>
                <p className="text-xs text-muted-foreground">
                  {getOrderTypeLabel(item.legacyType ?? item.type)} · Qty {item.quantity}
                </p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-semibold text-primary">KSH {(item.total ?? 0).toFixed(2)}</p>
                {/* <p className="text-xs text-muted-foreground">KSH {(item.price ?? 0).toFixed(2)} each</p> */}
              </div>
            </div>
          ))}
        </div>
      </AdminPanel>

      {/* Totals */}
      <AdminPanel className="p-6">
        <AdminSectionHeader title="Order Summary" />
        <dl className="space-y-2.5">
          <div className="flex items-center justify-between text-sm">
            <dt className="text-muted-foreground">Items</dt>
            <dd className="font-medium">{order.itemCount ?? order.items?.length ?? 0}</dd>
          </div>
          {(order.discountAmount ?? 0) > 0 || (order.couponDiscount ?? 0) > 0 ? (
            <div className="flex items-center justify-between text-sm">
              <dt className="text-muted-foreground">
                Discount
                {isPercentCoupon && order.coupon_value != null
                  ? ` (${Number(order.coupon_value)}%)`
                  : ''}
              </dt>
              <dd className="font-medium text-success">
                -KSH {Number(order.couponDiscount ?? order.discountAmount ?? 0).toFixed(2)}
              </dd>
            </div>
          ) : null}
          <div className="flex items-center justify-between text-sm">
            <dt className="text-muted-foreground">
              Tax{order.tax_percent != null ? ` (${Number(order.tax_percent)}%)` : ''}
            </dt>
            <dd className="font-medium">KSH {(order.taxAmount ?? 0).toFixed(2)}</dd>
          </div>
        </dl>

        {order.couponCode ? (
          <div className="mt-4 flex items-center justify-between gap-2 rounded-md border border-success/30! bg-success/5 px-3 py-2.5">
            <div className="flex items-center gap-2 text-sm min-w-0">
              <TicketPercent className="h-4 w-4 shrink-0 text-success" />
              <span className="truncate font-semibold text-success">{order.couponCode}</span>
              <span className="text-muted-foreground">applied</span>
              {couponTypeLabel || couponValueLabel ? (
                <span className="text-muted-foreground truncate">
                  ({[couponTypeLabel, couponValueLabel].filter(Boolean).join(' · ')})
                </span>
              ) : null}
            </div>
          </div>
        ) : null}

        <div className="mt-4 flex items-center justify-between text-base pt-2.5 border-t border-border">
          <span className="font-semibold">Total</span>
          <span className="font-bold text-primary">KSH {(order.totalAmount ?? 0).toFixed(2)}</span>
        </div>
      </AdminPanel>
    </AdminPage>
  );
}
