'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, Book, Clock, User, Settings, GraduationCap, Heart, MapPin } from 'lucide-react';
import { cn } from '@/components/ui/utils';
import { UserAvatar } from '@/components/ui/UserAvatar';
import UserDashboardSkeleton from '@/components/skeleton-loader/UserDashboardSkeleton';
import { useGetUserProfileQuery } from '@/store/rtkQueries/userGetAPI';
import { getUserRole } from '@/utils/authCookies';
import { USER_TYPE, UserTypeValue } from '@/constants/common';
import {
  getUserDashboardAddressRoutePath,
  getUserDashboardBecomeMentorRoutePath,
  getUserDashboardHistoryRoutePath,
  getUserDashboardMyBooksRoutePath,
  getUserDashboardMyChaptersRoutePath,
  getUserDashboardMyWishlistRoutePath,
  getUserDashboardProfileRoutePath,
  getUserDashboardSettingsRoutePath,
} from '@/routes/routes';

const NAV_GROUPS: {
  title: string;
  items: { href: string; label: string; icon: typeof User; roles?: UserTypeValue[] }[];
}[] = [
  {
    title: 'Account',
    items: [
      { href: getUserDashboardProfileRoutePath(), label: 'Profile', icon: User },
      { href: getUserDashboardAddressRoutePath(), label: 'Address', icon: MapPin },
      { href: getUserDashboardSettingsRoutePath(), label: 'Settings', icon: Settings },
    ],
  },
  {
    title: 'Library',
    items: [
      { href: getUserDashboardMyChaptersRoutePath(), label: 'My Blueprints', icon: BookOpen },
      { href: getUserDashboardMyBooksRoutePath(), label: 'My Series', icon: Book },
      { href: getUserDashboardMyWishlistRoutePath(), label: 'My Wishlist', icon: Heart },
    ],
  },
  {
    title: 'Growth',
    items: [
      {
        href: getUserDashboardBecomeMentorRoutePath(),
        label: 'Become a Mentor',
        icon: GraduationCap,
        roles: [USER_TYPE.CAREER_ARCHITECT, USER_TYPE.INSTITUTIONAL_CAREER_ARCHITECT],
      },
    ],
  },
];

export default function UserDashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: profileData } = useGetUserProfileQuery();
  const userName = profileData?.data?.name ?? 'User';
  const userPhoto = profileData?.data?.profile_pic ?? '';
  const userRole = getUserRole();

  const navGroups = NAV_GROUPS.map((group) => ({
    ...group,
    items: group.items.filter((item) => !item.roles || item.roles.includes(userRole as UserTypeValue)),
  })).filter((group) => group.items.length > 0);

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-3 py-5 sm:px-6 sm:py-8 lg:py-10">
        <div className="flex flex-col gap-4 lg:flex-row lg:gap-10">
          <aside className="hidden shrink-0 lg:block lg:w-64 xl:w-72">
            <div className="overflow-hidden rounded-lg border border-gray-200 bg-white lg:sticky lg:top-24">
              <div className="border-b border-gray-100 bg-linear-to-br from-primary/8 via-primary/4 to-white px-5 py-5">
                <div className="flex items-center gap-3">
                  <UserAvatar userName={userName} userPhoto={userPhoto} size="md" />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-gray-900">{userName}</p>
                    <span className="mt-1 inline-block rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
                      {profileData?.data?.role?.name ?? 'User'}
                    </span>
                  </div>
                </div>
              </div>

              <nav className="space-y-5 p-4">
                {navGroups.map((group) => (
                  <div key={group.title}>
                    <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      {group.title}
                    </p>
                    <div className="space-y-1">
                      {group.items.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                              'flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors',
                              isActive
                                ? 'border-l-2 border-primary bg-primary/8 pl-2.5 text-primary'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-foreground',
                            )}
                          >
                            <Icon className="h-4 w-4 shrink-0" />
                            <span>{item.label}</span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </nav>
            </div>
          </aside>

          <div className="min-w-0 flex-1">
            <Suspense fallback={<UserDashboardSkeleton />}>{children}</Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
