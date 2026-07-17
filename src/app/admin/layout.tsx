'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Bell, Book, ClipboardList, FileEdit, FileSignature, FileText, FolderTree, GraduationCap, LayoutDashboard, Mail, MessageSquare, Settings, Shield, ShoppingBag, UserCircle, Users, Award } from 'lucide-react';
import { getAdminDashboardRoutePath, getAdminMentorApplicationsRoutePath, getAdminMentorTypesRoutePath, getAdminSectionRoutePath, getMentorRoutePath } from '@/routes/routes';
import { AdminHeader } from '@/components/admin/layout/AdminHeader';
import { AdminSidebar } from '@/components/admin/layout/AdminSidebar';
import { KshIcon } from '@/components/ui/AllSVG';
import { ADMIN_SIDEBAR_WIDTH, type SidebarNavGroup } from '@/components/admin/layout/PanelSidebar';
import { useGetAdminProfileQuery } from '@/store/rtkQueries/adminGetApi';
import { IAdminProfileAPIResponse } from '@/types/adminProfile';

const NAV_GROUPS: SidebarNavGroup[] = [
    {
        title: 'System',
        items: [
            { id: 'dashboard', label: 'Dashboard', href: getAdminDashboardRoutePath(), icon: LayoutDashboard },
            { model: 'Setting', id: 'settings', label: 'Settings', href: getAdminSectionRoutePath('settings'), icon: Settings },
            { model: 'Role', id: 'roles', label: 'Roles & Permissions', href: getAdminSectionRoutePath('roles_permissions'), icon: Shield },
        ],
    },
    {
        title: 'Commerce',
        items: [
            { model: 'Transaction', id: 'transactions', label: 'Transactions', href: getAdminSectionRoutePath('transactions'), icon: KshIcon },
            { model: 'Order', id: 'orders', label: 'Orders', href: getAdminSectionRoutePath('orders'), icon: ShoppingBag },
        ],
    },
    {
        title: 'Mentor Management',
        items: [
            { model: 'Mentor', id: 'mentors', label: 'Mentors', href: getAdminSectionRoutePath('authors'), icon: Users },
            { model: 'Mentor Application', id: 'mentor_applications', label: 'Mentor Applications', href: getAdminMentorApplicationsRoutePath(), icon: ClipboardList },
            { model: 'Mentor Tier', id: 'mentor_types', label: 'Mentor Types', href: getAdminMentorTypesRoutePath(), icon: Award },
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
        title: 'User Management',
        items: [
            { model: 'User', id: 'users', label: 'Users', href: getAdminSectionRoutePath('users'), icon: UserCircle },
            { model: 'Institution', id: 'institutions', label: 'University Partners', href: getAdminSectionRoutePath('institutions'), icon: GraduationCap },
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

    if (pathname.startsWith(getMentorRoutePath())) {
        return <>{children}</>;
    }

    return (
        <div
            className="min-h-screen bg-slate-50/80 admin_panel [--admin-header-height:6rem]"
            style={{ '--admin-sidebar-width': ADMIN_SIDEBAR_WIDTH } as React.CSSProperties}
        >
            <AdminHeader profileData={profileData as IAdminProfileAPIResponse} onMobileMenuToggle={() => setMobileMenuOpen((open) => !open)} />
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
