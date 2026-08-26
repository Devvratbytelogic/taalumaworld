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
      'relative px-1 py-2 text-sm font-medium whitespace-nowrap transition-colors',
      isActive(path) ? 'text-primary' : 'text-gray-600 hover:text-gray-900'
    );

  const iconButtonClass =
    'relative inline-flex h-10 w-10 items-center justify-center rounded-full! text-gray-600 transition-colors hover:bg-gray-100 hover:text-primary';

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

  // Close search overlay on Escape key
  useEffect(() => {
    if (!isSearchOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsSearchOpen(false);
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isSearchOpen]);

  // Lock body scroll while the search overlay is open
  useEffect(() => {
    if (!isSearchOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
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

      <div
        className={cn(
          'fixed inset-0 z-40 bg-black/50 backdrop-blur-xs transition-opacity duration-300 ease-out',
          isSearchOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        )}
        onClick={() => setIsSearchOpen(false)}
        aria-hidden="true"
      />

      <header ref={headerRef} className="sticky top-0 z-50 border-b border-gray-200 bg-white/60 backdrop-blur-md">
        <div className="container">
          <div className="relative flex h-14 items-center justify-between gap-2 sm:h-16 sm:gap-3">
            <Link href={getHomeRoutePath()} className="flex min-w-0 shrink items-center">
              <div className="h-8 w-[120px] sm:h-10 sm:w-[200px]">
                <ImageComponent src={logo || '/images/logo.webp'} alt={brandName} object_cover={false} />
              </div>
            </Link>

            <nav className="hidden items-center gap-8 lg:absolute lg:left-1/2 lg:flex lg:-translate-x-1/2">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href} className={navLinkClass(item.href)}>
                  {item.label}
                  <span
                    className={cn(
                      'absolute inset-x-0 -bottom-px h-[2px] rounded-full bg-primary transition-opacity',
                      isActive(item.href) ? 'opacity-100' : 'opacity-0'
                    )}
                    aria-hidden
                  />
                </Link>
              ))}
            </nav>

            <div className="flex shrink-0 items-center gap-0.5 sm:gap-1.5">
              <button
                type="button"
                onClick={() => setIsSearchOpen((prev) => !prev)}
                className={cn(iconButtonClass, 'h-9 w-9 sm:h-10 sm:w-10', isSearchOpen && 'bg-primary/10 text-primary')}
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
                <Link href={getCartRoutePath()} className={cn(iconButtonClass, 'h-9 w-9 sm:h-10 sm:w-10')} aria-label="Shopping cart">
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
                    <div className="absolute right-0 z-50 mt-2 w-60 overflow-hidden rounded-md border bg-white shadow-xl">
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
                <div className="hidden items-center gap-1.5 lg:flex">
                  <Button
                    className="global_btn rounded_full outline_primary"
                    onPress={() => dispatch(openModal({ componentName: 'SignIn', data: '' }))}
                  >
                    Sign In
                  </Button>
                  <Button
                    className="global_btn rounded_full bg_primary"
                    onPress={() => dispatch(openModal({ componentName: 'SignUp', data: '' }))}
                  >
                    Join Taaluma
                  </Button>
                </div>
              )}

              <button
                type="button"
                onClick={() => setIsMenuOpen(true)}
                className={cn(iconButtonClass, 'h-9 w-9 sm:h-10 sm:w-10 lg:hidden')}
                aria-label="Open menu"
              >
                <Menu className="h-[18px] w-[18px]" />
              </button>
            </div>
          </div>
        </div>

        <div
          className={cn(
            'absolute inset-x-0 top-full z-50 flex justify-center px-4 pt-2 pb-10 origin-top transition-all duration-300 ease-out sm:px-6',
            isSearchOpen ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0 pointer-events-none'
          )}
        >
          <div className="w-full max-w-2xl overflow-hidden rounded-md bg-white">
            <GlobalSearchBar onSelect={() => setIsSearchOpen(false)} />
          </div>
        </div>
      </header>

      <HeaderOffcanvasMenu open={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  );
}
