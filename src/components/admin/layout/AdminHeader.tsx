'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { BookOpen, Search, Home, Bell, LogOut, Settings, ChevronDown, Menu, X, UserCircle, } from 'lucide-react';
import { Button, Input, Switch, Avatar, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, DropdownSection, Select, SelectItem, } from '@heroui/react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/components/ui/utils';
import { getRoleName } from '@/utils/adminPermissions';
import { getAdminSectionRoutePath, getAdminProfileRoutePath, getHomeRoutePath } from '@/routes/routes';
import { clearAuthCookies, getUserRole } from '@/utils/authCookies';
import toast from '@/utils/toast';
import { useUpdateGlobalSettingsMutation } from '@/store/rtkQueries/adminPostApi';
import { useGetAdminGlobalSettingsQuery, useGetAdminProfileQuery } from '@/store/rtkQueries/adminGetApi';
import type { AdminRole } from '@/types/admin';
import ImageComponent from '@/components/ui/ImageComponent';

export function AdminHeader() {
    const router = useRouter();
    const [updateGlobalSettings, { isLoading: isToggling }] = useUpdateGlobalSettingsMutation();
    const { data: globalSettings, isFetching: isSettingsLoading } = useGetAdminGlobalSettingsQuery();
    const { data: profileData } = useGetAdminProfileQuery();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
                <div className="container mx-auto px-4 h-10 flex items-center justify-between text-sm">
                    <span className="font-medium hidden sm:block">Admin Panel - {brandName}</span>
                    <span className="font-medium sm:hidden">Admin</span>

                    {!isAuthor && (
                        <div className="flex items-center gap-2">
                            <span className="text-xs hidden md:block">Content Mode:</span>
                            <div className="flex items-center gap-2 bg-white/10 rounded-full px-3 py-1">
                                {isSettingsLoading || isToggling ? (
                                    <div className="flex items-center gap-2 px-1">
                                        <div className="h-3 w-3 rounded-full border-2 border-white border-t-transparent animate-spin" />
                                        <span className="text-xs opacity-80">Loading…</span>
                                    </div>
                                ) : (
                                    <>
                                        <span className={cn("text-xs", visible === 'chapter' ? 'font-semibold' : 'opacity-70')}>
                                            Chapters
                                        </span>
                                        <Switch isSelected={visible === 'book'} onValueChange={onContentModeToggle} size="sm" />
                                        <span className={cn("text-xs", visible === 'book' ? 'font-semibold' : 'opacity-70')}>
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
            <div className="container mx-auto px-4">
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
                                        <p className="text-xs text-muted-foreground hidden sm:block">Admin Panel</p>
                                    </div>
                                </>
                            )}
                        </Link>
                    </div>

                    {/* Search (desktop) */}
                    <div className="hidden lg:flex flex-1 max-w-xl">
                        <Input
                            startContent={<Search className="h-5 w-5 text-muted-foreground" />}
                            type="search"
                            placeholder="Search users, books, chapters..."
                            radius="full"
                            className="w-full"
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
                            <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs">
                                3
                            </Badge>
                        </div>

                        {/* User menu */}
                        <Dropdown>
                            <DropdownTrigger>
                                <Button className="global_btn rounded_full bg_transparent" isIconOnly={false}>
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
                                        <p className="text-xs text-muted-foreground">{adminUser.email}</p>
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
            <div className="lg:hidden border-t px-4 py-3">
                <Input
                    startContent={<Search className="h-5 w-5 text-muted-foreground" />}
                    type="search"
                    placeholder="Search..."
                    className="w-full rounded-full"
                />
            </div>
        </header>
    );
}
