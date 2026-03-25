'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Clock, Calendar } from 'lucide-react';
import Button from '@/components/ui/Button';
import { useGetReadingHistoryQuery } from '@/store/rtkQueries/userGetAPI';
import type { IMyReadingHistoryAPIResponseItemsEntity } from '@/types/user/readingHistory';

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
        <div className="bg-white rounded-3xl p-8 shadow-sm animate-pulse">
          <div className="h-8 bg-gray-200 rounded-xl w-48 mb-2" />
          <div className="h-4 bg-gray-100 rounded-xl w-64" />
        </div>
        <div className="bg-white rounded-3xl p-6 shadow-sm space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex gap-4 p-4 rounded-2xl border border-gray-100 animate-pulse">
              <div className="shrink-0 w-32 aspect-video rounded-xl bg-gray-200" />
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
      {/* Page Header */}
      <div className="bg-white rounded-3xl p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-blue-500/10 rounded-2xl">
            <Clock className="h-6 w-6 text-blue-500" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">Reading History</h1>
        </div>
        <p className="text-muted-foreground">
          Track your reading journey and progress
        </p>
      </div>

      {/* History List */}
      {historyItems.length > 0 ? (
        <div className="bg-white rounded-3xl p-6 shadow-sm">
          <div className="space-y-4">
            {historyItems.map((item) => (
              <div
                key={item.chapterId}
                className="flex gap-4 p-4 rounded-2xl border border-gray-200 hover:shadow-md transition-all group"
              >
                {/* Chapter Image */}
                <div className="shrink-0 w-32 aspect-video rounded-xl overflow-hidden bg-gray-100">
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
                    Chapter {item.chapterNumber}
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
        <div className="bg-white rounded-3xl p-12 text-center shadow-sm">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="h-8 w-8 text-blue-500" />
            </div>
            <h3 className="text-xl font-bold mb-2">No Reading History</h3>
            <p className="text-muted-foreground mb-6">
              Start reading to build your history. Your recently read {displayMode === 'chapters' ? 'chapters' : 'books'} will appear here.
            </p>
            <Button
              onPress={() => router.push('/')}
              className='global_btn rounded_full bg_primary'
            >
              {displayMode === 'chapters' ? 'Browse Chapters' : 'Browse Books'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
