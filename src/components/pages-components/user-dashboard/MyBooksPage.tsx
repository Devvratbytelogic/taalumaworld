import { Book, Play, BookOpen, CheckCircle } from 'lucide-react';
import Button from '@/components/ui/Button';
import { useGetAllBooksQuery } from '@/store/api/booksApi';
import { useGetAuthorsQuery } from '@/store/api/authorsApi';

interface MyBooksPageProps {
  ownedBooks: string[];
  readingProgress: Record<string, number>;
  onNavigate: (page: string) => void;
}

export function MyBooksPage({
  ownedBooks,
  readingProgress,
  onNavigate
}: MyBooksPageProps) {
  const { data: books = [] } = useGetAllBooksQuery();
  const { data: authors = [] } = useGetAuthorsQuery();

  // Get book details for owned books
  const myBooks = ownedBooks
    .map(bookId => books.find(b => b.id === bookId))
    .filter(Boolean)
    .map(book => {
      const author = authors.find(a => a.id === book!.authorId);
      const progress = readingProgress[book!.id] || 0;
      return { book: book!, author, progress };
    })
    .sort((a, b) => {
      // Sort by progress (in-progress first, then not started, then completed)
      const aProgress = a.progress;
      const bProgress = b.progress;

      if (aProgress > 0 && aProgress < 100 && !(bProgress > 0 && bProgress < 100)) return -1;
      if (bProgress > 0 && bProgress < 100 && !(aProgress > 0 && aProgress < 100)) return 1;

      return 0;
    });

  const getProgressStatus = (progress: number) => {
    if (progress === 0) return { label: 'Not Started', color: 'text-gray-500' };
    if (progress < 100) return { label: 'In Progress', color: 'text-primary' };
    return { label: 'Completed', color: 'text-green-600' };
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white rounded-3xl p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-primary/10 rounded-2xl">
            <Book className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">My Books</h1>
        </div>
        <p className="text-muted-foreground">
          {myBooks.length} {myBooks.length === 1 ? 'book' : 'books'} in your library
        </p>
      </div>

      {/* Books Grid */}
      {myBooks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myBooks.map(({ book, author, progress }) => {
            const status = getProgressStatus(progress);

            return (
              <div
                key={book.id}
                className="bg-white border border-gray-200 rounded-3xl overflow-hidden hover:shadow-lg transition-all group"
              >
                {/* Book Cover */}
                <div className="aspect-3/4 relative overflow-hidden bg-gray-100">
                  <img
                    src={book.coverImage}
                    alt={book.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />

                  {/* Progress Badge */}
                  {progress === 100 && (
                    <div className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                      <CheckCircle className="h-3 w-3" />
                      Completed
                    </div>
                  )}
                  {progress > 0 && progress < 100 && (
                    <div className="absolute top-3 right-3 bg-primary text-white px-3 py-1 rounded-full text-xs font-medium">
                      {Math.round(progress)}%
                    </div>
                  )}
                </div>

                {/* Book Info */}
                <div className="p-5">
                  <p className="text-xs text-muted-foreground mb-1">
                    {author?.name || 'Unknown Author'}
                  </p>
                  <h3 className="font-bold text-base mb-2 line-clamp-2">
                    {book.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                    {book.description}
                  </p>

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
                    size="sm"
                    className="w-full rounded-full gap-2"
                    onClick={() => onNavigate('read-book')}
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
                  <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-muted-foreground">
                    <span>{book.totalChapters} chapters</span>
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
            <h3 className="text-xl font-bold mb-2">No Books Yet</h3>
            <p className="text-muted-foreground mb-6">
              You haven't purchased any books yet. Start exploring and build your collection!
            </p>
            <Button
              onClick={() => onNavigate('books')}
              className="gap-2"
            >
              Browse Books
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}