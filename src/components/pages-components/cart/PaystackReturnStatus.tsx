'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AlertCircle, Loader2 } from 'lucide-react';
import Button from '@/components/ui/Button';
import { getCartCheckoutRoutePath } from '@/routes/routes';
import { rtkQuerieSetup } from '@/store/services/rtkQuerieSetup';
import { useAppDispatch } from '@/store/hooks';
import {
  useVerifyPaystackPaymentQuery,
  type PaystackVerifyResponse,
} from '@/store/rtkQueries/userGetAPI';
import PaymentConfirmed from './PaymentConfirmed';

type VerifyOutcome = 'pending' | 'completed' | 'failed';

const SUCCESS_STATUSES = new Set(['success', 'successful', 'completed', 'paid']);
const FAILED_STATUSES = new Set([
  'failed',
  'fail',
  'cancelled',
  'canceled',
  'cancel',
  'abandoned',
  'unpaid',
]);

function normalizeStatus(value?: string | null) {
  return value?.trim().toLowerCase() ?? '';
}

function getPaystackVerifyOutcome(res?: PaystackVerifyResponse): VerifyOutcome {
  const raw =
    normalizeStatus(res?.data?.status) || normalizeStatus(res?.data?.payment_status);

  if (SUCCESS_STATUSES.has(raw)) return 'completed';
  if (FAILED_STATUSES.has(raw)) return 'failed';
  if (raw === 'pending' || raw === 'processing') return 'pending';
  if (!raw && (res?.success || res?.status || res?.http_status_code === 200)) {
    return 'completed';
  }
  return 'pending';
}

function PaymentFailed({ message }: { message?: string }) {
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 py-12">
      <div className="mx-auto max-w-lg sm:px-4">
        <div className="rounded-md border border-border bg-white p-8 text-center md:p-12">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-danger/10">
            <AlertCircle className="h-12 w-12 text-danger" />
          </div>
          <h1 className="mb-3 text-3xl font-bold">Payment was not completed</h1>
          <p className="mb-8 text-muted-foreground">
            {message || 'We could not confirm this Paystack payment. You can return to checkout and try again.'}
          </p>
          <Button
            size="lg"
            className="global_btn rounded_full bg_primary w-full"
            onPress={() => router.replace(getCartCheckoutRoutePath())}
          >
            Back to Checkout
          </Button>
        </div>
      </div>
    </div>
  );
}

function PaymentVerifying() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 py-12">
      <div className="mx-auto max-w-lg sm:px-4">
        <div className="rounded-md border border-border bg-white p-8 text-center md:p-12">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>
          <h1 className="mb-3 text-3xl font-bold">Confirming payment</h1>
          <p className="text-muted-foreground">
            Please wait while we verify your Paystack payment.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function PaystackReturnStatus({ reference }: { reference: string }) {
  const dispatch = useAppDispatch();
  const [shouldPoll, setShouldPoll] = useState(true);
  const { data, isLoading, isError } = useVerifyPaystackPaymentQuery(reference, {
    pollingInterval: shouldPoll ? 2_000 : 0,
  });
  const outcome = getPaystackVerifyOutcome(data);

  useEffect(() => {
    if (isError || outcome === 'completed' || outcome === 'failed') {
      setShouldPoll(false);
    }
  }, [isError, outcome]);

  useEffect(() => {
    if (outcome !== 'completed') return;
    dispatch(rtkQuerieSetup.util.invalidateTags(['Cart', 'AllChapters', 'MyChapters']));
  }, [dispatch, outcome]);

  if (isError) {
    return <PaymentFailed />;
  }

  if (isLoading || outcome === 'pending') {
    return <PaymentVerifying />;
  }

  if (outcome === 'failed') {
    return <PaymentFailed message={data?.message} />;
  }

  const paymentData = data?.data;
  const transaction = paymentData?.transaction;
  const transactionId =
    paymentData?.paystack_transaction_id ??
    paymentData?.transaction_id ??
    transaction?.transaction_id ??
    reference;
  const orderNumber =
    paymentData?.order_number != null
      ? String(paymentData.order_number)
      : paymentData?.order_id ?? transaction?.order_id ?? undefined;

  return (
    <PaymentConfirmed
      transactionId={transactionId}
      orderNumber={orderNumber}
      details={{
        amount: paymentData?.amount ?? transaction?.amount,
        currency: paymentData?.currency ?? transaction?.currency,
        paymentStatus: paymentData?.payment_status ?? transaction?.payment_status,
        paymentMethod: transaction?.payment_method ?? 'Paystack',
        reference: paymentData?.reference ?? transaction?.receipt_number ?? reference,
        invoiceNumber: paymentData?.invoice_number ?? transaction?.invoice_number,
        transactionId,
        orderId: paymentData?.order_id ?? transaction?.order_id,
        paidAt: transaction?.paid_at,
      }}
    />
  );
}
