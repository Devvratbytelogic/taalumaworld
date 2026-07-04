'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, Book, Clock, User, Settings, GraduationCap } from 'lucide-react';
import { cn } from '@/components/ui/utils';
import UserDashboardSkeleton from '@/components/skeleton-loader/UserDashboardSkeleton';
import {
  getUserDashboardBecomeMentorRoutePath,
  getUserDashboardHistoryRoutePath,
  getUserDashboardMyBooksRoutePath,
  getUserDashboardMyChaptersRoutePath,
  getUserDashboardProfileRoutePath,
  getUserDashboardSettingsRoutePath,
} from '@/routes/routes';

const NAV_ITEMS = [
  { href: getUserDashboardProfileRoutePath(), label: 'Profile', icon: User },
  { href: getUserDashboardMyChaptersRoutePath(), label: 'My Blueprints', icon: BookOpen },
  { href: getUserDashboardMyBooksRoutePath(), label: 'My Series', icon: Book },
  { href: getUserDashboardHistoryRoutePath(), label: 'Reading History', icon: Clock },
  { href: getUserDashboardBecomeMentorRoutePath(), label: 'Become a Mentor', icon: GraduationCap },
  { href: getUserDashboardSettingsRoutePath(), label: 'Settings', icon: Settings },
];

export default function UserDashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto sm:px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:w-64 shrink-0">
            <div className="bg-white rounded-3xl p-6 shadow-sm sticky top-24">
              <nav className="space-y-2">
                {NAV_ITEMS.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        'w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all',
                        isActive ? 'bg-primary text-white shadow-md' : 'hover:bg-gray-100',
                      )}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>
          </aside>

          <div className="flex-1">
            <Suspense fallback={<UserDashboardSkeleton />}>{children}</Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
