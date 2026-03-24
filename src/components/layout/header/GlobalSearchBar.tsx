'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'nextjs-toploader/app';
import { getAuthorsRoutePath } from '@/routes/routes';
import { Search, X, BookOpen, FileText, User, Clock } from 'lucide-react';
import { useGetSearchResultsQuery, useGetGlobalSettingsQuery } from '@/store/rtkQueries/userGetAPI';
import { Input } from '@/components/ui/input';
import Button from '@/components/ui/Button';
import { VISIBLE } from '@/constants/contentMode';
import { useAppDispatch } from '@/store/hooks';
import { openModal } from '@/store/slices/allModalSlice';
import { BooksEntity, ChaptersEntity } from '@/types/user/saech';
import { IBookItem, IChapterItem } from '@/types/user/HomeAllChapters';

function mapBookToContentItem(book: BooksEntity): IBookItem {
  return {
    type: 'book',
    id: book.id,
    title: book.title,
    description: book.description,
    coverImage: book.coverImage,
    price: book.price,
    pricingModel: book.pricingModel,
    totalPages: 0,
    chapterCount: 0,
    author: book.author,
    authorAvatar: book.authorAvatar ?? null,
    category: book.category,
    subcategory: book.subcategory ?? null,
    isPurchased: false,
    canRead: false,
    chapters: [],
  };
}

function mapChapterToContentItem(chapter: ChaptersEntity): IChapterItem {
  return {
    type: 'chapter',
    id: chapter.id,
    chapterNumber: chapter.chapterNumber,
    title: chapter.title,
    description: chapter.description,
    pageCount: chapter.pageCount,
    price: chapter.price,
    isFree: chapter.isFree,
    coverImage: chapter.coverImage,
    bookId: chapter.bookId as any,
    bookTitle: chapter.bookTitle,
    author: chapter.author,
    authorAvatar: chapter.authorAvatar ?? null,
    category: chapter.category,
    subcategory: chapter.subcategory ?? null,
  };
}

const RECENT_SEARCHES_KEY = 'taaluma_recent_searches';

export default function GlobalSearchBar() {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { data: globalSettings } = useGetGlobalSettingsQuery();
  const contentMode = globalSettings?.data?.visible;

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(RECENT_SEARCHES_KEY);
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch {
        setRecentSearches([]);
      }
    }
  }, []);

  // Debounce query by 350ms
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query.trim());
    }, 350);
    return () => clearTimeout(timer);
  }, [query]);

  const { data: searchData, isFetching } = useGetSearchResultsQuery(debouncedQuery, {
    skip: debouncedQuery.length < 2,
  });

  const books = contentMode === VISIBLE.BOOK ? (searchData?.data?.books ?? []) : [];
  const chapters = contentMode === VISIBLE.CHAPTER ? (searchData?.data?.chapters ?? []) : [];
  const authors = contentMode === VISIBLE.BOOK ? (searchData?.data?.authors ?? []) : [];
  const hasResults = books.length > 0 || chapters.length > 0 || authors.length > 0;

  const showResults = isOpen && debouncedQuery.length >= 2;
  const showRecent = isOpen && !query && recentSearches.length > 0;

  const saveSearch = (term: string) => {
    if (!term.trim()) return;
    const updated = [term, ...recentSearches.filter((s) => s !== term)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
  };

  const clearAndClose = () => {
    setQuery('');
    setDebouncedQuery('');
    setIsOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    saveSearch(query.trim());
    // router.push(getSearchRoutePath(query.trim()));
    // clearAndClose();
  };

  return (
    <div className="relative w-full">
      <form onSubmit={handleSubmit} className="relative">
        <Search
          className={`absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 transition-colors ${
            isOpen ? 'text-primary' : 'text-gray-400'
          }`}
        />
        <Input
          type="text"
          placeholder="Search books, chapters, authors..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          className={`pl-11 pr-10 w-full py-3 rounded-full transition-all ${
            isOpen ? 'border-primary' : ''
          }`}
        />
        {query && (
          <button
            type="button"
            onClick={clearAndClose}
            className="absolute right-3 top-1/2 -translate-y-1/2"
          >
            <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
          </button>
        )}
      </form>

      {/* Backdrop */}
      {(showResults || showRecent) && (
        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
      )}

      {/* Recent Searches Dropdown */}
      {showRecent && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border z-50 max-h-96 overflow-y-auto">
          <div className="p-3">
            <div className="flex items-center justify-between px-2 mb-2">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Recent Searches
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onPress={() => {
                  setRecentSearches([]);
                  localStorage.removeItem(RECENT_SEARCHES_KEY);
                }}
                className="h-auto py-1 px-2 text-xs rounded-full hover:bg-gray-100"
              >
                Clear
              </Button>
            </div>
            <div className="space-y-1">
              {recentSearches.map((term, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setQuery(term);
                    setIsOpen(true);
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2"
                >
                  <Search className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                  <span className="font-medium text-sm">{term}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Search Results Dropdown */}
      {showResults && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border z-50 max-h-96 overflow-y-auto">

          {/* Loading */}
          {isFetching && (
            <div className="px-4 py-3 text-sm text-gray-500 text-center">Searching...</div>
          )}

          {/* Results */}
          {!isFetching && hasResults && (
            <>
              {books.length > 0 && (
                <div className="p-2">
                  <div className="flex items-center gap-2 px-3 py-2">
                    <BookOpen className="h-4 w-4 text-primary" />
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Books
                    </span>
                  </div>
                  {books.slice(0, 4).map((book) => (
                    <button
                      key={book.id}
                      onClick={() => {
                        saveSearch(book.title);
                        dispatch(openModal({ componentName: 'CommonCardDetailsModal', data: { chapter: mapBookToContentItem(book) } }));
                        clearAndClose();
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <div className="font-medium line-clamp-1">{book.title}</div>
                      <div className="text-xs text-gray-500">{book.author}</div>
                    </button>
                  ))}
                </div>
              )}

              {chapters.length > 0 && (
                <div className="p-2 border-t">
                  <div className="flex items-center gap-2 px-3 py-2">
                    <FileText className="h-4 w-4 text-primary" />
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Chapters
                    </span>
                  </div>
                  {chapters.slice(0, 4).map((chapter) => (
                    <button
                      key={chapter.id}
                      onClick={() => {
                        saveSearch(chapter.title);
                        dispatch(openModal({ componentName: 'CommonCardDetailsModal', data: { chapter: mapChapterToContentItem(chapter) } }));
                        clearAndClose();
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <div className="font-medium line-clamp-1">{chapter.title}</div>
                      <div className="text-xs text-gray-500">
                        Ch. {chapter.chapterNumber} · {chapter.bookTitle}
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {authors.length > 0 && (
                <div className="p-2 border-t">
                  <div className="flex items-center gap-2 px-3 py-2">
                    <User className="h-4 w-4 text-primary" />
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Thought Leaders
                    </span>
                  </div>
                  {authors.slice(0, 3).map((author) => (
                    <button
                      key={author.id}
                      onClick={() => {
                        saveSearch(author.fullName);
                        router.push(getAuthorsRoutePath({ id: author.id }));
                        clearAndClose();
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <div className="font-medium">{author.fullName}</div>
                      <div className="text-xs text-gray-500">
                        {author.followersCount ?? 0} followers
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* View all results */}
              {/* <div className="p-2 border-t">
                <button
                  onClick={() => {
                    saveSearch(debouncedQuery);
                    router.push(getSearchRoutePath(debouncedQuery));
                    clearAndClose();
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2 text-primary"
                >
                  <Search className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    See all results for &quot;{debouncedQuery}&quot;
                  </span>
                </button>
              </div> */}
            </>
          )}

          {/* No results */}
          {!isFetching && !hasResults && (
            <div className="px-4 py-3 text-sm text-gray-500 text-center">
              No results found for &quot;{debouncedQuery}&quot;
            </div>
          )}
        </div>
      )}
    </div>
  );
}
