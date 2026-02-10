import { useState, useEffect } from 'react';
import { X, SlidersHorizontal, BookOpen, BookMarked, Gift, CheckCircle, FileText, Sparkles } from 'lucide-react';
import Button from '@/components/ui/Button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Divider } from '@heroui/react';
import type { Category, Author, Book } from '../../data/mockData';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  displayMode: 'chapters' | 'books';

  // Books mode filters
  categories?: Category[];
  authors?: Author[];
  books?: Book[];
  selectedCategories?: string[];
  selectedAuthors?: string[];
  selectedBooks?: string[];
  selectedTags?: string[];
  onCategoryChange?: (categories: string[]) => void;
  onAuthorChange?: (authors: string[]) => void;
  onBookChange?: (books: string[]) => void;
  onTagChange?: (tags: string[]) => void;

  // Chapters mode filters
  selectedProgressFilters?: string[];
  onProgressFilterChange?: (filters: string[]) => void;
}

export function FilterModal({
  isOpen,
  onClose,
  displayMode,
  categories = [],
  authors = [],
  books = [],
  selectedCategories = [],
  selectedAuthors = [],
  selectedBooks = [],
  selectedTags = [],
  onCategoryChange = () => { },
  onAuthorChange = () => { },
  onBookChange = () => { },
  onTagChange = () => { },
  selectedProgressFilters = [],
  onProgressFilterChange = () => { },
}: FilterModalProps) {
  // Local state for temporary filter selections
  const [tempCategories, setTempCategories] = useState<string[]>(selectedCategories);
  const [tempAuthors, setTempAuthors] = useState<string[]>(selectedAuthors);
  const [tempBooks, setTempBooks] = useState<string[]>(selectedBooks);
  const [tempTags, setTempTags] = useState<string[]>(selectedTags);
  const [tempProgressFilters, setTempProgressFilters] = useState<string[]>(selectedProgressFilters);

  // Update local state when props change
  useEffect(() => {
    setTempCategories(selectedCategories);
    setTempAuthors(selectedAuthors);
    setTempBooks(selectedBooks);
    setTempTags(selectedTags);
    setTempProgressFilters(selectedProgressFilters);
  }, [selectedCategories, selectedAuthors, selectedBooks, selectedTags, selectedProgressFilters]);

  // Progress-based filter options for Chapters Mode
  const progressFilters = [
    { id: 'continue', label: 'Continue Reading', icon: BookOpen, description: 'Chapters you started' },
    { id: 'unread', label: 'Unread Chapters', icon: BookMarked, description: 'New chapters to explore' },
    { id: 'free', label: 'Free to Read', icon: Gift, description: 'Free chapters available' },
    { id: 'purchased', label: 'Purchased', icon: CheckCircle, description: 'Chapters you own' },
  ];

  // Get all unique tags from books
  const allTags = Array.from(
    new Set(books.flatMap((book) => book.tags))
  ).sort();

  const handleProgressFilterToggle = (filterId: string) => {
    if (tempProgressFilters.includes(filterId)) {
      setTempProgressFilters(tempProgressFilters.filter((id) => id !== filterId));
    } else {
      setTempProgressFilters([...tempProgressFilters, filterId]);
    }
  };

  const handleCategoryToggle = (categoryId: string) => {
    if (tempCategories.includes(categoryId)) {
      setTempCategories(tempCategories.filter((id) => id !== categoryId));
    } else {
      setTempCategories([...tempCategories, categoryId]);
    }
  };

  const handleAuthorToggle = (authorId: string) => {
    if (tempAuthors.includes(authorId)) {
      setTempAuthors(tempAuthors.filter((id) => id !== authorId));
    } else {
      setTempAuthors([...tempAuthors, authorId]);
    }
  };

  const handleBookToggle = (bookId: string) => {
    if (tempBooks.includes(bookId)) {
      setTempBooks(tempBooks.filter((id) => id !== bookId));
    } else {
      setTempBooks([...tempBooks, bookId]);
    }
  };

  const handleTagToggle = (tag: string) => {
    if (tempTags.includes(tag)) {
      setTempTags(tempTags.filter((t) => t !== tag));
    } else {
      setTempTags([...tempTags, tag]);
    }
  };

  const handleApply = () => {
    if (displayMode === 'chapters') {
      onProgressFilterChange(tempProgressFilters);
    } else {
      onCategoryChange(tempCategories);
      onAuthorChange(tempAuthors);
      onBookChange(tempBooks);
      onTagChange(tempTags);
    }
    onClose();
  };

  const handleReset = () => {
    setTempCategories([]);
    setTempAuthors([]);
    setTempBooks([]);
    setTempTags([]);
    setTempProgressFilters([]);

    if (displayMode === 'chapters') {
      onProgressFilterChange([]);
    } else {
      onCategoryChange([]);
      onAuthorChange([]);
      onBookChange([]);
      onTagChange([]);
    }
  };

  const activeFilterCount = displayMode === 'chapters'
    ? tempProgressFilters.length
    : tempCategories.length + tempAuthors.length + tempBooks.length + tempTags.length;

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-250 animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-250 flex items-center justify-center p-4">
        <div
          className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-full">
                <SlidersHorizontal className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-bold tracking-tight">
                  Filter {displayMode === 'chapters' ? 'Chapters' : 'Books'}
                </h2>
                {activeFilterCount > 0 && (
                  <p className="text-sm text-muted-foreground">
                    {activeFilterCount} filter{activeFilterCount !== 1 ? 's' : ''} active
                  </p>
                )}
              </div>
            </div>
            <Button
              onPress={onClose}
              className="global_btn outline_primary rounded_full rounded_btn_sm"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Content */}
          <div className="overflow-y-auto max-h-[calc(90vh-180px)] p-6">
            {displayMode === 'chapters' ? (
              // Chapters Mode Filters
              <div className="space-y-4">
                <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <FileText className="h-4 w-4 text-primary" />
                    <span className="font-semibold text-sm text-primary tracking-tight">Reading Progress</span>
                  </div>
                  <p className="text-xs text-muted-foreground tracking-tight">
                    Filter chapters based on your reading journey
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {progressFilters.map((filter) => {
                    const Icon = filter.icon;
                    return (
                      <div
                        key={filter.id}
                        className={`flex items-start space-x-3 p-4 rounded-2xl border-2 transition-all cursor-pointer ${tempProgressFilters.includes(filter.id)
                            ? 'bg-primary/5 border-primary/30'
                            : 'bg-background border-border hover:border-primary/20'
                          }`}
                        onClick={() => handleProgressFilterToggle(filter.id)}
                      >
                        <Checkbox
                          id={`progress-${filter.id}`}
                          checked={tempProgressFilters.includes(filter.id)}
                          onCheckedChange={() => handleProgressFilterToggle(filter.id)}
                          className="rounded-md mt-0.5"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <Icon className="h-4 w-4 text-primary" />
                            <label
                              htmlFor={`progress-${filter.id}`}
                              className="text-sm font-medium cursor-pointer tracking-tight"
                            >
                              {filter.label}
                            </label>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1 tracking-tight">
                            {filter.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              // Books Mode Filters
              <div className="space-y-6">
                <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Sparkles className="h-4 w-4 text-primary" />
                    <span className="font-semibold text-sm text-primary tracking-tight">Discover & Explore</span>
                  </div>
                  <p className="text-xs text-muted-foreground tracking-tight">
                    Find books by category, author, or genre
                  </p>
                </div>

                {/* Categories */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-sm tracking-tight flex items-center gap-2">
                    <span className="bg-primary/10 text-primary px-2 py-1 rounded-lg text-xs">
                      {tempCategories.length}
                    </span>
                    Categories
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {categories.map((category) => (
                      <div
                        key={category.id}
                        className={`flex items-center space-x-2 p-3 rounded-xl border transition-all cursor-pointer ${tempCategories.includes(category.id)
                            ? 'bg-primary/5 border-primary/30'
                            : 'border-border hover:border-primary/20'
                          }`}
                        onClick={() => handleCategoryToggle(category.id)}
                      >
                        <Checkbox
                          id={`cat-${category.id}`}
                          checked={tempCategories.includes(category.id)}
                          onCheckedChange={() => handleCategoryToggle(category.id)}
                          className="rounded-md"
                        />
                        <label
                          htmlFor={`cat-${category.id}`}
                          className="text-sm cursor-pointer tracking-tight flex-1"
                        >
                          {category.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <Divider />

                {/* Authors */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-sm tracking-tight flex items-center gap-2">
                    <span className="bg-primary/10 text-primary px-2 py-1 rounded-lg text-xs">
                      {tempAuthors.length}
                    </span>
                    Authors
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                    {authors.map((author) => (
                      <div
                        key={author.id}
                        className={`flex items-center space-x-2 p-3 rounded-xl border transition-all cursor-pointer ${tempAuthors.includes(author.id)
                            ? 'bg-primary/5 border-primary/30'
                            : 'border-border hover:border-primary/20'
                          }`}
                        onClick={() => handleAuthorToggle(author.id)}
                      >
                        <Checkbox
                          id={`author-${author.id}`}
                          checked={tempAuthors.includes(author.id)}
                          onCheckedChange={() => handleAuthorToggle(author.id)}
                          className="rounded-md"
                        />
                        <label
                          htmlFor={`author-${author.id}`}
                          className="text-sm cursor-pointer tracking-tight flex-1"
                        >
                          {author.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <Divider />

                {/* Tags/Genres */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-sm tracking-tight flex items-center gap-2">
                    <span className="bg-primary/10 text-primary px-2 py-1 rounded-lg text-xs">
                      {tempTags.length}
                    </span>
                    Genres & Topics
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {allTags.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => handleTagToggle(tag)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all tracking-tight ${tempTags.includes(tag)
                            ? 'bg-primary text-white'
                            : 'bg-accent hover:bg-accent/80 border border-border'
                          }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between gap-3 p-6 border-t bg-gray-50">
            <Button
              onPress={handleReset}
              disabled={activeFilterCount === 0}
              className="global_btn outline_primary rounded_full w_fit"
            >
              Reset All
            </Button>
            <div className="flex gap-2">
              <Button
                onPress={onClose}
                className="global_btn outline_primary rounded_full w_fit"
              >
                Cancel
              </Button>
              <Button
                onPress={handleApply}
                className="global_btn bg_primary rounded_full w_fit"
              >
                Apply Filters
                {activeFilterCount > 0 && (
                  <Badge className="ml-2 bg-white text-primary rounded-full">
                    {activeFilterCount}
                  </Badge>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
