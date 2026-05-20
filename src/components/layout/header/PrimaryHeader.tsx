'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import toast from '@/utils/toast';
import { Menu, X, ShoppingCart, BookMarked, LogOut, User, Home, Info, Phone, HelpCircle, Shield, FileText } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useAppDispatch } from '@/store/hooks';
import { useGetCartQuery, useGetGlobalSettingsQuery } from '@/store/rtkQueries/userGetAPI';
import { openModal } from '@/store/slices/allModalSlice';
import { VISIBLE } from '@/constants/contentMode';
import Button from '@/components/ui/Button';
import GlobalSearchBar from './GlobalSearchBar';
import HeaderToolbar from './HeaderToolbar';
import MobileSearchBar from './MobileSearchBar';
import { getAboutUsRoutePath, getAdminRoutePath, getCartRoutePath, getContactUsRoutePath, getFAQRoutePath, getHomeRoutePath, getPrivacyPolicyRoutePath, getTermsOfServiceRoutePath, getUserDashboardRoutePath } from '@/routes/routes';
import { clearAuthCookies } from '@/utils/authCookies';
import { useAuth } from '@/hooks/useAuth';
import ImageComponent from '@/components/ui/ImageComponent';

export default function PrimaryHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMenuMounted, setIsMenuMounted] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const pathName = usePathname();
  const dispatch = useAppDispatch();

  const { data: globalSettings } = useGetGlobalSettingsQuery();
  const contentMode = globalSettings?.data?.visible;
  const logo = globalSettings?.data?.logo as string | null | undefined;
  const brandName = globalSettings?.data?.marketplace_name || globalSettings?.data?.platformName || 'TaalumaWorld';

  const { isAuthenticated, user } = useAuth();
  const isAdmin = ['admin', 'author'].includes(user?.role?.toLowerCase() ?? '');

  const { data: cartData, isLoading } = useGetCartQuery(undefined, { skip: !isAuthenticated });
  const cartCount = cartData?.data?.[0]?.item_count ?? 0;

  const headerUserPhoto = user?.photo?.trim() || undefined;
  const avatarInitial = (user?.fullName || user?.email || 'U').charAt(0).toUpperCase();

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

  // Mount/unmount offcanvas with animation
  useEffect(() => {
    if (isMenuOpen) {
      setIsMenuMounted(true);
    }
  }, [isMenuOpen]);

  // Lock body scroll when offcanvas is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  const closeMenu = () => setIsMenuOpen(false);
  const handleTransitionEnd = () => {
    if (!isMenuOpen) setIsMenuMounted(false);
  };

  const handleSignOut = () => {
    clearAuthCookies();
    setIsUserMenuOpen(false);
    toast.success('Signed out successfully');
    window.location.href = getHomeRoutePath();
  };

  const isActive = (path: string) => pathName === path;
  if (pathName === getAdminRoutePath()) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      {/* Top Announcement Bar */}
      <HeaderToolbar />

      {/* Main Header */}
      <div className="container mx-auto sm:px-4">
        <div className="flex items-center justify-between py-4 gap-4">
          {/* Logo */}
          <Link href={getHomeRoutePath()} className="flex items-center gap-2 shrink-0">
            {logo ? (
              <div className="h-10 w-[160px]">
                <ImageComponent src={logo} alt={brandName} object_cover={false} />
              </div>
            ) : (
              <div className="h-10 w-[160px]">
                <ImageComponent src={'/images/logo.png'} alt={brandName} object_cover={false} />
              </div>
            )}
          </Link>

          {/* Center Search Bar */}
          <div className="flex-1 max-w-2xl mx-4 hidden lg:block">
            <GlobalSearchBar />
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-4 lg:gap-6 shrink-0">
            {/* My Chapters / My Books */}
            {isAuthenticated && (
              <Link href={contentMode === VISIBLE.CHAPTER ? `${getUserDashboardRoutePath()}?tab=my-chapters` : `${getUserDashboardRoutePath()}?tab=my-books`} className="hidden lg:flex items-center gap-2 hover:text-primary transition-colors">
                <BookMarked className="h-5 w-5" />
                <span className="font-medium text-sm">{contentMode === VISIBLE.BOOK ? 'My Books' : 'My Chapters'}</span>
              </Link>
            )}

            {/* Cart */}
            {isAuthenticated && (
              <Link
                href={getCartRoutePath()}
                className="relative inline-flex p-1.5 sm:p-0 rounded-lg sm:rounded-none text-foreground hover:text-primary transition-colors"
                aria-label="Shopping cart"
              >
                <ShoppingCart className="h-6 w-6" />
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 sm:-top-2 sm:-right-2 min-w-5 h-5 px-1 bg-primary text-white text-xs rounded-full flex items-center justify-center font-bold leading-none">
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
              </Link>
            )}

            {/* User Avatar */}
            {isAuthenticated ? (
              <div ref={userMenuRef} className="relative">
                <div
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className={
                    headerUserPhoto
                      ? 'h-10 w-10 shrink-0 cursor-pointer rounded-full overflow-hidden ring-2 ring-transparent hover:opacity-95 hover:ring-primary/25 transition-all'
                      : 'h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white font-semibold text-sm hover:bg-primary/90 transition-colors cursor-pointer shrink-0'
                  }
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') setIsUserMenuOpen((o) => !o);
                  }}
                >
                  {headerUserPhoto ? (
                    <img
                      src={headerUserPhoto}
                      alt={user?.fullName ? `${user.fullName} avatar` : 'Your profile'}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    <span aria-hidden>{avatarInitial}</span>
                  )}
                </div>
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50">
                    <div className="py-1">
                      {isAdmin ? (
                        <Link href={getAdminRoutePath()} className="block px-4 py-2 hover:bg-gray-100">
                          <User className="h-5 w-5 mr-2 inline-block" />
                          Admin Panel
                        </Link>
                      ) : (
                        <Link href={getUserDashboardRoutePath()} className="block px-4 py-2 hover:bg-gray-100">
                          <User className="h-5 w-5 mr-2 inline-block" />
                          My Account
                        </Link>
                      )}
                      <button
                        onClick={handleSignOut}
                        className="block px-4 py-2 text-left w-full hover:bg-gray-100 rounded-none!"
                      >
                        <LogOut className="h-5 w-5 mr-2 inline-block" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Button
                  className="lg:hidden min-w-10! w-10 max-w-10! h-10! max-h-10! p-0! global_btn rounded_full bg_primary"
                  isIconOnly
                  aria-label="Sign in"
                  onPress={() => dispatch(openModal({ componentName: 'SignIn', data: '' }))}
                >
                  <User className="h-5 w-5" />
                </Button>
                <Button
                  className="hidden lg:flex global_btn rounded_full bg_primary"
                  onPress={() => dispatch(openModal({ componentName: 'SignIn', data: '' }))}
                >
                  <User className="h-4 w-4" />
                  Sign In
                </Button>
              </>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMenuOpen(true)}
              className="lg:hidden p-2 rounded-md hover:bg-gray-100 transition-colors"
              aria-label="Open menu"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <MobileSearchBar />

        {/* Desktop Navigation Bar */}
        <nav className="hidden lg:flex items-center gap-8 border-t py-3">
          <Link
            href={getHomeRoutePath()}
            className={`transition-colors ${isActive(getHomeRoutePath()) ? 'text-primary' : 'hover:text-primary'}`}
          >
            Home
          </Link>
          <Link
            href={getAboutUsRoutePath()}
            className={`transition-colors ${isActive(getAboutUsRoutePath()) ? 'text-primary' : 'hover:text-primary'}`}
          >
            About Us
          </Link>
          <Link
            href={getContactUsRoutePath()}
            className={`transition-colors ${isActive(getContactUsRoutePath()) ? 'text-primary' : 'hover:text-primary'}`}
          >
            Contact
          </Link>
        </nav>
      </div>

      {/* Offcanvas Backdrop */}
      {isMenuMounted && (
        <div
          className={`fixed inset-0 z-60 bg-black/50 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${isMenuOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={closeMenu}
          aria-hidden="true"
        />
      )}

      {/* Offcanvas Panel */}
      {isMenuMounted && (
        <div
          onTransitionEnd={handleTransitionEnd}
          className={`fixed top-0 right-0 z-70 h-full w-[300px] max-w-[85vw] bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-in-out lg:hidden ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
        >
          {/* Offcanvas Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b bg-white shrink-0">
            <Link href={getHomeRoutePath()} onClick={closeMenu}>
              <div className="h-9 w-[140px]">
                <ImageComponent
                  src={logo || '/images/logo.png'}
                  alt={brandName}
                  object_cover={false}
                />
              </div>
            </Link>
            <button
              onClick={closeMenu}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Offcanvas Body */}
          <div className="flex-1 overflow-y-auto px-5 py-4">
            {/* Nav Links */}
            <nav className="flex flex-col">
              {[
                { label: 'Home', href: getHomeRoutePath(), icon: Home },
                { label: 'About Us', href: getAboutUsRoutePath(), icon: Info },
                { label: 'Contact', href: getContactUsRoutePath(), icon: Phone },
              ].map(({ label, href, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={closeMenu}
                  className={`flex items-center gap-3 px-3 py-3 rounded-xl font-medium transition-colors ${
                    isActive(href) ? 'text-primary bg-primary/8' : 'hover:bg-gray-50 hover:text-primary'
                  }`}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  {label}
                </Link>
              ))}

              {isAuthenticated && (
                <Link
                  href={contentMode === VISIBLE.CHAPTER ? `${getUserDashboardRoutePath()}?tab=my-chapters` : `${getUserDashboardRoutePath()}?tab=my-books`}
                  onClick={closeMenu}
                  className={`flex items-center gap-3 px-3 py-3 rounded-xl font-medium transition-colors ${
                    isActive(getUserDashboardRoutePath()) ? 'text-primary bg-primary/8' : 'hover:bg-gray-50 hover:text-primary'
                  }`}
                >
                  <BookMarked className="h-5 w-5 shrink-0" />
                  {contentMode === VISIBLE.CHAPTER ? 'My Chapters' : 'My Books'}
                </Link>
              )}

              <div className="my-3 border-t" />

              {[
                { label: 'FAQ', href: getFAQRoutePath(), icon: HelpCircle },
                { label: 'Privacy Policy', href: getPrivacyPolicyRoutePath(), icon: Shield },
                { label: 'Terms of Service', href: getTermsOfServiceRoutePath(), icon: FileText },
              ].map(({ label, href, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={closeMenu}
                  className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm transition-colors ${
                    isActive(href) ? 'text-primary bg-primary/8 font-medium' : 'text-gray-500 hover:bg-gray-50 hover:text-primary'
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Offcanvas Footer */}
          <div className="shrink-0 px-5 py-4 border-t bg-gray-50">
            {isAuthenticated ? (
              <div className="flex flex-col gap-3">
                <Link
                  href={isAdmin ? getAdminRoutePath() : getUserDashboardRoutePath()}
                  onClick={closeMenu}
                  className="flex items-center gap-3 bg-white rounded-2xl p-3 shadow-xs border border-gray-100 hover:border-primary/30 transition-colors"
                >
                  <div className="h-9 w-9 rounded-full shrink-0 overflow-hidden bg-primary flex items-center justify-center">
                    {headerUserPhoto ? (
                      <img src={headerUserPhoto} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <span className="text-xs font-semibold text-white">{avatarInitial}</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{isAdmin ? 'Admin Panel' : (user?.fullName || 'My Account')}</p>
                    {!isAdmin && user?.email && (
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    )}
                  </div>
                </Link>
                <Button
                  className="global_btn rounded_full outline_primary w-full"
                  onPress={() => { handleSignOut(); closeMenu(); }}
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <Button
                className="global_btn rounded_full bg_primary w-full"
                onPress={() => {
                  dispatch(openModal({ componentName: 'SignIn', data: '' }));
                  closeMenu();
                }}
              >
                <User className="h-4 w-4" />
                Sign In
              </Button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}