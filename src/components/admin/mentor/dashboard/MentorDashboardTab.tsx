'use client';

import Link from 'next/link';
import {
  Award,
  BarChart3,
  CheckCircle2,
  Clock,
  FileText,
  History,
  Link2,
  ShieldCheck,
  ShoppingCart,
  Tag,
  TrendingUp,
  Wallet,
} from 'lucide-react';
import Button from '@/components/ui/Button';
import {
  AdminPage,
  AdminPageHeader,
  AdminPanel,
  AdminSectionHeader,
  AdminStatCard,
  AdminTextLink,
} from '@/components/admin/layout/AdminContent';
import { useGetAdminProfileQuery } from '@/store/rtkQueries/adminGetApi';
import {
  getMentorBlueprintPerformanceRoutePath,
  getMentorCouponsRoutePath,
  getMentorPaymentHistoryRoutePath,
  getMentorReferralsRoutePath,
  getMentorRevenueEarnedRoutePath,
  getMentorRevenuePendingRoutePath,
  getMentorSalesVolumeRoutePath,
  getMentorWalletRoutePath,
} from '@/routes/routes';
import {
  AGREEMENTS,
  formatKes,
  FOUNDING_MENTOR,
  MENTOR_OVERVIEW,
  RECENT_PAYMENTS,
  TOP_BLUEPRINTS,
} from '@/components/admin/mentor/data/mentorPerformanceData';
import toast from '@/utils/toast';

export function MentorDashboardTab() {
  const { data: profileData } = useGetAdminProfileQuery();
  const mentorName = profileData?.data?.name ?? 'Mentor';
  const canApplyVerification = MENTOR_OVERVIEW.verificationStatus === 'Not Applied';

  return (
    <AdminPage>
      <AdminPageHeader
        eyebrow="Overview"
        title={`Welcome back, ${mentorName}`}
        description="Track blueprint performance, sales, revenue, payouts, referrals, and compliance."
      >
        {canApplyVerification ? (
          <Button
            type="button"
            className="global_btn rounded_full bg_primary"
            startContent={<ShieldCheck className="h-4 w-4" />}
            onPress={() => toast.success('Verification application submitted. teamtaaluma@taaluma.world will review within a few business days.')}
          >
            Apply for Verified Mentor
          </Button>
        ) : null}
      </AdminPageHeader>

      <AdminPanel>
        <AdminSectionHeader title="Account status" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-sm text-slate-500">Profile completion</p>
            <p className="mt-1 text-lg font-semibold text-slate-900">{MENTOR_OVERVIEW.profileCompletion}%</p>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
              <div className="h-full rounded-full bg-primary" style={{ width: `${MENTOR_OVERVIEW.profileCompletion}%` }} />
            </div>
          </div>
          <div>
            <p className="text-sm text-slate-500">Verification</p>
            <p className="mt-1 flex items-center gap-1.5 text-lg font-semibold text-amber-700">
              <Clock className="h-4 w-4" />
              {MENTOR_OVERVIEW.verificationStatus}
            </p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Mentor type</p>
            <p className="mt-1 text-lg font-semibold text-slate-900">{MENTOR_OVERVIEW.mentorType}</p>
            <p className="mt-0.5 text-xs text-slate-500">{MENTOR_OVERVIEW.revenueShare}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Wallet balance</p>
            <p className="mt-1 flex items-center gap-1.5 text-lg font-semibold text-emerald-700">
              <Wallet className="h-4 w-4" />
              {formatKes(MENTOR_OVERVIEW.walletBalance)}
            </p>
          </div>
        </div>
      </AdminPanel>

      <AdminPanel>
        <AdminSectionHeader title="Agreement acceptance" />
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-left text-slate-500">
                <th className="pb-3 font-medium">Agreement</th>
                <th className="pb-3 font-medium">Version</th>
                <th className="pb-3 font-medium">Accepted</th>
                <th className="pb-3 font-medium text-right">Required</th>
              </tr>
            </thead>
            <tbody>
              {AGREEMENTS.map((row) => (
                <tr key={row.name} className="border-b border-slate-50 last:border-0">
                  <td className="py-3 font-medium text-slate-900">{row.name}</td>
                  <td className="py-3 text-slate-600">{row.version}</td>
                  <td className="py-3 text-slate-600">{row.acceptedAt}</td>
                  <td className="py-3 text-right">
                    {row.required ? (
                      <CheckCircle2 className="ml-auto h-4 w-4 text-emerald-600" />
                    ) : (
                      'Optional'
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </AdminPanel>

      {MENTOR_OVERVIEW.isFoundingMentor ? (
        <AdminPanel>
          <AdminSectionHeader title="Founding Mentor program" />
          <div className="mb-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="text-sm text-slate-500">Badge</p>
              <p className="mt-1 flex items-center gap-1.5 font-semibold text-primary">
                <Award className="h-4 w-4" />
                {FOUNDING_MENTOR.badgeActive ? 'Active' : 'Inactive'}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Program period</p>
              <p className="mt-1 text-sm font-medium text-slate-900">{FOUNDING_MENTOR.startDate} → {FOUNDING_MENTOR.expiryDate}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">High Value Blueprints</p>
              <p className="mt-1 text-lg font-semibold text-slate-900">{FOUNDING_MENTOR.highValueAchieved} / {FOUNDING_MENTOR.highValueTarget}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Equity eligibility</p>
              <p className="mt-1 text-sm font-medium text-emerald-700">{FOUNDING_MENTOR.equityEligibility}</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-left text-slate-500">
                  <th className="pb-3 font-medium">Blueprint</th>
                  <th className="pb-3 font-medium">HV status</th>
                  <th className="pb-3 font-medium text-right">Notes</th>
                </tr>
              </thead>
              <tbody>
                {FOUNDING_MENTOR.hvBlueprints.map((row) => (
                  <tr key={row.title} className="border-b border-slate-50 last:border-0">
                    <td className="py-3 font-medium text-slate-900">{row.title}</td>
                    <td className="py-3 text-slate-600">{row.status}</td>
                    <td className="py-3 text-right text-slate-500">{row.reason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </AdminPanel>
      ) : null}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Link href={getMentorSalesVolumeRoutePath()} className="block transition-opacity hover:opacity-90">
          <AdminStatCard label="Total sales" value={MENTOR_OVERVIEW.totalSales} icon={ShoppingCart} tone="blue" />
        </Link>
        <Link href={getMentorRevenueEarnedRoutePath()} className="block transition-opacity hover:opacity-90">
          <AdminStatCard label="Revenue earned" value={formatKes(MENTOR_OVERVIEW.revenueEarned)} icon={TrendingUp} tone="green" />
        </Link>
        <Link href={getMentorRevenuePendingRoutePath()} className="block transition-opacity hover:opacity-90">
          <AdminStatCard label="Pending payout" value={formatKes(MENTOR_OVERVIEW.revenuePending)} icon={Wallet} tone="orange" />
        </Link>
        <Link href={getMentorBlueprintPerformanceRoutePath()} className="block transition-opacity hover:opacity-90">
          <AdminStatCard label="Published blueprints" value={MENTOR_OVERVIEW.publishedBlueprints} icon={FileText} tone="purple" />
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <AdminPanel>
          <div className="mb-4 flex items-center justify-between gap-4">
            <h2 className="text-base font-semibold text-slate-900">Top blueprints</h2>
            <AdminTextLink href={getMentorBlueprintPerformanceRoutePath()}>View all</AdminTextLink>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-left text-slate-500">
                  <th className="pb-3 font-medium">Blueprint</th>
                  <th className="pb-3 font-medium">Sales</th>
                  <th className="pb-3 font-medium text-right">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {TOP_BLUEPRINTS.map((row) => (
                  <tr key={row.title} className="border-b border-slate-50 last:border-0">
                    <td className="py-3 font-medium text-slate-900">{row.title}</td>
                    <td className="py-3 text-slate-600">{row.sales}</td>
                    <td className="py-3 text-right text-slate-900">{formatKes(row.revenue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-xs text-slate-500">
            {MENTOR_OVERVIEW.draftSubmissions} draft · {MENTOR_OVERVIEW.pendingReview} pending review ·{' '}
            {MENTOR_OVERVIEW.suspendedBlueprints} suspended · {MENTOR_OVERVIEW.unpublishedBlueprints} unpublished
          </p>
        </AdminPanel>

        <AdminPanel>
          <div className="mb-4 flex items-center justify-between gap-4">
            <h2 className="text-base font-semibold text-slate-900">Recent payments</h2>
            <AdminTextLink href={getMentorPaymentHistoryRoutePath()}>View history</AdminTextLink>
          </div>
          <div className="space-y-3">
            {RECENT_PAYMENTS.map((payment) => (
              <div key={payment.date} className="flex items-center justify-between rounded-lg border border-slate-100 px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                    <History className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{formatKes(payment.amount)}</p>
                    <p className="text-xs text-slate-500">{payment.date}</p>
                  </div>
                </div>
                <span className="rounded-md bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700">{payment.status}</span>
              </div>
            ))}
          </div>
        </AdminPanel>
      </div>

      <AdminPanel>
        <AdminSectionHeader title="Quick links" />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: 'Blueprint performance', href: getMentorBlueprintPerformanceRoutePath(), icon: BarChart3 },
            { label: 'Wallet & payouts', href: getMentorWalletRoutePath(), icon: Wallet },
            { label: 'Referrals', href: getMentorReferralsRoutePath(), icon: Link2 },
            { label: 'Coupons & promos', href: getMentorCouponsRoutePath(), icon: Tag },
            { label: 'Sales volume', href: getMentorSalesVolumeRoutePath(), icon: ShoppingCart },
            { label: 'Revenue earned', href: getMentorRevenueEarnedRoutePath(), icon: TrendingUp },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 rounded-lg border border-slate-100 px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:border-primary/30 hover:bg-primary/5 hover:text-primary"
              >
                <Icon className="h-4 w-4 shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </AdminPanel>
    </AdminPage>
  );
}
