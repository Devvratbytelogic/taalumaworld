'use client';
import React, { useEffect, useMemo, useState } from 'react'
import Button from '@/components/ui/Button';
import { useContentMode } from '@/hooks/useContentMode';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { openModal } from '@/store/slices/allModalSlice';
import { useGetAllBooksQuery } from '@/store/api/booksApi';
import { useGetAllChaptersQuery } from '@/store/api/chaptersApi';
import { useGetAuthorsQuery } from '@/store/api/authorsApi';
import { useGetCategoriesQuery } from '@/store/api/categoriesApi';
/** Array-element shape for reading progress (stored object is converted to this for UI). */
type ReadingProgressEntry = { chapterId: string; progress: number; lastRead: string };
import { SlidersHorizontal } from 'lucide-react';
import { ContinueReadingCard } from '@/components/cards/ContinueReadingCard';
import toast from '@/utils/toast';
import { Book, Chapter } from '@/data/mockData';
import { Badge } from '@/components/ui/badge';
import { ChapterCard } from '@/components/cards/ChapterCard';
import { BookCard } from '@/components/cards/BookCard';
import { FilterModal } from '@/components/modals/FilterModal';

export default function LibraryContentSection() {
    const dispatch = useAppDispatch();
    const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
    const { contentMode } = useContentMode();
    const displayMode = contentMode; // Use contentMode from the hook

    // Fetch data from API
    const { data: booksData, isLoading: booksLoading } = useGetAllBooksQuery();
    const { data: chaptersData, isLoading: chaptersLoading } = useGetAllChaptersQuery();
    const { data: authorsData, isLoading: authorsLoading } = useGetAuthorsQuery();
    const { data: categoriesData, isLoading: categoriesLoading } = useGetCategoriesQuery();

    // Memoize books and chapters to avoid unnecessary re-renders
    const books = useMemo(() => booksData || [], [booksData]);
    const chapters = useMemo(() => chaptersData || [], [chaptersData]);
    const authors = useMemo(() => authorsData || [], [authorsData]);
    const categories = useMemo(() => categoriesData || [], [categoriesData]);




    const [ownedChapters, setOwnedChapters] = useState<string[]>([]);
    const [readingProgress, setReadingProgress] = useState<ReadingProgressEntry[]>([]);
    const [loginModalAction, setLoginModalAction] = useState<'cart' | 'read' | 'view' | 'purchase'>('read');
    const [loginModalItemType, setLoginModalItemType] = useState<'chapter' | 'book'>('chapter');
    const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);
    const [currentReadingBook, setCurrentReadingBook] = useState<string | null>(null);
    const [currentReadingChapter, setCurrentReadingChapter] = useState<string | null>(null);
    const [isReading, setIsReading] = useState(false);
    const [recentlyViewed, setRecentlyViewed] = useState<string[]>([]);
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([]);
    const [selectedAuthors, setSelectedAuthors] = useState<string[]>([]);
    const [selectedBooks, setSelectedBooks] = useState<string[]>([]);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [selectedProgressFilters, setSelectedProgressFilters] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedBook, setSelectedBook] = useState<Book | null>(null);
    const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);

    // Reading handlers
    const handleStartReading = (bookId: string, chapterId: string) => {
        // Get the chapter details to check if it's free
        const chapter = chapters.find(c => c.id === chapterId);

        if (!chapter) {
            console.error('Chapter not found');
            return;
        }

        // Check 1: Free chapter + not logged in → prompt login
        if (chapter.isFree && !isAuthenticated) {
            setLoginModalAction('read');
            setLoginModalItemType('chapter');
            setPendingAction(() => () => {
                setCurrentReadingBook(bookId);
                setCurrentReadingChapter(chapterId);
                setIsReading(true);
            });
            dispatch(openModal({ componentName: 'SignIn', data: '' }));
            return;
        }

        // Check 2: Free chapter + logged in → allow reading
        if (chapter.isFree && isAuthenticated) {
            setCurrentReadingBook(bookId);
            setCurrentReadingChapter(chapterId);
            setIsReading(true);

            if (!recentlyViewed.includes(chapterId)) {
                const newRecentlyViewed = [chapterId, ...recentlyViewed.slice(0, 9)];
                setRecentlyViewed(newRecentlyViewed);
                localStorage.setItem('recently_viewed', JSON.stringify(newRecentlyViewed));
            }
            return;
        }

        // Check 3: Paid chapter + not logged in → prompt login first
        if (!chapter.isFree && !isAuthenticated) {
            setLoginModalAction('purchase');
            setLoginModalItemType('chapter');
            setPendingAction(() => () => {
                // After login, re-check if they need to purchase
                handleStartReading(bookId, chapterId);
            });
            dispatch(openModal({ componentName: 'SignIn', data: '' }));
            return;
        }

        // Check 4: Paid chapter + logged in + not purchased → show purchase requirement
        if (!chapter.isFree && !ownedChapters.includes(chapterId)) {
            // User needs to purchase this chapter
            // Navigate to chapter detail or book detail page where they can purchase
            toast.error('Purchase Required');
            return;
        }

        // Check 5: Paid chapter + logged in + purchased → allow reading
        if (!chapter.isFree && ownedChapters.includes(chapterId)) {
            setCurrentReadingBook(bookId);
            setCurrentReadingChapter(chapterId);
            setIsReading(true);

            if (!recentlyViewed.includes(chapterId)) {
                const newRecentlyViewed = [chapterId, ...recentlyViewed.slice(0, 9)];
                setRecentlyViewed(newRecentlyViewed);
                localStorage.setItem('recently_viewed', JSON.stringify(newRecentlyViewed));
            }
            return;
        }
    };



    // Save recently viewed when chapter is selected
    const handleChapterSelect = (chapter: Chapter) => {
        setSelectedChapter(chapter);
    };


    // Filter books based on selected filters
    const filteredBooks = useMemo(() => {
        return books.filter((book) => {
            // Search query filter
            if (searchQuery && !book.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
                !book.description.toLowerCase().includes(searchQuery.toLowerCase())) {
                return false;
            }

            // Category filter
            if (selectedCategories.length > 0 && !selectedCategories.includes(book.categoryId)) {
                return false;
            }

            // Author filter
            if (selectedAuthors.length > 0 && !selectedAuthors.includes(book.authorId)) {
                return false;
            }

            // Tags filter
            if (selectedTags.length > 0) {
                const bookTags = book.tags || [];
                if (!selectedTags.some(tag => bookTags.includes(tag))) {
                    return false;
                }
            }

            return true;
        });
    }, [books, searchQuery, selectedCategories, selectedAuthors, selectedTags]);

    // Filter chapters based on selected filters
    const filteredChapters = useMemo(() => {
        return chapters.filter((chapter) => {
            const book = books.find((b) => b.id === chapter.bookId);
            if (!book) return false;

            // Search query filter
            if (searchQuery && !chapter.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
                !chapter.description?.toLowerCase().includes(searchQuery.toLowerCase())) {
                return false;
            }

            // Category filter
            if (selectedCategories.length > 0 && !selectedCategories.includes(book.categoryId)) {
                return false;
            }

            // Author filter
            if (selectedAuthors.length > 0 && !selectedAuthors.includes(book.authorId)) {
                return false;
            }

            // Book filter (for chapter mode)
            if (selectedBooks.length > 0 && !selectedBooks.includes(chapter.bookId)) {
                return false;
            }

            // Tags filter (use book tags for chapter)
            if (selectedTags.length > 0) {
                const tagsToCheck = book.tags || [];
                if (!selectedTags.some(tag => tagsToCheck.includes(tag))) {
                    return false;
                }
            }

            // Progress filters
            if (selectedProgressFilters.length > 0) {
                const isOwned = ownedChapters.includes(chapter.id);
                const isFree = chapter.isFree;
                const progressEntry = readingProgress.find((p) => p.chapterId === chapter.id);
                const progress = progressEntry?.progress ?? 0;
                const isInProgress = progress > 0 && progress < 100;
                const isUnread = progress === 0;

                if (selectedProgressFilters.includes('owned') && !isOwned) return false;
                if (selectedProgressFilters.includes('purchased') && !isOwned) return false;
                if (selectedProgressFilters.includes('free') && !isFree) return false;
                if (selectedProgressFilters.includes('premium') && (isFree || isOwned)) return false;
                if (selectedProgressFilters.includes('continue') && !isInProgress) return false;
                if (selectedProgressFilters.includes('unread') && !isUnread) return false;
            }

            return true;
        });
    }, [chapters, books, searchQuery, selectedCategories, selectedAuthors, selectedBooks, selectedTags, selectedProgressFilters, ownedChapters, readingProgress]);


    // Run pending action (e.g. start reading) after user logs in
    useEffect(() => {
        if (isAuthenticated && pendingAction) {
            pendingAction();
            setPendingAction(null);
        }
    }, [isAuthenticated, pendingAction]);

    // Load owned chapters from localStorage on mount
    useEffect(() => {
        const stored = localStorage.getItem('owned_chapters');
        const storedReadingProgress = localStorage.getItem('reading_progress');

        if (stored && storedReadingProgress) {
            try {
                setOwnedChapters(JSON.parse(stored));
                const raw = JSON.parse(storedReadingProgress) as Record<string, { progress?: number; lastRead?: string }>;
                setReadingProgress(
                    Object.entries(raw).map(([chapterId, data]) => ({
                        chapterId,
                        progress: data.progress ?? 0,
                        lastRead: data.lastRead ?? new Date().toISOString(),
                    }))
                );
            } catch (e) {
                console.error('Failed to parse owned chapters or reading progress:', e);
            }
        }
    }, []);

    useEffect(() => {
        if (selectedChapter) {
            setSelectedChapter(selectedChapter);
        }
    }, [selectedChapter]);

    return (
        <>
            <div id="content-section" className="container mx-auto px-4 pt-4 pb-10">
                {/* Main Grid - Full Width */}
                <main className="w-full">
                    {/* Continue Reading Section - Chapters Mode Only */}
                    {displayMode === 'chapters' && isAuthenticated && ownedChapters.length > 0 && (() => {
                        // Filter out completed chapters (progress >= 100)
                        const inProgressChapters = chapters
                            .filter((ch) => {
                                if (!ownedChapters.includes(ch.id)) return false;

                                // Check if chapter is completed
                                const chapterProgress = readingProgress.find((p) => p.chapterId === ch.id);
                                if (chapterProgress && chapterProgress.progress > 0) {
                                    return false; // Exclude completed chapters
                                }

                                return true; // Include chapters that are not completed
                            })
                            .slice(0, 6);

                        // Only show section if there are chapters in progress
                        if (inProgressChapters.length === 0) return null;

                        return (
                            <div className="mb-6 pb-10">
                                <div className="mb-6 text-center">
                                    <h2 className="text-3xl md:text-4xl font-bold mb-3">Continue Reading</h2>
                                    <p className="text-muted-foreground mt-1 text-lg">
                                        Pick up where you left off
                                    </p>
                                </div>
                                <div className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory">
                                    {inProgressChapters.map((chapter, index) => {
                                        const book = books.find((b) => b.id === chapter.bookId);
                                        const author = book ? authors.find((a) => a.id === book.authorId) : undefined;

                                        // Get actual progress from readingProgress data
                                        const chapterProgress = readingProgress.find((p) => p.chapterId === chapter.id);
                                        const progressPercentage = chapterProgress ? Math.round(chapterProgress.progress) : 0;

                                        return (
                                            <div key={chapter.id} className="shrink-0 w-[90%] sm:w-[48%] lg:w-[30%] snap-start">
                                                <ContinueReadingCard
                                                    chapter={chapter}
                                                    book={book}
                                                    author={author}
                                                    onClick={() => {
                                                        if (book && handleStartReading) {
                                                            handleStartReading(book.id, chapter.id);
                                                        }
                                                    }}
                                                    progress={progressPercentage}
                                                />
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })()}

                    {/* Content Grid */}
                    {displayMode === 'chapters' ? (
                        <>
                            {/* Section Header */}
                            <div className="mb-6 text-center">
                                <h2 className="text-3xl md:text-4xl font-bold mb-3">Browse All Chapters</h2>
                                <p className="text-muted-foreground mt-1 text-lg">
                                    Discover stories from every genre and find your next great read
                                </p>
                            </div>

                            {/* Filter Button and Results Count */}
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-4">
                                    <Button
                                        onPress={() => setIsFilterModalOpen(true)}
                                        className="global_btn rounded_full outline_primary"
                                    >
                                        <SlidersHorizontal className="h-5 w-5" />
                                        <span>Filters</span>
                                        {(selectedCategories.length +
                                            selectedAuthors.length +
                                            selectedBooks.length +
                                            selectedTags.length +
                                            selectedProgressFilters.length) > 0 && (
                                                <Badge className="ml-1 bg-primary text-white rounded-full">
                                                    {selectedCategories.length +
                                                        selectedAuthors.length +
                                                        selectedBooks.length +
                                                        selectedTags.length +
                                                        selectedProgressFilters.length}
                                                </Badge>
                                            )}
                                    </Button>

                                    <p className="text-muted-foreground">
                                        {filteredChapters.length} chapter{filteredChapters.length !== 1 ? 's' : ''} found
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                {filteredChapters.map((chapter) => {
                                    const book = books.find((b) => b.id === chapter.bookId);
                                    const author = book ? authors.find((a) => a.id === book.authorId) : undefined;
                                    return (
                                        <ChapterCard
                                            key={chapter.id}
                                            chapter={chapter}
                                            book={book}
                                            author={author}
                                            onClick={() => handleChapterSelect(chapter)}
                                        />
                                    );
                                })}
                            </div>

                            {filteredChapters.length === 0 && (
                                <div className="text-center py-12">
                                    <p className="text-lg text-muted-foreground">
                                        No chapters found matching your criteria.
                                    </p>
                                    <Button
                                        onPress={() => {
                                            setSearchQuery('');
                                            setSelectedCategories([]);
                                            setSelectedSubcategories([]);
                                            setSelectedAuthors([]);
                                            setSelectedBooks([]);
                                            setSelectedTags([]);
                                        }}
                                        className="global_btn bg_primary"
                                    >
                                        Clear all filters
                                    </Button>
                                </div>
                            )}
                        </>
                    ) : (
                        <>
                            {/* Section Header */}
                            <div className="mb-6 text-center">
                                <h2 className="text-3xl md:text-4xl font-bold mb-3">Browse All Books</h2>
                                <p className="text-muted-foreground mt-1 text-lg">
                                    Explore complete collections and find your perfect book
                                </p>
                            </div>

                            {/* Filter Button and Results Count */}
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-4">
                                    <Button
                                        onPress={() => setIsFilterModalOpen(true)}
                                        className="global_btn outline_primary"
                                    >
                                        <SlidersHorizontal className="h-5 w-5" />
                                        <span>Filters</span>
                                        {(selectedCategories.length +
                                            selectedAuthors.length +
                                            selectedTags.length) > 0 && (
                                                <Badge className="ml-1 bg-primary text-white rounded-full">
                                                    {selectedCategories.length +
                                                        selectedAuthors.length +
                                                        selectedTags.length}
                                                </Badge>
                                            )}
                                    </Button>

                                    <p className="text-muted-foreground">
                                        {filteredBooks.length} book{filteredBooks.length !== 1 ? 's' : ''} found
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                {filteredBooks.map((book) => {
                                    const author = authors.find((a) => a.id === book.authorId);
                                    const bookChapters = chapters.filter((ch) => ch.bookId === book.id);
                                    return (
                                        <BookCard
                                            key={book.id}
                                            book={book}
                                            author={author}
                                            chaptersCount={bookChapters.length}
                                            onClick={() => setSelectedBook(book)}
                                        />
                                    );
                                })}
                            </div>

                            {filteredBooks.length === 0 && (
                                <div className="text-center py-12">
                                    <p className="text-lg text-muted-foreground">
                                        No books found matching your criteria.
                                    </p>
                                    <Button
                                        onPress={() => {
                                            setSearchQuery('');
                                            setSelectedCategories([]);
                                            setSelectedSubcategories([]);
                                            setSelectedAuthors([]);
                                            setSelectedTags([]);
                                        }}
                                        className="global_btn bg_primary"
                                    >
                                        Clear all filters
                                    </Button>
                                </div>
                            )}
                        </>
                    )}
                </main>
            </div>

            {/* Filter Modal */}
            <FilterModal
                isOpen={isFilterModalOpen}
                onClose={() => setIsFilterModalOpen(false)}
                displayMode={displayMode}
                categories={categories}
                authors={authors}
                books={books}
                selectedCategories={selectedCategories}
                selectedAuthors={selectedAuthors}
                selectedBooks={selectedBooks}
                selectedTags={selectedTags}
                onCategoryChange={setSelectedCategories}
                onAuthorChange={setSelectedAuthors}
                onBookChange={setSelectedBooks}
                onTagChange={setSelectedTags}
                selectedProgressFilters={selectedProgressFilters}
                onProgressFilterChange={setSelectedProgressFilters}
            />
        </>
    )
}
