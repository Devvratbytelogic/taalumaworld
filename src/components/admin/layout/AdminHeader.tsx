'use client';
import { useState, useRef, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    BookOpen, Search, Home, Bell, LogOut, Settings, ChevronDown, Menu, X,
    UserCircle, Book, FileText, Users, FolderTree, LayoutDashboard,
    MessageSquare, FileEdit, Receipt, Plus,
} from 'lucide-react';
import { Button, Input, Switch, Avatar, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, DropdownSection } from '@heroui/react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/components/ui/utils';
import { getRoleName } from '@/utils/adminPermissions';
import { getAdminSectionRoutePath, getAdminProfileRoutePath, getHomeRoutePath, getCreateChapterRoutePath } from '@/routes/routes';
import { clearAuthCookies, getUserRole } from '@/utils/authCookies';
import toast from '@/utils/toast';
import { useUpdateGlobalSettingsMutation } from '@/store/rtkQueries/adminPostApi';
import { useGetAdminGlobalSettingsQuery, useGetAdminProfileQuery } from '@/store/rtkQueries/adminGetApi';
import type { AdminRole } from '@/types/admin';
import ImageComponent from '@/components/ui/ImageComponent';

// ── All navigable admin routes for the search palette ────────────────────────
const ADMIN_ROUTES = [
    { label: 'Dashboard',        description: 'Overview & stats',            path: getAdminSectionRoutePath('dashboard'),    icon: LayoutDashboard, keywords: ['home', 'overview', 'stats'] },
    { label: 'Books',            description: 'Manage all books',            path: getAdminSectionRoutePath('books'),        icon: Book,            keywords: ['book', 'publish'] },
    { label: 'Chapters',         description: 'Manage all chapters',         path: getAdminSectionRoutePath('chapters'),     icon: FileText,        keywords: ['chapter', 'content'] },
    { label: 'Create Chapter',   description: 'Add a new chapter',          path: getCreateChapterRoutePath(),              icon: Plus,            keywords: ['new chapter', 'add chapter'] },
    { label: 'Categories',       description: 'Manage categories',          path: getAdminSectionRoutePath('categories'),   icon: FolderTree,      keywords: ['category', 'tag'] },
    { label: 'Thought Leaders',  description: 'Manage authors & leaders',   path: getAdminSectionRoutePath('authors'),      icon: Users,           keywords: ['author', 'leader', 'thought'] },
    { label: 'Users',            description: 'Manage registered users',    path: getAdminSectionRoutePath('users'),        icon: UserCircle,      keywords: ['user', 'member', 'account'] },
    { label: 'Transactions',     description: 'View payment transactions',  path: getAdminSectionRoutePath('transactions'), icon: Receipt,         keywords: ['payment', 'transaction', 'money'] },
    { label: 'Testimonials',     description: 'Manage testimonials',        path: getAdminSectionRoutePath('testimonials'), icon: MessageSquare,   keywords: ['testimonial', 'review', 'feedback'] },
    { label: 'FAQs',             description: 'Manage FAQ entries',         path: getAdminSectionRoutePath('faqs'),         icon: FileEdit,        keywords: ['faq', 'question', 'answer'] },
    { label: 'Settings',         description: 'Platform settings',          path: getAdminSectionRoutePath('settings'),     icon: Settings,        keywords: ['setting', 'config', 'logo'] },
    { label: 'My Profile',       description: 'Edit your admin profile',    path: getAdminProfileRoutePath(),               icon: UserCircle,      keywords: ['profile', 'me', 'account'] },
];

export function AdminHeader() {
    const router = useRouter();
    const [updateGlobalSettings, { isLoading: isToggling }] = useUpdateGlobalSettingsMutation();
    const { data: globalSettings, isFetching: isSettingsLoading } = useGetAdminGlobalSettingsQuery();
    const { data: profileData } = useGetAdminProfileQuery();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // ── Navigation search ─────────────────────────────────────────────────────
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

    const adminUser = {
        name: profileData?.data?.name ?? 'Admin User',
        email: profileData?.data?.email ?? '',
        avatar: profileData?.data?.profile_pic ?? '',
        role: (profileData?.data?.role?.name?.toLowerCase() === 'author' ? 'author' : 'admin') as AdminRole,
    };

    const isAuthor = adminUser.role === 'author' || getUserRole()?.toLowerCase() === 'author';

    const onMobileMenuToggle = () => setMobileMenuOpen(prev => !prev);

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
        <header className="sticky top-0 z-50 bg-white shadow-sm">

            {/* ── Top Bar ─────────────────────────────────────────── */}
            <div className="bg-primary text-white">
                <div className="container mx-auto sm:px-4 h-10 flex items-center justify-between text-sm">
                    <span className="font-medium hidden sm:block">Admin Panel - {brandName}</span>
                    <span className="font-medium sm:hidden">Admin</span>

                    {!isAuthor && (
                        <div className="flex items-center gap-2">
                            <span className="text-sm hidden md:block">Content Mode:</span>
                            <div className="flex items-center gap-2 bg-white/10 rounded-full px-3 py-1">
                                {isSettingsLoading || isToggling ? (
                                    <div className="flex items-center gap-2 px-1">
                                        <div className="h-3 w-3 rounded-full border-2 border-white border-t-transparent animate-spin" />
                                        <span className="text-sm opacity-80">Loading…</span>
                                    </div>
                                ) : (
                                    <>
                                        <span className={cn("text-sm", visible === 'chapter' ? 'font-semibold' : 'opacity-70')}>
                                            Chapters
                                        </span>
                                        <Switch isSelected={visible === 'book'} onValueChange={onContentModeToggle} size="sm" />
                                        <span className={cn("text-sm", visible === 'book' ? 'font-semibold' : 'opacity-70')}>
                                            Books
                                        </span>
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* ── Main Header ─────────────────────────────────────── */}
            <div className="container mx-auto sm:px-4">
                <div className="flex items-center justify-between py-4 gap-4">

                    {/* Logo + mobile toggle */}
                    <div className="flex items-center gap-3">
                        <Button variant="light" size="sm" isIconOnly className="lg:hidden" onPress={onMobileMenuToggle}>
                            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </Button>
                        <Link href="/admin/dashboard" className="flex items-center gap-2 shrink-0">
                            {logo ? (
                                <div className="h-10 w-[160px]">
                                    <ImageComponent src={logo} alt={brandName} object_cover={false} />
                                </div>
                            ) : (
                                <>
                                    <div className="bg-primary rounded-xl p-2">
                                        <BookOpen className="h-6 w-6 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-lg font-bold leading-none">{brandName}</p>
                                        <p className="text-sm text-muted-foreground hidden sm:block">Admin Panel</p>
                                    </div>
                                </>
                            )}
                        </Link>
                    </div>

                    {/* Search (desktop) */}
                    <div className="hidden lg:flex flex-1 max-w-xl relative" ref={searchRef}>
                        <Input
                            startContent={<Search className="h-4 w-4 text-muted-foreground" />}
                            type="search"
                            placeholder="Navigate to..."
                            radius="full"
                            className="w-full"
                            value={searchQuery}
                            onChange={(e) => { setSearchQuery(e.target.value); setShowResults(true); }}
                            onFocus={() => setShowResults(true)}
                        />
                        <SearchDropdown
                            show={showResults}
                            results={searchResults}
                            onSelect={handleResultClick}
                        />
                    </div>

                    {/* Right actions */}
                    <div className="flex items-center gap-2">
                        <Button
                            onPress={() => router.push(getHomeRoutePath())}
                            className="global_btn rounded_full small_outline_primary fit_btn px-4!"
                        >
                            <Home className="h-4 w-4" />
                            <span className="hidden lg:inline">Website</span>
                        </Button>

                        <div className="relative">
                            <Bell className="h-5 w-5" />
                            <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-sm">
                                3
                            </Badge>
                        </div>

                        {/* User menu */}
                        <Dropdown>
                            <DropdownTrigger>
                                <Button className="global_btn rounded_full bg_transparent px-0! w-fit! min-w-fit! max-h-10! min-h-10!" isIconOnly={false}>
                                    <Avatar src={adminUser.avatar} name={adminUser.name} size="sm" className="h-8 w-8" />
                                    <span className="hidden md:inline">{adminUser.name}</span>
                                    <ChevronDown className="h-4 w-4 hidden md:inline" />
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu
                                aria-label="User menu"
                                className="w-72"
                                onAction={handleDropdownAction}
                                topContent={
                                    <div className="px-2 py-2">
                                        <p className="text-sm font-medium">{adminUser.name}</p>
                                        <p className="text-sm text-muted-foreground">{adminUser.email}</p>
                                        <Badge variant="secondary" className="w-fit mt-1">{getRoleName(adminUser.role)}</Badge>
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

            {/* ── Mobile Search ────────────────────────────────────── */}
            <div className="lg:hidden border-t px-4 py-3 relative" ref={mobileSearchRef}>
                <Input
                    startContent={<Search className="h-4 w-4 text-muted-foreground" />}
                    type="search"
                    placeholder="Navigate to..."
                    className="w-full rounded-full"
                    value={searchQuery}
                    onChange={(e) => { setSearchQuery(e.target.value); setShowResults(true); }}
                    onFocus={() => setShowResults(true)}
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

// ── Navigation Search Dropdown ────────────────────────────────────────────────

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
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-border z-50 overflow-hidden max-h-80 overflow-y-auto">
            {results.length === 0 ? (
                <p className="px-4 py-5 text-center text-sm text-muted-foreground">No pages found</p>
            ) : (
                results.map((route) => {
                    const Icon = route.icon;
                    return (
                        <button
                            key={route.path}
                            type="button"
                            onClick={() => onSelect(route.path)}
                            className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-muted/50 transition-colors text-left group"
                        >
                            <div className="h-8 w-8 rounded-lg bg-primary/8 flex items-center justify-center shrink-0 group-hover:bg-primary/15 transition-colors">
                                <Icon className="h-4 w-4 text-primary" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-sm font-medium">{route.label}</p>
                                <p className="text-xs text-muted-foreground">{route.description}</p>
                            </div>
                        </button>
                    );
                })
            )}
        </div>
    );
}
