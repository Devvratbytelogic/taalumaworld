'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Clock, Calendar } from 'lucide-react';
import Button from '@/components/ui/Button';
import { useGetReadingHistoryQuery } from '@/store/rtkQueries/userGetAPI';
import type { IMyReadingHistoryAPIResponseItemsEntity } from '@/types/user/readingHistory';
import { UserDashboardPageHeader } from './UserDashboardPageHeader';

export function ReadingHistory() {
  const router = useRouter();
  const [displayMode, setDisplayMode] = useState<'chapters' | 'books'>('chapters');

  const { data: historyData, isLoading } = useGetReadingHistoryQuery();
  const historyItems: IMyReadingHistoryAPIResponseItemsEntity[] = historyData?.data?.items ?? [];

  useEffect(() => {
    const savedMode = localStorage.getItem('display-mode');
    if (savedMode === 'books' || savedMode === 'chapters') {
      setDisplayMode(savedMode);
    }

    const handleDisplayModeChange = (event: Event) => {
      const customEvent = event as CustomEvent<{ mode: 'chapters' | 'books' }>;
      setDisplayMode(customEvent.detail.mode);
    };

    window.addEventListener('display-mode-changed', handleDisplayModeChange as EventListener);
    return () => {
      window.removeEventListener('display-mode-changed', handleDisplayModeChange as EventListener);
    };
  }, []);

  const formatLastRead = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;

    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getProgressColor = (progress: number) => {
    if (progress === 100) return 'text-green-600 bg-green-50';
    if (progress > 50) return 'text-primary bg-primary/10';
    if (progress > 0) return 'text-orange-600 bg-orange-50';
    return 'text-gray-500 bg-gray-50';
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="rounded-lg border border-gray-200/80 bg-white p-8 animate-pulse">
          <div className="mb-2 h-8 w-48 rounded-lg bg-gray-200" />
          <div className="h-4 w-64 rounded-lg bg-gray-100" />
        </div>
        <div className="space-y-4 rounded-lg border border-gray-200/80 bg-white p-6 animate-pulse">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex animate-pulse gap-4 rounded-lg border border-gray-100 p-4">
              <div className="aspect-video w-32 shrink-0 rounded-md bg-gray-200" />
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-gray-100 rounded w-24" />
                <div className="h-5 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-100 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <UserDashboardPageHeader title="Reading History" description="Track your reading journey and progress" />

      {historyItems.length > 0 ? (
        <div className="rounded-lg border border-gray-200/80 bg-white p-4 sm:p-6">
          <div className="space-y-4">
            {historyItems.map((item) => (
              <div
                key={item.chapterId}
                className="group flex gap-4 rounded-lg border border-gray-100 p-4 transition-colors hover:border-gray-200"
              >
                <div className="aspect-video w-32 shrink-0 overflow-hidden rounded-md bg-gray-100">
                  <img
                    src={item.chapterCoverImage}
                    alt={item.chapterTitle}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Chapter Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-muted-foreground mb-1">{item.bookTitle}</p>
                  <h3 className="font-bold text-base mb-1 line-clamp-1">{item.chapterTitle}</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Blueprint {item.chapterNumber}
                  </p>

                  {/* Progress Info */}
                  <div className="flex items-center gap-3 flex-wrap">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-24 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full transition-all"
                          style={{ width: `${item.progressPercent}%` }}
                        />
                      </div>
                      <span className={`text-sm font-medium px-2 py-0.5 rounded-full ${getProgressColor(item.progressPercent)}`}>
                        {Math.round(item.progressPercent)}%
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {formatLastRead(item.lastReadAt)}
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <div className="shrink-0 flex items-center">
                  <Button
                    className='global_btn rounded_full outline_primary'
                    onPress={() => router.push(`/read-chapter/${item.chapterId}`)}
                  >
                    {item.progressPercent < 100 ? 'Continue' : 'Read Again'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Empty State */
        <div className="rounded-lg border border-gray-200/80 bg-white p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="h-8 w-8 text-blue-500" />
            </div>
            <h3 className="text-xl font-bold mb-2">No Reading History</h3>
            <p className="text-muted-foreground mb-6">
              Start reading to build your history. Your recently read {displayMode === 'chapters' ? 'blueprints' : 'series'} will appear here.
            </p>
            <Button
              onPress={() => router.push('/')}
              className='global_btn rounded_full bg_primary'
            >
              {displayMode === 'chapters' ? 'Browse Blueprints' : 'Browse Series'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
