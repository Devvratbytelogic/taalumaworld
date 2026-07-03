'use client';

import { useState } from 'react';
import {
  BarChart3,
  Book,
  Download,
  FileText,
  FolderTree,
  History,
  LayoutDashboard,
  Link2,
  ShoppingCart,
  Tag,
  TrendingUp,
  UserCircle,
  Wallet,
} from 'lucide-react';
import { AdminHeader } from '@/components/admin/layout/AdminHeader';
import { AdminSidebar } from '@/components/admin/layout/AdminSidebar';
import { KshIcon } from '@/components/ui/AllSVG';
import { ADMIN_SIDEBAR_WIDTH, type SidebarNavGroup } from '@/components/admin/layout/PanelSidebar';
import {
  getMentorBlueprintPerformanceRoutePath,
  getMentorBooksRoutePath,
  getMentorCategoriesRoutePath,
  getMentorChaptersRoutePath,
  getMentorCouponsRoutePath,
  getMentorDashboardRoutePath,
  getMentorPaymentHistoryRoutePath,
  getMentorReferralsRoutePath,
  getMentorRevenueByBlueprintRoutePath,
  getMentorRevenueEarnedRoutePath,
  getMentorRevenuePendingRoutePath,
  getMentorSalesVolumeRoutePath,
  getMentorStatementsRoutePath,
  getMentorUsersRoutePath,
  getMentorWalletRoutePath,
} from '@/routes/routes';

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
      { id: 'categories', label: 'Categories', href: getMentorCategoriesRoutePath(), icon: FolderTree },
    ],
  },
  {
    title: 'Performance & Revenue',
    items: [
      { id: 'blueprint_performance', label: 'Blueprint Performance', href: getMentorBlueprintPerformanceRoutePath(), icon: BarChart3 },
      { id: 'sales_volume', label: 'Sales Volume', href: getMentorSalesVolumeRoutePath(), icon: ShoppingCart },
      { id: 'revenue_earned', label: 'Revenue Earned', href: getMentorRevenueEarnedRoutePath(), icon: KshIcon },
      { id: 'revenue_pending', label: 'Revenue Pending Payment', href: getMentorRevenuePendingRoutePath(), icon: Wallet },
      { id: 'revenue_by_blueprint', label: 'Revenue by Blueprint', href: getMentorRevenueByBlueprintRoutePath(), icon: TrendingUp },
      { id: 'wallet', label: 'Wallet & Payouts', href: getMentorWalletRoutePath(), icon: Wallet },
      { id: 'payment_history', label: 'Payment History', href: getMentorPaymentHistoryRoutePath(), icon: History },
      { id: 'statements', label: 'Downloadable Statements', href: getMentorStatementsRoutePath(), icon: Download },
    ],
  },
  {
    title: 'Growth',
    items: [
      { id: 'referrals', label: 'Referral Performance', href: getMentorReferralsRoutePath(), icon: Link2 },
      { id: 'coupons', label: 'Coupons & Promos', href: getMentorCouponsRoutePath(), icon: Tag },
    ],
  },
  {
    title: 'User Management',
    items: [
      { id: 'users', label: 'Users', href: getMentorUsersRoutePath(), icon: UserCircle },
    ],
  },
];

export default function MentorLayout({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div
      className="min-h-screen bg-slate-50/80 admin_panel [--admin-header-height:6rem]"
      style={{ '--admin-sidebar-width': ADMIN_SIDEBAR_WIDTH } as React.CSSProperties}
    >
      <AdminHeader onMobileMenuToggle={() => setMobileMenuOpen((open) => !open)} />
      <AdminSidebar
        groups={NAV_GROUPS}
        mobileMenuOpen={mobileMenuOpen}
        onCloseMobileMenu={() => setMobileMenuOpen(false)}
      />

      <main className="min-w-0 lg:ml-(--admin-sidebar-width)">
        <div className="mx-auto w-full max-w-[1440px] px-4 py-6 sm:px-6 lg:py-7">{children}</div>
      </main>
    </div>
  );
}
