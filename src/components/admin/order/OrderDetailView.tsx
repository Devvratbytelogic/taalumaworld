'use client';

import type { ReactNode } from 'react';
import { useState } from 'react';
import Link from 'next/link';
import Cookies from 'js-cookie';
import moment from 'moment';
import { ArrowLeft, Download, ShoppingBag, User } from 'lucide-react';
import Button from '@/components/ui/Button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/components/ui/utils';
import {
  AdminPage,
  AdminPageHeader,
  AdminPanel,
  AdminSectionHeader,
} from '@/components/admin/layout/AdminContent';
import { useGetOrderByIdQuery } from '@/store/rtkQueries/adminGetApi';
import { getAdminSectionRoutePath } from '@/routes/routes';
import { API_BASE_URL } from '@/utils/config';

const PAYMENT_STATUS_BADGE_CLASS: Record<string, string> = {
  paid: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  unpaid: 'bg-red-50 text-red-700 border-red-200',
  partial: 'bg-amber-50 text-amber-700 border-amber-200',
};

const ORDER_STATUS_BADGE_CLASS: Record<string, string> = {
  completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  cancelled: 'bg-red-50 text-red-700 border-red-200',
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

  const statusKey = (order.status || '').toLowerCase();
  const paymentStatusKey = (order.paymentStatus || '').toLowerCase();

  return (
    <AdminPage>
      <Link
        href={getAdminSectionRoutePath('orders')}
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
              <p className="text-sm text-muted-foreground">{order.paymentType}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge
              variant="outline"
              className={cn('capitalize', ORDER_STATUS_BADGE_CLASS[statusKey] ?? 'bg-gray-50 text-gray-600 border-gray-200')}
            >
              {order.status || '—'}
            </Badge>
            <Badge
              variant="outline"
              className={cn('capitalize', PAYMENT_STATUS_BADGE_CLASS[paymentStatusKey] ?? 'bg-gray-50 text-gray-600 border-gray-200')}
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
          <DetailRow label="Customer ID" value={order.customer?.id} />
          <DetailRow label="Phone" value={order.customer?.phone} />
        </dl>
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
          <DetailRow
            label="Coupon Discount"
            value={order.couponDiscount != null ? `KSH ${Number(order.couponDiscount).toFixed(2)}` : null}
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
                <p className="text-xs text-muted-foreground capitalize">
                  {item.type} · Qty {item.quantity}
                </p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-semibold text-primary">KSH {(item.total ?? 0).toFixed(2)}</p>
                <p className="text-xs text-muted-foreground">KSH {(item.price ?? 0).toFixed(2)} each</p>
              </div>
            </div>
          ))}
        </div>
      </AdminPanel>

      {/* Totals */}
      <AdminPanel className="p-6">
        <AdminSectionHeader title="Totals" />
        <dl className="space-y-2.5">
          <div className="flex items-center justify-between text-sm">
            <dt className="text-muted-foreground">Discount</dt>
            <dd className="font-medium">KSH {(order.discountAmount ?? 0).toFixed(2)}</dd>
          </div>
          <div className="flex items-center justify-between text-sm">
            <dt className="text-muted-foreground">Tax</dt>
            <dd className="font-medium">KSH {(order.taxAmount ?? 0).toFixed(2)}</dd>
          </div>
          <div className="flex items-center justify-between text-base pt-2.5 border-t border-border">
            <dt className="font-semibold">Total</dt>
            <dd className="font-bold text-primary">KSH {(order.totalAmount ?? 0).toFixed(2)}</dd>
          </div>
        </dl>
      </AdminPanel>
    </AdminPage>
  );
}
