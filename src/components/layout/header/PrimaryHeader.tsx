'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import toast from '@/utils/toast';
import { Menu, Search, X, ShoppingCart, BookMarked, LogOut, User, ChevronDown } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useAppDispatch } from '@/store/hooks';
import { useGetCartQuery, useGetUserProfileQuery } from '@/store/rtkQueries/userGetAPI';
import { openModal } from '@/store/slices/allModalSlice';
import { VISIBLE } from '@/constants/contentMode';
import Button from '@/components/ui/Button';
import { UserAvatar } from '@/components/ui/UserAvatar';
import { cn } from '@/components/ui/utils';
import GlobalSearchBar from './GlobalSearchBar';
import HeaderOffcanvasMenu from './HeaderOffcanvasMenu';
import HeaderToolbar from './HeaderToolbar';
import { getAboutUsRoutePath, getAdminRoutePath, getCartRoutePath, getContactUsRoutePath, getHomeRoutePath, getUserDashboardMyBooksRoutePath, getUserDashboardMyChaptersRoutePath, getUserDashboardRoutePath } from '@/routes/routes';
import { clearAuthCookies } from '@/utils/authCookies';
import ImageComponent from '@/components/ui/ImageComponent';

interface PrimaryHeaderProps {
  isAuthenticated: boolean;
  userRole: string;
  logo: string;
  contentMode: string;
}

export default function PrimaryHeader({ logo, isAuthenticated, userRole, contentMode }: PrimaryHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const pathName = usePathname();
  const dispatch = useAppDispatch();

  const brandName = 'TaalumaWorld';

  const isAdmin = userRole === 'admin' || userRole === 'author';

  const { data: cartData } = useGetCartQuery(undefined, { skip: !isAuthenticated });
  const { data: userData } = useGetUserProfileQuery(undefined, { skip: !isAuthenticated });
  const cartCount = cartData?.data?.[0]?.item_count ?? 0;
  const userName = userData?.data?.name || 'User';
  const userEmail = userData?.data?.email || 'No email found';
  const userPhoto = userData?.data?.profile_pic || undefined;

  const libraryHref = contentMode === VISIBLE.CHAPTER ? getUserDashboardMyChaptersRoutePath() : getUserDashboardMyBooksRoutePath();
  const libraryLabel = contentMode === VISIBLE.BOOK ? 'My Series' : 'My Blueprints';

  const navItems = [
    { label: 'Home', href: getHomeRoutePath() },
    { label: 'Why Taaluma Exists', href: getAboutUsRoutePath() },
    { label: 'Help & Trust Center', href: getContactUsRoutePath() },
  ];

  const isActive = (path: string) => pathName === path;

  const navLinkClass = (path: string) =>
    cn(
      'rounded-full px-4 py-2 text-sm font-medium transition-colors',
      isActive(path) ? 'bg-primary/10 text-primary' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
    );

  const iconButtonClass =
    'relative inline-flex h-10 w-10 items-center justify-center rounded-full text-gray-600 transition-colors hover:bg-gray-100 hover:text-primary';

  const menuItemClass =
    'flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-gray-700 transition-colors hover:bg-gray-50 hover:text-primary';

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    if (isUserMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isUserMenuOpen]);

  // Close search panel when clicking outside the header
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    };

    if (isSearchOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSearchOpen]);

  // Close transient UI (search panel, user menu) on route change
  useEffect(() => {
    setIsSearchOpen(false);
    setIsUserMenuOpen(false);
  }, [pathName]);

  const handleSignOut = () => {
    clearAuthCookies();
    setIsUserMenuOpen(false);
    toast.success('Signed out successfully');
    window.location.href = getHomeRoutePath();
  };

  if (pathName === getAdminRoutePath()) {
    return null;
  }

  return (
    <>
      <HeaderToolbar />

      <header ref={headerRef} className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur-md">
        <div className="container">
          <div className="flex h-16 items-center justify-between gap-3">
            <Link href={getHomeRoutePath()} className="flex shrink-0 items-center">
              <div className="h-9 w-[136px] sm:h-10 sm:w-[152px]">
                <ImageComponent src={logo || '/images/logo.png'} alt={brandName} object_cover={false} />
              </div>
            </Link>

            <nav className="hidden items-center gap-1 lg:flex">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href} className={navLinkClass(item.href)}>
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="flex shrink-0 items-center gap-1 sm:gap-1.5">
              <button
                type="button"
                onClick={() => setIsSearchOpen((prev) => !prev)}
                className={cn(iconButtonClass, isSearchOpen && 'bg-primary/10 text-primary')}
                aria-label={isSearchOpen ? 'Close search' : 'Open search'}
                aria-expanded={isSearchOpen}
              >
                {isSearchOpen ? <X className="h-[18px] w-[18px]" /> : <Search className="h-[18px] w-[18px]" />}
              </button>

              {isAuthenticated && (
                <Link
                  href={libraryHref}
                  className="hidden items-center gap-2 rounded-full px-3.5 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-primary lg:inline-flex"
                >
                  <BookMarked className="h-4 w-4 shrink-0" aria-hidden />
                  {libraryLabel}
                </Link>
              )}

              {isAuthenticated && (
                <Link href={getCartRoutePath()} className={iconButtonClass} aria-label="Shopping cart">
                  <ShoppingCart className="h-[18px] w-[18px]" />
                  {cartCount > 0 && (
                    <span className="absolute right-0 top-0 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold leading-none text-white">
                      {cartCount > 99 ? '99+' : cartCount}
                    </span>
                  )}
                </Link>
              )}

              {isAuthenticated ? (
                <div ref={userMenuRef} className="relative hidden lg:block">
                  <button
                    type="button"
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-1.5 rounded-full! p-1 pr-2 transition-colors hover:bg-gray-100"
                    aria-expanded={isUserMenuOpen}
                    aria-haspopup="menu"
                  >
                    <UserAvatar
                      userName={userName}
                      userPhoto={userPhoto}
                      size="sm"
                      className="ring-2 border ring-white"
                    />
                    <ChevronDown
                      className={cn('hidden h-4 w-4 text-gray-400 transition-transform sm:block', isUserMenuOpen && 'rotate-180')}
                      aria-hidden
                    />
                  </button>

                  {isUserMenuOpen && (
                    <div className="absolute right-0 z-50 mt-2 w-60 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-xl">
                      <div className="border-b border-gray-100 bg-gray-50/70 px-4 py-3">
                        <p className="truncate text-sm font-medium text-gray-900">{userName || 'My Account'}</p>
                        {userEmail ? (
                          <p className="mt-0.5 truncate text-xs text-gray-500">{userEmail}</p>
                        ) : null}
                      </div>
                      <div className="p-1.5">
                        {isAdmin ? (
                          <Link href={getAdminRoutePath()} className={menuItemClass} onClick={() => setIsUserMenuOpen(false)}>
                            <User className="h-4 w-4 shrink-0" aria-hidden />
                            Admin Panel
                          </Link>
                        ) : (
                          <Link
                            href={getUserDashboardRoutePath()}
                            className={menuItemClass}
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <User className="h-4 w-4 shrink-0" aria-hidden />
                            My Account
                          </Link>
                        )}
                        <button type="button" onClick={handleSignOut} className={cn(menuItemClass, 'text-red-600 hover:bg-red-50 hover:text-red-600')}>
                          <LogOut className="h-4 w-4 shrink-0" aria-hidden />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Button
                    className="global_btn rounded_full bg_primary h-10! max-h-10! min-w-10! w-10! max-w-10! p-0! lg:hidden"
                    isIconOnly
                    aria-label="Sign in"
                    onPress={() => dispatch(openModal({ componentName: 'SignIn', data: '' }))}
                  >
                    <User className="h-5 w-5" />
                  </Button>
                  <Button
                    className="global_btn rounded_full outline_primary hidden lg:flex"
                    onPress={() => dispatch(openModal({ componentName: 'SignIn', data: '' }))}
                  >
                    Sign In
                  </Button>
                  <Button
                    className="global_btn rounded_full bg_primary hidden lg:flex"
                    onPress={() => dispatch(openModal({ componentName: 'SignUp', data: '' }))}
                  >
                    Join Taaluma
                  </Button>
                </>
              )}

              <button
                type="button"
                onClick={() => setIsMenuOpen(true)}
                className={cn(iconButtonClass, 'lg:hidden')}
                aria-label="Open menu"
              >
                <Menu className="h-[18px] w-[18px]" />
              </button>
            </div>
          </div>

          {isSearchOpen && (
            <div className="animate-fade-in pb-4">
              <GlobalSearchBar onSelect={() => setIsSearchOpen(false)} />
            </div>
          )}
        </div>
      </header>

      <HeaderOffcanvasMenu open={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  );
}
