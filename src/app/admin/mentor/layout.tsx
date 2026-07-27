'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Book,
  FileText,
  LayoutDashboard,
  Link2,
  ShieldAlert,
  ShoppingCart,
  Star,
  TrendingUp,
  Users,
  Wallet,
} from 'lucide-react';
import { AdminHeader } from '@/components/admin/layout/AdminHeader';
import { AdminSidebar } from '@/components/admin/layout/AdminSidebar';
import { KshIcon } from '@/components/ui/AllSVG';
import { ADMIN_SIDEBAR_WIDTH, type SidebarNavGroup } from '@/components/admin/layout/PanelSidebar';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import CommonOTPVerification from '@/components/auth/CommonOTPVerification';
import { useAdminResendOtpMutation } from '@/store/rtkQueries/adminAuth';
import toast from '@/utils/toast';
import {
  getMentorBlueprintPerformanceRoutePath,
  getMentorBooksRoutePath,
  getMentorChaptersRoutePath,
  getMentorDashboardRoutePath,
  getMentorFollowersRoutePath,
  getMentorProfileRoutePath,
  getMentorReferralsRoutePath,
  getMentorRevenueByBlueprintRoutePath,
  getMentorRevenueEarnedRoutePath,
  getMentorReviewsRoutePath,
  getMentorSalesVolumeRoutePath,
  getMentorWalletRoutePath,
} from '@/routes/routes';
import { useGetAdminProfileQuery } from '@/store/rtkQueries/adminGetApi';
import { IAdminProfileAPIResponse } from '@/types/adminProfile';

const NAV_GROUPS: SidebarNavGroup[] = [
  {
    title: 'Overview',
    items: [
      { id: 'dashboard', label: 'Dashboard', href: getMentorDashboardRoutePath(), icon: LayoutDashboard },
    ],
  },
  {
    title: 'Content Management',
    items: [
      { id: 'books', label: 'Series', href: getMentorBooksRoutePath(), icon: Book },
      { id: 'chapters', label: 'Blueprints', href: getMentorChaptersRoutePath(), icon: FileText },
      { id: 'reviews', label: 'Reviews', href: getMentorReviewsRoutePath(), icon: Star },
    ],
  },
  {
    title: 'Performance & Revenue',
    items: [
      { id: 'blueprint_performance', label: 'Blueprint Performance', href: getMentorBlueprintPerformanceRoutePath(), icon: BarChart3 },
      { id: 'sales_volume', label: 'Sales Volume', href: getMentorSalesVolumeRoutePath(), icon: ShoppingCart },
      { id: 'revenue_earned', label: 'Revenue Earned', href: getMentorRevenueEarnedRoutePath(), icon: KshIcon },
      { id: 'revenue_by_blueprint', label: 'Revenue by Blueprint', href: getMentorRevenueByBlueprintRoutePath(), icon: TrendingUp },
      { id: 'wallet', label: 'Wallet & Payouts', href: getMentorWalletRoutePath(), icon: Wallet },
    ],
  },
  {
    title: 'Growth',
    items: [
      { id: 'referrals', label: 'Referral Performance', href: getMentorReferralsRoutePath(), icon: Link2 },
      { id: 'followers', label: 'Followers', href: getMentorFollowersRoutePath(), icon: Users },
    ],
  },
];

export default function MentorLayout({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const { data: profileData, refetch: refetchProfile } = useGetAdminProfileQuery();
  const [adminResendOtp, { isLoading: isSendingOtp }] = useAdminResendOtpMutation();
  const isActiveMentor = profileData?.data?.status === 'active';
  const isVerifiedMentor = profileData?.data?.is_verified;
  const isAccountBlocked = !isVerifiedMentor || !isActiveMentor;
  const mentorEmail = profileData?.data?.email ?? '';

  const handleVerifyAccountClick = async () => {
    if (!mentorEmail || isSendingOtp) return;
    try {
      const res = await adminResendOtp({ email: mentorEmail, type: 'email_verification' }).unwrap();
      if (res?.http_status_code === 200 || res?.http_status_code === 201) {
        toast.success(res.message ?? 'Verification code sent to your email.');
        setShowOtpModal(true);
      }
    } catch (error) {
      console.error('Failed to send verification code. Please try again.', error);
    }
  };

  const handleOtpVerified = () => {
    setShowOtpModal(false);
    refetchProfile();
  };

  return (
    <div
      className="min-h-screen bg-slate-50/80 admin_panel [--admin-header-height:6rem]"
      style={{ '--admin-sidebar-width': ADMIN_SIDEBAR_WIDTH } as React.CSSProperties}
    >
      <AdminHeader profileData={profileData as IAdminProfileAPIResponse} onMobileMenuToggle={() => setMobileMenuOpen((open) => !open)} />
      <div
        className={`${isAccountBlocked ? 'pointer-events-none opacity-50' : ''}`}
        aria-disabled={isAccountBlocked}
        inert={isAccountBlocked ? true : undefined}
      >
        <AdminSidebar
          groups={NAV_GROUPS}
          mobileMenuOpen={mobileMenuOpen}
          onCloseMobileMenu={() => setMobileMenuOpen(false)}
        />
      </div>

      <main className="min-w-0 lg:ml-(--admin-sidebar-width)">
        <div className="mx-auto w-full max-w-full px-4 py-6 sm:px-6 lg:py-7">
          {profileData && !isVerifiedMentor ? (
            <div className="mb-6 flex flex-col gap-3 rounded-md border border-blue-200! bg-blue-50 px-4 py-3.5 sm:flex-row sm:items-center sm:gap-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100">
                <ShieldAlert className="h-5 w-5 text-blue-600" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-blue-900">Verify your account</p>
                <p className="text-sm text-blue-700">Please verify your account first to access all mentor features.</p>
              </div>
              <button
                type="button"
                onClick={handleVerifyAccountClick}
                className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
              >
                Verify Account
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          ) : (
            profileData && !isActiveMentor && (
              <div className="mb-6 flex flex-col gap-3 rounded-md border border-amber-200! bg-amber-50 px-4 py-3.5 sm:flex-row sm:items-center sm:gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100">
                  <AlertTriangle className="h-5 w-5 text-amber-600" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-amber-900">Complete your account setup</p>
                  <p className="text-sm text-amber-700">Your mentor account isn&apos;t active yet. Complete your profile to unlock the full dashboard.</p>
                </div>
                <Link
                  href={getMentorProfileRoutePath()}
                  className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-full bg-amber-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-amber-700"
                >
                  Complete Profile
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            )
          )}
          <div
            // className={`${isAccountBlocked ? 'pointer-events-none opacity-50' : ''}`}
            // aria-disabled={isAccountBlocked}
            // inert={isAccountBlocked ? true : undefined}
          >
            {children}
          </div>
        </div>
      </main>

      <Dialog open={showOtpModal} onOpenChange={setShowOtpModal}>
        <DialogContent size="sm">
          <CommonOTPVerification
            email={mentorEmail}
            type="email_verification"
            isAdmin={false}
            onVerified={handleOtpVerified}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
