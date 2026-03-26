'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import Button from '@/components/ui/Button';
import { useGetSingleBookQuery, useGetSingleChapterQuery } from '@/store/rtkQueries/userGetAPI';
import type { IBookChapterItem } from '@/types/user/singleBook';
import MarkdownContent from '@/components/ui/MarkdownContent';
import dynamic from 'next/dynamic';

const PdfViewer = dynamic(() => import('@/components/ui/PdfViewer'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center py-16">
      <p className="text-muted-foreground text-sm animate-pulse">Loading PDF…</p>
    </div>
  ),
});
import ReadChapterPageSkeleton from '@/components/skeleton-loader/ReadChapterPageSkeleton';
import { openModal } from '@/store/slices/allModalSlice';
import { getHomeRoutePath, getReadChapterRoutePath } from '@/routes/routes';
import { useUpdateReadingProgressMutation } from '@/store/rtkQueries/userPostAPI';

export default function ReadChapterPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const chapterId = params?.chapterId as string | undefined;

  const { data: chapterResponse, isLoading } = useGetSingleChapterQuery(chapterId!, { skip: !chapterId });

  const currentChapter = chapterResponse?.data ?? null;
  const book = currentChapter ? { title: currentChapter.bookTitle } : null;
  const isLocked = !currentChapter?.canRead;

  const { data: bookResponse } = useGetSingleBookQuery(currentChapter?.bookId!, { skip: !currentChapter?.bookId });
  // Map API shape to the Chapter type expected by ChapterPurchaseModal
  const chapterForModal = currentChapter
    ? {
      _id: currentChapter.chapterId,
      id: currentChapter.chapterId,
      number: currentChapter.chapterNumber,
      title: currentChapter.title,
      description: currentChapter.description,
      content: currentChapter.content,
      isFree: currentChapter.isFree,
      price: currentChapter.price,
      coverImage: currentChapter.coverImage,
      type: currentChapter.type,
      status: 'published',
    }
    : null;

  // Open purchase modal when landing on a locked chapter
  useEffect(() => {
    if (currentChapter && isLocked) {
      dispatch(
        openModal({
          componentName: 'ChapterPurchaseModal',
          data: { chapter: chapterForModal, book, closeBehavior: 'goBack' },
        })
      );
    }
  }, [currentChapter, isLocked]);

  // All chapters from the same book, sorted by chapter number
  const bookChapters = useMemo((): IBookChapterItem[] => {
    if (!bookResponse?.data?.chapters?.length) return [];
    return [...bookResponse.data.chapters].sort((a, b) => a.number - b.number);
  }, [bookResponse]);

  const currentIndex = bookChapters.findIndex((c) => c._id === chapterId);

  const hasPdf = !!currentChapter?.pdf;

  const [showControls, setShowControls] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);

  const [updateReadingProgress] = useUpdateReadingProgressMutation();
  const hasMarkedStarted = useRef(false);
  const hasMarkedCompleted = useRef(false);
  const lastSavedPercentage = useRef(-1);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Mark chapter as in-progress when it first loads
  useEffect(() => {
    if (chapterId && currentChapter && !isLocked && !hasMarkedStarted.current) {
      hasMarkedStarted.current = true;
      hasMarkedCompleted.current = false;
      lastSavedPercentage.current = 0;
      updateReadingProgress({ chapterId, lastPageRead: 0, percentage: 0, completed: false });
    }
  }, [chapterId, currentChapter, isLocked]);

  const onClose = () => {
    router.push(getHomeRoutePath());
  };

  const resetProgressRefs = () => {
    setScrollProgress(0);
    hasMarkedStarted.current = false;
    hasMarkedCompleted.current = false;
    lastSavedPercentage.current = -1;
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
  };

  const handlePreviousChapter = () => {
    const prev = bookChapters[currentIndex - 1];
    if (prev) {
      resetProgressRefs();
      router.push(getReadChapterRoutePath(prev._id));
    }
  };

  const handleNextChapter = () => {
    const next = bookChapters[currentIndex + 1];
    if (next) {
      resetProgressRefs();
      router.push(getReadChapterRoutePath(next._id));
    }
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const scrolled = target.scrollTop;
    const maxScroll = target.scrollHeight - target.clientHeight;
    const progress = maxScroll > 0 ? (scrolled / maxScroll) * 100 : 0;
    const rounded = Math.round(progress);
    setScrollProgress(progress);

    if (!chapterId) return;

    // Mark completed once when scroll reaches 100%
    if (progress >= 100 && !hasMarkedCompleted.current) {
      hasMarkedCompleted.current = true;
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      lastSavedPercentage.current = 100;
      updateReadingProgress({ chapterId, lastPageRead: 1, percentage: 100, completed: true });
      return;
    }

    // Stop all further saves once completed — prevents overwriting completed: true
    if (hasMarkedCompleted.current) return;

    // Save progress every 20% increment via debounce (300ms after scroll stops)
    const threshold = Math.floor(rounded / 20) * 20;
    if (threshold > lastSavedPercentage.current) {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      saveTimerRef.current = setTimeout(() => {
        lastSavedPercentage.current = threshold;
        updateReadingProgress({ chapterId, lastPageRead: 0, percentage: threshold, completed: false });
      }, 300);
    }
  };

  const canGoPrevious = currentIndex > 0;
  const canGoNext = currentIndex < bookChapters.length - 1;

  if (isLoading || !chapterId) {
    return <div className='fixed inset-0 bg-white z-50 flex items-center justify-center'><ReadChapterPageSkeleton /></div>;
  }

  if (!currentChapter) {
    return (
      <div className="fixed inset-0 bg-background flex items-center justify-center z-50">
        <div className="bg-white rounded-3xl p-8 max-w-md text-center">
          <p className="text-lg font-semibold mb-4">Chapter not found</p>
          <Button onPress={onClose} className="global_btn rounded_full outline_primary">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  if (isLocked) {
    return <div className="fixed inset-0 bg-background z-40" />;
  }

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      {/* Header */}
      <div
        className={`bg-white border-b transition-transform duration-300 ${showControls ? 'translate-y-0' : '-translate-y-full'
          }`}
      >
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <Button
              onPress={onClose}
              className="global_btn rounded_full outline_primary fit_btn"
              isIconOnly
            >
              <X className="h-5 w-5" />
            </Button>
            <div className="min-w-0 flex-1">
              <h1 className="font-semibold text-sm truncate">
                {currentChapter.title}
              </h1>
              {book && (
                <p className="text-sm text-muted-foreground truncate">
                  {book.title} • Chapter {currentChapter.chapterNumber}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-1 bg-accent">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${scrollProgress}%` }}
          />
        </div>
      </div>

      {/* Reading Content */}
      <div
        className="flex-1 overflow-y-auto scroll-smooth"
        onClick={() => setShowControls(!showControls)}
        onScroll={handleScroll}
      >
        <div className="max-w-3xl mx-auto px-6 sm:px-8 py-12">
          {/* Chapter Title */}
          <div className="mb-10 text-center">
            <div className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-sm mb-3">
              Chapter {currentChapter.chapterNumber}
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-3">{currentChapter.title}</h1>
            {currentChapter.description && (
              <p className="text-muted-foreground text-base">{currentChapter.description}</p>
            )}
          </div>

          {/* Chapter Content */}
          {hasPdf ? (
            <PdfViewer url={currentChapter.pdf!} title={currentChapter.title} />
          ) : (
            <MarkdownContent
              content={currentChapter.content}
              emptyMessage="No content available for this chapter."
            />
          )}

          {/* End of Chapter */}
          {canGoNext && (
            <div className="mt-16 mb-8 text-center">
              <div className="inline-block border-t border-border w-32 mb-6" />
              <p className="text-sm text-muted-foreground mb-4">
                End of Chapter {currentChapter.chapterNumber}
              </p>
              <Button onPress={handleNextChapter} className="global_btn rounded_full bg_primary">
                Continue to Next Chapter
              </Button>
            </div>
          )}

          {!canGoNext && (
            <div className="mt-16 mb-8 text-center">
              <div className="inline-block border-t border-border w-32 mb-6" />
              <p className="text-sm text-muted-foreground">
                You&apos;ve reached the end of available chapters
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Controls */}
      <div
        className={`bg-white border-t transition-transform duration-300 ${showControls ? 'translate-y-0' : 'translate-y-full'
          }`}
      >
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Button
            onPress={handlePreviousChapter}
            isDisabled={!canGoPrevious}
            className='global_btn rounded_full outline_primary'
            startContent={<ChevronLeft className="h-4 w-4" />}
          >
            Previous Chapter
          </Button>

          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Chapter</span>
            <span className="font-semibold">{currentChapter.chapterNumber}</span>
            {bookChapters.length > 0 && (
              <>
                <span className="text-muted-foreground">of</span>
                <span className="font-semibold">{bookChapters.length}</span>
              </>
            )}
          </div>

          <Button
            onPress={handleNextChapter}
            isDisabled={!canGoNext}
            className="global_btn rounded_full bg_primary"
            endContent={<ChevronRight className="h-4 w-4" />}
          >
            Next Chapter
          </Button>
        </div>
      </div>

    </div>
  );
}
