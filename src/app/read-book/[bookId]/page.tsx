'use client';
import { useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { X, Lock, BookOpen, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Button from '@/components/ui/Button';
import { useGetSingleBookQuery } from '@/store/rtkQueries/userGetAPI';
import type { ISingleBookAPIResponseData, IBookChapterItem } from '@/types/user/singleBook';
import ReadChapterPageSkeleton from '@/components/skeleton-loader/ReadChapterPageSkeleton';
import { getHomeRoutePath, getReadChapterRoutePath } from '@/routes/routes';

export default function BookReadPage() {
  const params = useParams();
  const router = useRouter();
  const bookId = params?.bookId as string | undefined;

  const { data: bookResponse, isLoading } = useGetSingleBookQuery(bookId!, { skip: !bookId });

  const book: ISingleBookAPIResponseData | null = bookResponse?.data ?? null;

  const chapters = useMemo((): IBookChapterItem[] => {
    if (!book?.chapters?.length) return [];
    return [...book.chapters].sort((a, b) => a.number - b.number);
  }, [book]);

  const onClose = () => router.push(getHomeRoutePath());

  const handleChapterClick = (chapter: IBookChapterItem) => {
    router.push(getReadChapterRoutePath(chapter._id));
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
      <div className="flex-1 overflow-y-auto">
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
                <p className="text-xs text-muted-foreground line-clamp-3">{book.description}</p>
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
                const isLocked = !chapter.isFree && !book.isPurchased;
                return (
                  <div
                    key={chapter._id}
                    role="button"
                    tabIndex={0}
                    onClick={() => handleChapterClick(chapter)}
                    onKeyDown={(e) => e.key === 'Enter' && handleChapterClick(chapter)}
                    className="w-full text-left p-4 rounded-2xl border border-border bg-white hover:border-primary/40 hover:shadow-sm cursor-pointer transition-all duration-200 flex items-center gap-4"
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
                      {!chapter.isFree && chapter.price > 0 && (
                        <p className="text-xs text-primary font-medium mt-0.5">₹{chapter.price}</p>
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
    </div>
  );
}
