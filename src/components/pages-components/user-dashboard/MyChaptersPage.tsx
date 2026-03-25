'use client';
import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BookOpen, TrendingUp, CheckCircle, Play } from 'lucide-react';
import Button from '@/components/ui/Button';
import { useGetMyChaptersQuery } from '@/store/rtkQueries/userGetAPI';
import { cn } from '@/components/ui/utils';
import type { ItemsEntity } from '@/types/user/myChapters';

type FilterType = 'all' | 'reading' | 'completed' | 'unread';

export function MyChaptersPage() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  const { data: myChaptersData, isLoading } = useGetMyChaptersQuery();
  const chapters: ItemsEntity[] = myChaptersData?.data?.items ?? [];

  const stats = useMemo(
    () => ({
      total: chapters.length,
      reading: chapters.filter((c) => c.progressPercent > 0 && !c.completed).length,
      completed: chapters.filter((c) => c.completed).length,
      unread: chapters.filter((c) => c.progressPercent === 0 && !c.completed).length,
    }),
    [chapters]
  );

  const filteredChapters = useMemo(() => {
    switch (activeFilter) {
      case 'reading':
        return chapters.filter((c) => c.progressPercent > 0 && !c.completed);
      case 'completed':
        return chapters.filter((c) => c.completed);
      case 'unread':
        return chapters.filter((c) => c.progressPercent === 0 && !c.completed);
      default:
        return chapters;
    }
  }, [chapters, activeFilter]);

  const getProgressStatus = (progressPercent: number, completed: boolean) => {
    if (completed || progressPercent === 100) return { label: 'Completed', color: 'text-green-600' };
    if (progressPercent > 0) return { label: 'In Progress', color: 'text-primary' };
    return { label: 'Not Started', color: 'text-gray-500' };
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-3xl p-5 shadow-sm animate-pulse">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 bg-gray-200 rounded-full" />
                <div className="space-y-2">
                  <div className="h-6 bg-gray-200 rounded w-10" />
                  <div className="h-3 bg-gray-100 rounded w-24" />
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-3xl overflow-hidden animate-pulse">
              <div className="aspect-video bg-gray-200" />
              <div className="p-5 space-y-3">
                <div className="h-3 bg-gray-100 rounded w-24" />
                <div className="h-5 bg-gray-200 rounded w-full" />
                <div className="h-4 bg-gray-100 rounded w-3/4" />
                <div className="h-10 bg-gray-200 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="mb-2">
        <h1 className="text-3xl font-bold mb-1">My Chapters</h1>
        <p className="text-muted-foreground">Your personal collection of purchased chapters</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
          {filteredChapters.length} chapter{filteredChapters.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Chapters Grid */}
      {filteredChapters.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredChapters.map((chapter) => {
            // console.log('chapter', chapter);
            
            const progress = chapter.progressPercent;
            const status = getProgressStatus(progress, chapter.completed);

            return (
              <div
                key={chapter.chapterId}
                className="bg-white border border-gray-200 rounded-3xl overflow-hidden hover:shadow-lg transition-all group"
              >
                {/* Chapter Image */}
                <div className="aspect-video relative overflow-hidden bg-gray-100">
                  <img
                    src={chapter.coverImage}
                    alt={chapter.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />

                  {/* Progress Badge */}
                  {chapter.completed && (
                    <div className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                      <CheckCircle className="h-3 w-3" />
                      Completed
                    </div>
                  )}
                  {!chapter.completed && progress > 0 && (
                    <div className="absolute top-3 right-3 bg-primary text-white px-3 py-1 rounded-full text-sm font-medium">
                      {Math.round(progress)}%
                    </div>
                  )}
                </div>

                {/* Chapter Info */}
                <div className="p-5">
                  <p className="text-sm text-muted-foreground mb-1">{chapter.bookTitle}</p>
                  <h3 className="font-bold text-base mb-2 line-clamp-2">{chapter.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{chapter.description}</p>

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
                    className='global_btn rounded_full bg_primary'
                    onPress={() => router.push(`/read-chapter/${chapter.chapterId}`)}
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

                  {/* Chapter Number & Status */}
                  <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-sm text-muted-foreground">
                    <span>Chapter {chapter.chapterNumber}</span>
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
              <BookOpen className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">
              {activeFilter === 'all' ? 'No Chapters Yet' : `No ${activeFilter === 'reading' ? 'In Progress' : activeFilter === 'completed' ? 'Completed' : 'Unread'} Chapters`}
            </h3>
            <p className="text-muted-foreground mb-6">
              {activeFilter === 'all'
                ? "You haven't purchased any chapters yet. Start exploring and build your collection!"
                : 'No chapters match this filter.'}
            </p>
            {activeFilter === 'all' && (
              <Button
                onPress={() => router.push('/')}
                className='global_btn rounded_full bg_primary'
              >
                Browse Chapters
              </Button>
            )}
            {activeFilter !== 'all' && (
              <Button
                onPress={() => setActiveFilter('all')}
                className='global_btn rounded_full outline_primary'
              >
                Show All Chapters
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
