'use client';
import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Book, BookOpen, TrendingUp, CheckCircle, Play } from 'lucide-react';
import Button from '@/components/ui/Button';
import { useGetMyBooksQuery } from '@/store/rtkQueries/userGetAPI';
import { cn } from '@/components/ui/utils';
import type { IMyBookItem } from '@/types/user/myBooks';
import MyBooksPageSkeleton from '@/components/skeleton-loader/MyBooksPageSkeleton';
import { getHomeRoutePath, getReadBookRoutePath } from '@/routes/routes';

type FilterType = 'all' | 'reading' | 'completed' | 'unread';

export function MyBooksPage() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  const { data: myBooksData, isLoading } = useGetMyBooksQuery();
  const books: IMyBookItem[] = myBooksData?.data?.items ?? [];

  const stats = useMemo(
    () => ({
      total: books.length,
      reading: books.filter((b) => b.progressPercent > 0 && !b.completed).length,
      completed: books.filter((b) => b.completed).length,
      unread: books.filter((b) => b.progressPercent === 0 && !b.completed).length,
    }),
    [books]
  );

  const filteredBooks = useMemo(() => {
    switch (activeFilter) {
      case 'reading':
        return books.filter((b) => b.progressPercent > 0 && !b.completed);
      case 'completed':
        return books.filter((b) => b.completed);
      case 'unread':
        return books.filter((b) => b.progressPercent === 0 && !b.completed);
      default:
        return books;
    }
  }, [books, activeFilter]);

  const getProgressStatus = (progressPercent: number, completed: boolean) => {
    if (completed || progressPercent === 100) return { label: 'Completed', color: 'text-green-600' };
    if (progressPercent > 0) return { label: 'In Progress', color: 'text-primary' };
    return { label: 'Not Started', color: 'text-gray-500' };
  };
console.log('filteredBooks', filteredBooks);

  if (isLoading) {
    return <MyBooksPageSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="mb-2">
        <h1 className="text-3xl font-bold mb-1">My Books</h1>
        <p className="text-muted-foreground">Your personal collection of purchased books</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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

      {/* Filter Bar */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex gap-2 flex-wrap">
          {(
            [
              { key: 'all', label: `All (${stats.total})` },
              { key: 'reading', label: `Reading (${stats.reading})` },
              { key: 'completed', label: `Completed (${stats.completed})` },
              { key: 'unread', label: `Unread (${stats.unread})` },
            ] as { key: FilterType; label: string }[]
          ).map(({ key, label }) => (
            <Button
              key={key}
              className={cn('global_btn rounded_full', activeFilter === key ? 'bg_primary' : 'outline_primary')}
              onPress={() => setActiveFilter(key)}
            >
              {label}
            </Button>
          ))}
        </div>
        <p className="text-muted-foreground text-sm">
          {filteredBooks.length} book{filteredBooks.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Books Grid */}
      {filteredBooks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBooks.map((book, index) => {
            const progress = book.progressPercent;
            const status = getProgressStatus(progress, book.completed);

            return (
              <div
                key={book.bookId ?? index}
                className="bg-white border border-gray-200 rounded-3xl overflow-hidden hover:shadow-lg transition-all group"
              >
                {/* Book Cover */}
                <div className="aspect-3/4 relative overflow-hidden bg-gray-100">
                  <img
                    src={book.coverImage}
                    alt={book.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />

                  {/* Status Badge */}
                  {book.completed && (
                    <div className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                      <CheckCircle className="h-3 w-3" />
                      Completed
                    </div>
                  )}
                  {!book.completed && progress > 0 && (
                    <div className="absolute top-3 right-3 bg-primary text-white px-3 py-1 rounded-full text-sm font-medium">
                      {Math.round(progress)}%
                    </div>
                  )}
                </div>

                {/* Book Info */}
                <div className="p-5">
                  <p className="text-sm text-muted-foreground mb-1">{book.author}</p>
                  <h3 className="font-bold text-base mb-2 line-clamp-2">{book.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{book.description}</p>

                  {/* Progress Bar */}
                  {progress > 0 && (
                    <div className="mb-4">
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full transition-all"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Action Button */}
                  <Button
                    className="global_btn rounded_full bg_primary w-full"
                    onPress={() => router.push(getReadBookRoutePath(book?.id ?? '')  )}
                  >
                    {progress === 0 ? (
                      <>
                        <Play className="h-4 w-4" />
                        Start Reading
                      </>
                    ) : progress < 100 ? (
                      <>
                        <BookOpen className="h-4 w-4" />
                        Continue Reading
                      </>
                    ) : (
                      <>
                        <BookOpen className="h-4 w-4" />
                        Read Again
                      </>
                    )}
                  </Button>

                  {/* Book Details */}
                  <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-sm text-muted-foreground">
                    <span>{book.chapterCount} chapters</span>
                    <span className={status.color}>{status.label}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-3xl p-12 text-center shadow-sm">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Book className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">
              {activeFilter === 'all'
                ? 'No Books Yet'
                : `No ${activeFilter === 'reading' ? 'In Progress' : activeFilter === 'completed' ? 'Completed' : 'Unread'} Books`}
            </h3>
            <p className="text-muted-foreground mb-6">
              {activeFilter === 'all'
                ? "You haven't purchased any books yet. Start exploring and build your collection!"
                : 'No books match this filter.'}
            </p>
            {activeFilter === 'all' ? (
              <Button
                onPress={() => router.push(getHomeRoutePath())}
                className="global_btn rounded_full bg_primary"
              >
                Browse Books
              </Button>
            ) : (
              <Button
                onPress={() => setActiveFilter('all')}
                className="global_btn rounded_full outline_primary"
              >
                Show All Books
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
