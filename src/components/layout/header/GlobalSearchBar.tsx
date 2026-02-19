import { useState, useEffect } from 'react';
import { useRouter } from 'nextjs-toploader/app';
import { getAuthorsRoutePath, getBooksRoutePath, getHomeWithSelectionRoutePath } from '@/routes/routes';
import { Search, X, BookOpen, FileText, User, Clock } from 'lucide-react';
import { useGetAllBooksQuery } from '@/store/api/booksApi';
import { useGetAllChaptersQuery } from '@/store/api/chaptersApi';
import { useGetAuthorsQuery } from '@/store/api/authorsApi';
import { Input } from '@/components/ui/input';  
import Button from '@/components/ui/Button';
import { useAppSelector } from '@/store/hooks';
import { selectContentMode } from '@/store/slices/contentModeSlice';

export default function GlobalSearchBar() {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const router = useRouter();
  const displayMode = useAppSelector(selectContentMode);

  const { data: books = [] } = useGetAllBooksQuery();
  const { data: chapters = [] } = useGetAllChaptersQuery();
  const { data: authors = [] } = useGetAuthorsQuery();

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('taaluma_recent_searches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  const saveSearch = (searchTerm: string) => {
    if (!searchTerm.trim()) return;
    
    const updated = [searchTerm, ...recentSearches.filter(s => s !== searchTerm)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('taaluma_recent_searches', JSON.stringify(updated));
  };

  const handleRecentSearchClick = (search: string) => {
    setQuery(search);
    setIsOpen(true);
  };

  // Only show books and authors in Books Mode
  const filteredBooks = query && displayMode === 'books'
    ? books.filter((book) =>
        book.title.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 3)
    : [];

  // Only show chapters in Chapters Mode
  const filteredChapters = query && displayMode === 'chapters'
    ? chapters.filter((chapter) =>
        chapter.title.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 3)
    : [];

  const filteredAuthors = query && displayMode === 'books'
    ? authors.filter((author) =>
        author.name.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 3)
    : [];

  const hasResults = filteredBooks.length > 0 || filteredChapters.length > 0 || filteredAuthors.length > 0;
  const showSuggestions = !query && recentSearches.length > 0;

  return (
    <div className="relative w-full">
      <div className="relative">
        <Search className={`absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 transition-colors ${isOpen ? 'text-primary' : 'text-gray-400'}`} />
        <Input
          type="text"
          placeholder="Search books, chapters, authors..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          className={`pl-11 pr-10 w-full py-3 rounded-full transition-all ${isOpen ? 'border-primary' : ''}`}
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setIsOpen(false);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2"
          >
            <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isOpen && query && hasResults && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Results */}
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border z-50 max-h-96 overflow-y-auto">
            {filteredBooks.length > 0 && (
              <div className="p-2">
                <div className="flex items-center gap-2 px-3 py-2">
                  <BookOpen className="h-4 w-4 text-primary" />
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Books</span>
                </div>
                {filteredBooks.map((book) => (
                  <button
                    key={book.id}
                    onClick={() => {
                      router.push(getBooksRoutePath({ id: book.id }));
                      setIsOpen(false);
                      setQuery('');
                      saveSearch(book.title);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <div className="font-medium">{book.title}</div>
                    <div className="text-xs text-gray-500">{book.categoryId ? book.categoryId : 'N/A'}</div>
                  </button>
                ))}
              </div>
            )}

            {filteredChapters.length > 0 && (
              <div className="p-2 border-t">
                <div className="flex items-center gap-2 px-3 py-2">
                  <FileText className="h-4 w-4 text-primary" />
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Chapters</span>
                </div>
                {filteredChapters.map((chapter) => (
                  <button
                    key={chapter.id}
                    onClick={() => {
                      // Navigate to home page with chapter selection
                      router.push(getHomeWithSelectionRoutePath(chapter.id, chapter.bookId));
                      setIsOpen(false);
                      setQuery('');
                      saveSearch(chapter.title);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <div className="font-medium">{chapter.title}</div>
                    <div className="text-xs text-gray-500">Chapter {chapter.sequence}</div>
                  </button>
                ))}
              </div>
            )}

            {filteredAuthors.length > 0 && (
              <div className="p-2 border-t">
                <div className="flex items-center gap-2 px-3 py-2">
                  <User className="h-4 w-4 text-primary" />
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Thought Leaders</span>
                </div>
                {filteredAuthors.map((author) => (
                  <button
                    key={author.id}
                    onClick={() => {
                      router.push(getAuthorsRoutePath({ id: author.id }));
                      setIsOpen(false);
                      setQuery('');
                      saveSearch(author.name);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <div className="font-medium">{author.name}</div>
                    <div className="text-xs text-gray-500">{author.booksCount ? author.booksCount : 0} books</div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* Suggestions Dropdown - Shows when focused but no query */}
      {isOpen && showSuggestions && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Suggestions */}
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border z-50 max-h-96 overflow-y-auto">
            <div className="p-3">
              <div className="flex items-center justify-between px-2 mb-2">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Recent Searches</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setRecentSearches([]);
                    localStorage.removeItem('taaluma_recent_searches');
                  }}
                  className="h-auto py-1 px-2 text-xs rounded-full hover:bg-gray-100"
                >
                  Clear
                </Button>
              </div>
              <div className="space-y-1">
                {recentSearches.map((search, index) => (
                  <button
                    key={index}
                    onClick={() => handleRecentSearchClick(search)}
                    className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <Search className="h-3.5 w-3.5 text-gray-400" />
                    <span className="font-medium text-sm">{search}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}