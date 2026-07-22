'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Banknote, Bell, Book, ClipboardList, FileEdit, FileSignature, FileText, FolderTree, GraduationCap, Handshake, LayoutDashboard, Mail, MessageSquare, Percent, Settings, Shield, ShieldCheck, ShoppingBag, Tag, TrendingUp, UserCircle, Users, Award } from 'lucide-react';
import { getAdminDashboardRoutePath, getAdminMentorApplicationsRoutePath, getAdminMentorTypesRoutePath, getAdminSectionRoutePath, getMentorRoutePath } from '@/routes/routes';
import { AdminHeader } from '@/components/admin/layout/AdminHeader';
import { AdminSidebar } from '@/components/admin/layout/AdminSidebar';
import { KshIcon } from '@/components/ui/AllSVG';
import { ADMIN_SIDEBAR_WIDTH, type SidebarNavGroup } from '@/components/admin/layout/PanelSidebar';
import { useGetAdminProfileQuery } from '@/store/rtkQueries/adminGetApi';
import { useAdminPermissions } from '@/hooks/useAdminPermissions';
import { IAdminProfileAPIResponse } from '@/types/adminProfile';

const NAV_GROUPS: SidebarNavGroup[] = [
    {
        title: 'System',
        items: [
            { id: 'dashboard', label: 'Dashboard', href: getAdminDashboardRoutePath(), icon: LayoutDashboard },
            { model: 'Setting', id: 'settings', label: 'Settings', href: getAdminSectionRoutePath('settings'), icon: Settings },
            { model: 'Role', submodel: ['Permission', 'Staff'], id: 'roles', label: 'Roles & Permissions', href: getAdminSectionRoutePath('roles_permissions'), icon: Shield },
        ],
    },
    {
        title: 'Commerce',
        items: [
            { model: 'Transaction', id: 'transactions', label: 'Transactions', href: getAdminSectionRoutePath('transactions'), icon: KshIcon },
            { model: 'Order', id: 'orders', label: 'Orders', href: getAdminSectionRoutePath('orders'), icon: ShoppingBag },
            { model: 'Coupon', id: 'coupons', label: 'Coupons', href: getAdminSectionRoutePath('coupons'), icon: Tag },
            { model: 'Tax', id: 'taxes', label: 'Taxes', href: getAdminSectionRoutePath('taxes'), icon: Percent },
            { model: 'Withdrawal', id: 'withdrawal_requests', label: 'Withdrawals', href: getAdminSectionRoutePath('withdrawal_requests'), icon: Banknote },
        ],
    },
    {
        title: 'User Management',
        items: [
            { model: 'User', id: 'users', label: 'Users', href: getAdminSectionRoutePath('users'), icon: UserCircle },
            { model: 'Institutions', submodel: ['Institution Access', 'Institute Usage Report', 'Institute Registration Prompt'], id: 'institutions', label: 'University Partners', href: getAdminSectionRoutePath('institutions'), icon: GraduationCap },
        ],
    },
    {
        title: 'Mentor Management',
        items: [
            { model: 'Mentor', id: 'mentors', label: 'Mentors', href: getAdminSectionRoutePath('authors'), icon: Users },
            { model: 'Mentor Application', id: 'mentor_applications', label: 'Mentor Applications', href: getAdminMentorApplicationsRoutePath(), icon: ClipboardList },
            { model: 'Mentor Tier', id: 'mentor_types', label: 'Mentor Types', href: getAdminMentorTypesRoutePath(), icon: Award },
            { model: 'Mentor Verification', id: 'mentor_verification', label: 'Mentor Verification', href: getAdminSectionRoutePath('mentor_verification'), icon: ShieldCheck },
            { model: 'Mentor Tier Upgrade', id: 'mentor_tier_upgrades', label: 'Mentor Tier Upgrade', href: getAdminSectionRoutePath('mentor_tier_upgrades'), icon: TrendingUp },
            // { model: 'Affiliate Application', id: 'affiliate_applications', label: 'Affiliate Applications', href: getAdminSectionRoutePath('affiliate_applications'), icon: Handshake },
        ],
    },
    {
        title: 'Content Management',
        items: [
            { model: 'Series', id: 'books', label: 'Series', href: getAdminSectionRoutePath('books'), icon: Book },
            { model: 'Blueprint', id: 'chapters', label: 'Blueprints', href: getAdminSectionRoutePath('chapters'), icon: FileText },
            // { id: 'categories', label: 'Categories', href: getAdminSectionRoutePath('categories'), icon: FolderTree },
        ],
    },
    {
        title: 'Legal',
        items: [
            { model: 'Agreement Type', id: 'agreement_types', label: 'Agreement Types', href: getAdminSectionRoutePath('agreement_types'), icon: FolderTree },
            { model: 'Agreement', id: 'agreements', label: 'Agreements', href: getAdminSectionRoutePath('agreements'), icon: FileSignature },
        ],
    },
    {
        title: 'Community',
        items: [
            { model: 'Testimonial', id: 'testimonials', label: 'Testimonials', href: getAdminSectionRoutePath('testimonials'), icon: MessageSquare },
            { model: 'FAQs', id: 'faqs', label: 'FAQs', href: getAdminSectionRoutePath('faqs'), icon: FileEdit },
            { model: 'Contact Us', id: 'contact_us', label: 'Help & Trust Center', href: getAdminSectionRoutePath('contact_us'), icon: Mail },
            { model: 'Subscriber', id: 'subscribers', label: 'Subscribers', href: getAdminSectionRoutePath('subscribers'), icon: Bell },
        ],
    },
];

export default function AdminPanelLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { data: profileData } = useGetAdminProfileQuery();
    const { hasAccess } = useAdminPermissions();

    if (pathname.startsWith(getMentorRoutePath())) {
        return <>{children}</>;
    }

    const visibleNavGroups = NAV_GROUPS
        .map((group) => ({
            ...group,
            items: group.items.filter(
                (item) => hasAccess(item.model) || item.submodel?.some((submodel) => hasAccess(submodel)),
            ),
        }))
        .filter((group) => group.items.length > 0);

    return (
        <div
            className="min-h-screen bg-slate-50/80 admin_panel [--admin-header-height:6rem]"
            style={{ '--admin-sidebar-width': ADMIN_SIDEBAR_WIDTH } as React.CSSProperties}
        >
            <AdminHeader profileData={profileData as IAdminProfileAPIResponse} onMobileMenuToggle={() => setMobileMenuOpen((open) => !open)} />
            <AdminSidebar
                groups={visibleNavGroups}
                mobileMenuOpen={mobileMenuOpen}
                onCloseMobileMenu={() => setMobileMenuOpen(false)}
            />

            <main className="min-w-0 lg:ml-(--admin-sidebar-width)">
                <div className="mx-auto w-full max-w-360 px-4 py-6 sm:px-6 lg:py-7">{children}</div>
            </main>
        </div>
    );
}
