'use client';

import { useState } from 'react';
import { AlertTriangle, ArrowDownToLine, RotateCcw, Wallet, X } from 'lucide-react';
import {
  AdminPage,
  AdminPageHeader,
  AdminPanel,
  AdminStatCard,
  AdminTableShell,
} from '@/components/admin/layout/AdminContent';
import Button from '@/components/ui/Button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  formatKes,
  MENTOR_OVERVIEW,
  PAYOUT_SETTINGS,
  REFUNDS_CHARGEBACKS,
  WITHDRAWAL_FREQUENCIES,
} from '@/components/admin/mentor/data/mentorPerformanceData';
import toast from '@/utils/toast';

export function MentorWalletTab() {
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const [withdrawalMethod, setWithdrawalMethod] = useState(PAYOUT_SETTINGS.withdrawalMethod);
  const [payoutFrequency, setPayoutFrequency] = useState(MENTOR_OVERVIEW.payoutFrequency);
  const [amountError, setAmountError] = useState('');

  const canRequestWithdrawal = MENTOR_OVERVIEW.walletBalance >= MENTOR_OVERVIEW.payoutThreshold;

  const resetWithdrawForm = () => {
    setAmount('');
    setAmountError('');
    setWithdrawalMethod(PAYOUT_SETTINGS.withdrawalMethod);
    setPayoutFrequency(MENTOR_OVERVIEW.payoutFrequency);
  };

  const handleWithdrawOpenChange = (open: boolean) => {
    setWithdrawOpen(open);
    if (!open) resetWithdrawForm();
  };

  const handleSubmitWithdrawal = () => {
    const value = Number(amount.replace(/,/g, ''));

    if (!amount.trim() || Number.isNaN(value) || value <= 0) {
      setAmountError('Enter a valid withdrawal amount.');
      return;
    }
    if (value < MENTOR_OVERVIEW.payoutThreshold) {
      setAmountError(`Minimum withdrawal is ${formatKes(MENTOR_OVERVIEW.payoutThreshold)}.`);
      return;
    }
    if (value > MENTOR_OVERVIEW.walletBalance) {
      setAmountError(`Amount cannot exceed your wallet balance of ${formatKes(MENTOR_OVERVIEW.walletBalance)}.`);
      return;
    }

    toast.success(
      `Withdrawal of ${formatKes(value)} via ${withdrawalMethod} submitted for Finance Admin review.`,
    );
    handleWithdrawOpenChange(false);
  };

  return (
    <AdminPage>
      <AdminPageHeader
        eyebrow="Performance & Revenue"
        title="Wallet & Payouts"
        description="Real-time balance, refunds, and chargebacks."
      >
        <Button
          type="button"
          className="global_btn rounded_full bg_primary"
          startContent={<ArrowDownToLine className="h-4 w-4" />}
          isDisabled={!canRequestWithdrawal}
          onPress={() => setWithdrawOpen(true)}
        >
          Request withdrawal
        </Button>
      </AdminPageHeader>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <AdminStatCard label="Wallet balance" value={formatKes(MENTOR_OVERVIEW.walletBalance)} icon={Wallet} tone="green" />
        <AdminStatCard label="Payout threshold" value={formatKes(MENTOR_OVERVIEW.payoutThreshold)} icon={Wallet} tone="blue" />
        <AdminStatCard label="Payout frequency" value={payoutFrequency} icon={Wallet} tone="purple" />
      </div>

      {!canRequestWithdrawal ? (
        <p className="text-sm text-amber-700">
          Your balance is below the minimum withdrawal amount of {formatKes(MENTOR_OVERVIEW.payoutThreshold)}.
        </p>
      ) : null}

      <AdminPanel>
        <h2 className="mb-4 text-base font-semibold text-slate-900">Payment details</h2>
        <dl className="grid gap-3 sm:grid-cols-2 text-sm">
          <div><dt className="text-slate-500">Bank</dt><dd className="font-medium text-slate-900">{PAYOUT_SETTINGS.bankName}</dd></div>
          <div><dt className="text-slate-500">Account name</dt><dd className="font-medium text-slate-900">{PAYOUT_SETTINGS.accountName}</dd></div>
          <div><dt className="text-slate-500">Account number</dt><dd className="font-medium text-slate-900">{PAYOUT_SETTINGS.accountNumber}</dd></div>
          <div><dt className="text-slate-500">M-Pesa</dt><dd className="font-medium text-slate-900">{PAYOUT_SETTINGS.mpesaNumber}</dd></div>
          <div><dt className="text-slate-500">Tax ID (KRA PIN)</dt><dd className="font-medium text-slate-900">{PAYOUT_SETTINGS.taxId}</dd></div>
          <div><dt className="text-slate-500">Country / currency</dt><dd className="font-medium text-slate-900">{PAYOUT_SETTINGS.country} · {PAYOUT_SETTINGS.preferredCurrency}</dd></div>
        </dl>
      </AdminPanel>

      <AdminTableShell>
        <div className="border-b border-slate-100 px-5 py-3">
          <h2 className="text-base font-semibold text-slate-900">Refunds & chargebacks</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/80 text-left text-slate-500">
                <th className="px-5 py-3 font-medium">Date</th>
                <th className="px-5 py-3 font-medium">Blueprint</th>
                <th className="px-5 py-3 font-medium">Type</th>
                <th className="px-5 py-3 font-medium">Amount</th>
                <th className="px-5 py-3 font-medium text-right">Status</th>
              </tr>
            </thead>
            <tbody>
              {REFUNDS_CHARGEBACKS.map((row) => (
                <tr key={`${row.date}-${row.blueprint}`} className="border-b border-slate-50 last:border-0">
                  <td className="px-5 py-4 text-slate-600">{row.date}</td>
                  <td className="px-5 py-4 font-medium text-slate-900">{row.blueprint}</td>
                  <td className="px-5 py-4">
                    <span className="inline-flex items-center gap-1 text-slate-700">
                      {row.type === 'Refund' ? <RotateCcw className="h-3.5 w-3.5" /> : <AlertTriangle className="h-3.5 w-3.5" />}
                      {row.type}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-red-600">-{formatKes(row.amount)}</td>
                  <td className="px-5 py-4 text-right text-slate-600">{row.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </AdminTableShell>

      <Dialog open={withdrawOpen} onOpenChange={handleWithdrawOpenChange}>
        <DialogContent size="md" className="admin_panel max-w-md">
          <DialogHeader>
            <DialogTitle>Request withdrawal</DialogTitle>
            <DialogDescription>
              Enter the amount you want to withdraw. Finance Admin will review and process approved requests.
            </DialogDescription>
          </DialogHeader>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmitWithdrawal();
            }}
            className="admin_panel flex min-h-0 flex-col"
          >
            <div className="space-y-4 py-4">
              <div className="rounded-lg border border-sky-100 bg-sky-50/80 px-3 py-2.5 text-sm text-sky-900">
                Available balance: {formatKes(MENTOR_OVERVIEW.walletBalance)} · Minimum:{' '}
                {formatKes(MENTOR_OVERVIEW.payoutThreshold)}
              </div>

              <div className="space-y-2">
                <Label htmlFor="withdraw-amount">
                  Amount (KES)<span className="text-red-500">*</span>
                </Label>
                <Input
                  id="withdraw-amount"
                  type="number"
                  min={MENTOR_OVERVIEW.payoutThreshold}
                  max={MENTOR_OVERVIEW.walletBalance}
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => {
                    setAmount(e.target.value);
                    setAmountError('');
                  }}
                  className={amountError ? 'border-red-500' : ''}
                />
                {amountError ? <p className="text-sm text-red-600">{amountError}</p> : null}
              </div>

              <div className="space-y-2">
                <Label htmlFor="withdraw-method">Withdrawal method</Label>
                <Select value={withdrawalMethod} onValueChange={(v) => setWithdrawalMethod(v as typeof withdrawalMethod)}>
                  <SelectTrigger id="withdraw-method">
                    <SelectValue placeholder="Select method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="M-Pesa">M-Pesa ({PAYOUT_SETTINGS.mpesaNumber})</SelectItem>
                    <SelectItem value="Bank transfer">Bank transfer ({PAYOUT_SETTINGS.accountNumber})</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="withdraw-frequency">Payout frequency</Label>
                <Select value={payoutFrequency} onValueChange={setPayoutFrequency}>
                  <SelectTrigger id="withdraw-frequency">
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    {WITHDRAWAL_FREQUENCIES.map((freq) => (
                      <SelectItem key={freq} value={freq}>
                        {freq}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                className="global_btn rounded_full outline_primary"
                onPress={() => handleWithdrawOpenChange(false)}
                startContent={<X className="h-4 w-4" />}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="global_btn rounded_full bg_primary"
                startContent={<ArrowDownToLine className="h-4 w-4" />}
              >
                Submit request
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AdminPage>
  );
}
