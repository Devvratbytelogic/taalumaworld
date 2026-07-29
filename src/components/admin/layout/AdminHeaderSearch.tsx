'use client';

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
    type ReactNode,
    type RefObject,
} from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
    ArrowUpRight,
    Search,
    Book,
    FileText,
    Users,
    FolderTree,
    LayoutDashboard,
    MessageSquare,
    FileEdit,
    Receipt,
    Plus,
    Mail,
    ShoppingBag,
    Settings,
    Award,
    UserCircle,
    UserCog,
    BarChart3,
    ShoppingCart,
    Wallet,
    TrendingUp,
    Link2,
    Percent,
    Star,
} from 'lucide-react';
import { KshIcon } from '@/components/ui/AllSVG';
import { cn } from '@/components/ui/utils';
import { AdminSearchInput } from '@/components/admin/layout/AdminContent';
import {
    getAdminSectionRoutePath,
    getAdminProfileRoutePath,
    getAdminMentorTypesRoutePath,
    getCreateChapterRoutePath,
    getMentorRoutePath,
    getMentorDashboardRoutePath,
    getMentorBooksRoutePath,
    getMentorChaptersRoutePath,
    getMentorBlueprintPerformanceRoutePath,
    getMentorSalesVolumeRoutePath,
    getMentorRevenueEarnedRoutePath,
    getMentorRevenueByBlueprintRoutePath,
    getMentorWalletRoutePath,
    getMentorReferralsRoutePath,
    getMentorReviewsRoutePath,
    getMentorOrdersRoutePath,
    getMentorUsersRoutePath,
    getMentorProfileRoutePath,
} from '@/routes/routes';

export type AdminNavRoute = {
    label: string;
    description: string;
    path: string;
    icon: React.ElementType;
    keywords: string[];
};

const ADMIN_ROUTES: AdminNavRoute[] = [
    { label: 'Dashboard', description: 'Overview & stats', path: getAdminSectionRoutePath('dashboard'), icon: LayoutDashboard, keywords: ['home', 'overview', 'stats'] },
    { label: 'Series', description: 'Manage all series', path: getAdminSectionRoutePath('books'), icon: Book, keywords: ['book', 'series', 'publish'] },
    { label: 'Blueprints', description: 'Manage all blueprints', path: getAdminSectionRoutePath('chapters'), icon: FileText, keywords: ['blueprint', 'content'] },
    { label: 'Create Blueprint', description: 'Add a new blueprint', path: getCreateChapterRoutePath(), icon: Plus, keywords: ['new blueprint', 'add blueprint'] },
    { label: 'Categories', description: 'Manage categories', path: getAdminSectionRoutePath('categories'), icon: FolderTree, keywords: ['category', 'tag'] },
    { label: 'Mentors', description: 'Manage mentors', path: getAdminSectionRoutePath('authors'), icon: Users, keywords: ['author', 'leader', 'thought', 'mentor'] },
    { label: 'Mentor Types', description: 'Configure mentor categories and revenue share', path: getAdminMentorTypesRoutePath(), icon: Award, keywords: ['mentor type', 'mentor category', 'founding', 'revenue share', 'badge'] },
    { label: 'Users', description: 'Manage registered users', path: getAdminSectionRoutePath('users'), icon: UserCircle, keywords: ['user', 'member', 'account'] },
    { label: 'Staff', description: 'Manage staff members and roles', path: getAdminSectionRoutePath('staff'), icon: UserCog, keywords: ['staff', 'institutional', 'admin', 'role'] },
    { label: 'Transactions', description: 'View payment transactions', path: getAdminSectionRoutePath('transactions'), icon: Receipt, keywords: ['payment', 'transaction', 'money'] },
    { label: 'Orders', description: 'View series & blueprint orders', path: getAdminSectionRoutePath('orders'), icon: ShoppingBag, keywords: ['order', 'book order', 'series order', 'blueprint order', 'purchase'] },
    { label: 'Taxes', description: 'Manage country tax rates', path: getAdminSectionRoutePath('taxes'), icon: Percent, keywords: ['tax', 'gst', 'vat', 'rate'] },
    { label: 'Reviews', description: 'Monitor and moderate user reviews', path: getAdminSectionRoutePath('reviews'), icon: Star, keywords: ['review', 'rating', 'feedback', 'moderate'] },
    { label: 'Testimonials', description: 'Manage testimonials', path: getAdminSectionRoutePath('testimonials'), icon: MessageSquare, keywords: ['testimonial', 'review', 'feedback'] },
    { label: 'FAQs', description: 'Manage FAQ entries', path: getAdminSectionRoutePath('faqs'), icon: FileEdit, keywords: ['faq', 'question', 'answer'] },
    { label: 'Subscribers', description: 'View newsletter subscribers', path: getAdminSectionRoutePath('subscribers'), icon: Mail, keywords: ['subscriber', 'newsletter', 'email'] },
    { label: 'Settings', description: 'Platform settings', path: getAdminSectionRoutePath('settings'), icon: Settings, keywords: ['setting', 'config', 'logo'] },
    { label: 'Referral Setting', description: 'Configure affiliate referral commission', path: getAdminSectionRoutePath('referral_setting'), icon: Link2, keywords: ['referral', 'affiliate', 'commission'] },
    { label: 'My Profile', description: 'Edit your admin profile', path: getAdminProfileRoutePath(), icon: UserCircle, keywords: ['profile', 'me', 'account'] },
];

const MENTOR_ROUTES: AdminNavRoute[] = [
    { label: 'Dashboard', description: 'Overview & stats', path: getMentorDashboardRoutePath(), icon: LayoutDashboard, keywords: ['home', 'overview', 'stats'] },
    { label: 'Series', description: 'Manage your series', path: getMentorBooksRoutePath(), icon: Book, keywords: ['book', 'series', 'publish'] },
    { label: 'Blueprints', description: 'Manage your blueprints', path: getMentorChaptersRoutePath(), icon: FileText, keywords: ['blueprint', 'content'] },
    { label: 'Reviews', description: 'Monitor and moderate reviews', path: getMentorReviewsRoutePath(), icon: Star, keywords: ['review', 'rating', 'feedback'] },
    { label: 'Orders', description: 'View your series & blueprint orders', path: getMentorOrdersRoutePath(), icon: ShoppingBag, keywords: ['order', 'purchase', 'sales'] },
    { label: 'Create Blueprint', description: 'Add a new blueprint', path: getCreateChapterRoutePath(true), icon: Plus, keywords: ['new blueprint', 'add blueprint'] },
    { label: 'Blueprint Performance', description: 'Track blueprint performance', path: getMentorBlueprintPerformanceRoutePath(), icon: BarChart3, keywords: ['performance', 'analytics'] },
    { label: 'Sales Volume', description: 'View sales volume', path: getMentorSalesVolumeRoutePath(), icon: ShoppingCart, keywords: ['sales', 'volume'] },
    { label: 'Revenue Earned', description: 'View revenue earned', path: getMentorRevenueEarnedRoutePath(), icon: KshIcon, keywords: ['revenue', 'earnings', 'money'] },
    { label: 'Revenue by Blueprint', description: 'Revenue breakdown by blueprint', path: getMentorRevenueByBlueprintRoutePath(), icon: TrendingUp, keywords: ['revenue', 'blueprint'] },
    { label: 'Wallet & Payouts', description: 'Manage wallet and payouts', path: getMentorWalletRoutePath(), icon: Wallet, keywords: ['wallet', 'payout', 'withdraw'] },
    { label: 'Referral Performance', description: 'Track referral performance', path: getMentorReferralsRoutePath(), icon: Link2, keywords: ['referral', 'growth'] },
    { label: 'Users', description: 'Manage your users', path: getMentorUsersRoutePath(), icon: UserCircle, keywords: ['user', 'member', 'account'] },
    { label: 'My Profile', description: 'Edit your mentor profile', path: getMentorProfileRoutePath(), icon: UserCircle, keywords: ['profile', 'me', 'account'] },
];

type AdminHeaderSearchContextValue = {
    searchRef: RefObject<HTMLDivElement | null>;
    mobileSearchRef: RefObject<HTMLDivElement | null>;
    searchInputRef: RefObject<HTMLInputElement | null>;
    mobileSearchInputRef: RefObject<HTMLInputElement | null>;
    showResults: boolean;
    setShowResults: (show: boolean) => void;
    searchQuery: string;
    searchResults: AdminNavRoute[];
    pathname: string;
    activeIndex: number;
    setActiveIndex: (index: number) => void;
    handleResultClick: (path: string) => void;
    handleSearchKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    handleSearchChange: (value: string) => void;
};

const AdminHeaderSearchContext = createContext<AdminHeaderSearchContextValue | null>(null);

function useAdminHeaderSearchContext() {
    const context = useContext(AdminHeaderSearchContext);
    if (!context) {
        throw new Error('AdminHeaderSearch must be used within AdminHeaderSearchProvider');
    }
    return context;
}

function useAdminHeaderSearchState(): AdminHeaderSearchContextValue {
    const router = useRouter();
    const pathname = usePathname();

    const [searchQuery, setSearchQuery] = useState('');
    const [showResults, setShowResults] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);

    const searchRef = useRef<HTMLDivElement>(null);
    const mobileSearchRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const mobileSearchInputRef = useRef<HTMLInputElement>(null);

    const isSearchActive = searchQuery.trim().length >= 1;
    const isMentor = pathname.startsWith(getMentorRoutePath());
    const routes = isMentor ? MENTOR_ROUTES : ADMIN_ROUTES;

    const searchResults = useMemo(() => {
        if (!isSearchActive) return routes;
        const q = searchQuery.toLowerCase().trim();
        return routes.filter(route =>
            route.label.toLowerCase().includes(q) ||
            route.description.toLowerCase().includes(q) ||
            route.keywords.some(k => k.includes(q)),
        );
    }, [isSearchActive, searchQuery, routes]);

    useEffect(() => {
        setActiveIndex(0);
    }, [searchQuery, searchResults.length]);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            const inside = searchRef.current?.contains(e.target as Node)
                || mobileSearchRef.current?.contains(e.target as Node);
            if (!inside) setShowResults(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
                e.preventDefault();
                const input = window.innerWidth >= 1024
                    ? searchInputRef.current
                    : mobileSearchInputRef.current;
                input?.focus();
                setShowResults(true);
            }
            if (e.key === 'Escape') {
                setShowResults(false);
                setActiveIndex(0);
            }
        };
        document.addEventListener('keydown', onKeyDown);
        return () => document.removeEventListener('keydown', onKeyDown);
    }, []);

    const handleResultClick = useCallback((path: string) => {
        setShowResults(false);
        setSearchQuery('');
        setActiveIndex(0);
        router.push(path);
    }, [router]);

    const handleSearchKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
        if (!showResults || searchResults.length === 0) return;

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setActiveIndex((index) => Math.min(index + 1, searchResults.length - 1));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setActiveIndex((index) => Math.max(index - 1, 0));
        } else if (e.key === 'Enter') {
            e.preventDefault();
            const route = searchResults[activeIndex];
            if (route) handleResultClick(route.path);
        }
    }, [activeIndex, handleResultClick, searchResults, showResults]);

    const handleSearchChange = useCallback((value: string) => {
        setSearchQuery(value);
        setShowResults(true);
    }, []);

    return {
        searchRef,
        mobileSearchRef,
        searchInputRef,
        mobileSearchInputRef,
        showResults,
        setShowResults,
        searchQuery,
        searchResults,
        pathname,
        activeIndex,
        setActiveIndex,
        handleResultClick,
        handleSearchKeyDown,
        handleSearchChange,
    };
}

export function AdminHeaderSearchProvider({ children }: { children: ReactNode }) {
    const value = useAdminHeaderSearchState();
    return (
        <AdminHeaderSearchContext.Provider value={value}>
            {children}
        </AdminHeaderSearchContext.Provider>
    );
}

export function AdminHeaderSearch({
    placement,
    className,
    inputClassName,
}: {
    placement: 'desktop' | 'mobile';
    className?: string;
    inputClassName?: string;
}) {
    const {
        searchRef,
        mobileSearchRef,
        searchInputRef,
        mobileSearchInputRef,
        showResults,
        setShowResults,
        searchQuery,
        searchResults,
        pathname,
        activeIndex,
        setActiveIndex,
        handleResultClick,
        handleSearchKeyDown,
        handleSearchChange,
    } = useAdminHeaderSearchContext();

    const isDesktop = placement === 'desktop';
    const wrapperRef = isDesktop ? searchRef : mobileSearchRef;
    const inputRef = isDesktop ? searchInputRef : mobileSearchInputRef;

    return (
        <div
            ref={wrapperRef}
            className={className}
            onFocus={() => setShowResults(true)}
        >
            <AdminSearchInput
                value={searchQuery}
                onChange={handleSearchChange}
                onKeyDown={handleSearchKeyDown}
                inputRef={inputRef}
                placeholder="Navigate to..."
                className={cn(isDesktop ? 'flex-none! w-full' : 'relative w-full', inputClassName)}
                inputClassName={cn(
                    showResults && 'border-primary/35 ring-2 ring-primary/10',
                    !searchQuery.trim() && 'pr-14',
                )}
                trailing={!searchQuery.trim() ? (
                    <kbd className="pointer-events-none absolute right-2.5 top-1/2 hidden -translate-y-1/2 rounded-sm border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[10px] font-medium leading-none text-slate-400 sm:inline-block">
                        ⌘K
                    </kbd>
                ) : null}
            />
            <AdminHeaderSearchDropdown
                show={showResults}
                results={searchResults}
                query={searchQuery}
                pathname={pathname}
                activeIndex={activeIndex}
                onActiveIndexChange={setActiveIndex}
                onSelect={handleResultClick}
            />
        </div>
    );
}

function AdminHeaderSearchDropdown({
    show,
    results,
    query,
    pathname,
    activeIndex,
    onActiveIndexChange,
    onSelect,
}: {
    show: boolean;
    results: AdminNavRoute[];
    query: string;
    pathname: string;
    activeIndex: number;
    onActiveIndexChange: (index: number) => void;
    onSelect: (path: string) => void;
}) {
    const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

    useEffect(() => {
        itemRefs.current[activeIndex]?.scrollIntoView({ block: 'nearest' });
    }, [activeIndex]);

    if (!show) return null;

    const isFiltering = query.trim().length >= 1;

    return (
        <div className="absolute top-full left-0 right-0 z-50 mt-1.5 overflow-hidden rounded-md border border-slate-200/90 bg-white shadow-[0_8px_24px_rgba(15,23,42,0.1)]">
            <div className="flex items-center justify-between border-b border-slate-100 px-3.5 py-2.5">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                    Quick navigation
                </p>
                {isFiltering && (
                    <span className="text-xs text-slate-400">
                        {results.length} {results.length === 1 ? 'result' : 'results'}
                    </span>
                )}
            </div>

            <div className="custom_scrollbar max-h-72 overflow-y-auto p-1.5">
                {results.length === 0 ? (
                    <div className="flex flex-col items-center justify-center px-4 py-8 text-center">
                        <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-slate-100">
                            <Search className="h-4 w-4 text-slate-400" />
                        </div>
                        <p className="mt-3 text-sm font-medium text-slate-700">No pages found</p>
                        <p className="mt-1 text-xs text-slate-500">Try a different search term</p>
                    </div>
                ) : (
                    results.map((route, index) => {
                        const Icon = route.icon;
                        const isCurrent = pathname === route.path || pathname.startsWith(`${route.path}/`);
                        const isHighlighted = index === activeIndex;

                        return (
                            <button
                                key={route.path}
                                ref={(el) => { itemRefs.current[index] = el; }}
                                type="button"
                                onClick={() => onSelect(route.path)}
                                onMouseEnter={() => onActiveIndexChange(index)}
                                className={cn(
                                    'group flex w-full items-center gap-3 rounded-sm px-2.5 py-2 text-left transition-colors',
                                    isHighlighted
                                        ? 'bg-primary/10 ring-1 ring-inset ring-primary/20'
                                        : isCurrent
                                            ? 'bg-primary/8 ring-1 ring-inset ring-primary/15'
                                            : 'hover:bg-slate-50',
                                )}
                            >
                                <div
                                    className={cn(
                                        'flex h-9 w-9 shrink-0 items-center justify-center rounded-sm transition-colors',
                                        isHighlighted || isCurrent
                                            ? 'bg-primary/15'
                                            : 'bg-slate-100 group-hover:bg-primary/10',
                                    )}
                                >
                                    <Icon
                                        className={cn(
                                            'h-4 w-4',
                                            isHighlighted || isCurrent
                                                ? 'text-primary'
                                                : 'text-slate-500 group-hover:text-primary',
                                        )}
                                    />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-2">
                                        <p className="truncate text-sm font-medium text-slate-900">{route.label}</p>
                                        {isCurrent && (
                                            <span className="shrink-0 rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary">
                                                Current
                                            </span>
                                        )}
                                    </div>
                                    <p className="truncate text-xs text-slate-500">{route.description}</p>
                                </div>
                                <ArrowUpRight
                                    className={cn(
                                        'h-3.5 w-3.5 shrink-0 text-slate-300 transition-all',
                                        isHighlighted || isCurrent
                                            ? 'text-primary opacity-100'
                                            : 'opacity-0 group-hover:opacity-100 group-hover:text-slate-400',
                                    )}
                                />
                            </button>
                        );
                    })
                )}
            </div>

            <div className="border-t border-slate-100 bg-slate-50/80 px-3.5 py-2">
                <p className="text-[11px] text-slate-400">
                    {results.length > 0
                        ? '↑↓ to navigate · Enter to open · Esc to close'
                        : 'Type to filter pages · ⌘K to focus'}
                </p>
            </div>
        </div>
    );
}
