'use client';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Settings, BookOpen as Book, FileText, Users, FolderTree, MessageSquare, FileEdit, UserCircle, Mail, Bell, ShoppingBag, GraduationCap, Shield } from 'lucide-react';
import { getAdminSectionRoutePath, getAdminDashboardRoutePath } from '@/routes/routes';
import { AdminHeader } from '@/components/admin/layout/AdminHeader';
import { AdminSidebar } from '@/components/admin/layout/AdminSidebar';
import type { AdminSection } from '@/types/admin';

function KshIcon({ className }: { className?: string }) {
    return (
        <span className={`inline-flex items-center justify-center border-[1.5px] border-current rounded font-bold text-[8px] leading-none tracking-tight shrink-0 ${className ?? ''}`}>
            KSH
        </span>
    );
}

const NAV_ITEMS = [
    { id: 'dashboard' as AdminSection, label: 'Dashboard', icon: LayoutDashboard, category: 'system' },
    { id: 'settings' as AdminSection, label: 'Settings', icon: Settings, category: 'system' },
    { id: 'books' as AdminSection, label: 'Books', icon: Book, category: 'content' },
    { id: 'chapters' as AdminSection, label: 'Blueprints', icon: FileText, category: 'content' },
    { id: 'categories' as AdminSection, label: 'Categories', icon: FolderTree, category: 'content' },
    { id: 'authors' as AdminSection, label: 'Thought Leaders', icon: Users, category: 'content' },
    { id: 'users' as AdminSection, label: 'Users', icon: UserCircle, category: 'users' },
    { id: 'institutions' as AdminSection, label: 'University Partners', icon: GraduationCap, category: 'users' },
    { id: 'roles_permissions' as AdminSection, label: 'Roles & Permissions', icon: Shield, category: 'system' },
    { id: 'transactions' as AdminSection, label: 'Transactions', icon: KshIcon, category: 'commerce' },
    { id: 'orders' as AdminSection, label: 'Orders', icon: ShoppingBag, category: 'commerce' },
    { id: 'testimonials' as AdminSection, label: 'Testimonials', icon: MessageSquare, category: 'community' },
    { id: 'faqs' as AdminSection, label: 'FAQs', icon: FileEdit, category: 'community' },
    { id: 'contact_us' as AdminSection, label: 'Help & Trust Center', icon: Mail, category: 'community' },
    { id: 'subscribers' as AdminSection, label: 'Subscribers', icon: Bell, category: 'community' },
];

const PATH_TO_SECTION: Record<string, AdminSection> = {
    [getAdminDashboardRoutePath()]: 'dashboard',
    [getAdminSectionRoutePath('settings')]: 'settings',
    [getAdminSectionRoutePath('books')]: 'books',
    [getAdminSectionRoutePath('chapters')]: 'chapters',
    [getAdminSectionRoutePath('categories')]: 'categories',
    [getAdminSectionRoutePath('authors')]: 'authors',
    [getAdminSectionRoutePath('users')]: 'users',
    [getAdminSectionRoutePath('institutions')]: 'institutions',
    [getAdminSectionRoutePath('roles_permissions')]: 'roles_permissions',
    [getAdminSectionRoutePath('activity_logs')]: 'activity_logs',
    [getAdminSectionRoutePath('transactions')]: 'transactions',
    [getAdminSectionRoutePath('orders')]: 'orders',
    [getAdminSectionRoutePath('reviews')]: 'reviews',
    [getAdminSectionRoutePath('testimonials')]: 'testimonials',
    [getAdminSectionRoutePath('faqs')]: 'faqs',
    [getAdminSectionRoutePath('contact_us')]: 'contact_us',
    [getAdminSectionRoutePath('subscribers')]: 'subscribers',
    [getAdminSectionRoutePath('analytics')]: 'analytics',
    [getAdminSectionRoutePath('reports')]: 'reports',
};

export default function AdminPanelLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const activeSection: AdminSection =
        PATH_TO_SECTION[pathname] ??
        Object.entries(PATH_TO_SECTION).find(([path]) => pathname.startsWith(path + '/'))?.[1] ??
        'dashboard';

    const navItemsByCategory = NAV_ITEMS.reduce((acc, item) => {
        if (!acc[item.category]) acc[item.category] = [];
        acc[item.category].push(item);
        return acc;
    }, {} as Record<string, typeof NAV_ITEMS>);

    return (
        <div className="min-h-screen bg-gray-50 admin_panel">
            <AdminHeader onMobileMenuToggle={() => setMobileMenuOpen(prev => !prev)} />

            <div className="container mx-auto sm:px-4 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    <AdminSidebar
                        navItemsByCategory={navItemsByCategory}
                        activeSection={activeSection}
                        mobileMenuOpen={mobileMenuOpen}
                        onCloseMobileMenu={() => setMobileMenuOpen(false)}
                    />

                    <main className="flex-1 min-w-0">
                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
}
