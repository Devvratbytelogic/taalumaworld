'use client';
import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import Button from '@/components/ui/Button';
import { useGetAllChaptersQuery, useGetSingleChapterQuery } from '@/store/rtkQueries/userGetAPI';
import MarkdownContent from '@/components/ui/MarkdownContent';
import { openModal } from '@/store/slices/allModalSlice';
import { RootState } from '@/store/store';
import type { Chapter } from '@/types/content';

export default function ReadChapterPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const chapterId = params?.chapterId as string | undefined;
  const { isOpen, componentName } = useSelector((state: RootState) => state.allModal);

  const { data: chapterResponse, isLoading } = useGetSingleChapterQuery(chapterId!, { skip: !chapterId });
  const { data: allChaptersResponse } = useGetAllChaptersQuery();

  const currentChapter = chapterResponse?.data ?? null;
  const book = currentChapter ? { title: currentChapter.bookTitle } : null;

  const isLocked = currentChapter ? !currentChapter.isFree : false;

  // Map API shape to the Chapter type expected by ChapterPurchaseModal
  const chapterForModal: Chapter | null = currentChapter
    ? {
        _id: currentChapter.id,
        id: currentChapter.id,
        number: currentChapter.chapterNumber,
        title: currentChapter.title,
        description: currentChapter.description,
        content: currentChapter.content,
        isFree: currentChapter.isFree,
        price: currentChapter.price,
        coverImage: currentChapter.coverImage,
        status: 'published',
        createdBy: '',
        createdAt: '',
        updatedAt: '',
      }
    : null;

  // Open purchase modal when landing on a locked chapter
  useEffect(() => {
    if (isLocked && chapterForModal && !(isOpen && componentName === 'ChapterPurchaseModal')) {
      dispatch(
        openModal({
          componentName: 'ChapterPurchaseModal',
          data: { chapter: chapterForModal, book, closeBehavior: 'goBack' },
        })
      );
    }
  }, [isLocked, currentChapter?.id, isOpen, componentName]); // eslint-disable-line react-hooks/exhaustive-deps

  // All chapters from the same book, sorted by chapter number
  const bookChapters = useMemo(() => {
    const items = allChaptersResponse?.data?.items ?? [];
    if (!currentChapter) return items;
    return [...items]
      .filter((c) => c.bookId._id === currentChapter.bookId)
      .sort((a, b) => a.chapterNumber - b.chapterNumber);
  }, [allChaptersResponse, currentChapter]);

  const currentIndex = bookChapters.findIndex((c) => c.id === chapterId);

  const [showControls, setShowControls] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);

  const onClose = () => router.back();

  const handlePreviousChapter = () => {
    const prev = bookChapters[currentIndex - 1];
    if (prev) {
      setScrollProgress(0);
      router.push(`/read-chapter/${prev.id}`);
    }
  };

  const handleNextChapter = () => {
    const next = bookChapters[currentIndex + 1];
    if (next) {
      setScrollProgress(0);
      router.push(`/read-chapter/${next.id}`);
    }
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const scrolled = target.scrollTop;
    const maxScroll = target.scrollHeight - target.clientHeight;
    const progress = maxScroll > 0 ? (scrolled / maxScroll) * 100 : 0;
    setScrollProgress(progress);
  };

  const canGoPrevious = currentIndex > 0;
  const canGoNext = currentIndex < bookChapters.length - 1;

  if (isLoading || !chapterId) {
    return (
      <div className="fixed inset-0 bg-background flex items-center justify-center z-50">
        <div className="text-muted-foreground">Loading chapter...</div>
      </div>
    );
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
                <p className="text-xs text-muted-foreground truncate">
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
            <div className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-xs mb-3">
              Chapter {currentChapter.chapterNumber}
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-3">{currentChapter.title}</h1>
            {currentChapter.description && (
              <p className="text-muted-foreground text-base">{currentChapter.description}</p>
            )}
          </div>

          {/* Chapter Content */}
          <MarkdownContent
            content={currentChapter.content}
            emptyMessage="No content available for this chapter."
          />

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
            disabled={!canGoPrevious}
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
            disabled={!canGoNext}
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
