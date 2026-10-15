'use client';

import Link from 'next/link';
import {
  BookMarked,
  Home,
  Info,
  LogIn,
  Phone,
  Search,
  ShoppingCart,
  User,
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/components/ui/utils';
import { useAppDispatch } from '@/store/hooks';
import { openModal } from '@/store/slices/allModalSlice';
import { VISIBLE } from '@/constants/contentMode';
import { useGetCartQuery } from '@/store/rtkQueries/userGetAPI';
import { isStaffAdminRole } from '@/constants/common';
import {
  getAboutUsRoutePath,
  getAdminRoutePath,
  getCartRoutePath,
  getContactUsRoutePath,
  getHomeRoutePath,
  getMentorForgotPasswordRoutePath,
  getMentorSignupRoutePath,
  getUserDashboardMyBooksRoutePath,
  getUserDashboardMyChaptersRoutePath,
  getUserDashboardRoutePath,
} from '@/routes/routes';
import { openGlobalSearch } from '@/utils/openGlobalSearch';

type MobileBottomNavProps = {
  isAuthenticated: boolean;
  userRole: string;
  contentMode: string;
};

type NavAction = {
  key: string;
  label: string;
  icon: typeof Home;
  href?: string;
  onPress?: () => void;
  badge?: number;
  isActive?: (pathname: string) => boolean;
};

export default function MobileBottomNav({
  isAuthenticated,
  userRole,
  contentMode,
}: MobileBottomNavProps) {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const isStaff = isStaffAdminRole(userRole);

  const isMentorAuthPage =
    pathname === getMentorSignupRoutePath() ||
    pathname.startsWith(`${getMentorSignupRoutePath()}/`) ||
    pathname === getMentorForgotPasswordRoutePath() ||
    pathname.startsWith(`${getMentorForgotPasswordRoutePath()}/`);
  const isPolicyPage = pathname === '/policies' || pathname.startsWith('/policies/');

  const { data: cartData } = useGetCartQuery(undefined, {
    skip: !isAuthenticated || isMentorAuthPage || isPolicyPage || isStaff,
  });
  const cartCount = cartData?.data?.[0]?.item_count ?? 0;

  const libraryHref =
    contentMode === VISIBLE.CHAPTER
      ? getUserDashboardMyChaptersRoutePath()
      : getUserDashboardMyBooksRoutePath();
  const libraryLabel = contentMode === VISIBLE.BOOK ? 'Series' : 'Library';
  const accountHref = isStaff ? getAdminRoutePath() : getUserDashboardRoutePath();

  const guestActions: NavAction[] = [
    {
      key: 'home',
      label: 'Home',
      icon: Home,
      href: getHomeRoutePath(),
      isActive: (path) => path === getHomeRoutePath(),
    },
    {
      key: 'search',
      label: 'Search',
      icon: Search,
      onPress: openGlobalSearch,
    },
    {
      key: 'about',
      label: 'About',
      icon: Info,
      href: getAboutUsRoutePath(),
      isActive: (path) => path === getAboutUsRoutePath(),
    },
    {
      key: 'help',
      label: 'Help',
      icon: Phone,
      href: getContactUsRoutePath(),
      isActive: (path) => path === getContactUsRoutePath(),
    },
    {
      key: 'sign-in',
      label: 'Sign In',
      icon: LogIn,
      onPress: () => dispatch(openModal({ componentName: 'SignIn', data: '' })),
    },
  ];

  const authenticatedActions: NavAction[] = [
    {
      key: 'home',
      label: 'Home',
      icon: Home,
      href: getHomeRoutePath(),
      isActive: (path) => path === getHomeRoutePath(),
    },
    {
      key: 'search',
      label: 'Search',
      icon: Search,
      onPress: openGlobalSearch,
    },
    ...(isStaff
      ? []
      : [
          {
            key: 'library',
            label: libraryLabel,
            icon: BookMarked,
            href: libraryHref,
            isActive: (path: string) =>
              path === libraryHref || path.startsWith(`${libraryHref}/`),
          } as NavAction,
        ]),
    ...(isStaff
      ? []
      : [
          {
            key: 'cart',
            label: 'Cart',
            icon: ShoppingCart,
            href: getCartRoutePath(),
            badge: cartCount,
            isActive: (path: string) =>
              path === getCartRoutePath() || path.startsWith(`${getCartRoutePath()}/`),
          } as NavAction,
        ]),
    {
      key: 'account',
      label: 'Account',
      icon: User,
      href: accountHref,
      isActive: (path) =>
        path === accountHref ||
        path.startsWith(`${accountHref}/`) ||
        path.startsWith(`${getUserDashboardRoutePath()}/`),
    },
  ];

  const actions = isAuthenticated ? authenticatedActions : guestActions;

  if (pathname === getAdminRoutePath()) {
    return null;
  }

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-gray-200 bg-white/95 backdrop-blur-md pb-[env(safe-area-inset-bottom,0px)] xl:hidden"
      aria-label="Mobile navigation"
    >
      <div className="flex h-16 items-stretch justify-around">
        {actions.map(({ key, label, icon: Icon, href, onPress, badge, isActive }) => {
          const active = isActive?.(pathname) ?? false;
          const itemClass = cn(
            'relative flex min-w-0 flex-1 flex-col items-center justify-center gap-0.5 px-1 pt-1 text-[10px] font-medium transition-colors sm:text-xs',
            active ? 'text-primary' : 'text-gray-500 hover:text-primary',
          );

          const iconWrap = (
            <span className="relative inline-flex">
              <Icon className="h-5 w-5 shrink-0" aria-hidden />
              {badge != null && badge > 0 ? (
                <span className="absolute -right-2 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-0.5 text-[9px] font-semibold leading-none text-white">
                  {badge > 99 ? '99+' : badge}
                </span>
              ) : null}
            </span>
          );

          if (href) {
            return (
              <Link key={key} href={href} className={itemClass} aria-current={active ? 'page' : undefined}>
                {iconWrap}
                <span className="truncate">{label}</span>
              </Link>
            );
          }

          return (
            <button key={key} type="button" onClick={onPress} className={itemClass}>
              {iconWrap}
              <span className="truncate">{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
