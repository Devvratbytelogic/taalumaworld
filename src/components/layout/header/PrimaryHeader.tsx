'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import toast from '@/utils/toast';
import { Menu, X, ShoppingCart, LogIn, BookMarked, LogOut, User } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useAppDispatch } from '@/store/hooks';
import { useGetCartQuery, useGetGlobalSettingsQuery } from '@/store/rtkQueries/userGetAPI';
import { openModal } from '@/store/slices/allModalSlice';
import { VISIBLE } from '@/constants/contentMode';
import Button from '@/components/ui/Button';
import { UserAvatar } from '@/components/ui/UserAvatar';
import GlobalSearchBar from './GlobalSearchBar';
import HeaderToolbar from './HeaderToolbar';
import MobileSearchBar from './MobileSearchBar';
import { getAboutUsRoutePath, getAdminRoutePath, getCartRoutePath, getContactUsRoutePath, getHomeRoutePath, getUserDashboardRoutePath } from '@/routes/routes';
import { clearAuthCookies } from '@/utils/authCookies';
import { useAuth } from '@/hooks/useAuth';
import ImageComponent from '@/components/ui/ImageComponent';

export default function PrimaryHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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
                  className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white font-semibold text-sm hover:bg-primary/90 transition-colors cursor-pointer"
                >
                  {user?.photo ? (
                    <img src={user.photo} alt={user.fullName || 'User'} className="h-full w-full rounded-full object-cover" />
                  ) : (
                    <span>{(user?.fullName || user?.email || 'U').charAt(0).toUpperCase()}</span>
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
                  <LogIn className="h-5 w-5" />
                </Button>
                <Button
                  className="hidden lg:flex global_btn rounded_full bg_primary"
                  onPress={() => dispatch(openModal({ componentName: 'SignIn', data: '' }))}
                >
                  <LogIn className="h-4 w-4" />
                  Sign In
                </Button>
              </>
            )}

            {/* Mobile Menu Toggle */}
            <div
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </div>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <MobileSearchBar />

        {/* Navigation Bar */}
        <nav className="hidden lg:flex items-center gap-8 border-t py-3">
          <Link
            href={getHomeRoutePath()}
            className={`transition-colors ${isActive(getHomeRoutePath()) ? 'text-primary' : 'hover:text-primary'
              }`}
          >
            Home
          </Link>
          <Link
            href={getAboutUsRoutePath()}
            className={`transition-colors ${isActive(getAboutUsRoutePath()) ? 'text-primary' : 'hover:text-primary'
              }`}
          >
            About Us
          </Link>
          <Link
            href={getContactUsRoutePath()}
            className={`transition-colors ${isActive(getContactUsRoutePath()) ? 'text-primary' : 'hover:text-primary'
              }`}
          >
            Contact
          </Link>

          {/* {contentMode === VISIBLE.BOOK && (
            <>
              <Link
                href={getBooksRoutePath()}
                className={`transition-colors ${isActive(getBooksRoutePath()) ? 'text-primary' : 'hover:text-primary'
                  }`}
              >
                Books
              </Link>
              <Link
                href={getCategoriesRoutePath()}
                className={`transition-colors ${isActive(getCategoriesRoutePath()) ? 'text-primary' : 'hover:text-primary'
                  }`}
              >
                Categories
              </Link>
              <Link
                href={getAuthorsRoutePath()}
                className={`transition-colors ${isActive(getAuthorsRoutePath()) ? 'text-primary' : 'hover:text-primary'
                  }`}
              >
                Thought Leaders
              </Link>
            </>
          )} */}
        </nav>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t">
            <nav className="flex flex-col gap-4">
              <Link href={getHomeRoutePath()} onClick={() => setIsMenuOpen(false)} className="py-2 font-medium">
                Home
              </Link>
              <Link href={getAboutUsRoutePath()} onClick={() => setIsMenuOpen(false)} className="py-2 font-medium">
                About Us
              </Link>
              <Link href={getContactUsRoutePath()} onClick={() => setIsMenuOpen(false)} className="py-2 font-medium">
                Contact
              </Link>

              {/* {contentMode === VISIBLE.BOOK && (
                <>
                  <Link href={getBooksRoutePath()} onClick={() => setIsMenuOpen(false)} className="py-2 font-medium">
                    Books
                  </Link>
                  <Link href={getCategoriesRoutePath()} onClick={() => setIsMenuOpen(false)} className="py-2 font-medium">
                    Categories
                  </Link>
                  <Link href={getAuthorsRoutePath()} onClick={() => setIsMenuOpen(false)} className="py-2 font-medium">
                    Thought Leaders
                  </Link>
                </> 
              )} */}

              {isAuthenticated && (
                <Link href={contentMode === VISIBLE.CHAPTER ? `${getUserDashboardRoutePath()}?tab=my-chapters` : `${getUserDashboardRoutePath()}?tab=my-books`} onClick={() => setIsMenuOpen(false)} className="py-2 font-medium">
                  {contentMode === VISIBLE.CHAPTER ? 'My Chapters' : 'My Books'}
                </Link>
              )}

              <div className="pt-4 border-t">
                {isAuthenticated ? (
                  <>
                    <Link href={isAdmin ? getAdminRoutePath() : getUserDashboardRoutePath()} onClick={() => setIsMenuOpen(false)}>
                      <button className="w-full flex items-center gap-3 bg-linear-to-r from-primary/10 to-primary/5 rounded-2xl p-3 mb-3">
                        <UserAvatar
                          userName={user?.fullName || user?.email || ''}
                          userPhoto={user?.photo ?? undefined}
                          size="sm"
                        />
                        <span className="text-base">{isAdmin ? 'Admin Panel' : (user?.fullName || 'My Account')}</span>
                      </button>
                    </Link>
                    <Button
                      className='global_btn rounded_full outline_primary'
                      onPress={() => {
                        handleSignOut();
                        setIsMenuOpen(false);
                      }}
                    >
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <Button
                    className="w-full"
                    onPress={() => {
                      dispatch(openModal({ componentName: 'SignIn', data: '' }));
                      setIsMenuOpen(false);
                    }}
                  >
                    Sign In
                  </Button>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}