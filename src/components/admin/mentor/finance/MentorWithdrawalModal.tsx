'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { ChevronLeft, Landmark, Smartphone, X } from 'lucide-react';
import Button from '@/components/ui/Button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import { formatKes } from '@/constants/common';
import { useGetAdminProfileQuery } from '@/store/rtkQueries/adminGetApi';
import { useCreateWithdrawalMutation, useGetWithdrawalLedgerQuery } from '@/store/rtkQueries/walletAPIs';
import toast from '@/utils/toast';
import { cn } from '@/components/ui/utils';

type PayoutMethod = 'bank' | 'mpesa';

interface MentorWithdrawalModalProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

function formatAmountDisplay(value: string) {
  if (!value) return '0.00';
  const [whole, decimal] = value.split('.');
  const formattedWhole = Number(whole || '0').toLocaleString('en-KE');
  if (decimal === undefined) return `${formattedWhole}.00`;
  return `${formattedWhole}.${decimal.padEnd(2, '0').slice(0, 2)}`;
}

function sanitizeAmountInput(raw: string) {
  const cleaned = raw.replace(/[^\d.]/g, '');
  const [whole, ...rest] = cleaned.split('.');
  if (rest.length === 0) return whole;
  return `${whole}.${rest.join('').slice(0, 2)}`;
}

function PayoutMethodCard({
  selected,
  onSelect,
  icon,
  title,
  subtitle,
  disabled,
}: {
  selected: boolean;
  onSelect: () => void;
  icon: ReactNode;
  title: string;
  subtitle: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={disabled}
      aria-pressed={selected}
      className={`
        flex w-full items-center gap-4 rounded-md border px-4 py-4 text-start transition-colors
         disabled:cursor-not-allowed disabled:opacity-50
        ${selected ? 'border-primary! bg-[#eef4ff]' : 'border-primary/15 hover:border-primary/40'}
      `}
    >
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-primary">{title}</p>
        <p className="mt-0.5 truncate font-mono text-xs text-slate-500">{subtitle}</p>
      </div>
    </button>
  );
}

export default function MentorWithdrawalModal({ open = false, onOpenChange }: MentorWithdrawalModalProps) {
  const [amount, setAmount] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [payoutMethod, setPayoutMethod] = useState<PayoutMethod>('bank');

  const { data: profileData } = useGetAdminProfileQuery(undefined, { skip: !open });
  const { data: ledgerData } = useGetWithdrawalLedgerQuery({ page: 1, limit: 1 }, { skip: !open });
  const [createWithdrawal, { isLoading: isSubmitting }] = useCreateWithdrawalMutation();

  const profile = profileData?.data;
  const mentorInfo = profile?.mentor_info;
  const bankName = mentorInfo?.bank_name?.trim() || 'Bank';
  const accountNumber = mentorInfo?.bank_number?.trim() || '—';
  const mpesaNumber = mentorInfo?.mpesa_number?.trim() || '—';
  const hasBank = Boolean(mentorInfo?.bank_number?.trim());
  const hasMpesa = Boolean(mentorInfo?.mpesa_number?.trim());
  const availableBalance = ledgerData?.data?.summary?.available_balance ?? 0;
  const currency = profile?.mentor_economy?.wallet?.currency || ledgerData?.data?.summary?.currency || 'KES';

  useEffect(() => {
    if (!open) {
      setAmount('');
      setIsFocused(false);
      setPayoutMethod('bank');
      return;
    }
    if (hasBank) setPayoutMethod('bank');
    else if (hasMpesa) setPayoutMethod('mpesa');
  }, [open, hasBank, hasMpesa]);

  const amountValue = Number(amount || 0);
  const canSubmit =
    amountValue > 0 &&
    amountValue <= availableBalance &&
    !isSubmitting &&
    ((payoutMethod === 'bank' && hasBank) || (payoutMethod === 'mpesa' && hasMpesa));

  const handleClose = () => onOpenChange?.(false);

  const handleSubmit = async () => {
    if (amountValue <= 0) {
      toast.error('Please enter an amount to withdraw.');
      return;
    }
    if (amountValue > availableBalance) {
      toast.error('Amount exceeds available balance.');
      return;
    }
    if (payoutMethod === 'bank' && !hasBank) {
      toast.error('No bank account on file.');
      return;
    }
    if (payoutMethod === 'mpesa' && !hasMpesa) {
      toast.error('No M-Pesa number on file.');
      return;
    }

    try {
      const res = await createWithdrawal({
        amount: amountValue,
        payout_method: payoutMethod,
      }).unwrap();
      toast.success(res?.message ?? 'Withdrawal request submitted successfully.');
      onOpenChange?.(false);
    } catch (error) {
      console.error('Failed to submit withdrawal request.', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        size="md"
        className="admin_panel gap-0 overflow-hidden rounded-2xl p-0 [&>button]:hidden"
      >
        <div className="relative flex items-center justify-center border-b border-slate-100 px-12 py-4">
          <button
            type="button"
            aria-label="Back"
            onClick={handleClose}
            className="absolute left-4 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div className="text-center">
            <DialogTitle className="text-base font-semibold text-slate-900">Withdraw</DialogTitle>
            <DialogDescription className="sr-only">
              Choose a payout method and request a withdrawal.
            </DialogDescription>
          </div>
          <button
            type="button"
            aria-label="Close"
            onClick={handleClose}
            className="absolute right-4 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-8 px-6 py-6">
          <div className="space-y-3">
            <p className="text-sm font-semibold text-slate-900">Payout method</p>
            <div className="grid gap-3">
              <PayoutMethodCard
                selected={payoutMethod === 'bank'}
                onSelect={() => setPayoutMethod('bank')}
                icon={<Landmark className="h-6 w-6" />}
                title={bankName}
                subtitle={accountNumber}
                disabled={!hasBank}
              />
              <PayoutMethodCard
                selected={payoutMethod === 'mpesa'}
                onSelect={() => setPayoutMethod('mpesa')}
                icon={<Smartphone className="h-6 w-6" />}
                title="M-Pesa"
                subtitle={mpesaNumber}
                disabled={!hasMpesa}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="text-start">
              <p className="text-sm font-semibold text-slate-900">Amount</p>
              <p className="mt-0.5 text-xs text-slate-500">How much would you like to withdraw?</p>
            </div>

            <label className="relative mx-auto flex w-full max-w-[16rem] cursor-text items-center justify-center gap-2">
              <input
                type="text"
                inputMode="decimal"
                value={amount}
                onChange={(e) => setAmount(sanitizeAmountInput(e.target.value))}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                aria-label="Withdrawal amount"
                className="absolute inset-0 z-10 h-full w-full cursor-text opacity-0"
              />
              <span
                className={`text-3xl font-semibold tracking-tight ${amount ? 'text-slate-800' : 'text-slate-400'
                  }`}
              >
                {formatAmountDisplay(amount)}
              </span>
              <span
                className={`h-8 w-px shrink-0 ${isFocused ? 'bg-primary' : 'bg-slate-300'}`}
                aria-hidden
              />
              <span className="text-base font-medium text-slate-500">{currency}</span>
            </label>

            <p className="text-center text-xs text-slate-500">
              Available balance: {formatKes(availableBalance)}
            </p>
          </div>

          <Button
            type="button"
            className="global_btn bg_primary rounded_full h-12 w-full min-w-0 text-base font-semibold"
            isLoading={isSubmitting}
            isDisabled={!canSubmit}
            onPress={handleSubmit}
          >
            Withdraw
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
