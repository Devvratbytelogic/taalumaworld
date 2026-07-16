'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Mail,
  Ban,
  CircleCheck,
  Linkedin,
  Facebook,
  BadgeCheck,
  Wallet,
  TrendingUp,
  RotateCcw,
  Target,
  CheckCircle2,
  Circle,
  UserX,
} from 'lucide-react';
import type { ReactNode } from 'react';
import Button from '@/components/ui/Button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/components/ui/utils';
import {
  AdminPage,
  AdminPageHeader,
  AdminPanel,
  AdminSectionHeader,
  AdminEmptyState,
  adminPanelClass,
} from '@/components/admin/layout/AdminContent';
import { SuspendUserDialog } from '@/components/admin/users/SuspendUserDialog';
import { useGetAllUsersQuery, useUpdateStaffStatusMutation } from '@/store/rtkQueries/rolesPermissionsApi';
import { getAdminSectionRoutePath } from '@/routes/routes';
import toast from '@/utils/toast';
import type { IAllUsersEntity } from '@/types/rolesPermissions';

const STATUS_BADGE_CLASS: Record<string, string> = {
  active: 'bg-green-50 text-green-700 border-green-200',
  suspended: 'bg-red-50 text-red-700 border-red-200',
};

const formatDate = (value?: string | null) =>
  value
    ? new Date(value).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
    : '-';

const formatDateTime = (value?: string | null) =>
  value
    ? new Date(value).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : '-';

const formatCurrency = (value?: number | null, currency?: string | null) => {
  if (value === undefined || value === null) return '-';
  try {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: currency || 'USD' }).format(value);
  } catch {
    return `${currency ?? ''} ${value}`.trim();
  }
};

function InfoRow({ label, value, fullWidth }: { label: string; value?: ReactNode; fullWidth?: boolean }) {
  return (
    <div className={fullWidth ? 'col-span-2' : 'min-w-0'}>
      <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">{label}</dt>
      <dd className="mt-1 text-sm text-slate-700 wrap-break-word">
        {value === undefined || value === null || value === '' ? '-' : value}
      </dd>
    </div>
  );
}

function StatTile({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: typeof Wallet;
  label: string;
  value: ReactNode;
  tone: 'blue' | 'green' | 'orange' | 'purple';
}) {
  const tones = {
    blue: 'bg-sky-50 text-sky-600',
    green: 'bg-emerald-50 text-emerald-600',
    orange: 'bg-amber-50 text-amber-600',
    purple: 'bg-violet-50 text-violet-600',
  };
  return (
    <div className="min-w-0 rounded-md border border-slate-100 bg-slate-50/60 p-4">
      <div className="flex items-center gap-2.5">
        <div className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-lg', tones[tone])}>
          <Icon className="h-4 w-4" />
        </div>
        <p className="min-w-0 truncate text-xs font-medium text-slate-500">{label}</p>
      </div>
      <p className="mt-2.5 wrap-break-word text-lg font-semibold tracking-tight text-slate-900">{value}</p>
    </div>
  );
}

function ProfileSkeleton() {
  return (
    <AdminPage>
      <div className={cn(adminPanelClass, 'h-9 w-40 animate-pulse')} />
      <div className={cn(adminPanelClass, 'h-32 animate-pulse')} />
      <div className="grid gap-6 xl:grid-cols-3">
        <div className={cn(adminPanelClass, 'h-96 animate-pulse xl:col-span-1')} />
        <div className={cn(adminPanelClass, 'h-96 animate-pulse xl:col-span-2')} />
      </div>
    </AdminPage>
  );
}

export function MentorProfileView() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const mentorId = params?.id;

  const [suspendMentor, setSuspendMentor] = useState<IAllUsersEntity | null>(null);

  const { data: mentorsResponse, isLoading } = useGetAllUsersQuery({
    page: 1,
    limit: 500,
    user_type: 'mentor',
  });
  const [updateMentorStatus, { isLoading: isSuspending }] = useUpdateStaffStatusMutation();

  const mentor = mentorsResponse?.data?.data?.find((item) => item._id === mentorId) ?? null;

  const handleSendEmail = () => {
    if (mentor) window.location.href = `mailto:${mentor.email}`;
  };

  const handleSuspendClick = () => {
    if (mentor) setSuspendMentor(mentor);
  };

  const confirmSuspend = async (statusReason: string) => {
    if (!suspendMentor) return;
    const newStatus = suspendMentor.status === 'suspended' ? 'active' : 'suspended';
    try {
      const res = await updateMentorStatus({
        id: suspendMentor._id,
        payload: { status: newStatus, status_reason: statusReason },
      }).unwrap();
      if (res?.http_status_code === 200 || res?.http_status_code === 201) {
        toast.success(res.message ?? `"${suspendMentor.name}" has been ${newStatus === 'suspended' ? 'suspended' : 'activated'}`);
      }
    } catch {
      toast.error(`Failed to update "${suspendMentor.name}"`);
    } finally {
      setSuspendMentor(null);
    }
  };

  if (isLoading) return <ProfileSkeleton />;

  const backLink = (
    <Link
      href={getAdminSectionRoutePath('authors')}
      className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-slate-500 transition-colors hover:text-primary"
    >
      <ArrowLeft className="h-4 w-4" />
      Back to mentors
    </Link>
  );

  if (!mentor) {
    return (
      <AdminPage>
        {backLink}
        <AdminPanel>
          <AdminEmptyState
            icon={UserX}
            title="Mentor not found"
            description="This mentor may have been removed, suspended beyond this list, or the link is invalid."
            action={
              <Button
                onPress={() => router.push(getAdminSectionRoutePath('authors'))}
                className="global_btn rounded_full bg_primary"
              >
                Back to mentors
              </Button>
            }
          />
        </AdminPanel>
      </AdminPage>
    );
  }

  const isSuspended = mentor.status === 'suspended';
  const mentorInfo = mentor.mentor_info;
  const economy = mentor.mentor_economy;
  const agreement = mentor.agreement_status;
  const completion = mentor.profile_completion;
  const completionPercentage = completion?.profile_completion_percentage ?? mentor.profile_completion_percentage ?? 0;

  return (
    <AdminPage>
      {backLink}

      <AdminPageHeader eyebrow="Mentor Management" title={mentor.name} description={mentor.email}>
        <Button
          onPress={handleSendEmail}
          className="global_btn rounded_full outline_primary"
          startContent={<Mail className="h-4 w-4" />}
        >
          Send Email
        </Button>
        <Button
          onPress={handleSuspendClick}
          className={`global_btn rounded_full ${isSuspended ? 'success_btn' : 'danger_btn'}`}
          startContent={isSuspended ? <CircleCheck className="h-4 w-4" /> : <Ban className="h-4 w-4" />}
        >
          {isSuspended ? 'Activate Mentor' : 'Suspend Mentor'}
        </Button>
      </AdminPageHeader>

      <div className="grid gap-6 xl:grid-cols-3">
        {/* Left column: identity, contact, completion */}
        <div className="min-w-0 space-y-6 xl:col-span-1">
          <AdminPanel>
            <div className="flex flex-col items-center gap-3 text-center">
              <Avatar className="border h-20 w-20">
                <AvatarImage src={mentor.profile_pic ?? ''} alt={mentor.name} />
                <AvatarFallback className="text-2xl">{mentor.name?.[0]?.toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-lg font-semibold text-slate-900">{mentor.name}</h2>
                <p className="text-sm text-muted-foreground">{mentor.email}</p>
                {mentor.short_code ? (
                  <p className="mt-1 font-mono text-xs text-slate-400">{mentor.short_code}</p>
                ) : null}
              </div>
              <div className="flex flex-wrap items-center justify-center gap-2">
                <Badge>{mentor.role?.name ?? 'Mentor'}</Badge>
                <Badge
                  variant="outline"
                  className={STATUS_BADGE_CLASS[mentor.status] ?? STATUS_BADGE_CLASS.active}
                >
                  {mentor.status || 'active'}
                </Badge>
                {economy?.tier?.code && <Badge variant="outline">{economy.tier.code}</Badge>}
                {economy?.is_verified_mentor && (
                  <Badge variant="outline" className="gap-1 bg-blue-50 text-blue-700 border-blue-200">
                    <BadgeCheck className="h-3 w-3" /> Verified Mentor
                  </Badge>
                )}
              </div>
            </div>

            <dl className="mt-6 grid grid-cols-2 gap-x-4 gap-y-4 border-t border-slate-100 pt-5">
              <InfoRow label="Join Date" value={formatDate(mentor.createdAt)} />
              <InfoRow label="Last Updated" value={formatDate(mentor.updatedAt)} />
              <InfoRow
                label="Account Verified"
                value={
                  <Badge
                    variant="outline"
                    className={
                      mentor.is_verified
                        ? 'bg-green-50 text-green-700 border-green-200'
                        : 'bg-slate-100 text-slate-600 border-slate-200'
                    }
                  >
                    {mentor.is_verified ? 'Yes' : 'No'}
                  </Badge>
                }
              />
              <InfoRow label="User Type" value={<span className="capitalize">{mentor.user_type ?? '-'}</span>} />
              {mentor.status_reason ? (
                <>
                  <InfoRow label="Status Changed At" value={formatDateTime(mentor.status_changed_at)} fullWidth />
                  <InfoRow label="Status Reason" value={mentor.status_reason} fullWidth />
                </>
              ) : null}
            </dl>
          </AdminPanel>

          <AdminPanel>
            <AdminSectionHeader title="Contact & Links" />
            {mentor.linkedin || mentor.facebook ? (
              <div className="space-y-2.5">
                {mentor.linkedin ? (
                  <a
                    href={mentor.linkedin.startsWith('http') ? mentor.linkedin : `https://${mentor.linkedin}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex min-w-0 items-center gap-2.5 rounded-md border border-slate-100 px-3 py-2.5 text-sm text-slate-700 transition-colors hover:border-primary/30 hover:text-primary"
                  >
                    <Linkedin className="h-4 w-4 shrink-0" />
                    <span className="min-w-0 flex-1 truncate">{mentor.linkedin}</span>
                  </a>
                ) : null}
                {mentor.facebook ? (
                  <a
                    href={mentor.facebook.startsWith('http') ? mentor.facebook : `https://${mentor.facebook}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex min-w-0 items-center gap-2.5 rounded-md border border-slate-100 px-3 py-2.5 text-sm text-slate-700 transition-colors hover:border-primary/30 hover:text-primary"
                  >
                    <Facebook className="h-4 w-4 shrink-0" />
                    <span className="min-w-0 flex-1 truncate">{mentor.facebook}</span>
                  </a>
                ) : null}
              </div>
            ) : (
              <p className="text-sm text-slate-500">No contact links provided.</p>
            )}
          </AdminPanel>

          <AdminPanel>
            <AdminSectionHeader title="Profile Completion" />
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="text-slate-600">Overall completion</span>
              <span className="font-semibold text-slate-900">{completionPercentage}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-2 rounded-full bg-primary transition-all"
                style={{ width: `${Math.min(100, Math.max(0, completionPercentage))}%` }}
              />
            </div>

            {completion?.completed_fields?.length ? (
              <div className="mt-4 flex flex-wrap gap-1.5">
                {completion.completed_fields.map((field, index) => (
                  <Badge
                    key={`${field.section}-${field.field}-${index}`}
                    variant="outline"
                    className="gap-1 bg-green-50 text-green-700 border-green-200"
                  >
                    <CheckCircle2 className="h-3 w-3" />
                    {field.section}.{field.field}
                  </Badge>
                ))}
              </div>
            ) : null}

            {completion?.pending_fields?.length ? (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {completion.pending_fields.map((field, index) => (
                  <Badge
                    key={`${field.section}-${field.field}-${index}`}
                    variant="outline"
                    className="gap-1 bg-amber-50 text-amber-700 border-amber-200"
                  >
                    <Circle className="h-3 w-3" />
                    {field.section}.{field.field}
                  </Badge>
                ))}
              </div>
            ) : null}
          </AdminPanel>
        </div>

        {/* Right column: about, payment, tier & wallet, agreements */}
        <div className="min-w-0 space-y-6 xl:col-span-2">
          <AdminPanel>
            <AdminSectionHeader title="About" />
            <p className="text-sm leading-relaxed text-slate-700">
              {mentor.professionalBio || 'No professional bio provided.'}
            </p>
          </AdminPanel>

          <AdminPanel>
            <AdminSectionHeader title="Payment & Bank Details" />
            {mentorInfo ? (
              <dl className="grid gap-5 sm:grid-cols-2">
                <InfoRow label="Bank Name" value={mentorInfo.bank_name} />
                <InfoRow label="Bank Number" value={mentorInfo.bank_number} />
                <InfoRow label="Bank Branch" value={mentorInfo.bank_branch} />
                <InfoRow label="M-Pesa Number" value={mentorInfo.mpesa_number} />
                <InfoRow label="Tax ID" value={mentorInfo.tax_id} />
                <InfoRow
                  label="Payment Frequency"
                  value={<span className="capitalize">{mentorInfo.preferred_payment_frequency}</span>}
                />
                <InfoRow label="Tier Assigned At" value={formatDateTime(mentorInfo.tier_assigned_at)} />
                <InfoRow
                  label="Mentor Verified"
                  value={
                    <Badge
                      variant="outline"
                      className={
                        mentorInfo.is_verified_mentor
                          ? 'bg-green-50 text-green-700 border-green-200'
                          : 'bg-slate-100 text-slate-600 border-slate-200'
                      }
                    >
                      {mentorInfo.is_verified_mentor ? 'Yes' : 'No'}
                    </Badge>
                  }
                />
                {mentorInfo.verified_mentor_at ? (
                  <InfoRow label="Verified At" value={formatDateTime(mentorInfo.verified_mentor_at)} />
                ) : null}
                {mentorInfo.verified_mentor_by ? (
                  <InfoRow label="Verified By" value={mentorInfo.verified_mentor_by} />
                ) : null}
                {mentorInfo.verification_notes ? (
                  <InfoRow label="Verification Notes" value={mentorInfo.verification_notes} fullWidth />
                ) : null}
              </dl>
            ) : (
              <p className="text-sm text-slate-500">No payment information available.</p>
            )}
          </AdminPanel>

          <AdminPanel>
            <AdminSectionHeader title="Tier & Wallet" />
            {economy ? (
              <div className="space-y-6">
                <dl className="grid grid-cols-2 gap-5 sm:grid-cols-4">
                  <InfoRow label="Tier Code" value={economy.tier?.code} />
                  <InfoRow label="Rank" value={economy.tier?.rank} />
                  <InfoRow
                    label="Mentor Share"
                    value={
                      economy.tier?.mentor_share_percent !== undefined
                        ? `${economy.tier.mentor_share_percent}%`
                        : undefined
                    }
                  />
                  <InfoRow
                    label="Platform Share"
                    value={
                      economy.tier?.platform_share_percent !== undefined
                        ? `${economy.tier.platform_share_percent}%`
                        : undefined
                    }
                  />
                </dl>

                <div>
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-medium text-slate-700">Wallet</p>
                    <Badge
                      variant="outline"
                      className={
                        economy.wallet?.enabled
                          ? 'bg-green-50 text-green-700 border-green-200'
                          : 'bg-slate-100 text-slate-600 border-slate-200'
                      }
                    >
                      {economy.wallet?.enabled ? 'Enabled' : 'Disabled'} · {economy.wallet?.currency ?? '-'}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <StatTile
                      icon={Wallet}
                      label="Balance"
                      value={formatCurrency(economy.wallet?.balance, economy.wallet?.currency)}
                      tone="blue"
                    />
                    <StatTile
                      icon={TrendingUp}
                      label="Lifetime Earnings"
                      value={formatCurrency(economy.wallet?.lifetime_earnings, economy.wallet?.currency)}
                      tone="green"
                    />
                    <StatTile
                      icon={RotateCcw}
                      label="Lifetime Refunds"
                      value={formatCurrency(economy.wallet?.lifetime_refunds, economy.wallet?.currency)}
                      tone="orange"
                    />
                    <StatTile
                      icon={Target}
                      label="Payout Threshold"
                      value={formatCurrency(economy.wallet?.payout_threshold, economy.wallet?.currency)}
                      tone="purple"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-sm text-slate-500">No tier or wallet information available.</p>
            )}
          </AdminPanel>

          <AdminPanel>
            <AdminSectionHeader title="Agreements" />
            <div className="mb-4 flex flex-wrap gap-2">
              <Badge
                variant="outline"
                className={
                  agreement?.all_mandatory_accepted
                    ? 'bg-green-50 text-green-700 border-green-200'
                    : 'bg-red-50 text-red-700 border-red-200'
                }
              >
                Mandatory {agreement?.all_mandatory_accepted ? 'Accepted' : 'Pending'}
              </Badge>
              <Badge
                variant="outline"
                className={
                  agreement?.all_blocking_accepted
                    ? 'bg-green-50 text-green-700 border-green-200'
                    : 'bg-red-50 text-red-700 border-red-200'
                }
              >
                Blocking {agreement?.all_blocking_accepted ? 'Accepted' : 'Pending'}
              </Badge>
            </div>

            {agreement?.items?.length ? (
              <div className="space-y-2">
                {agreement.items.map((item) => (
                  <div
                    key={item.agreement_id}
                    className="flex items-center justify-between gap-3 rounded-md border border-slate-100 px-4 py-3"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-800 truncate">
                        {item.title} <span className="text-xs text-slate-400">v{item.version}</span>
                      </p>
                      <p className="text-xs text-slate-500">Accepted {formatDateTime(item.accepted_at)}</p>
                    </div>
                    <Badge
                      variant="outline"
                      className={
                        item.is_accepted
                          ? 'bg-green-50 text-green-700 border-green-200 shrink-0'
                          : 'bg-slate-100 text-slate-600 border-slate-200 shrink-0'
                      }
                    >
                      {item.is_accepted ? 'Accepted' : 'Pending'}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500">No agreements recorded.</p>
            )}
          </AdminPanel>
        </div>
      </div>

      <SuspendUserDialog
        user={suspendMentor}
        open={!!suspendMentor}
        onOpenChange={(open) => !open && setSuspendMentor(null)}
        onConfirm={confirmSuspend}
        isLoading={isSuspending}
      />
    </AdminPage>
  );
}
