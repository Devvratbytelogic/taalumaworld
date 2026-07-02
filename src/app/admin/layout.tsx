'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Bell, Book, FileEdit, FileText, FolderTree, GraduationCap, LayoutDashboard, Mail, MessageSquare, Settings, Shield, ShoppingBag, UserCircle, Users } from 'lucide-react';
import { getAdminDashboardRoutePath, getAdminSectionRoutePath, getMentorRoutePath } from '@/routes/routes';
import { AdminHeader } from '@/components/admin/layout/AdminHeader';
import { AdminSidebar } from '@/components/admin/layout/AdminSidebar';
import { KshIcon } from '@/components/ui/AllSVG';
import type { SidebarNavGroup } from '@/components/admin/layout/PanelSidebar';

const NAV_GROUPS: SidebarNavGroup[] = [
    {
        title: 'System',
        items: [
            { id: 'dashboard', label: 'Dashboard', href: getAdminDashboardRoutePath(), icon: LayoutDashboard },
            { id: 'settings', label: 'Settings', href: getAdminSectionRoutePath('settings'), icon: Settings },
            { id: 'roles_permissions', label: 'Roles & Permissions', href: getAdminSectionRoutePath('roles_permissions'), icon: Shield },
        ],
    },
    {
        title: 'Content Management',
        items: [
            { id: 'books', label: 'Series', href: getAdminSectionRoutePath('books'), icon: Book },
            { id: 'chapters', label: 'Blueprints', href: getAdminSectionRoutePath('chapters'), icon: FileText },
            { id: 'categories', label: 'Categories', href: getAdminSectionRoutePath('categories'), icon: FolderTree },
            { id: 'authors', label: 'Mentors', href: getAdminSectionRoutePath('authors'), icon: Users },
        ],
    },
    {
        title: 'User Management',
        items: [
            { id: 'users', label: 'Users', href: getAdminSectionRoutePath('users'), icon: UserCircle },
            { id: 'institutions', label: 'University Partners', href: getAdminSectionRoutePath('institutions'), icon: GraduationCap },
        ],
    },
    {
        title: 'Commerce',
        items: [
            { id: 'transactions', label: 'Transactions', href: getAdminSectionRoutePath('transactions'), icon: KshIcon },
            { id: 'orders', label: 'Orders', href: getAdminSectionRoutePath('orders'), icon: ShoppingBag },
        ],
    },
    {
        title: 'Community',
        items: [
            { id: 'testimonials', label: 'Testimonials', href: getAdminSectionRoutePath('testimonials'), icon: MessageSquare },
            { id: 'faqs', label: 'FAQs', href: getAdminSectionRoutePath('faqs'), icon: FileEdit },
            { id: 'contact_us', label: 'Help & Trust Center', href: getAdminSectionRoutePath('contact_us'), icon: Mail },
            { id: 'subscribers', label: 'Subscribers', href: getAdminSectionRoutePath('subscribers'), icon: Bell },
        ],
    },
];

export default function AdminPanelLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    if (pathname.startsWith(getMentorRoutePath())) {
        return <>{children}</>;
    }

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
