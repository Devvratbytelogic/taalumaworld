'use client';
import Link from 'next/link';
import { Shield } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/components/ui/utils';
import { getRoleName, getRoleDescription } from '@/utils/adminPermissions';
import { getAdminSectionRoutePath } from '@/routes/routes';
import type { AdminUser, AdminSection } from '@/types/admin';

interface NavItem {
    id: AdminSection;
    label: string;
    icon: React.ElementType;
    category: string;
    badge?: number;
}

interface AdminSidebarProps {
    adminUser: AdminUser;
    navItemsByCategory: Record<string, NavItem[]>;
    activeSection: AdminSection;
    mobileMenuOpen: boolean;
    onCloseMobileMenu: () => void;
}

const CATEGORY_LABELS: Record<string, string> = {
    system: 'System',
    content: 'Content Management',
    users: 'User Management',
    commerce: 'Commerce',
    community: 'Community',
    analytics: 'Analytics & Reports',
};

export function AdminSidebar({
    adminUser,
    navItemsByCategory,
    activeSection,
    mobileMenuOpen,
    onCloseMobileMenu,
}: AdminSidebarProps) {
    return (
        <aside className={cn("lg:w-64 shrink-0 lg:block", mobileMenuOpen ? "block" : "hidden")}>
            <div className="bg-white rounded-3xl p-6 shadow-sm lg:sticky lg:top-24">

                {/* Role info */}
                <div className="mb-6 p-4 bg-primary/5 rounded-2xl border border-primary/10">
                    <div className="flex items-center gap-2 mb-1">
                        <Shield className="h-4 w-4 text-primary" />
                        <span className="text-sm font-semibold">{getRoleName(adminUser.role)}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{getRoleDescription(adminUser.role)}</p>
                </div>

                {/* Nav groups */}
                <nav className="space-y-6">
                    {Object.entries(navItemsByCategory).map(([category, items]) => (
                        <div key={category}>
                            <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-4">
                                {CATEGORY_LABELS[category]}
                            </h4>
                            <div className="space-y-1">
                                {items.map((item) => (
                                    <NavLink
                                        key={item.id}
                                        item={item}
                                        isActive={activeSection === item.id}
                                        onClick={onCloseMobileMenu}
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                </nav>
            </div>
        </aside>
    );
}

// ── Single nav link ──────────────────────────────────────────────────────────

interface NavLinkProps {
    item: NavItem;
    isActive: boolean;
    onClick: () => void;
}

function NavLink({ item, isActive, onClick }: NavLinkProps) {
    const Icon = item.icon;
    return (
        <Link
            href={getAdminSectionRoutePath(item.id)}
            onClick={onClick}
            className={cn(
                "flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-medium transition-all",
                isActive ? "bg-primary text-white shadow-md" : "text-gray-700 hover:bg-gray-100"
            )}
        >
            <div className="flex items-center gap-3">
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
            </div>
            {item.badge && (
                <Badge variant={isActive ? "secondary" : "default"} className="h-5 px-2">
                    {item.badge}
                </Badge>
            )}
        </Link>
    );
}
