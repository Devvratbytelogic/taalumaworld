import { Clock, Calendar } from 'lucide-react';
import Button from '@/components/ui/Button';
import { useGetBooksQuery } from '@/store/api/booksApi';
import { useGetChaptersQuery } from '@/store/api/chaptersApi';
import { useGetAuthorsQuery } from '@/store/api/authorsApi';

interface ReadingHistoryProps {
  readingProgress: Record<string, number>;
  displayMode: 'chapters' | 'books';
  onNavigate: (page: string, id?: string) => void;
}

export function ReadingHistory({
  readingProgress,
  displayMode,
  onNavigate
}: ReadingHistoryProps) {
  const { data: books = [] } = useGetBooksQuery({});
  const { data: chapters = [] } = useGetChaptersQuery({});
  const { data: authors = [] } = useGetAuthorsQuery();

  // Get all items with reading progress
  const historyItems = Object.entries(readingProgress)
    .map(([id, progress]) => {
      if (displayMode === 'chapters') {
        const chapter = chapters.find(c => c.id === id);
        if (chapter) {
          const book = books.find(b => b.id === chapter.bookId);
          return {
            type: 'chapter' as const,
            id,
            item: chapter,
            book,
            progress,
            // Mock last read date (in real app, this would come from backend)
            lastRead: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)
          };
        }
      } else {
        const book = books.find(b => b.id === id);
        if (book) {
          const author = authors.find(a => a.id === book.authorId);
          return {
            type: 'book' as const,
            id,
            item: book,
            author,
            progress,
            // Mock last read date (in real app, this would come from backend)
            lastRead: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)
          };
        }
      }
      return null;
    })
    .filter(Boolean)
    .sort((a, b) => b!.lastRead.getTime() - a!.lastRead.getTime());

  const formatLastRead = (date: Date) => {
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
            {historyItems.map((item) => {
              if (!item) return null;

              if (item.type === 'chapter') {
                return (
                  <div
                    key={item.id}
                    className="flex gap-4 p-4 rounded-2xl border border-gray-200 hover:shadow-md transition-all group"
                  >
                    {/* Chapter Image */}
                    <div className="shrink-0 w-32 aspect-video rounded-xl overflow-hidden bg-gray-100">
                      <img
                        src={item.item.featuredImage}
                        alt={item.item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    {/* Chapter Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-muted-foreground mb-1">
                        {item.book?.title || 'Unknown Book'}
                      </p>
                      <h3 className="font-bold text-base mb-1 line-clamp-1">
                        {item.item.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                        Chapter {item.item.sequence}
                      </p>

                      {/* Progress Info */}
                      <div className="flex items-center gap-3 flex-wrap">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-24 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary rounded-full transition-all"
                              style={{ width: `${item.progress}%` }}
                            />
                          </div>
                          <span className="text-xs font-medium text-muted-foreground">
                            {Math.round(item.progress)}%
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {formatLastRead(item.lastRead)}
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="shrink-0 flex items-center">
                      <Button
                        className='global_btn rounded_full outline_primary'
                        onPress={() => onNavigate('read-chapter', item.id)}
                      >
                        {item.progress < 100 ? 'Continue' : 'Read Again'}
                      </Button>
                    </div>
                  </div>
                );
              } else {
                return (
                  <div
                    key={item.id}
                    className="flex gap-4 p-4 rounded-2xl border border-gray-200 hover:shadow-md transition-all group"
                  >
                    {/* Book Cover */}
                    <div className="shrink-0 w-24 aspect-3/4 rounded-xl overflow-hidden bg-gray-100">
                      <img
                        src={item.item.coverImage}
                        alt={item.item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    {/* Book Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-muted-foreground mb-1">
                        {item.author?.name || 'Unknown Author'}
                      </p>
                      <h3 className="font-bold text-base mb-1 line-clamp-1">
                        {item.item.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                        {item.item.totalChapters} chapters
                      </p>

                      {/* Progress Info */}
                      <div className="flex items-center gap-3 flex-wrap">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-24 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary rounded-full transition-all"
                              style={{ width: `${item.progress}%` }}
                            />
                          </div>
                          <span className="text-xs font-medium text-muted-foreground">
                            {Math.round(item.progress)}%
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {formatLastRead(item.lastRead)}
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="shrink-0 flex items-center">
                      <Button
                        className='global_btn rounded_full outline_primary'
                        onPress={() => onNavigate('read-book')}
                      >
                        {item.progress < 100 ? 'Continue' : 'Read Again'}
                      </Button>
                    </div>
                  </div>
                );
              }
            })}
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
              onPress={() => onNavigate('home')}
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