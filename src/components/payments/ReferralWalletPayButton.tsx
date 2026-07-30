'use client';

import { useEffect } from 'react';
import { Loader2, Wallet } from 'lucide-react';
import { toast } from 'sonner';
import { formatKes } from '@/constants/common';
import { cn } from '@/components/ui/utils';
import { useGetReferralWalletLedgerQuery } from '@/store/rtkQueries/dashboard';
import { useReferralWalletPayMutation } from '@/store/rtkQueries/userPostAPI';

export type ReferralWalletPayPayload = {
  cart_id?: string;
  chapter_id?: string;
  book_id?: string;
  gift_email?: string;
  type?: string;
  accepted_agreement_ids?: string[];
};

type ReferralWalletPayButtonProps = {
  totalPaymentRequired: number;
  payload: ReferralWalletPayPayload;
  label?: string;
  className?: string;
  isDisabled?: boolean;
  /** Return false to block the payment request (e.g. missing address / agreements). */
  onBeforePay?: () => boolean;
  onSuccess?: (response?: unknown) => void;
  onLoadingChange?: (isLoading: boolean) => void;
};

export function ReferralWalletPayButton({
  totalPaymentRequired,
  payload,
  label = 'Pay with Referral Wallet',
  className,
  isDisabled = false,
  onBeforePay,
  onSuccess,
  onLoadingChange,
}: ReferralWalletPayButtonProps) {
  const { data: walletData, isLoading: isBalanceLoading } = useGetReferralWalletLedgerQuery();
  const [referralWalletPay, { isLoading }] = useReferralWalletPayMutation();

  const balance = walletData?.data?.summary?.balance ?? 0;
  const hasSufficientBalance = balance >= totalPaymentRequired;
  const disabled = isDisabled || isLoading || isBalanceLoading || !hasSufficientBalance;

  useEffect(() => {
    onLoadingChange?.(isLoading);
  }, [isLoading, onLoadingChange]);

  const handlePay = async () => {
    if (disabled) return;
    if (onBeforePay && !onBeforePay()) return;

    try {
      const res = await referralWalletPay(payload).unwrap();
      if (res?.http_status_code === 200 || res?.http_status_code === 201 || res?.success) {
        toast.success(res?.message ?? 'Payment successful');
        onSuccess?.(res);
        return;
      }
    } catch (error) {
      console.error('Referral wallet payment failed', error);
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
          <Wallet className="h-4 w-4 shrink-0 text-primary" />
        )}
        <span className="min-w-0">
          <span className="block text-sm font-medium text-gray-900">
            {isLoading ? 'Processing…' : label}
          </span>
          <span className="block text-xs text-gray-500">
            {hasSufficientBalance
              ? 'Tap to pay with wallet balance'
              : `Insufficient wallet balance · Need ${formatKes(totalPaymentRequired)}`}
          </span>
        </span>
      </span>

      <span className="shrink-0 text-right">
        <span className="block text-[11px] font-medium uppercase tracking-wide text-gray-400">
          Balance
        </span>
        <span className="block text-sm font-semibold text-primary">
          {isBalanceLoading ? '…' : formatKes(balance)}
        </span>
      </span>
    </button>
  );
}
