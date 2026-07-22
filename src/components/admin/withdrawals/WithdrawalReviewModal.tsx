'use client';

import { useEffect, useState } from 'react';
import { Save, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import UiButton from '@/components/ui/Button';
import { cn } from '@/components/ui/utils';
import { adminSelectClass } from '@/components/admin/layout/AdminContent';
import { formatKes } from '@/constants/common';
import { useReviewWithdrawalMutation } from '@/store/rtkQueries/walletAPIs';
import type { IWithdrawalDataEntity } from '@/types/wallet';
import toast from '@/utils/toast';

type WithdrawalAction = 'approve' | 'reject';

interface WithdrawalReviewModalProps {
  open: boolean;
  withdrawal: IWithdrawalDataEntity | null;
  onOpenChange: (open: boolean) => void;
}

const STATUS_BADGE_CLASS: Record<string, string> = {
  pending: 'bg-amber-50 text-amber-700 border-amber-200!',
  approved: 'bg-emerald-50 text-emerald-700 border-emerald-200!',
  rejected: 'bg-red-50 text-red-700 border-red-200!',
};

const DECISION_OPTIONS = [
  { value: 'approve' as const, label: 'Approve' },
  { value: 'reject' as const, label: 'Reject' },
];

function formatStatusLabel(status?: string) {
  if (!status) return '—';
  return status.charAt(0).toUpperCase() + status.slice(1);
}

function formatPayoutMethod(method?: string) {
  if (!method) return '—';
  if (method.toLowerCase() === 'mpesa') return 'M-Pesa';
  if (method.toLowerCase() === 'bank') return 'Bank transfer';
  return method;
}

function formatDate(value?: string | null) {
  if (!value) return '—';
  return new Date(value).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function formatWalletType(walletType?: string) {
  if (walletType === 'mentor') return 'Mentor';
  if (walletType === 'affiliate') return 'Affiliate';
  return walletType || '—';
}

function getReviewerName(reviewedBy: IWithdrawalDataEntity['reviewed_by']) {
  if (!reviewedBy) return null;
  return typeof reviewedBy === 'string' ? reviewedBy : reviewedBy.name;
}

export function WithdrawalReviewModal({ open, withdrawal, onOpenChange }: WithdrawalReviewModalProps) {
  const [action, setAction] = useState<WithdrawalAction>('approve');
  const [adminNotes, setAdminNotes] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [reviewWithdrawal, { isLoading: isReviewing }] = useReviewWithdrawalMutation();

  const isPending = withdrawal?.status === 'pending';

  useEffect(() => {
    if (!open || !withdrawal) return;
    setAction(withdrawal.status === 'rejected' ? 'reject' : 'approve');
    setAdminNotes(withdrawal.admin_notes ?? '');
    setRejectionReason(withdrawal.rejection_reason ?? '');
  }, [open, withdrawal]);

  const handleClose = () => onOpenChange(false);

  const handleSubmitReview = async () => {
    if (!withdrawal) return;

    if (action === 'reject' && !rejectionReason.trim()) {
      toast.error('Please provide a rejection reason.');
      return;
    }

    try {
      const res = await reviewWithdrawal({
        id: withdrawal.id,
        values: {
          action,
          ...(action === 'reject'
            ? { rejection_reason: rejectionReason.trim() }
            : { admin_notes: adminNotes.trim() }),
        },
      }).unwrap();
      toast.success(res?.message ?? 'Withdrawal reviewed successfully');
      handleClose();
    } catch (error) {
      console.error('Failed to review withdrawal', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="admin_panel flex max-h-[90vh] flex-col gap-0 overflow-hidden p-0 sm:max-w-2xl">
        {withdrawal ? (
          <>
            <DialogHeader className="shrink-0 border-b border-slate-100 px-6 pb-4 pt-6 pr-12">
              <DialogTitle>Review withdrawal</DialogTitle>
              <DialogDescription>
                {withdrawal.user?.name || '—'} · {withdrawal.user?.email || '—'}
              </DialogDescription>
            </DialogHeader>

            <div className="custom_scrollbar flex-1 space-y-4 overflow-y-auto p-6! text-sm">
              <div className="flex items-center gap-2">
                <span className="text-slate-500">Current status:</span>
                <Badge
                  variant="outline"
                  className={
                    STATUS_BADGE_CLASS[withdrawal.status] ??
                    'border-slate-200 bg-slate-100 text-slate-600'
                  }
                >
                  {formatStatusLabel(withdrawal.status)}
                </Badge>
              </div>

              <div className="grid gap-2 rounded-lg border border-slate-100 bg-slate-50/60 p-3 sm:grid-cols-2">
                <p>
                  <span className="text-slate-500">Amount:</span>{' '}
                  <span className="font-semibold text-primary">{formatKes(withdrawal.amount)}</span>
                </p>
                <p>
                  <span className="text-slate-500">Currency:</span> {withdrawal.currency || 'KES'}
                </p>
                <p>
                  <span className="text-slate-500">Balance at request:</span>{' '}
                  {formatKes(withdrawal.balance_at_request ?? 0)}
                </p>
                <p>
                  <span className="text-slate-500">Wallet:</span> {formatWalletType(withdrawal.wallet_type)}
                </p>
                <p>
                  <span className="text-slate-500">Payout method:</span>{' '}
                  {formatPayoutMethod(withdrawal.payout_method)}
                </p>
                <p>
                  <span className="text-slate-500">Requested:</span> {formatDate(withdrawal.createdAt)}
                </p>
                {withdrawal.mpesa_number ? (
                  <p>
                    <span className="text-slate-500">M-Pesa:</span> {withdrawal.mpesa_number}
                  </p>
                ) : null}
                {withdrawal.bank_details?.bank_name ? (
                  <p>
                    <span className="text-slate-500">Bank:</span> {withdrawal.bank_details.bank_name}
                  </p>
                ) : null}
                {withdrawal.bank_details?.bank_account_name ? (
                  <p>
                    <span className="text-slate-500">Account name:</span>{' '}
                    {withdrawal.bank_details.bank_account_name}
                  </p>
                ) : null}
                {withdrawal.bank_details?.bank_account_number ? (
                  <p>
                    <span className="text-slate-500">Account number:</span>{' '}
                    {withdrawal.bank_details.bank_account_number}
                  </p>
                ) : null}
                {withdrawal.bank_details?.bank_branch ? (
                  <p>
                    <span className="text-slate-500">Branch:</span> {withdrawal.bank_details.bank_branch}
                  </p>
                ) : null}
              </div>

              {getReviewerName(withdrawal.reviewed_by) ? (
                <p>
                  <span className="text-slate-500">Reviewed by:</span>{' '}
                  {getReviewerName(withdrawal.reviewed_by)} on {formatDate(withdrawal.reviewed_at)}
                </p>
              ) : null}

              {!isPending && withdrawal.admin_notes ? (
                <p>
                  <span className="text-slate-500">Admin notes:</span> {withdrawal.admin_notes}
                </p>
              ) : null}

              {!isPending && withdrawal.rejection_reason ? (
                <p>
                  <span className="text-slate-500">Rejection reason:</span> {withdrawal.rejection_reason}
                </p>
              ) : null}

              {isPending ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="withdrawal-decision">Decision</Label>
                    <select
                      id="withdrawal-decision"
                      value={action}
                      onChange={(e) => setAction(e.target.value as WithdrawalAction)}
                      className={cn(adminSelectClass, 'w-full')}
                    >
                      {DECISION_OPTIONS.map((item) => (
                        <option key={item.value} value={item.value}>
                          {item.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {action === 'reject' ? (
                    <div className="space-y-2">
                      <Label htmlFor="rejection-reason">Rejection reason</Label>
                      <Textarea
                        id="rejection-reason"
                        rows={3}
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        placeholder="Explain why this withdrawal is being rejected..."
                      />
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Label htmlFor="admin-notes">Admin notes</Label>
                      <Textarea
                        id="admin-notes"
                        rows={3}
                        value={adminNotes}
                        onChange={(e) => setAdminNotes(e.target.value)}
                        placeholder="e.g. Verified, approved for payout"
                      />
                    </div>
                  )}
                </>
              ) : null}
            </div>

            <DialogFooter className="shrink-0 gap-3 border-t border-slate-100 px-6 py-4">
              <UiButton
                type="button"
                className="global_btn outline_primary rounded_full"
                onPress={handleClose}
                disabled={isReviewing}
              >
                <X className="h-4 w-4" /> {isPending ? 'Cancel' : 'Close'}
              </UiButton>
              {isPending ? (
                <UiButton
                  type="button"
                  className="global_btn bg_primary rounded_full"
                  onPress={handleSubmitReview}
                  isLoading={isReviewing}
                >
                  <Save className="h-4 w-4" /> Save
                </UiButton>
              ) : null}
            </DialogFooter>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
