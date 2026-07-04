'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, Book, Clock, User, Settings, GraduationCap } from 'lucide-react';
import { cn } from '@/components/ui/utils';
import { UserAvatar } from '@/components/ui/UserAvatar';
import UserDashboardSkeleton from '@/components/skeleton-loader/UserDashboardSkeleton';
import { useGetUserProfileQuery } from '@/store/rtkQueries/userGetAPI';
import {
  getUserDashboardBecomeMentorRoutePath,
  getUserDashboardHistoryRoutePath,
  getUserDashboardMyBooksRoutePath,
  getUserDashboardMyChaptersRoutePath,
  getUserDashboardProfileRoutePath,
  getUserDashboardSettingsRoutePath,
} from '@/routes/routes';

const NAV_GROUPS = [
  {
    title: 'Account',
    items: [
      { href: getUserDashboardProfileRoutePath(), label: 'Profile', icon: User },
      { href: getUserDashboardSettingsRoutePath(), label: 'Settings', icon: Settings },
    ],
  },
  {
    title: 'Library',
    items: [
      { href: getUserDashboardMyChaptersRoutePath(), label: 'My Blueprints', icon: BookOpen },
      { href: getUserDashboardMyBooksRoutePath(), label: 'My Series', icon: Book },
      { href: getUserDashboardHistoryRoutePath(), label: 'Reading History', icon: Clock },
    ],
  },
  {
    title: 'Growth',
    items: [
      { href: getUserDashboardBecomeMentorRoutePath(), label: 'Become a Mentor', icon: GraduationCap },
    ],
  },
];

export default function UserDashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: profileData } = useGetUserProfileQuery();
  const userName = profileData?.data?.name ?? 'User';
  const userPhoto = profileData?.data?.profile_pic ?? '';

  return (
    <div className="min-h-screen bg-gray-50/80">
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:py-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:gap-10">
          <aside className="lg:w-64 shrink-0 xl:w-72">
            <div className="overflow-hidden rounded-lg border border-gray-200 bg-white lg:sticky lg:top-24">
              <div className="border-b border-gray-100 bg-linear-to-br from-primary/8 via-primary/4 to-white px-5 py-5">
                <div className="flex items-center gap-3">
                  <UserAvatar userName={userName} userPhoto={userPhoto} size="md" />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-gray-900">{userName}</p>
                    <span className="mt-1 inline-block rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                      Career Architect
                    </span>
                  </div>
                </div>
              </div>

              <nav className="space-y-5 p-4">
                {NAV_GROUPS.map((group) => (
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
