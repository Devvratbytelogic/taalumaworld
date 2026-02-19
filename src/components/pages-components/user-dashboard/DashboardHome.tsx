import { BookOpen, Book, Clock, ArrowRight } from 'lucide-react';
import Button from '@/components/ui/Button';
import { useGetAllBooksQuery } from '@/store/api/booksApi';
import { useGetAllChaptersQuery } from '@/store/api/chaptersApi';
import type { Book as BookType, Chapter } from '@/data/mockData';

interface DashboardHomeProps {
  userName: string;
  displayMode: 'chapters' | 'books';
  ownedChapters: string[];
  ownedBooks: string[];
  readingProgress: Record<string, number>;
  onNavigate: (page: string, id?: string) => void;
  onPageChange: (page: 'my-chapters' | 'my-books' | 'history') => void;
}

export function DashboardHome({
  userName,
  displayMode,
  ownedChapters,
  ownedBooks,
  readingProgress,
  onNavigate,
  onPageChange
}: DashboardHomeProps) {
  const firstName = userName.split(' ')[0] || userName;

  const { data: books = [] } = useGetAllBooksQuery();
  const { data: chapters = [] } = useGetAllChaptersQuery();

  // Get continue reading items (items with progress > 0 and < 100)
  const continueReadingItems = Object.entries(readingProgress)
    .filter(([id, progress]) => progress > 0 && progress < 100)
    .sort((a, b) => b[1] - a[1]) // Sort by progress
    .slice(0, 3);

  const hasContinueReading = continueReadingItems.length > 0;

  // Get chapter or book details for continue reading
  const getContinueReadingItem = (id: string) => {
    if (displayMode === 'chapters') {
      const chapter = chapters.find(c => c.id === id);
      if (chapter) {
        const book = books.find(b => b.id === chapter.bookId);
        return { type: 'chapter', item: chapter, book };
      }
    } else {
      const book = books.find(b => b.id === id);
      if (book) {
        return { type: 'book', item: book };
      }
    }
    return null;
  };

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="bg-white rounded-3xl p-8 shadow-sm">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Welcome back, {firstName}! 👋
        </h1>
        <p className="text-muted-foreground">
          {displayMode === 'chapters' 
            ? "Continue your reading journey or explore new chapters"
            : "Continue your reading journey or explore new books"}
        </p>
      </div>

      {/* Continue Reading Section - Only show if there's progress */}
      {hasContinueReading && (
        <div className="bg-white rounded-3xl p-8 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-foreground">Continue Reading</h2>
            <Button
              className='global_btn rounded_full outline_primary'
              onPress={() => onPageChange('history')}
            >
              View All
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {continueReadingItems.map(([id, progress]) => {
              const item = getContinueReadingItem(id);
              if (!item) return null;

              if (item.type === 'chapter') {
                const chapter = item.item as Chapter;
                const book = item.book as BookType;
                
                return (
                  <div
                    key={id}
                    className="group bg-white border border-gray-200 rounded-3xl overflow-hidden hover:shadow-lg transition-all cursor-pointer"
                    onClick={() => onNavigate('read-chapter', id)}
                  >
                    <div className="aspect-video relative overflow-hidden bg-gray-100">
                      <img
                        src={chapter.featuredImage}
                        alt={chapter.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-4">
                      <p className="text-xs text-muted-foreground mb-1">{book?.title}</p>
                      <h3 className="font-semibold text-sm mb-2 line-clamp-2">
                        {chapter.title}
                      </h3>
                      
                      {/* Progress Bar */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>{Math.round(progress)}% complete</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full transition-all"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>

                      <Button
                        size="sm"
                        className="w-full mt-3 rounded-full"
                        onClick={(e) => {
                          e.stopPropagation();
                          onNavigate('read-chapter', id);
                        }}
                      >
                        Continue Reading
                      </Button>
                    </div>
                  </div>
                );
              } else {
                const book = item.item as BookType;
                
                return (
                  <div
                    key={id}
                    className="group bg-white border border-gray-200 rounded-3xl overflow-hidden hover:shadow-lg transition-all cursor-pointer"
                    onClick={() => onNavigate('read-book')}
                  >
                    <div className="aspect-3/4 relative overflow-hidden bg-gray-100">
                      <img
                        src={book.coverImage}
                        alt={book.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-sm mb-2 line-clamp-2">
                        {book.title}
                      </h3>
                      
                      {/* Progress Bar */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>{Math.round(progress)}% complete</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full transition-all"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>

                      <Button
                        size="sm"
                        className="w-full mt-3 rounded-full"
                        onClick={(e) => {
                          e.stopPropagation();
                          onNavigate('read-book');
                        }}
                      >
                        Continue Reading
                      </Button>
                    </div>
                  </div>
                );
              }
            })}
          </div>
        </div>
      )}

      {/* Quick Access Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* My Library Card */}
        {displayMode === 'chapters' ? (
          <button
            onClick={() => onPageChange('my-chapters')}
            className="bg-linear-to-br from-primary/10 to-primary/5 rounded-3xl p-6 hover:shadow-lg transition-all text-left group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-primary rounded-2xl">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <ArrowRight className="h-5 w-5 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <h3 className="text-xl font-bold mb-2">My Chapters</h3>
            <p className="text-sm text-muted-foreground mb-3">
              {ownedChapters.length} {ownedChapters.length === 1 ? 'chapter' : 'chapters'} owned
            </p>
            <p className="text-xs text-muted-foreground">
              Access all your purchased chapters
            </p>
          </button>
        ) : (
          <button
            onClick={() => onPageChange('my-books')}
            className="bg-linear-to-br from-primary/10 to-primary/5 rounded-3xl p-6 hover:shadow-lg transition-all text-left group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-primary rounded-2xl">
                <Book className="h-6 w-6 text-white" />
              </div>
              <ArrowRight className="h-5 w-5 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <h3 className="text-xl font-bold mb-2">My Books</h3>
            <p className="text-sm text-muted-foreground mb-3">
              {ownedBooks.length} {ownedBooks.length === 1 ? 'book' : 'books'} owned
            </p>
            <p className="text-xs text-muted-foreground">
              Access all your purchased books
            </p>
          </button>
        )}

        {/* Reading History Card */}
        <button
          onClick={() => onPageChange('history')}
          className="bg-linear-to-br from-blue-50 to-blue-100/50 rounded-3xl p-6 hover:shadow-lg transition-all text-left group"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-blue-500 rounded-2xl">
              <Clock className="h-6 w-6 text-white" />
            </div>
            <ArrowRight className="h-5 w-5 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <h3 className="text-xl font-bold mb-2">Reading History</h3>
          <p className="text-sm text-muted-foreground mb-3">
            Track your reading activity
          </p>
          <p className="text-xs text-muted-foreground">
            View all your recently read items
          </p>
        </button>

        {/* Explore More Card */}
        <button
          onClick={() => onNavigate('home')}
          className="bg-linear-to-br from-purple-50 to-purple-100/50 rounded-3xl p-6 hover:shadow-lg transition-all text-left group"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-purple-500 rounded-2xl">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <ArrowRight className="h-5 w-5 text-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <h3 className="text-xl font-bold mb-2">
            {displayMode === 'chapters' ? 'Explore Chapters' : 'Explore Books'}
          </h3>
          <p className="text-sm text-muted-foreground mb-3">
            Discover new stories
          </p>
          <p className="text-xs text-muted-foreground">
            Browse and find your next read
          </p>
        </button>
      </div>

      {/* Empty State if no reading progress */}
      {!hasContinueReading && (
        <div className="bg-white rounded-3xl p-12 text-center shadow-sm">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">Start Your Reading Journey</h3>
            <p className="text-muted-foreground mb-6">
              You haven't started reading yet. Explore our collection and dive into amazing stories!
            </p>
            <Button
              onPress={() => onNavigate('home')}
              className='global_btn rounded_full bg_primary'
            >
              {displayMode === 'chapters' ? 'Browse Chapters' : 'Browse Books'}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}