'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    BookOpen, Home, LogOut, Settings, ChevronDown, Menu,
    UserCircle, Book, FileText, Users, FolderTree, LayoutDashboard,
    MessageSquare, FileEdit, Receipt, Plus, Mail, ShoppingBag,
} from 'lucide-react';
import { Avatar, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, DropdownSection } from '@heroui/react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/components/ui/utils';
import { AdminSearchInput } from '@/components/admin/layout/AdminContent';
import { getAdminSectionRoutePath, getAdminProfileRoutePath, getHomeRoutePath, getCreateChapterRoutePath, getMentorDashboardRoutePath } from '@/routes/routes';
import { clearAuthCookies, getUserRole } from '@/utils/authCookies';
import toast from '@/utils/toast';
import { useUpdateGlobalSettingsMutation } from '@/store/rtkQueries/adminPostApi';
import { useGetAdminGlobalSettingsQuery, useGetAdminProfileQuery } from '@/store/rtkQueries/adminGetApi';
import type { AdminRole } from '@/types/admin';
import ImageComponent from '@/components/ui/ImageComponent';

const ADMIN_ROUTES = [
    { label: 'Dashboard', description: 'Overview & stats', path: getAdminSectionRoutePath('dashboard'), icon: LayoutDashboard, keywords: ['home', 'overview', 'stats'] },
    { label: 'Series', description: 'Manage all series', path: getAdminSectionRoutePath('books'), icon: Book, keywords: ['book', 'series', 'publish'] },
    { label: 'Blueprints', description: 'Manage all blueprints', path: getAdminSectionRoutePath('chapters'), icon: FileText, keywords: ['blueprint', 'content'] },
    { label: 'Create Blueprint', description: 'Add a new blueprint', path: getCreateChapterRoutePath(), icon: Plus, keywords: ['new blueprint', 'add blueprint'] },
    { label: 'Categories', description: 'Manage categories', path: getAdminSectionRoutePath('categories'), icon: FolderTree, keywords: ['category', 'tag'] },
    { label: 'Mentors', description: 'Manage mentors', path: getAdminSectionRoutePath('authors'), icon: Users, keywords: ['author', 'leader', 'thought', 'mentor'] },
    { label: 'Users', description: 'Manage registered users', path: getAdminSectionRoutePath('users'), icon: UserCircle, keywords: ['user', 'member', 'account'] },
    { label: 'Transactions', description: 'View payment transactions', path: getAdminSectionRoutePath('transactions'), icon: Receipt, keywords: ['payment', 'transaction', 'money'] },
    { label: 'Orders', description: 'View series & blueprint orders', path: getAdminSectionRoutePath('orders'), icon: ShoppingBag, keywords: ['order', 'book order', 'series order', 'blueprint order', 'purchase'] },
    { label: 'Testimonials', description: 'Manage testimonials', path: getAdminSectionRoutePath('testimonials'), icon: MessageSquare, keywords: ['testimonial', 'review', 'feedback'] },
    { label: 'FAQs', description: 'Manage FAQ entries', path: getAdminSectionRoutePath('faqs'), icon: FileEdit, keywords: ['faq', 'question', 'answer'] },
    { label: 'Subscribers', description: 'View newsletter subscribers', path: getAdminSectionRoutePath('subscribers'), icon: Mail, keywords: ['subscriber', 'newsletter', 'email'] },
    { label: 'Settings', description: 'Platform settings', path: getAdminSectionRoutePath('settings'), icon: Settings, keywords: ['setting', 'config', 'logo'] },
    { label: 'My Profile', description: 'Edit your admin profile', path: getAdminProfileRoutePath(), icon: UserCircle, keywords: ['profile', 'me', 'account'] },
];

interface AdminHeaderProps {
    onMobileMenuToggle: () => void;
}

const headerButtonClass =
    'inline-flex h-9 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50';

function TopBarContentMode({
    visible,
    isInitialLoading,
    isUpdating,
    onToggle,
    className,
}: {
    visible: string;
    isInitialLoading: boolean;
    isUpdating: boolean;
    onToggle: (isBooks: boolean) => void;
    className?: string;
}) {
    const isLoading = isInitialLoading || isUpdating;

    return (
        <div className={cn('flex h-full items-center gap-2.5', className)}>
            <span className="hidden h-7 items-center text-xs leading-none text-white/50 lg:inline-flex">
                Content mode
            </span>
            <div className="relative flex h-7 items-center">
                <div
                    role="group"
                    aria-label="Content mode"
                    aria-busy={isLoading}
                    className={cn(
                        'inline-flex h-7 items-center rounded-full border border-white/20 bg-black/10 p-0.5 transition-opacity duration-200',
                        isLoading && 'pointer-events-none opacity-70',
                    )}
                >
                    {isInitialLoading ? (
                        <>
                            <span className="flex h-6 w-18 items-center justify-center rounded-full px-3">
                                <span className="block h-2.5 w-14 animate-pulse rounded-full bg-white/20" />
                            </span>
                            <span className="flex h-6 w-11 items-center justify-center rounded-full px-3">
                                <span className="block h-2.5 w-8 animate-pulse rounded-full bg-white/20" />
                            </span>
                        </>
                    ) : (
                        <>
                            <button
                                type="button"
                                aria-pressed={visible === 'chapter'}
                                disabled={isUpdating}
                                onClick={() => visible !== 'chapter' && onToggle(false)}
                                className={cn(
                                    'inline-flex h-6 items-center justify-center rounded-full px-3 text-xs font-medium leading-none transition-all duration-200 disabled:cursor-not-allowed',
                                    visible === 'chapter'
                                        ? 'bg-white text-primary shadow-sm'
                                        : 'text-white/65 hover:text-white',
                                )}
                            >
                                Blueprints
                            </button>
                            <button
                                type="button"
                                aria-pressed={visible === 'book'}
                                disabled={isUpdating}
                                onClick={() => visible !== 'book' && onToggle(true)}
                                className={cn(
                                    'inline-flex h-6 items-center justify-center rounded-full px-3 text-xs font-medium leading-none transition-all duration-200 disabled:cursor-not-allowed',
                                    visible === 'book'
                                        ? 'bg-white text-primary shadow-sm'
                                        : 'text-white/65 hover:text-white',
                                )}
                            >
                                Series
                            </button>
                        </>
                    )}
                </div>

                {isUpdating && (
                    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                        <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/80 border-t-transparent" />
                    </div>
                )}
            </div>

            <span className="sr-only" aria-live="polite">
                {isUpdating ? 'Updating content mode' : ''}
            </span>
        </div>
    );
}

export function AdminHeader({ onMobileMenuToggle }: AdminHeaderProps) {
    const router = useRouter();
    const [updateGlobalSettings, { isLoading: isToggling }] = useUpdateGlobalSettingsMutation();
    const { data: globalSettings, isFetching: isSettingsLoading } = useGetAdminGlobalSettingsQuery();
    const { data: profileData } = useGetAdminProfileQuery();

    const [searchQuery, setSearchQuery] = useState('');
    const [showResults, setShowResults] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);
    const mobileSearchRef = useRef<HTMLDivElement>(null);

    const isSearchActive = searchQuery.trim().length >= 1;

    const searchResults = useMemo(() => {
        if (!isSearchActive) return ADMIN_ROUTES;
        const q = searchQuery.toLowerCase().trim();
        return ADMIN_ROUTES.filter(route =>
            route.label.toLowerCase().includes(q) ||
            route.description.toLowerCase().includes(q) ||
            route.keywords.some(k => k.includes(q))
        );
    }, [isSearchActive, searchQuery]);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            const inside = searchRef.current?.contains(e.target as Node)
                || mobileSearchRef.current?.contains(e.target as Node);
            if (!inside) setShowResults(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const handleResultClick = (path: string) => {
        setShowResults(false);
        setSearchQuery('');
        router.push(path);
    };

    const visible = globalSettings?.data?.visible ?? 'chapter';
    const logo = globalSettings?.data?.logo as string | null | undefined;
    const brandName = globalSettings?.data?.marketplace_name || globalSettings?.data?.platformName || 'TaalumaWorld';

    const roleLabel = profileData?.data?.role?.name ?? 'Admin';

    const adminUser = {
        name: profileData?.data?.name ?? 'Admin User',
        email: profileData?.data?.email ?? '',
        avatar: profileData?.data?.profile_pic ?? '',
        role: (profileData?.data?.role?.name?.toLowerCase() === 'author' ? 'author' : 'admin') as AdminRole,
    };

    const isAuthor = adminUser.role === 'author' || getUserRole()?.toLowerCase() === 'author';

    const onContentModeToggle = async (isBooks: boolean) => {
        const newMode = isBooks ? 'book' : 'chapter';
        await updateGlobalSettings({ visible: newMode });
    };

    const handleLogout = () => {
        clearAuthCookies();
        toast.success('Signed out successfully');
        window.location.href = getHomeRoutePath();
    };

    const handleDropdownAction = (key: React.Key) => {
        if (key === 'profile') router.push(getAdminProfileRoutePath());
        if (key === 'settings') router.push(getAdminSectionRoutePath('settings'));
        if (key === 'website') router.push(getHomeRoutePath());
        if (key === 'logout') handleLogout();
    };

    return (
        <header className="sticky top-0 z-50 border-b border-slate-200/90 bg-white">

            {/* Top bar */}
            <div className="border-b border-primary-dark/30 bg-primary text-white">
                <div className="mx-auto flex h-10 max-w-[1440px] items-center justify-between gap-4 px-4 sm:px-6">
                    <div className="flex h-full min-w-0 items-center">
                        <p className="hidden min-w-0 items-center gap-2 text-sm leading-none sm:flex">
                            <span className="shrink-0 font-semibold tracking-tight text-white">
                                {isAuthor ? 'Mentor Panel' : 'Admin Panel'}
                            </span>
                            <span aria-hidden className="text-white/30">·</span>
                            <span className="truncate font-normal text-white/70">{brandName}</span>
                        </p>
                        <p className="truncate text-sm font-semibold leading-none text-white sm:hidden">
                            {isAuthor ? 'Mentor Panel' : 'Admin Panel'}
                        </p>
                    </div>

                    {!isAuthor && (
                        <TopBarContentMode
                            visible={visible}
                            isInitialLoading={isSettingsLoading && !globalSettings?.data}
                            isUpdating={isToggling || (isSettingsLoading && !!globalSettings?.data)}
                            onToggle={onContentModeToggle}
                        />
                    )}
                </div>
            </div>

            {/* Main header */}
            <div className="mx-auto max-w-[1440px] px-4 sm:px-6">
                <div className="relative flex h-14 items-center">
                    <div className="flex min-w-0 flex-1 items-center gap-2">
                        <button
                            type="button"
                            onClick={onMobileMenuToggle}
                            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition-colors hover:bg-slate-50 lg:hidden"
                            aria-label="Open menu"
                        >
                            <Menu className="h-5 w-5" />
                        </button>

                        <Link
                            href={isAuthor ? getMentorDashboardRoutePath() : '/admin/dashboard'}
                            className="flex min-w-0 shrink-0 items-center gap-2.5"
                        >
                            {logo ? (
                                <div className="h-9 w-[140px] sm:h-10 sm:w-[160px]">
                                    <ImageComponent src={logo} alt={brandName} object_cover={false} />
                                </div>
                            ) : (
                                <>
                                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                                        <BookOpen className="h-5 w-5 text-white" />
                                    </div>
                                    <div className="hidden min-w-0 sm:block">
                                        <p className="truncate text-sm font-semibold leading-none text-slate-900">{brandName}</p>
                                        <p className="mt-0.5 text-xs text-slate-500">{isAuthor ? 'Mentor' : 'Admin'}</p>
                                    </div>
                                </>
                            )}
                        </Link>
                    </div>

                    <div
                        className="absolute left-1/2 top-1/2 hidden w-full max-w-sm -translate-x-1/2 -translate-y-1/2 px-4 lg:block xl:max-w-md"
                        ref={searchRef}
                        onFocus={() => setShowResults(true)}
                    >
                        <AdminSearchInput
                            value={searchQuery}
                            onChange={(value) => {
                                setSearchQuery(value);
                                setShowResults(true);
                            }}
                            placeholder="Navigate to..."
                            className="flex-none! w-full"
                        />
                        <SearchDropdown
                            show={showResults}
                            results={searchResults}
                            onSelect={handleResultClick}
                        />
                    </div>

                    <div className="flex flex-1 items-center justify-end gap-2">
                        <button
                            type="button"
                            onClick={() => router.push(getHomeRoutePath())}
                            className={headerButtonClass}
                        >
                            <Home className="h-4 w-4 text-primary" />
                            <span className="hidden lg:inline">Website</span>
                        </button>

                        <Dropdown>
                            <DropdownTrigger>
                                <button type="button" className={cn(headerButtonClass, 'max-w-48 pl-1.5')}>
                                    <Avatar
                                        src={adminUser.avatar}
                                        name={adminUser.name}
                                        className="h-7 w-7 shrink-0"
                                    />
                                    <span className="hidden truncate md:inline">{adminUser.name}</span>
                                    <ChevronDown className="hidden h-4 w-4 shrink-0 text-slate-400 md:inline" />
                                </button>
                            </DropdownTrigger>
                            <DropdownMenu
                                aria-label="User menu"
                                className="w-72"
                                onAction={handleDropdownAction}
                                topContent={
                                    <div className="px-2 py-2">
                                        <p className="text-sm font-medium text-slate-900">{adminUser.name}</p>
                                        <p className="text-sm text-slate-500">{adminUser.email}</p>
                                        <Badge variant="secondary" className="mt-1 w-fit">{roleLabel}</Badge>
                                    </div>
                                }
                            >
                                <DropdownItem key="profile" startContent={<UserCircle className="h-4 w-4" />}>My Profile</DropdownItem>
                                {isAuthor ? null : <DropdownItem key="settings" startContent={<Settings className="h-4 w-4" />}>Settings</DropdownItem>}
                                <DropdownItem key="website" startContent={<Home className="h-4 w-4" />}>Back to Website</DropdownItem>
                                <DropdownSection>
                                    <DropdownItem key="logout" startContent={<LogOut className="h-4 w-4" />} className="text-danger" color="danger">
                                        Sign Out
                                    </DropdownItem>
                                </DropdownSection>
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                </div>
            </div>

            {/* Mobile search */}
            <div
                className="relative border-t border-slate-200/80 px-4 py-2.5 lg:hidden"
                ref={mobileSearchRef}
                onFocus={() => setShowResults(true)}
            >
                <AdminSearchInput
                    value={searchQuery}
                    onChange={(value) => {
                        setSearchQuery(value);
                        setShowResults(true);
                    }}
                    placeholder="Navigate to..."
                    className="relative w-full"
                />
                <SearchDropdown
                    show={showResults}
                    results={searchResults}
                    onSelect={handleResultClick}
                />
            </div>
        </header>
    );
}

type RouteItem = typeof ADMIN_ROUTES[number];

function SearchDropdown({
    show,
    results,
    onSelect,
}: {
    show: boolean;
    results: RouteItem[];
    onSelect: (path: string) => void;
}) {
    if (!show) return null;

    return (
        <div className="absolute top-full left-0 right-0 z-50 mt-1.5 max-h-80 overflow-hidden overflow-y-auto rounded-xl border border-slate-200/90 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.1)]">
            {results.length === 0 ? (
                <p className="px-4 py-5 text-center text-sm text-slate-500">No pages found</p>
            ) : (
                results.map((route) => {
                    const Icon = route.icon;
                    return (
                        <button
                            key={route.path}
                            type="button"
                            onClick={() => onSelect(route.path)}
                            className="group flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors hover:bg-slate-50"
                        >
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-primary/15">
                                <Icon className="h-4 w-4 text-primary" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-sm font-medium text-slate-900">{route.label}</p>
                                <p className="text-xs text-slate-500">{route.description}</p>
                            </div>
                        </button>
                    );
                })
            )}
        </div>
    );
}
