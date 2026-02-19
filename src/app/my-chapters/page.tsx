'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { BookOpen, TrendingUp, CheckCircle } from 'lucide-react';
import Button from '@/components/ui/Button';
import { MyChaptersPage } from '@/components/pages-components/user-dashboard/MyChaptersPage';
import { getHomeRoutePath, getReadChapterRoutePath } from '@/routes/routes';
import { selectReadingProgress } from '@/store/slices/readingSlice';
import { useGetPurchasedItemsQuery } from '@/store/api/userApi';
import type { RootState } from '@/store/store';
import { cn } from '@/components/ui/utils';

type FilterType = 'all' | 'reading' | 'completed' | 'unread';

export default function MyChaptersRoutePage() {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const router = useRouter();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const readingProgressRaw = useSelector(selectReadingProgress);
  const { data: purchasedItems = [] } = useGetPurchasedItemsQuery(undefined, {
    skip: !isAuthenticated,
  });

  const readingProgress = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(readingProgressRaw).map(([id, data]) => [id, data.progress])
      ),
    [readingProgressRaw]
  );

  const ownedChapters = useMemo(
    () => purchasedItems.map((p) => p.chapterId).filter((id): id is string => !!id),
    [purchasedItems]
  );

  const handleNavigate = (page: string, id?: string) => {
    if (page === 'home') router.push(getHomeRoutePath());
    else if (page === 'read-chapter' && id) router.push(getReadChapterRoutePath(id));
    else router.push(getHomeRoutePath());
  };

  const stats = useMemo(
    () => ({
      total: ownedChapters.length,
      reading: ownedChapters.filter(
        (id) => (readingProgress[id] ?? 0) > 0 && (readingProgress[id] ?? 0) < 100
      ).length,
      completed: ownedChapters.filter((id) => (readingProgress[id] ?? 0) === 100).length,
      unread: ownedChapters.filter((id) => (readingProgress[id] ?? 0) === 0).length,
    }),
    [ownedChapters, readingProgress]
  );

  const filteredChapters = useMemo(() => {
    switch (activeFilter) {
      case 'reading':
        return ownedChapters.filter(
          (id) => (readingProgress[id] ?? 0) > 0 && (readingProgress[id] ?? 0) < 100
        );
      case 'completed':
        return ownedChapters.filter((id) => (readingProgress[id] ?? 0) === 100);
      case 'unread':
        return ownedChapters.filter((id) => (readingProgress[id] ?? 0) === 0);
      default:
        return ownedChapters;
    }
  }, [ownedChapters, readingProgress, activeFilter]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">My Chapters</h1>
          <p className="text-muted-foreground text-lg">
            Your personal collection of purchased chapters
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-linear-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-3xl p-5">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/20 rounded-full">
                <BookOpen className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold tracking-tight">{stats.total}</div>
                <div className="text-sm text-muted-foreground tracking-tight">Total Chapters</div>
              </div>
            </div>
          </div>
          <div className="bg-linear-to-br from-blue-50 to-blue-100/50 border border-blue-200 rounded-3xl p-5">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-200 rounded-full">
                <TrendingUp className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold tracking-tight">{stats.reading}</div>
                <div className="text-sm text-muted-foreground tracking-tight">In Progress</div>
              </div>
            </div>
          </div>
          <div className="bg-linear-to-br from-green-50 to-green-100/50 border border-green-200 rounded-3xl p-5">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-200 rounded-full">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold tracking-tight">{stats.completed}</div>
                <div className="text-sm text-muted-foreground tracking-tight">Completed</div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-2 flex-wrap">
            <Button
              className={cn('global_btn rounded_full', activeFilter === 'all' ? 'bg_primary' : 'outline_primary')}
              onPress={() => setActiveFilter('all')}
            >
              All ({stats.total})
            </Button>
            <Button
              className={cn('global_btn rounded_full', activeFilter === 'reading' ? 'bg_primary' : 'outline_primary')}
              onPress={() => setActiveFilter('reading')}
            >
              Reading ({stats.reading})
            </Button>
            <Button
              className={cn('global_btn rounded_full', activeFilter === 'completed' ? 'bg_primary' : 'outline_primary')}
              onPress={() => setActiveFilter('completed')}
            >
              Completed ({stats.completed})
            </Button>
            <Button
              className={cn('global_btn rounded_full', activeFilter === 'unread' ? 'bg_primary' : 'outline_primary')}
              onPress={() => setActiveFilter('unread')}
            >
              Unread ({stats.unread})
            </Button>
          </div>

          <p className="text-muted-foreground text-sm">
            {filteredChapters.length} chapter{filteredChapters.length !== 1 ? 's' : ''}
          </p>
        </div>

        <MyChaptersPage
          ownedChapters={filteredChapters}
          readingProgress={readingProgress}
          onNavigate={handleNavigate}
          isAuthenticated={isAuthenticated}
          hideHeader
        />
      </div>
    </div>
  );
}
