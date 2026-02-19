'use client';

import { useMemo, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { Book, TrendingUp, CheckCircle } from 'lucide-react';
import Button from '@/components/ui/Button';
import { MyBooksPage } from '@/components/pages-components/user-dashboard/MyBooksPage';
import { getHomeRoutePath } from '@/routes/routes';
import { selectReadingProgress } from '@/store/slices/readingSlice';
import { cn } from '@/components/ui/utils';

type FilterType = 'all' | 'reading' | 'completed' | 'unread';

export default function MyBooksRoutePage() {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const router = useRouter();
  const readingProgressRaw = useSelector(selectReadingProgress);
  const [ownedBooks, setOwnedBooks] = useState<string[]>([]);

  const readingProgress = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(readingProgressRaw).map(([id, data]) => [id, data.progress])
      ),
    [readingProgressRaw]
  );

  useEffect(() => {
    try {
      const stored = localStorage.getItem('owned_books');
      setOwnedBooks(stored ? JSON.parse(stored) : []);
    } catch {
      setOwnedBooks([]);
    }
  }, []);

  const handleNavigate = (page: string) => {
    router.push(getHomeRoutePath());
  };

  const stats = useMemo(
    () => ({
      total: ownedBooks.length,
      reading: ownedBooks.filter(
        (id) => (readingProgress[id] ?? 0) > 0 && (readingProgress[id] ?? 0) < 100
      ).length,
      completed: ownedBooks.filter((id) => (readingProgress[id] ?? 0) === 100).length,
      unread: ownedBooks.filter((id) => (readingProgress[id] ?? 0) === 0).length,
    }),
    [ownedBooks, readingProgress]
  );

  const filteredBooks = useMemo(() => {
    switch (activeFilter) {
      case 'reading':
        return ownedBooks.filter(
          (id) => (readingProgress[id] ?? 0) > 0 && (readingProgress[id] ?? 0) < 100
        );
      case 'completed':
        return ownedBooks.filter((id) => (readingProgress[id] ?? 0) === 100);
      case 'unread':
        return ownedBooks.filter((id) => (readingProgress[id] ?? 0) === 0);
      default:
        return ownedBooks;
    }
  }, [ownedBooks, readingProgress, activeFilter]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">My Books</h1>
          <p className="text-muted-foreground text-lg">
            Your personal collection of purchased books
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-linear-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-3xl p-5">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/20 rounded-full">
                <Book className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold tracking-tight">{stats.total}</div>
                <div className="text-sm text-muted-foreground tracking-tight">Total Books</div>
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
            {filteredBooks.length} book{filteredBooks.length !== 1 ? 's' : ''}
          </p>
        </div>

        <MyBooksPage
          ownedBooks={filteredBooks}
          readingProgress={readingProgress}
          onNavigate={handleNavigate}
          hideHeader
        />
      </div>
    </div>
  );
}
