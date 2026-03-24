/**
 * Admin Dashboard Tab
 * Overview with stats, charts, and quick actions
 */
'use client';

import { Users, Book, FileText, DollarSign, ShoppingCart } from 'lucide-react';
import type { ContentMode } from '../../../types/admin';
import type { StatCard } from './DashboardStatsGrid';
import type { ActivityItem } from './DashboardRecentActivity';
import type { TopContentItem } from './DashboardTopContent';
import { DashboardWelcomeHeader } from './DashboardWelcomeHeader';
import { DashboardStatsGrid } from './DashboardStatsGrid';
import { DashboardRecentActivity } from './DashboardRecentActivity';
import { DashboardTopContent } from './DashboardTopContent';
import { DashboardQuickActions } from './DashboardQuickActions';
import { useAdminUser } from '../../../hooks/useAdminUser';
import { useGetAllUsersQuery, useGetAllBooksQuery, useGetAllAdminChaptersQuery, useGetAllTestimonialsQuery, useGetAdminGlobalSettingsQuery } from '../../../store/rtkQueries/adminGetApi';
import { getAdminSectionRoutePath } from '../../../routes/routes';

function timeAgo(dateStr: string): string {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const diffMins = Math.floor(diffMs / 60_000);
  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
}

/** Percent change: users registered in last 30d vs previous 30d */
function calcUserGrowth(dates: string[]): number {
  const now = Date.now();
  const MS_30D = 30 * 24 * 60 * 60 * 1000;
  const recent = dates.filter((d) => now - new Date(d).getTime() < MS_30D).length;
  const prev = dates.filter((d) => {
    const age = now - new Date(d).getTime();
    return age >= MS_30D && age < 2 * MS_30D;
  }).length;
  if (prev === 0) return recent > 0 ? 100 : 0;
  return Math.round(((recent - prev) / prev) * 100 * 10) / 10;
}

export function AdminDashboardTab() {
  const { adminUser } = useAdminUser();

  const { data: usersData, isLoading: usersLoading } = useGetAllUsersQuery();
  const { data: booksData, isLoading: booksLoading } = useGetAllBooksQuery();
  const { data: chaptersData, isLoading: chaptersLoading } = useGetAllAdminChaptersQuery();
  const { data: testimonialsData, isLoading: testimonialsLoading } = useGetAllTestimonialsQuery();
  const { data: globalSettingsData } = useGetAdminGlobalSettingsQuery();

  const isLoading = usersLoading || booksLoading || chaptersLoading || testimonialsLoading;

  // Derived from global settings: visible === 'book' → 'books', otherwise 'chapters'
  const contentMode: ContentMode =
    globalSettingsData?.data?.visible === 'book' ? 'books' : 'chapters';

  // ── KPI counts ──────────────────────────────────────────────────────────────
  const allUsers = usersData?.data ?? [];
  const allBooks = booksData?.data ?? [];
  const allChapters = chaptersData?.data ?? [];
  const allTestimonials = testimonialsData?.data ?? [];

  // Quick-action counts from real data
  const pendingTestimonials = allTestimonials.filter(
    (t) => t.status !== 'approved' && t.status !== 'active',
  ).length;
  const inactiveContent = allChapters.filter((c) => {
    const s = c.status?.toLowerCase();
    return s !== 'active' && s !== 'published';
  }).length;

  const totalUsers = allUsers.length;
  const totalBooks = allBooks.length;
  const totalChapters = allChapters.length;
  const totalPurchases = allUsers.reduce((sum, u) => sum + (u.purchases ?? 0), 0);

  const userGrowth = calcUserGrowth(allUsers.map((u) => u.createdAt));

  // New chapters/books added in last 30d
  const MS_30D = 30 * 24 * 60 * 60 * 1000;
  const recentChapters = allChapters.filter(
    (c) => Date.now() - new Date(c.createdAt).getTime() < MS_30D,
  ).length;
  const recentBooks = allBooks.filter(
    (b) => Date.now() - new Date(b.createdAt).getTime() < MS_30D,
  ).length;

  const stats: StatCard[] = [
    {
      title: 'Total Users',
      value: totalUsers.toLocaleString(),
      change: userGrowth,
      icon: Users,
      color: 'blue',
      href: getAdminSectionRoutePath('users'),
    },
    {
      title: contentMode === 'chapters' ? 'Total Chapters' : 'Total Books',
      value: contentMode === 'chapters' ? totalChapters : totalBooks,
      change: contentMode === 'chapters' ? recentChapters : recentBooks,
      icon: contentMode === 'chapters' ? FileText : Book,
      color: 'purple',
      href: getAdminSectionRoutePath(contentMode === 'chapters' ? 'chapters' : 'books'),
    },
    {
      title: 'Total Purchases',
      value: totalPurchases.toLocaleString(),
      change: 0,
      icon: DollarSign,
      color: 'green',
      href: getAdminSectionRoutePath('transactions'),
    },
    {
      title: contentMode === 'chapters' ? 'Total Books' : 'Total Chapters',
      value: contentMode === 'chapters' ? totalBooks : totalChapters,
      change: contentMode === 'chapters' ? recentBooks : recentChapters,
      icon: contentMode === 'chapters' ? Book : ShoppingCart,
      color: 'orange',
      href: getAdminSectionRoutePath(contentMode === 'chapters' ? 'books' : 'chapters'),
    },
  ];

  // ── Recent activity: last 5 registered users ────────────────────────────────
  const recentActivity: ActivityItem[] = [...allUsers]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)
    .map((user, idx) => ({
      id: idx + 1,
      user: user.name,
      action: 'registered',
      item: '',
      time: timeAgo(user.createdAt),
    }));

  // ── Top content: top 5 by price ─────────────────────────────────────────────
  const topContent: TopContentItem[] =
    contentMode === 'chapters'
      ? [...allChapters]
          .sort((a, b) => b.price - a.price)
          .slice(0, 5)
          .map((chapter, idx) => ({
            id: idx + 1,
            title: chapter.title,
            sales: 0,
            revenue: chapter.price,
            trend: 0,
          }))
      : [...allBooks]
          .sort((a, b) => b.price - a.price)
          .slice(0, 5)
          .map((book, idx) => ({
            id: idx + 1,
            title: book.title,
            sales: 0,
            revenue: book.price,
            trend: 0,
          }));

  if (!adminUser) return null;

  return (
    <div className="space-y-8 animate-fade-in">
      <DashboardWelcomeHeader adminUser={adminUser} contentMode={contentMode} />
      <DashboardStatsGrid stats={stats} isLoading={isLoading} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DashboardRecentActivity items={recentActivity} isLoading={usersLoading} />
        <DashboardTopContent
          items={topContent}
          contentMode={contentMode}
          isLoading={chaptersLoading || booksLoading}
        />
      </div>
      <DashboardQuickActions
        pendingTestimonials={pendingTestimonials}
        inactiveContent={inactiveContent}
        isLoading={isLoading}
      />
    </div>
  );
}
