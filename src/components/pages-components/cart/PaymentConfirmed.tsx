'use client';

import type { ReactNode } from 'react';
import { CheckCircle } from 'lucide-react';
import moment from 'moment';
import Button from '@/components/ui/Button';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';
import {
  getUserDashboardMyOrderDetailRoutePath,
  getUserDashboardRoutePath,
} from '@/routes/routes';
import { formatKes } from '@/constants/common';

export type PaymentConfirmedDetails = {
  amount?: number | null;
  currency?: string | null;
  paymentStatus?: string | null;
  paymentMethod?: string | null;
  reference?: string | null;
  invoiceNumber?: string | null;
  transactionId?: string | null;
  orderId?: string | null;
  paidAt?: string | null;
};

interface PaymentConfirmedProps {
  transactionId?: string | null;
  orderNumber?: string | null;
  details?: PaymentConfirmedDetails | null;
}

function DetailRow({ label, value }: { label: string; value?: ReactNode }) {
  if (value === undefined || value === null || value === '') return null;

  return (
    <div className="min-w-0 text-left">
      <dt className="text-[11px] font-medium uppercase tracking-wide text-gray-400">{label}</dt>
      <dd className="mt-1 text-sm font-medium text-gray-800 wrap-break-word">{value}</dd>
    </div>
  );
}

function formatPaidAt(paidAt?: string | null) {
  if (!paidAt) return null;
  const parsed = moment(paidAt);
  return parsed.isValid() ? parsed.format('DD MMM YYYY, hh:mm A') : paidAt;
}

function formatAmount(amount?: number | null, currency?: string | null) {
  if (amount == null) return null;
  if (!currency || currency.toUpperCase() === 'KES') return formatKes(amount);
  return `${currency} ${amount.toLocaleString()}`;
}

export default function PaymentConfirmed({
  transactionId,
  orderNumber,
  details,
}: PaymentConfirmedProps) {
  const router = useRouter();
  const referenceId = details?.reference || transactionId || orderNumber;
  const invoiceNumber = details?.invoiceNumber && details.invoiceNumber !== details.reference
    ? details.invoiceNumber
    : null;
  const displayTransactionId = details?.transactionId || transactionId;
  const amountLabel = formatAmount(details?.amount, details?.currency);
  const paidAtLabel = formatPaidAt(details?.paidAt);
  const hasDetails = Boolean(details);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 py-12">
      <div className="mx-auto w-full max-w-lg sm:px-4">
        <div className="rounded-md border border-border bg-white p-8 text-center md:p-12">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-success/10">
            <CheckCircle className="h-12 w-12 text-success" />
          </div>
          <h1 className="mb-3 text-3xl font-bold">Order Confirmed!</h1>
          {hasDetails ? (
            <>
              {referenceId ? (
                <p className="mb-1 text-sm font-medium text-muted-foreground">
                  Reference{' '}
                  <span className="font-semibold text-foreground">{referenceId}</span>
                </p>
              ) : null}
              {amountLabel ? (
                <p className="mb-4 text-2xl font-bold text-primary">{amountLabel}</p>
              ) : null}
              <dl className="mb-6 grid grid-cols-1 gap-4 rounded-md border border-border bg-muted/30 p-4 sm:grid-cols-2">
                <DetailRow
                  label="Payment Status"
                  value={
                    details?.paymentStatus ? (
                      <Badge
                        variant="outline"
                        className="bg-emerald-50 text-emerald-700 border-emerald-200!"
                      >
                        {details.paymentStatus}
                      </Badge>
                    ) : null
                  }
                />
                <DetailRow label="Payment Method" value={details?.paymentMethod} />
                <DetailRow label="Transaction ID" value={displayTransactionId} />
                <DetailRow label="Invoice #" value={invoiceNumber} />
                <DetailRow label="Paid At" value={paidAtLabel} />
              </dl>
            </>
          ) : referenceId ? (
            <p className="mb-3 text-sm font-medium text-muted-foreground">
              {transactionId ? 'Transaction ID' : 'Order Number'}{' '}
              <span className="font-semibold text-foreground">{referenceId}</span>
            </p>
          ) : null}

          <p className="mb-8 text-muted-foreground">
            Your blueprints are now unlocked and ready to read. Head to your dashboard to start
            exploring.
          </p>
          <div className="space-y-3">
            {details?.orderId ? (
              <Button
                size="lg"
                className="global_btn rounded_full outline_primary w-full"
                onPress={() => router.push(getUserDashboardMyOrderDetailRoutePath(details.orderId!))}
              >
                View Order
              </Button>
            ) : null}
            <Button
              size="lg"
              className="global_btn rounded_full bg_primary w-full"
              onPress={() => router.push(getUserDashboardRoutePath())}
            >
              Go to Dashboard
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
