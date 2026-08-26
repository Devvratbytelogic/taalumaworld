'use client';

import { useEffect } from 'react';
import { CreditCard, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/components/ui/utils';
import { VISIBLE } from '@/constants/contentMode';
import { usePaystackPaymentMutation } from '@/store/rtkQueries/userPostAPI';

export type PaystackPayPayload = {
  cart_id?: string;
  chapter_id?: string;
  book_id?: string;
  type?: string;
  accepted_agreement_ids?: string[];
};

type PaystackPayResult = {
  http_status_code?: number;
  success?: boolean;
  status?: boolean;
  message?: string;
  data?: {
    authorization_url?: string;
    authorizationUrl?: string;
    checkout_url?: string;
    redirect_url?: string;
    url?: string;
    access_code?: string;
    reference?: string;
    transaction_id?: string;
    order_number?: string | number;
    gateway?: {
      authorization_url?: string;
      authorizationUrl?: string;
      checkout_url?: string;
      redirect_url?: string;
      url?: string;
      access_code?: string;
      response?: {
        authorization_url?: string;
        authorizationUrl?: string;
        checkout_url?: string;
        access_code?: string;
      };
    };
  };
};

type PaystackPayButtonProps = {
  cartID?: string;
  chapterID?: string;
  type?: string;
  acceptedAgreementIds?: string[];
  isDisabled?: boolean;
  label?: string;
  className?: string;
  /** Return false to block starting payment (e.g. missing address / agreements). */
  onBeforePay?: () => boolean;
  onSuccess?: (result?: { transactionId?: string; orderNumber?: string }) => void | Promise<void>;
  onLoadingChange?: (isLoading: boolean) => void;
};

function firstHttpUrl(...values: Array<string | undefined>): string | undefined {
  return values.find((value) => typeof value === 'string' && /^https?:\/\//i.test(value));
}

function getPaystackCheckoutUrl(res?: PaystackPayResult): string | undefined {
  const data = res?.data;
  const gateway = data?.gateway;
  const gatewayResponse = gateway?.response;
  const accessCode =
    data?.access_code ?? gateway?.access_code ?? gatewayResponse?.access_code;

  return firstHttpUrl(
    data?.authorization_url,
    data?.authorizationUrl,
    data?.checkout_url,
    data?.redirect_url,
    data?.url,
    gateway?.authorization_url,
    gateway?.authorizationUrl,
    gateway?.checkout_url,
    gateway?.redirect_url,
    gateway?.url,
    gatewayResponse?.authorization_url,
    gatewayResponse?.authorizationUrl,
    gatewayResponse?.checkout_url,
    accessCode ? `https://checkout.paystack.com/${accessCode}` : undefined,
  );
}

export function PaystackPayButton({
  cartID,
  chapterID,
  type,
  acceptedAgreementIds = [],
  isDisabled = false,
  label = 'Pay with Paystack',
  className,
  onBeforePay,
  onSuccess,
  onLoadingChange,
}: PaystackPayButtonProps) {
  const [paystackPay, { isLoading }] = usePaystackPaymentMutation();
  const disabled = isDisabled || isLoading;

  useEffect(() => {
    onLoadingChange?.(isLoading);
  }, [isLoading, onLoadingChange]);

  const handlePay = async () => {
    if (disabled) return;
    if (onBeforePay && !onBeforePay()) return;

    const payload: PaystackPayPayload = {
      type,
      accepted_agreement_ids: acceptedAgreementIds,
      ...(cartID ? { cart_id: cartID } : {}),
      ...(chapterID
        ? type === VISIBLE.BOOK
          ? { book_id: chapterID }
          : { chapter_id: chapterID }
        : {}),
    };

    try {
      const res = (await paystackPay(payload).unwrap()) as PaystackPayResult;
      const checkoutUrl = getPaystackCheckoutUrl(res);
      if (checkoutUrl) {
        window.location.assign(checkoutUrl);
        return;
      }

      const isOk =
        res?.http_status_code === 200 ||
        res?.http_status_code === 201 ||
        res?.success ||
        res?.status;

      if (isOk) {
        const orderNumber =
          res?.data?.order_number != null ? String(res.data.order_number) : undefined;
        toast.success(res?.message ?? 'Payment successful');
        await Promise.resolve(
          onSuccess?.({
            transactionId: res?.data?.transaction_id ?? res?.data?.reference,
            orderNumber,
          }),
        );
        return;
      }

      toast.error('Could not start Paystack payment', {
        description: 'Please try again or contact support.',
      });
    } catch (error) {
      console.error('Paystack payment failed', error);
    }
  };

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={handlePay}
      aria-busy={isLoading}
      className={cn(
        'flex w-full items-center justify-between gap-3 rounded-md border border-primary/25 bg-primary/5 px-3 py-3 text-left transition-colors',
        'hover:border-primary/40 hover:bg-primary/10',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30',
        'disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-primary/25 disabled:hover:bg-primary/5',
        className,
      )}
    >
      <span className="flex min-w-0 items-center gap-2">
        {isLoading ? (
          <Loader2 className="h-4 w-4 shrink-0 animate-spin text-primary" />
        ) : (
          <CreditCard className="h-4 w-4 shrink-0 text-primary" />
        )}
        <span className="min-w-0">
          <span className="block text-sm font-medium text-gray-900">
            {isLoading ? 'Processing…' : label}
          </span>
          <span className="block text-xs text-gray-500">
            Pay securely with card, bank, or USSD
          </span>
        </span>
      </span>

      <span className="shrink-0 text-right">
        <span className="block text-[11px] font-medium uppercase tracking-wide text-gray-400">
          Method
        </span>
        <span className="block text-sm font-semibold text-primary">Paystack</span>
      </span>
    </button>
  );
}
