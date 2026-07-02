'use client';

import { useState } from 'react';
import { BarChart3, Book, Download, FileText, FolderTree, History, LayoutDashboard, ShoppingCart, TrendingUp, UserCircle, Wallet } from 'lucide-react';
import { AdminHeader } from '@/components/admin/layout/AdminHeader';
import { AdminSidebar } from '@/components/admin/layout/AdminSidebar';
import { KshIcon } from '@/components/ui/AllSVG';
import type { SidebarNavGroup } from '@/components/admin/layout/PanelSidebar';
import { getMentorBlueprintPerformanceRoutePath, getMentorBooksRoutePath, getMentorCategoriesRoutePath, getMentorChaptersRoutePath, getMentorDashboardRoutePath, getMentorPaymentHistoryRoutePath, getMentorRevenueByBlueprintRoutePath, getMentorRevenueEarnedRoutePath, getMentorRevenuePendingRoutePath, getMentorSalesVolumeRoutePath, getMentorStatementsRoutePath, getMentorUsersRoutePath } from '@/routes/routes';

const NAV_GROUPS: SidebarNavGroup[] = [
  {
    title: 'Overview',
    items: [
      { id: 'dashboard', label: 'Dashboard', href: getMentorDashboardRoutePath(), icon: LayoutDashboard },
    ],
  },
  {
    title: 'Performance & Revenue',
    items: [
      { id: 'blueprint_performance', label: 'Blueprint Performance', href: getMentorBlueprintPerformanceRoutePath(), icon: BarChart3 },
      { id: 'sales_volume', label: 'Sales Volume', href: getMentorSalesVolumeRoutePath(), icon: ShoppingCart },
      { id: 'revenue_earned', label: 'Revenue Earned', href: getMentorRevenueEarnedRoutePath(), icon: KshIcon },
      { id: 'revenue_pending', label: 'Revenue Pending Payment', href: getMentorRevenuePendingRoutePath(), icon: Wallet },
      { id: 'payment_history', label: 'Payment History', href: getMentorPaymentHistoryRoutePath(), icon: History },
      { id: 'statements', label: 'Downloadable Statements', href: getMentorStatementsRoutePath(), icon: Download },
      { id: 'revenue_by_blueprint', label: 'Revenue by Blueprint', href: getMentorRevenueByBlueprintRoutePath(), icon: TrendingUp },
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
    title: 'User Management',
    items: [
      { id: 'users', label: 'Users', href: getMentorUsersRoutePath(), icon: UserCircle },
    ],
  },
];

export default function MentorLayout({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f4f7fb] admin_panel">
      <AdminHeader onMobileMenuToggle={() => setMobileMenuOpen((open) => !open)} />

      <div className="container mx-auto sm:px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <AdminSidebar
            groups={NAV_GROUPS}
            mobileMenuOpen={mobileMenuOpen}
            onCloseMobileMenu={() => setMobileMenuOpen(false)}
          />

          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>
    </div>
  );
}
