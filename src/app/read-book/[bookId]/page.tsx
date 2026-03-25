'use client';
import { useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { X, Lock, BookOpen, ChevronRight, ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import Button from '@/components/ui/Button';
import { useGetSingleBookQuery } from '@/store/rtkQueries/userGetAPI';
import type { ISingleBookAPIResponseData, IBookChapterItem } from '@/types/user/singleBook';
import ReadChapterPageSkeleton from '@/components/skeleton-loader/ReadChapterPageSkeleton';
import { getHomeRoutePath, getReadChapterRoutePath } from '@/routes/routes';
import AddToCartButton from '@/components/ui/AddToCartButton';
import { useAuth } from '@/hooks/useAuth';
import { useDispatch } from 'react-redux';
import { openModal } from '@/store/slices/allModalSlice';

export default function BookReadPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const { isAuthenticated } = useAuth();
  const bookId = params?.bookId as string | undefined;

  const { data: bookResponse, isLoading } = useGetSingleBookQuery(bookId!, { skip: !bookId });

  const book: ISingleBookAPIResponseData | null = bookResponse?.data ?? null;

  const isFullBook = book?.pricingModel === 'book';
  const needsBookPurchase = isFullBook && !book?.isPurchased && (book?.price ?? 0) > 0;

  const chapters = useMemo((): IBookChapterItem[] => {
    if (!book?.chapters?.length) return [];
    return [...book.chapters].sort((a, b) => a.number - b.number);
  }, [book]);

  const onClose = () => router.push(getHomeRoutePath());

  const handleChapterClick = (chapter: IBookChapterItem) => {
    if (!chapter.canRead) return;
    router.push(getReadChapterRoutePath(chapter._id));
  };

  const handleLoginRequired = () => {
    dispatch(openModal({ componentName: 'LoginRequiredModal', data: { action: 'cart', itemType: 'book' } }));
  };

  if (isLoading || !bookId) {
    return (
      <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
        <ReadChapterPageSkeleton />
      </div>
    );
  }

  if (!book) {
    return (
      <div className="fixed inset-0 bg-background flex items-center justify-center z-50">
        <div className="bg-white rounded-3xl p-8 max-w-md text-center">
          <p className="text-lg font-semibold mb-4">Book not found</p>
          <Button onPress={onClose} className="global_btn rounded_full outline_primary">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-3">
          <Button
            onPress={onClose}
            className="global_btn rounded_full outline_primary fit_btn"
            isIconOnly
          >
            <X className="h-5 w-5" />
          </Button>
          <div className="min-w-0 flex-1">
            <h1 className="font-semibold text-sm truncate">{book.title}</h1>
            <p className="text-xs text-muted-foreground truncate">
              {book.author} • {chapters.length} chapter{chapters.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
      </div>

      {/* Chapter List */}
      <div className="flex-1 overflow-y-auto" style={needsBookPurchase ? { paddingBottom: '5rem' } : undefined}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">

          {/* Book summary */}
          <div className="flex items-start gap-4 mb-8 p-4 bg-accent/30 rounded-2xl">
            {book.coverImage && (
              <div className="relative w-16 h-24 shrink-0 rounded-lg overflow-hidden shadow-sm">
                <Image src={book.coverImage} alt={book.title} fill className="object-cover" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h2 className="font-bold text-lg leading-tight mb-1">{book.title}</h2>
              <p className="text-sm text-muted-foreground mb-2">{book.author}</p>
              {book.description && (
                <p className="text-muted-foreground line-clamp-3">{book.description}</p>
              )}
            </div>
          </div>

          {/* Section heading */}
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="h-4 w-4 text-primary" />
            <h3 className="font-semibold text-sm">All Chapters</h3>
            <span className="ml-auto text-xs text-muted-foreground">{chapters.length} total</span>
          </div>

          {/* Chapter cards */}
          {chapters.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground text-sm">
              No chapters available yet.
            </div>
          ) : (
            <div className="space-y-3">
              {chapters.map((chapter) => {
                const isLocked = !chapter.canRead;
                return (
                  <div
                    key={chapter._id}
                    role="button"
                    tabIndex={0}
                    onClick={() => handleChapterClick(chapter)}
                    onKeyDown={(e) => e.key === 'Enter' && handleChapterClick(chapter)}
                    className={`w-full text-left p-4 rounded-2xl border border-border bg-white transition-all duration-200 flex items-center gap-4 ${isLocked ? 'opacity-60 cursor-not-allowed' : 'hover:border-primary/40 hover:shadow-sm cursor-pointer'}`}
                  >
                    {/* Chapter number badge */}
                    <div className="shrink-0 w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">
                      {chapter.number}
                    </div>

                    {/* Chapter info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="font-medium text-sm truncate">{chapter.title}</p>
                        {chapter.isFree && (
                          <span className="shrink-0 text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full">
                            Free
                          </span>
                        )}
                      </div>
                      {chapter.description && (
                        <p className="text-xs text-muted-foreground line-clamp-2">{chapter.description}</p>
                      )}
                      {/* For chapter-pricing books only, show individual chapter price */}
                      {!isFullBook && !chapter.isFree && chapter.price > 0 && (
                        <p className="text-xs text-primary font-medium mt-0.5">${chapter.price}</p>
                      )}
                    </div>

                    {/* Right icon */}
                    <div className="shrink-0">
                      {isLocked ? (
                        <Lock className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>
      </div>

      {/* Sticky "Buy Complete Book" footer — only for book-level pricing */}
      {needsBookPurchase && (
        <div className="absolute bottom-0 left-0 right-0 bg-white border-t px-4 py-3 flex items-center gap-4">
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm tracking-tight">Unlock all {chapters.length} chapters</p>
            <p className="text-xs text-muted-foreground">One-time purchase · ${book!.price.toFixed(2)}</p>
          </div>
          {!isAuthenticated ? (
            <Button
              className="global_btn rounded_full bg_primary shrink-0"
              onPress={handleLoginRequired}
              startContent={<ShoppingCart className="h-4 w-4" />}
            >
              Buy Book · ${book!.price.toFixed(2)}
            </Button>
          ) : (
            <AddToCartButton
              chapterId={book!.id}
              bookId={book!.id}
              type="book"
              price={book!.price}
              className="global_btn rounded_full bg_primary shrink-0"
              label={`Buy Book · $${book!.price.toFixed(2)}`}
            />
          )}
        </div>
      )}
    </div>
  );
}
