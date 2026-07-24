'use client';

import { useDispatch } from 'react-redux';
import { Clock, ShieldCheck, ShieldX, Wallet } from 'lucide-react';
import Button from '@/components/ui/Button';
import { cn } from '@/components/ui/utils';
import { AdminPageHeader, AdminPanel, AdminSectionHeader } from '@/components/admin/layout/AdminContent';
import { VERIFIED_MENTOR_APPLICATION_STATUS } from '@/constants/verifiedMentorApplication';
import { openModal } from '@/store/slices/allModalSlice';
import { useGetAdminProfileQuery } from '@/store/rtkQueries/adminGetApi';
import { useGetMyVerifiedMentorApplicationQuery } from '@/store/rtkQueries/verifiedMentorApplicationApis';

type MentorVerificationHeaderProps = {
  eyebrow?: string;
  title?: string;
  description?: string;
  showAccountStatus?: boolean;
};

export function MentorVerificationHeader({
  eyebrow,
  title,
  description,
  showAccountStatus = true,
}: MentorVerificationHeaderProps) {
  const dispatch = useDispatch();
  const { data: profileData } = useGetAdminProfileQuery();
  const profile = profileData?.data;
  const mentorName = profile?.name ?? 'Mentor';
  const { data: verifiedMentorApplicationData } = useGetMyVerifiedMentorApplicationQuery();
  const verifiedMentorApplication = verifiedMentorApplicationData?.data ?? null;
  const verificationStatus = verifiedMentorApplication?.status;
  const decisionReason = verifiedMentorApplication?.decision_reason;

  const onApply = () => dispatch(openModal({ componentName: 'ApplyVerifiedMentorModal' }));

  const isApprovedDecision = verificationStatus === VERIFIED_MENTOR_APPLICATION_STATUS.APPROVED;
  const decisionBanner = isApprovedDecision
    ? {
      label: 'Approval note',
      Icon: ShieldCheck,
      border: 'border-emerald-200/80!',
      bg: 'bg-emerald-50/50',
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-600',
      titleColor: 'text-emerald-900',
      textColor: 'text-emerald-700',
    }
    : {
      label: 'Reason for rejection',
      Icon: ShieldX,
      border: 'border-red-200/80!',
      bg: 'bg-red-50/50',
      iconBg: 'bg-red-100',
      iconColor: 'text-red-600',
      titleColor: 'text-red-900',
      textColor: 'text-red-700',
    };

  const verificationDisplay =
    verificationStatus === VERIFIED_MENTOR_APPLICATION_STATUS.APPROVED
      ? { label: 'Verified', className: 'text-emerald-700', Icon: ShieldCheck }
      : verificationStatus === VERIFIED_MENTOR_APPLICATION_STATUS.PENDING_REVIEW
        ? { label: 'Pending Review', className: 'text-amber-700', Icon: Clock }
        : verificationStatus === VERIFIED_MENTOR_APPLICATION_STATUS.REJECTED
          ? { label: 'Rejected', className: 'text-red-700', Icon: ShieldX }
          : { label: 'Not Applied', className: 'text-slate-500', Icon: Clock };

  const profileCompletion = profile?.profile_completion_percentage ?? 0;
  const tier = profile?.mentor_economy?.tier;
  const wallet = profile?.mentor_economy?.wallet;

  return (
    <>
      <AdminPageHeader
        eyebrow={eyebrow ?? 'Overview'}
        title={title ?? `Welcome back, ${mentorName}`}
        description={
          description ?? 'Track blueprint performance, sales, revenue, payouts, referrals, and compliance.'
        }
      >
        {verificationStatus === VERIFIED_MENTOR_APPLICATION_STATUS.PENDING_REVIEW ? (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200! bg-amber-50 px-4 py-2 text-sm font-medium text-amber-700">
            <Clock className="h-4 w-4" />
            Verification Pending Review
          </span>
        ) : verificationStatus === VERIFIED_MENTOR_APPLICATION_STATUS.APPROVED ? (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200! bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700">
            <ShieldCheck className="h-4 w-4" />
            Verified Mentor
          </span>
        ) : verificationStatus === VERIFIED_MENTOR_APPLICATION_STATUS.REJECTED ? (
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-red-200! bg-red-50 px-4 py-2 text-sm font-medium text-red-700">
              <ShieldX className="h-4 w-4" />
              Application Rejected
            </span>
            <Button
              type="button"
              className="global_btn rounded_full bg_primary"
              startContent={<ShieldCheck className="h-4 w-4" />}
              onPress={onApply}
            >
              Re-apply
            </Button>
          </div>
        ) : (
          <Button
            type="button"
            className="global_btn rounded_full bg_primary"
            startContent={<ShieldCheck className="h-4 w-4" />}
            onPress={onApply}
          >
            Apply for Verified Mentor
          </Button>
        )}
      </AdminPageHeader>

      {decisionReason ? (
        <div
          className={cn(
            'flex items-start gap-3.5 rounded-md border p-4',
            decisionBanner.border,
            decisionBanner.bg
          )}
        >
          <div className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-lg', decisionBanner.iconBg)}>
            <decisionBanner.Icon className={cn('h-5 w-5', decisionBanner.iconColor)} />
          </div>
          <div className="min-w-0 flex-1 pt-0.5">
            <p className={cn('text-sm font-semibold', decisionBanner.titleColor)}>{decisionBanner.label}</p>
            <p className={cn('mt-0.5 text-sm leading-relaxed', decisionBanner.textColor)}>
              {decisionReason}
            </p>
          </div>
        </div>
      ) : null}

      {showAccountStatus ? (
        <AdminPanel>
          <AdminSectionHeader title="Account status" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="text-sm text-slate-500">Profile completion</p>
              <p className="mt-1 text-lg font-semibold text-slate-900">{profileCompletion}%</p>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full rounded-full bg-primary" style={{ width: `${profileCompletion}%` }} />
              </div>
            </div>
            <div>
              <p className="text-sm text-slate-500">Verification</p>
              <p className={`mt-1 flex items-center gap-1.5 text-lg font-semibold ${verificationDisplay.className}`}>
                <verificationDisplay.Icon className="h-4 w-4" />
                {verificationDisplay.label}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Mentor tier</p>
              <p className="mt-1 text-lg font-semibold text-slate-900">{tier?.code ?? '—'}</p>
              <p className="mt-0.5 text-xs text-slate-500">
                {tier?.mentor_share_percent != null ? `${tier.mentor_share_percent}% revenue share` : '—'}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Wallet balance</p>
              <p className="mt-1 flex items-center gap-1.5 text-lg font-semibold text-emerald-700">
                <Wallet className="h-4 w-4" />
                {`${wallet?.currency ?? ''} ${wallet?.balance ?? 0}`.trim()}
              </p>
            </div>
          </div>
        </AdminPanel>
      ) : null}
    </>
  );
}
