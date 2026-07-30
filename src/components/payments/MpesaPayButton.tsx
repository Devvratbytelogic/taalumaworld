'use client';

import { useEffect } from 'react';
import { Loader2, Smartphone } from 'lucide-react';
import { cn } from '@/components/ui/utils';
import {
  useMpesaPaymentFlow,
  type MpesaPaymentSuccessResult,
} from '@/hooks/useMpesaPaymentFlow';
import { MpesaPhoneModal } from '@/components/payments/MpesaPhoneModal';
import { MpesaWaitModal } from '@/components/payments/MpesaWaitModal';

type MpesaPayButtonProps = {
  cartID?: string;
  chapterID?: string;
  type?: string;
  acceptedAgreementIds?: string[];
  isDisabled?: boolean;
  label?: string;
  className?: string;
  /** Return false to block starting payment (e.g. missing address / agreements). */
  onBeforePay?: () => boolean;
  onSuccess: (result?: MpesaPaymentSuccessResult) => void | Promise<void>;
  onLoadingChange?: (isLoading: boolean) => void;
};

export function MpesaPayButton({
  cartID,
  chapterID,
  type,
  acceptedAgreementIds = [],
  isDisabled = false,
  label = 'Pay with M-Pesa',
  className,
  onBeforePay,
  onSuccess,
  onLoadingChange,
}: MpesaPayButtonProps) {
  const { startPayment, isInitiating, phoneModalProps, waitModalProps } = useMpesaPaymentFlow({
    cartID,
    chapterID,
    type,
    acceptedAgreementIds,
    onSuccess,
  });

  useEffect(() => {
    onLoadingChange?.(isInitiating);
  }, [isInitiating, onLoadingChange]);

  const disabled = isDisabled || isInitiating;

  const handlePay = () => {
    if (disabled) return;
    if (onBeforePay && !onBeforePay()) return;
    startPayment();
  };

  return (
    <>
      <button
        type="button"
        disabled={disabled}
        onClick={handlePay}
        aria-busy={isInitiating}
        className={cn(
          'flex w-full items-center justify-between gap-3 rounded-md border border-primary/25 bg-primary/5 px-3 py-3 text-left transition-colors',
          'hover:border-primary/40 hover:bg-primary/10',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30',
          'disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-primary/25 disabled:hover:bg-primary/5',
          className,
        )}
      >
        <span className="flex min-w-0 items-center gap-2">
          {isInitiating ? (
            <Loader2 className="h-4 w-4 shrink-0 animate-spin text-primary" />
          ) : (
            <Smartphone className="h-4 w-4 shrink-0 text-primary" />
          )}
          <span className="min-w-0">
            <span className="block text-sm font-medium text-gray-900">
              {isInitiating ? 'Processing…' : label}
            </span>
            <span className="block text-xs text-gray-500">
              Tap to pay securely via M-Pesa
            </span>
          </span>
        </span>

        <span className="shrink-0 text-right">
          <span className="block text-[11px] font-medium uppercase tracking-wide text-gray-400">
            Method
          </span>
          <span className="block text-sm font-semibold text-primary">M-Pesa</span>
        </span>
      </button>

      <MpesaPhoneModal {...phoneModalProps} />
      <MpesaWaitModal {...waitModalProps} />
    </>
  );
}
