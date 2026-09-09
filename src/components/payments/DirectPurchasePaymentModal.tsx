'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { AlertCircle, BookOpen, Check, Loader2, ReceiptText } from 'lucide-react';
import moment from 'moment';
import { Modal, ModalBody, ModalContent } from '@heroui/react';
import Button from '@/components/ui/Button';
import { Badge } from '@/components/ui/badge';
import { formatKes } from '@/constants/common';
import { rtkQuerieSetup } from '@/store/services/rtkQuerieSetup';
import { useAppDispatch } from '@/store/hooks';
import { useVerifyPaystackPaymentQuery } from '@/store/rtkQueries/userGetAPI';
import {
  getBlueprintRoutePath,
  getPurchasedBlueprintRoutePath,
  getPurchasedSeriesRoutePath,
  getSeriesRoutePath,
  getUserDashboardMyOrderDetailRoutePath,
} from '@/routes/routes';
import { getPaystackVerifyOutcome } from '@/utils/paystackReturn';

const modalClassNames = {
  base: 'max-w-md overflow-hidden rounded-2xl shadow-xl',
  wrapper: 'px-4 py-10 sm:px-6',
  body: 'p-0',
  closeButton: 'z-10 bg-white/90 backdrop-blur-sm rounded-full! right-2 top-2',
};

type DirectPurchasePaymentModalProps = {
  reference: string;
  kind: 'blueprint' | 'series';
  slug: string;
};

function DetailRow({ label, value }: { label: string; value?: ReactNode }) {
  if (value === undefined || value === null || value === '') return null;

  return (
    <div className="flex items-start justify-between gap-4 px-4 py-3">
      <dt className="shrink-0 text-[11px] font-medium uppercase tracking-wide text-gray-400">{label}</dt>
      <dd className="min-w-0 text-right text-sm font-medium text-gray-800 wrap-break-word">{value}</dd>
    </div>
  );
}

export default function DirectPurchasePaymentModal({
  reference,
  kind,
  slug,
}: DirectPurchasePaymentModalProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [isOpen, setIsOpen] = useState(true);
  const [shouldPoll, setShouldPoll] = useState(true);
  const { data, isLoading, isError } = useVerifyPaystackPaymentQuery(reference, {
    pollingInterval: shouldPoll ? 2_000 : 0,
  });
  const outcome = getPaystackVerifyOutcome(data);
  const canClose = isError || outcome === 'completed' || outcome === 'failed';
  const pageHref = kind === 'series' ? getSeriesRoutePath(slug) : getBlueprintRoutePath(slug);
  const continueHref =
    kind === 'series' ? getPurchasedSeriesRoutePath(slug) : getPurchasedBlueprintRoutePath(slug);
  const continueLabel = kind === 'series' ? 'Open Series' : 'Start Reading';
  const itemLabel = kind === 'series' ? 'series' : 'blueprint';

  useEffect(() => {
    if (isError || outcome === 'completed' || outcome === 'failed') {
      setShouldPoll(false);
    }
  }, [isError, outcome]);

  useEffect(() => {
    if (outcome !== 'completed') return;
    dispatch(rtkQuerieSetup.util.invalidateTags(['Cart', 'AllChapters', 'MyChapters', 'SingleChapter']));
  }, [dispatch, outcome]);

  const stayOnPage = () => {
    if (!canClose) return;
    setIsOpen(false);
    router.replace(pageHref);
    router.refresh();
  };

  const paymentData = data?.data;
  const transaction = paymentData?.transaction;
  const transactionId =
    paymentData?.paystack_transaction_id ??
    paymentData?.transaction_id ??
    transaction?.transaction_id ??
    reference;
  const orderId = paymentData?.order_id ?? transaction?.order_id ?? undefined;
  const amount = paymentData?.amount ?? transaction?.amount;
  const currency = paymentData?.currency ?? transaction?.currency;
  const paymentStatus = paymentData?.payment_status ?? transaction?.payment_status;
  const paidAt = transaction?.paid_at ? moment(transaction.paid_at) : null;
  const amountLabel =
    amount == null
      ? null
      : !currency || currency.toUpperCase() === 'KES'
        ? formatKes(amount)
        : `${currency} ${amount.toLocaleString()}`;

  return (
    <Modal
      isOpen={isOpen}
      onClose={stayOnPage}
      hideCloseButton={!canClose}
      isDismissable={canClose}
      isKeyboardDismissDisabled={!canClose}
      className="modal_container"
      size="md"
      classNames={modalClassNames}
    >
      <ModalContent>
        <ModalBody className="gap-0 p-0">
          {isError || outcome === 'failed' ? (
            <div className="px-6 py-8 text-center sm:px-8">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-danger/10">
                <AlertCircle className="h-7 w-7 text-danger" />
              </div>
              <h2 className="mb-2 text-xl font-bold tracking-tight">Payment was not completed</h2>
              <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
                {data?.message || 'We could not confirm this Paystack payment. You can try again.'}
              </p>
              <Button size="lg" className="global_btn rounded_full bg_primary w-full" onPress={stayOnPage}>
                Try Again
              </Button>
            </div>
          ) : isLoading || outcome === 'pending' ? (
            <div className="px-6 py-10 text-center sm:px-8">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                <Loader2 className="h-7 w-7 animate-spin text-primary" />
              </div>
              <h2 className="mb-2 text-xl font-bold tracking-tight">Confirming payment</h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Please wait while we verify your Paystack payment.
              </p>
            </div>
          ) : (
            <>
              <div className="bg-linear-to-b from-emerald-50 to-white px-6 pb-2 pt-8 text-center sm:px-8">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500 text-white shadow-[0_8px_24px_rgba(16,185,129,0.35)]">
                  <Check className="h-8 w-8" strokeWidth={2.75} />
                </div>
                <p className="mb-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-600">
                  Payment successful
                </p>
                <h2 className="text-2xl font-bold tracking-tight">Order Confirmed</h2>
                {amountLabel ? (
                  <p className="mt-3 text-3xl font-bold tracking-tight text-primary">{amountLabel}</p>
                ) : null}
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  This {itemLabel} is now unlocked and ready to read.
                </p>
              </div>

              <div className="px-6 pb-6 pt-4 sm:px-8">
                <dl className="overflow-hidden rounded-xl border border-border bg-white">
                  <DetailRow label="Reference" value={reference} />
                  <div className="h-px bg-border" />
                  <DetailRow
                    label="Status"
                    value={
                      paymentStatus ? (
                        <Badge
                          variant="outline"
                          className="bg-emerald-50 text-emerald-700 border-emerald-200!"
                        >
                          {paymentStatus}
                        </Badge>
                      ) : null
                    }
                  />
                  <div className="h-px bg-border" />
                  <DetailRow label="Method" value={transaction?.payment_method ?? 'Paystack'} />
                  <div className="h-px bg-border" />
                  <DetailRow label="Transaction" value={transactionId} />
                  {paidAt?.isValid() ? (
                    <>
                      <div className="h-px bg-border" />
                      <DetailRow label="Paid at" value={paidAt.format('DD MMM YYYY, hh:mm A')} />
                    </>
                  ) : null}
                </dl>

                <div className="mt-5 flex flex-col gap-2.5 sm:flex-row">
                  <Button
                    size="lg"
                    className="global_btn rounded_full bg_primary h-12 w-full sm:flex-1"
                    startContent={<BookOpen className="h-4 w-4" />}
                    onPress={() => router.push(continueHref)}
                  >
                    {continueLabel}
                  </Button>
                  {orderId ? (
                    <Button
                      size="lg"
                      className="global_btn rounded_full outline_primary h-12 w-full sm:flex-1"
                      startContent={<ReceiptText className="h-4 w-4" />}
                      onPress={() => router.push(getUserDashboardMyOrderDetailRoutePath(orderId))}
                    >
                      View Order
                    </Button>
                  ) : null}
                </div>
              </div>
            </>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
