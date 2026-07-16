'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    BookOpen, Home, LogOut, Settings, ChevronDown, Menu,
    UserCircle,
} from 'lucide-react';
import { Avatar } from '@heroui/react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/components/ui/utils';
import { AdminHeaderSearch, AdminHeaderSearchProvider } from '@/components/admin/layout/AdminHeaderSearch';
import { getAdminSectionRoutePath, getAdminProfileRoutePath, getHomeRoutePath, getMentorDashboardRoutePath, getMentorProfileRoutePath } from '@/routes/routes';
import { clearAuthCookies, getUserRole } from '@/utils/authCookies';
import toast from '@/utils/toast';
import { useUpdateGlobalSettingsMutation } from '@/store/rtkQueries/adminPostApi';
import { useGetAdminGlobalSettingsQuery } from '@/store/rtkQueries/adminGetApi';
import ImageComponent from '@/components/ui/ImageComponent';
import { USER_TYPE } from '@/constants/common';
import { IAdminProfileAPIResponse } from '@/types/adminProfile';

interface AdminHeaderProps {
    profileData: IAdminProfileAPIResponse;
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

export function AdminHeader({ profileData, onMobileMenuToggle }: AdminHeaderProps) {
    const router = useRouter();
    const [updateGlobalSettings, { isLoading: isToggling }] = useUpdateGlobalSettingsMutation();
    const { data: globalSettings, isFetching: isSettingsLoading } = useGetAdminGlobalSettingsQuery();
    
 
    const visible = globalSettings?.data?.visible ?? 'chapter';
    const logo = globalSettings?.data?.logo as string | null | undefined;
    const brandName = globalSettings?.data?.marketplace_name || globalSettings?.data?.platformName || 'TaalumaWorld';

    const adminUser = {
        name: profileData?.data?.name ?? 'Admin User',
        email: profileData?.data?.email ?? '',
        avatar: profileData?.data?.profile_pic ?? '',
        role: profileData?.data?.role?.name,
    };

    const isAuthor = adminUser.role === USER_TYPE.MENTOR || getUserRole() === USER_TYPE.MENTOR;
    const roleLabel = isAuthor ? 'Mentor' : (profileData?.data?.role?.name ?? 'Admin');

    const onContentModeToggle = async (isBooks: boolean) => {
        const newMode = isBooks ? 'book' : 'chapter';
        await updateGlobalSettings({ visible: newMode });
    };

    const handleLogout = () => {
        clearAuthCookies();
        toast.success('Signed out successfully');
        window.location.href = getHomeRoutePath();
    };

    const goToProfile = () => router.push(isAuthor ? getMentorProfileRoutePath() : getAdminProfileRoutePath());

    return (
        <AdminHeaderSearchProvider>
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

                        <AdminHeaderSearch
                            placement="desktop"
                            className="absolute left-1/2 top-1/2 hidden w-full max-w-sm -translate-x-1/2 -translate-y-1/2 px-4 lg:block xl:max-w-md"
                        />

                        <div className="flex flex-1 items-center justify-end gap-2">
                            <button
                                type="button"
                                onClick={() => router.push(getHomeRoutePath())}
                                className={headerButtonClass}
                            >
                                <Home className="h-4 w-4 text-primary" />
                                <span className="hidden lg:inline">Website</span>
                            </button>

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button
                                        type="button"
                                        className={cn(
                                            headerButtonClass,
                                            'group max-w-52 gap-2.5 pl-1 pr-2.5 data-[state=open]:border-primary/30 data-[state=open]:bg-primary/5',
                                        )}
                                    >
                                        <Avatar
                                            src={adminUser.avatar}
                                            name={adminUser.name}
                                            className="h-7 w-7 shrink-0"
                                        />
                                        <span className="hidden truncate md:inline">{adminUser.name}</span>
                                        <ChevronDown className="hidden h-4 w-4 shrink-0 text-slate-400 transition-transform duration-200 group-data-[state=open]:rotate-180 md:inline" />
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-72 overflow-hidden rounded-md border-slate-200 p-0 shadow-lg">
                                    <div className="border-b border-slate-100 bg-linear-to-r from-primary/5 via-slate-50 to-white px-4 py-4">
                                        <div className="flex items-center gap-3">
                                            <Avatar
                                                src={adminUser.avatar}
                                                name={adminUser.name}
                                                className="h-11 w-11 shrink-0 ring-2 ring-white shadow-sm"
                                            />
                                            <div className="min-w-0 flex-1">
                                                <p className="truncate text-sm font-semibold text-slate-900">{adminUser.name}</p>
                                                <p className="truncate text-xs text-slate-500">{adminUser.email}</p>
                                            </div>
                                        </div>
                                        <span className="mt-3 inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                                            {roleLabel}
                                        </span>
                                    </div>

                                    <div className="p-1.5">
                                        <DropdownMenuItem
                                            className="cursor-pointer rounded-md px-3 py-2.5"
                                            onSelect={goToProfile}
                                        >
                                            <UserCircle className="h-4 w-4 text-slate-500" />
                                            My Profile
                                        </DropdownMenuItem>
                                        {!isAuthor ? (
                                            <DropdownMenuItem
                                                className="cursor-pointer rounded-md px-3 py-2.5"
                                                onSelect={() => router.push(getAdminSectionRoutePath('settings'))}
                                            >
                                                <Settings className="h-4 w-4 text-slate-500" />
                                                Settings
                                            </DropdownMenuItem>
                                        ) : null}
                                        <DropdownMenuItem
                                            className="cursor-pointer rounded-md px-3 py-2.5"
                                            onSelect={() => router.push(getHomeRoutePath())}
                                        >
                                            <Home className="h-4 w-4 text-slate-500" />
                                            Back to Website
                                        </DropdownMenuItem>
                                    </div>

                                    <DropdownMenuSeparator className="mx-0 bg-slate-100" />

                                    <div className="p-1.5">
                                        <DropdownMenuItem
                                            variant="destructive"
                                            className="cursor-pointer rounded-md px-3 py-2.5"
                                            onSelect={handleLogout}
                                        >
                                            <LogOut className="h-4 w-4" />
                                            Sign Out
                                        </DropdownMenuItem>
                                    </div>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </div>

                {/* Mobile search */}
                <AdminHeaderSearch
                    placement="mobile"
                    className="relative border-t border-slate-200/80 px-4 py-2.5 lg:hidden"
                />
            </header>
        </AdminHeaderSearchProvider>
    );
}
