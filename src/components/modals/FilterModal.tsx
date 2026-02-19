import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { X, SlidersHorizontal, BookOpen, BookMarked, Gift, CheckCircle, FileText, Sparkles } from 'lucide-react';
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@heroui/react';
import Button from '@/components/ui/Button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Divider } from '@heroui/react';
import { closeModal } from '@/store/slices/allModalSlice';
import { RootState } from '@/store/store';
import { categories, authors, books } from '@/data/mockData';
import type { Category, Author, Book } from '@/data/mockData';

const PARAM_KEYS = {
  categories: 'categories',
  authors: 'authors',
  books: 'books',
  tags: 'tags',
  progress: 'progress',
} as const;

function parseArrayParam(value: string | null): string[] {
  if (!value) return [];
  return value.split(',').filter(Boolean);
}

function buildSearchParams(
  params: URLSearchParams,
  updates: { categories?: string[]; authors?: string[]; books?: string[]; tags?: string[]; progress?: string[] }
): URLSearchParams {
  const next = new URLSearchParams(params);
  Object.entries(updates).forEach(([key, values]) => {
    if (values && values.length > 0) {
      next.set(PARAM_KEYS[key as keyof typeof PARAM_KEYS], values.join(','));
    } else {
      next.delete(PARAM_KEYS[key as keyof typeof PARAM_KEYS]);
    }
  });
  return next;
}

interface FilterModalData {
  displayMode?: 'chapters' | 'books';
}

export default function FilterModal() {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { isOpen, data } = useSelector((state: RootState) => state.allModal);

  const modalData = (data || {}) as FilterModalData;
  const displayMode = modalData.displayMode ?? 'chapters';

  const [tempCategories, setTempCategories] = useState<string[]>([]);
  const [tempAuthors, setTempAuthors] = useState<string[]>([]);
  const [tempBooks, setTempBooks] = useState<string[]>([]);
  const [tempTags, setTempTags] = useState<string[]>([]);
  const [tempProgressFilters, setTempProgressFilters] = useState<string[]>([]);

  useEffect(() => {
    if (!isOpen) return;
    setTempCategories(parseArrayParam(searchParams.get(PARAM_KEYS.categories)));
    setTempAuthors(parseArrayParam(searchParams.get(PARAM_KEYS.authors)));
    setTempBooks(parseArrayParam(searchParams.get(PARAM_KEYS.books)));
    setTempTags(parseArrayParam(searchParams.get(PARAM_KEYS.tags)));
    setTempProgressFilters(parseArrayParam(searchParams.get(PARAM_KEYS.progress)));
  }, [isOpen, searchParams]);

  const progressFilters = [
    { id: 'continue', label: 'Continue Reading', icon: BookOpen, description: 'Chapters you started' },
    { id: 'unread', label: 'Unread Chapters', icon: BookMarked, description: 'New chapters to explore' },
    { id: 'free', label: 'Free to Read', icon: Gift, description: 'Free chapters available' },
    { id: 'purchased', label: 'Purchased', icon: CheckCircle, description: 'Chapters you own' },
  ];

  const allTags = Array.from(new Set(books.flatMap((b: Book) => b.tags))).sort();

  const handleProgressFilterToggle = (filterId: string) => {
    setTempProgressFilters((prev) =>
      prev.includes(filterId) ? prev.filter((id) => id !== filterId) : [...prev, filterId]
    );
  };

  const handleCategoryToggle = (categoryId: string) => {
    setTempCategories((prev) =>
      prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId]
    );
  };

  const handleAuthorToggle = (authorId: string) => {
    setTempAuthors((prev) =>
      prev.includes(authorId) ? prev.filter((id) => id !== authorId) : [...prev, authorId]
    );
  };

  const handleTagToggle = (tag: string) => {
    setTempTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleApply = () => {
    const next = buildSearchParams(searchParams, {
      categories: tempCategories,
      authors: tempAuthors,
      books: tempBooks,
      tags: tempTags,
      progress: tempProgressFilters,
    });
    router.replace(`${pathname}${next.toString() ? `?${next.toString()}` : ''}`);
    dispatch(closeModal());
  };

  const handleReset = () => {
    setTempCategories([]);
    setTempAuthors([]);
    setTempBooks([]);
    setTempTags([]);
    setTempProgressFilters([]);
    const next = buildSearchParams(searchParams, {
      categories: [],
      authors: [],
      books: [],
      tags: [],
      progress: [],
    });
    router.replace(`${pathname}${next.toString() ? `?${next.toString()}` : ''}`);
  };

  const activeFilterCount =
    displayMode === 'chapters'
      ? tempProgressFilters.length
      : tempCategories.length + tempAuthors.length + tempBooks.length + tempTags.length;

  return (
    <Modal isOpen={isOpen} onClose={() => dispatch(closeModal())} className="modal_container" size="2xl">
      <ModalContent>
        <ModalHeader className="flex flex-row items-center justify-between gap-3 p-6 border-b">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-full">
              <SlidersHorizontal className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight">
                Filter {displayMode === 'chapters' ? 'Chapters' : 'Books'}
              </h2>
              <div className="text-sm font-normal text-muted-foreground">
                {activeFilterCount > 0 && (
                  <p>{activeFilterCount} filter{activeFilterCount !== 1 ? 's' : ''} active</p>
                )}
              </div>
            </div>
          </div>
        </ModalHeader>

        <ModalBody className="overflow-y-auto max-h-[calc(90vh-220px)] p-6">
          {displayMode === 'chapters' ? (
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
                          <label htmlFor={`progress-${filter.id}`} className="text-sm font-medium cursor-pointer tracking-tight">
                            {filter.label}
                          </label>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 tracking-tight">{filter.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
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
              <div className="space-y-3">
                <h4 className="font-semibold text-sm tracking-tight flex items-center gap-2">
                  <span className="bg-primary/10 text-primary px-2 py-1 rounded-lg text-xs">{tempCategories.length}</span>
                  Categories
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {categories.map((category: Category) => (
                    <div
                      key={category.id}
                      className={`flex items-center space-x-2 p-3 rounded-xl border transition-all cursor-pointer ${tempCategories.includes(category.id) ? 'bg-primary/5 border-primary/30' : 'border-border hover:border-primary/20'
                        }`}
                      onClick={() => handleCategoryToggle(category.id)}
                    >
                      <Checkbox
                        id={`cat-${category.id}`}
                        checked={tempCategories.includes(category.id)}
                        onCheckedChange={() => handleCategoryToggle(category.id)}
                        className="rounded-md"
                      />
                      <label htmlFor={`cat-${category.id}`} className="text-sm cursor-pointer tracking-tight flex-1">
                        {category.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              <Divider />
              <div className="space-y-3">
                <h4 className="font-semibold text-sm tracking-tight flex items-center gap-2">
                  <span className="bg-primary/10 text-primary px-2 py-1 rounded-lg text-xs">{tempAuthors.length}</span>
                  Authors
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                  {authors.map((author: Author) => (
                    <div
                      key={author.id}
                      className={`flex items-center space-x-2 p-3 rounded-xl border transition-all cursor-pointer ${tempAuthors.includes(author.id) ? 'bg-primary/5 border-primary/30' : 'border-border hover:border-primary/20'
                        }`}
                      onClick={() => handleAuthorToggle(author.id)}
                    >
                      <Checkbox
                        id={`author-${author.id}`}
                        checked={tempAuthors.includes(author.id)}
                        onCheckedChange={() => handleAuthorToggle(author.id)}
                        className="rounded-md"
                      />
                      <label htmlFor={`author-${author.id}`} className="text-sm cursor-pointer tracking-tight flex-1">
                        {author.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              <Divider />
              <div className="space-y-3">
                <h4 className="font-semibold text-sm tracking-tight flex items-center gap-2">
                  <span className="bg-primary/10 text-primary px-2 py-1 rounded-lg text-xs">{tempTags.length}</span>
                  Genres & Topics
                </h4>
                <div className="flex flex-wrap gap-2">
                  {allTags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => handleTagToggle(tag)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all tracking-tight ${tempTags.includes(tag) ? 'bg-primary text-white' : 'bg-accent hover:bg-accent/80 border border-border'
                        }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </ModalBody>
        <ModalFooter className="flex items-center justify-between gap-3 p-6 border-t bg-gray-50">
          <Button
            onPress={handleReset}
            disabled={activeFilterCount === 0}
            className="global_btn outline_primary rounded_full w_fit"
          >
            Reset All
          </Button>
          <div className="flex gap-2">
            <Button onPress={() => dispatch(closeModal())} className="global_btn outline_primary rounded_full w_fit">
              Cancel
            </Button>
            <Button
              onPress={handleApply}
              className="global_btn bg_primary rounded_full w_fit"
            >
              Apply Filters
              {activeFilterCount > 0 && (
                <Badge className="ml-2 bg-white text-primary rounded-full">{activeFilterCount}</Badge>
              )}
            </Button>
          </div>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
