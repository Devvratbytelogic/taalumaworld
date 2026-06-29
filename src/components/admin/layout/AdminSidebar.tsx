'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Shield, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/components/ui/utils';
import { getAdminSectionRoutePath } from '@/routes/routes';
import { useGetAdminProfileQuery } from '@/store/rtkQueries/adminGetApi';
import type { AdminSection } from '@/types/admin';

interface NavItem {
    id: AdminSection;
    label: string;
    icon: React.ElementType;
    category: string;
    badge?: number;
}

interface AdminSidebarProps {
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
    navItemsByCategory,
    activeSection,
    mobileMenuOpen,
    onCloseMobileMenu,
}: AdminSidebarProps) {
    const [isMounted, setIsMounted] = useState(false);
    const { data: profileData } = useGetAdminProfileQuery();

    const roleLabel = profileData?.data?.role?.name ?? 'Admin';

    useEffect(() => {
        if (mobileMenuOpen) setIsMounted(true);
    }, [mobileMenuOpen]);

    useEffect(() => {
        document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [mobileMenuOpen]);

    const handleTransitionEnd = () => {
        if (!mobileMenuOpen) setIsMounted(false);
    };

    const sidebarContent = (
        <>
            <div className="mb-6 p-4 bg-primary/5 rounded-2xl border border-primary/10">
                <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-primary" />
                    <span className="text-sm font-semibold">{roleLabel}</span>
                </div>
            </div>

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
        </>
    );

    return (
        <>
            <aside className="hidden lg:block lg:w-64 shrink-0">
                <div className="bg-white rounded-3xl p-6 shadow-sm sticky top-24">
                    {sidebarContent}
                </div>
            </aside>

            {isMounted && (
                <>
                    <div
                        className={cn(
                            'fixed inset-0 z-60 bg-black/50 backdrop-blur-sm transition-opacity duration-300 lg:hidden',
                            mobileMenuOpen ? 'opacity-100' : 'opacity-0'
                        )}
                        onClick={onCloseMobileMenu}
                        aria-hidden="true"
                    />

                    <div
                        onTransitionEnd={handleTransitionEnd}
                        className={cn(
                            'fixed top-0 left-0 z-70 h-full w-72 max-w-[85vw] bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-in-out lg:hidden',
                            mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
                        )}
                    >
                        <div className="flex items-center justify-between px-5 py-4 border-b shrink-0">
                            <div className="flex items-center gap-2">
                                <Shield className="h-4 w-4 text-primary" />
                                <span className="font-semibold text-sm">{roleLabel}</span>
                            </div>
                            <button
                                onClick={onCloseMobileMenu}
                                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                                aria-label="Close menu"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto px-4 py-4">
                            <nav className="space-y-6">
                                {Object.entries(navItemsByCategory).map(([category, items]) => (
                                    <div key={category}>
                                        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-3">
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
                    </div>
                </>
            )}
        </>
    );
}

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
