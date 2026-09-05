'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import toast from '@/utils/toast';
import {
  Book,
  BookMarked,
  BookOpen,
  Clock,
  FileText,
  GraduationCap,
  HelpCircle,
  Home,
  Info,
  LayoutDashboard,
  LogOut,
  MapPin,
  Phone,
  Settings,
  Shield,
  ShoppingBag,
  User,
  X,
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import Button from '@/components/ui/Button';
import ImageComponent from '@/components/ui/ImageComponent';
import { UserAvatar } from '@/components/ui/UserAvatar';
import { cn } from '@/components/ui/utils';
import { useAppDispatch } from '@/store/hooks';
import { openModal } from '@/store/slices/allModalSlice';
import { useGetGlobalSettingsQuery } from '@/store/rtkQueries/userGetAPI';
import { VISIBLE } from '@/constants/contentMode';
import {
  getAboutUsRoutePath,
  getAdminRoutePath,
  getContactUsRoutePath,
  getFAQRoutePath,
  getHomeRoutePath,
  getMentorDashboardRoutePath,
  getPrivacyPolicyRoutePath,
  getTermsOfServiceRoutePath,
  getUserDashboardAddressRoutePath,
  getUserDashboardBecomeMentorRoutePath,
  getUserDashboardHistoryRoutePath,
  getUserDashboardMyBooksRoutePath,
  getUserDashboardMyChaptersRoutePath,
  getUserDashboardMyOrdersRoutePath,
  getUserDashboardProfileRoutePath,
  getUserDashboardRoutePath,
  getUserDashboardSettingsRoutePath,
} from '@/routes/routes';
import { signOut } from '@/utils/refreshSession';
import { useAuth } from '@/hooks/useAuth';
import { isStaffAdminRole, USER_TYPE, type UserTypeValue } from '@/constants/common';

const mainLinks = [
  { label: 'Home', href: getHomeRoutePath(), icon: Home },
  { label: 'Why Taaluma Exists', href: getAboutUsRoutePath(), icon: Info },
  { label: 'Help & Trust Center', href: getContactUsRoutePath(), icon: Phone },
];

const accountLinks: { label: string; href: string; icon: typeof User; roles?: UserTypeValue[] }[] = [
  { label: 'Profile', href: getUserDashboardProfileRoutePath(), icon: User },
  { label: 'Address', href: getUserDashboardAddressRoutePath(), icon: MapPin },
  { label: 'Settings', href: getUserDashboardSettingsRoutePath(), icon: Settings },
  { label: 'My Blueprints', href: getUserDashboardMyChaptersRoutePath(), icon: BookOpen },
  { label: 'My Series', href: getUserDashboardMyBooksRoutePath(), icon: Book },
  { label: 'My Orders', href: getUserDashboardMyOrdersRoutePath(), icon: ShoppingBag },
  { label: 'Reading History', href: getUserDashboardHistoryRoutePath(), icon: Clock },
  {
    label: 'Become a Mentor',
    href: getUserDashboardBecomeMentorRoutePath(),
    icon: GraduationCap,
    roles: [USER_TYPE.CAREER_ARCHITECT, USER_TYPE.INSTITUTIONAL_CAREER_ARCHITECT],
  },
  {
    label: 'Mentor Panel',
    href: getMentorDashboardRoutePath(),
    icon: LayoutDashboard,
    roles: [USER_TYPE.MENTOR],
  },
];

const supportLinks = [
  { label: 'FAQ', href: getFAQRoutePath(), icon: HelpCircle },
  { label: 'Privacy Policy', href: getPrivacyPolicyRoutePath(), icon: Shield },
  { label: 'Terms of Service', href: getTermsOfServiceRoutePath(), icon: FileText },
];

type HeaderOffcanvasMenuProps = {
  open: boolean;
  onClose: () => void;
};

export default function HeaderOffcanvasMenu({ open, onClose }: HeaderOffcanvasMenuProps) {
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAuth();
  const { data: globalSettings } = useGetGlobalSettingsQuery();

  const contentMode = globalSettings?.data?.visible;
  const logo = globalSettings?.data?.logo as string | null | undefined;
  const brandName = globalSettings?.data?.marketplace_name || globalSettings?.data?.platformName || 'TaalumaWorld';
  const isStaff = isStaffAdminRole(user?.role);
  const userPhoto = user?.photo?.trim() || undefined;
  const libraryHref =
    contentMode === VISIBLE.CHAPTER ? getUserDashboardMyChaptersRoutePath() : getUserDashboardMyBooksRoutePath();
  const libraryLabel = contentMode === VISIBLE.BOOK ? 'My Series' : 'My Blueprints';
  const accountHref = isStaff ? getAdminRoutePath() : getUserDashboardRoutePath();
  const visibleAccountLinks = accountLinks.filter(
    (item) => !item.roles || item.roles.includes(user?.role as UserTypeValue),
  );

  useEffect(() => {
    if (open) setMounted(true);
  }, [open]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const signOutUser = () => {
    onClose();
    toast.success('Signed out successfully');
    void signOut({ redirectTo: getHomeRoutePath() });
  };

  if (!mounted) return null;

  const linkClass = (href: string, muted = false) =>
    cn(
      'group flex items-center gap-3 rounded-lg px-2 py-2.5 transition-colors',
      pathname === href
        ? 'border-l-2 border-primary bg-primary/8 pl-1.5 text-primary'
        : muted
          ? 'text-gray-500 hover:bg-gray-50 hover:text-primary'
          : 'text-gray-700 hover:bg-gray-50 hover:text-primary'
    );

  const iconClass = (href: string) =>
    cn(
      'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors',
      pathname === href
        ? 'bg-primary/10 text-primary'
        : 'bg-gray-50 text-gray-500 group-hover:bg-primary/10 group-hover:text-primary'
    );

  return createPortal(
    <>
      <div
        className={cn(
          'fixed inset-0 z-200 bg-black/50 backdrop-blur-sm transition-opacity duration-300 lg:hidden',
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        )}
        onClick={onClose}
        aria-hidden
      />

      <aside
        onTransitionEnd={() => {
          if (!open) setMounted(false);
        }}
        className={cn(
          'fixed top-0 right-0 z-201 flex h-dvh w-[min(320px,88vw)] flex-col bg-white border-l border-gray-200 transition-transform duration-300 ease-out lg:hidden',
          open ? 'translate-x-0' : 'translate-x-full'
        )}
        aria-hidden={!open}
      >
        <div className="shrink-0 border-b border-gray-100 bg-linear-to-br from-primary/8 via-primary/4 to-white px-5 py-4">
          <div className="flex items-center justify-between">
            <Link href={getHomeRoutePath()} onClick={onClose}>
              <div className="h-9 w-33">
                <ImageComponent src={logo || '/images/logo.webp'} alt={brandName} object_cover={false} />
              </div>
            </Link>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 transition-colors hover:border-primary/25 hover:bg-primary/5 hover:text-primary"
              aria-label="Close menu"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-3">
          <p className="px-2 pb-2 text-xs font-medium uppercase tracking-wide text-gray-400">Menu</p>
          <nav className="space-y-0.5">
            {mainLinks.map(({ label, href, icon: Icon }) => (
              <Link key={href} href={href} onClick={onClose} className={linkClass(href)}>
                <span className={iconClass(href)}>
                  <Icon className="h-4 w-4" aria-hidden />
                </span>
                <span className="text-sm font-medium">{label}</span>
              </Link>
            ))}

            {isAuthenticated && !isStaff && (
              <Link href={libraryHref} onClick={onClose} className={linkClass(libraryHref)}>
                <span className={iconClass(libraryHref)}>
                  <BookMarked className="h-4 w-4" aria-hidden />
                </span>
                <span className="text-sm font-medium">{libraryLabel}</span>
              </Link>
            )}
          </nav>

          {isAuthenticated && !isStaff && (
            <>
              <p className="mt-5 px-2 pb-2 text-xs font-medium uppercase tracking-wide text-gray-400">Account</p>
              <nav className="space-y-0.5">
                {visibleAccountLinks.map(({ label, href, icon: Icon }) => (
                  <Link key={href} href={href} onClick={onClose} className={linkClass(href)}>
                    <span className={iconClass(href)}>
                      <Icon className="h-4 w-4" aria-hidden />
                    </span>
                    <span className="text-sm font-medium">{label}</span>
                  </Link>
                ))}
              </nav>
            </>
          )}

          <p className="mt-5 px-2 pb-2 text-xs font-medium uppercase tracking-wide text-gray-400">Support</p>
          <nav className="space-y-0.5">
            {supportLinks.map(({ label, href, icon: Icon }) => (
              <Link key={href} href={href} onClick={onClose} className={linkClass(href, true)}>
                <span className={iconClass(href)}>
                  <Icon className="h-4 w-4" aria-hidden />
                </span>
                <span className="text-sm">{label}</span>
              </Link>
            ))}
          </nav>
        </div>

        <div className="shrink-0 border-t border-gray-100 bg-gray-50/70 p-4">
          {isAuthenticated ? (
            <div className="space-y-3">
              <Link
                href={accountHref}
                onClick={onClose}
                className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-3 transition-colors hover:border-primary/20 hover:bg-primary/5"
              >
                <UserAvatar userName={user?.fullName || user?.email || 'User'} userPhoto={userPhoto} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-gray-900">
                    {isStaff ? 'Admin Panel' : user?.fullName || 'My Account'}
                  </p>
                  {!isStaff && user?.email ? (
                    <p className="truncate text-xs text-gray-500">{user.email}</p>
                  ) : null}
                </div>
              </Link>
              <Button className="global_btn rounded_full outline_primary w-full" onPress={signOutUser}>
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              <Button
                className="global_btn rounded_full outline_primary w-full"
                onPress={() => {
                  dispatch(openModal({ componentName: 'SignIn', data: '' }));
                  onClose();
                }}
              >
                Sign In
              </Button>
              <Button
                className="global_btn rounded_full bg_primary w-full"
                onPress={() => {
                  dispatch(openModal({ componentName: 'SignUp', data: '' }));
                  onClose();
                }}
              >
                Join Taaluma
              </Button>
            </div>
          )}
        </div>
      </aside>
    </>,
    document.body
  );
}
