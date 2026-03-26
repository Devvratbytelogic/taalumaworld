'use client';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { BookOpen, AlertCircle } from 'lucide-react';
import { Button } from '@heroui/react';
import {
    LayoutDashboard, Settings, BookOpen as Book, FileText, Users, FolderTree,
    MessageSquare, FileEdit, BarChart3, DollarSign, Shield, Activity,
    Receipt, FileSpreadsheet, UserCircle,
} from 'lucide-react';

import { useAdminUser } from '@/hooks/useAdminUser';
import { canAccessSection } from '@/utils/adminPermissions';
import { getHomeRoutePath, getAdminSectionRoutePath } from '@/routes/routes';

import { AdminHeader } from '@/components/admin/layout/AdminHeader';
import { AdminSidebar } from '@/components/admin/layout/AdminSidebar';
import type { AdminSection } from '@/types/admin';

// ── Nav items definition ─────────────────────────────────────────────────────

const NAV_ITEMS = [
    { id: 'dashboard' as AdminSection, label: 'Dashboard', icon: LayoutDashboard, category: 'system' },
    { id: 'settings' as AdminSection, label: 'Settings', icon: Settings, category: 'system' },
    { id: 'books' as AdminSection, label: 'Books', icon: Book, category: 'content' },
    { id: 'chapters' as AdminSection, label: 'Chapters', icon: FileText, category: 'content' },
    { id: 'categories' as AdminSection, label: 'Categories', icon: FolderTree, category: 'content' },
    { id: 'authors' as AdminSection, label: 'Thought Leaders', icon: Users, category: 'content' },
    { id: 'users' as AdminSection, label: 'Users', icon: UserCircle, category: 'users' },
    // { id: 'activity_logs' as AdminSection, label: 'Activity Logs', icon: Activity, category: 'users' },
    // { id: 'payments' as AdminSection, label: 'Payments', icon: DollarSign, category: 'commerce' },
    { id: 'transactions' as AdminSection, label: 'Transactions', icon: Receipt, category: 'commerce' },
    // { id: 'reviews' as AdminSection, label: 'Reviews', icon: MessageSquare, category: 'community' },
    { id: 'testimonials' as AdminSection, label: 'Testimonials', icon: MessageSquare, category: 'community' },
    { id: 'faqs' as AdminSection, label: 'FAQs', icon: FileEdit, category: 'community' },
    // { id: 'moderation' as AdminSection, label: 'Moderation', icon: Moderation, category: 'community', badge: 5 },
    // { id: 'analytics' as AdminSection, label: 'Analytics', icon: BarChart3, category: 'analytics' },
    // { id: 'reports' as AdminSection, label: 'Reports', icon: FileSpreadsheet, category: 'analytics' },
];

// Maps URL path → section id (to highlight active nav item)
const PATH_TO_SECTION: Record<string, AdminSection> = {
    '/admin/dashboard': 'dashboard',
    '/admin/settings': 'settings',
    '/admin/books': 'books',
    '/admin/chapters': 'chapters',
    '/admin/categories': 'categories',
    '/admin/authors': 'authors',
    '/admin/users': 'users',
    '/admin/activity-logs': 'activity_logs',
    // '/admin/payments': 'payments',
    '/admin/transactions': 'transactions',
    '/admin/reviews': 'reviews',
    '/admin/testimonials': 'testimonials',
    '/admin/faqs': 'faqs',
    // '/admin/moderation': 'moderation',
    '/admin/analytics': 'analytics',
    '/admin/reports': 'reports',
};

// ── Layout ───────────────────────────────────────────────────────────────────

export default function AdminPanelLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();

    const { adminUser, isLoading } = useAdminUser();

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Which section is currently active (based on URL)
    const activeSection = PATH_TO_SECTION[pathname] ?? 'dashboard';

    // Redirect author to books if they land on a section they cannot access
    useEffect(() => {
        if (!adminUser || isLoading) return;
        const section = PATH_TO_SECTION[pathname];
        if (section && !canAccessSection(adminUser, section)) {
            router.replace(getAdminSectionRoutePath('books'));
        }
    }, [adminUser, isLoading, pathname, router]);

    // Only show nav items the current admin role has access to
    const accessibleNavItems = adminUser
        ? NAV_ITEMS.filter(item => canAccessSection(adminUser, item.id))
        : [];

    // Group accessible items by category for sidebar rendering
    const navItemsByCategory = accessibleNavItems.reduce((acc, item) => {
        if (!acc[item.category]) acc[item.category] = [];
        acc[item.category].push(item);
        return acc;
    }, {} as Record<string, typeof NAV_ITEMS>);

    // ── Loading state ──
    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <BookOpen className="h-12 w-12 text-primary animate-pulse mx-auto mb-4" />
                    <p className="text-muted-foreground">Loading Admin Panel...</p>
                </div>
            </div>
        );
    }

    // ── Access denied state ──
    if (!adminUser) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
                    <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
                    <p className="text-muted-foreground mb-4">You don't have permission to access the admin panel.</p>
                    <Button onPress={() => router.push(getHomeRoutePath())}>Go to Website</Button>
                </div>
            </div>
        );
    }

    // ── Main layout ──
    return (
        <div className="min-h-screen bg-gray-50 admin_panel">

            <AdminHeader />

            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col lg:flex-row gap-8">

                    <AdminSidebar
                        adminUser={adminUser}
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
