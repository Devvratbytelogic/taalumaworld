'use client';
import { useState, useMemo, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import Button from '@/components/ui/Button';
import ImageComponent from '@/components/ui/ImageComponent';
import { openModal } from '@/store/slices/allModalSlice';
import { clearChapterPurchased } from '@/store/slices/chapterPurchaseSlice';
import { RootState } from '@/store/store';
import { useGetChapterByIdQuery, useGetChaptersByBookQuery } from '@/store/api/chaptersApi';
import { useGetPurchasedItemsQuery } from '@/store/api/userApi';
import { useUpdateReadingProgressMutation } from '@/store/api/userApi';
import { books } from '@/data/mockData';
import type { Chapter, Book, ContentBlock } from '@/data/mockData';

export default function ReadChapterPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const chapterId = params?.chapterId as string | undefined;
  const lastPurchasedChapterId = useSelector((state: RootState) => state.chapterPurchase.lastPurchasedChapterId);
  const { isOpen, componentName } = useSelector((state: RootState) => state.allModal);

  const { data: chapter, isLoading } = useGetChapterByIdQuery(chapterId ?? '', { skip: !chapterId });
  const { data: allChapters = [] } = useGetChaptersByBookQuery(chapter?.bookId ?? '', { skip: !chapter?.bookId });
  const { data: purchasedItems = [] } = useGetPurchasedItemsQuery();
  const [updateProgress] = useUpdateReadingProgressMutation();

  const ownedChapters = useMemo(
    () => purchasedItems.map((p) => p.chapterId).filter((id): id is string => !!id),
    [purchasedItems]
  );

  const book: Book | undefined = useMemo(
    () => (chapter ? books.find((b) => b.id === chapter.bookId) : undefined),
    [chapter]
  );

  const initialIndex = useMemo(
    () => (chapter ? allChapters.findIndex((c) => c.id === chapter.id) : 0),
    [chapter, allChapters]
  );

  const [currentChapterIndex, setCurrentChapterIndex] = useState(Math.max(0, initialIndex));
  const [showControls, setShowControls] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [lockedChapter, setLockedChapter] = useState<Chapter | null>(null);

  const currentChapter = allChapters[currentChapterIndex] || chapter;

  const onClose = () => router.back();

  const handlePreviousChapter = () => {
    if (currentChapterIndex > 0) {
      setCurrentChapterIndex(currentChapterIndex - 1);
      setScrollProgress(0);
    }
  };

  const handleNextChapter = () => {
    if (currentChapterIndex < allChapters.length - 1) {
      const nextChapter = allChapters[currentChapterIndex + 1];
      const isOwned = ownedChapters.includes(nextChapter.id) || nextChapter.isFree;

      if (!isOwned) {
        setLockedChapter(nextChapter);
        dispatch(
          openModal({
            componentName: 'ChapterPurchaseModal',
            data: { chapter: nextChapter, book, closeBehavior: 'dismiss' },
          })
        );
        return;
      }

      setCurrentChapterIndex(currentChapterIndex + 1);
      setScrollProgress(0);

      if (currentChapter) {
        updateProgress({ chapterId: currentChapter.id, progress: 100 });
      }
    }
  };

  // Advance when chapter is purchased from modal (next-chapter flow)
  useEffect(() => {
    if (lastPurchasedChapterId && lockedChapter?.id === lastPurchasedChapterId) {
      setLockedChapter(null);
      setCurrentChapterIndex((i) => i + 1);
      setScrollProgress(0);
    }
  }, [lastPurchasedChapterId, lockedChapter?.id]);

  // Clear lastPurchasedChapterId once ownedChapters has updated (avoids stale isLocked)
  useEffect(() => {
    if (lastPurchasedChapterId && ownedChapters.includes(lastPurchasedChapterId)) {
      dispatch(clearChapterPurchased());
    }
  }, [lastPurchasedChapterId, ownedChapters, dispatch]);

  // Clear lockedChapter when modal is closed without purchase (cancel/dismiss)
  useEffect(() => {
    if (!isOpen && componentName === null && lockedChapter && !lastPurchasedChapterId) {
      setLockedChapter(null);
    }
  }, [isOpen, componentName, lockedChapter, lastPurchasedChapterId]);

  const isLocked = currentChapter
    ? !(ownedChapters.includes(currentChapter.id) || currentChapter.isFree || lastPurchasedChapterId === currentChapter.id)
    : false;

  // Open ChapterPurchaseModal when landing directly on a locked chapter (only when not already open)
  useEffect(() => {
    if (
      isLocked &&
      currentChapter &&
      !(isOpen && componentName === 'ChapterPurchaseModal')
    ) {
      dispatch(
        openModal({
          componentName: 'ChapterPurchaseModal',
          data: { chapter: currentChapter, book, closeBehavior: 'goBack' },
        })
      );
    }
  }, [isLocked, currentChapter?.id, isOpen, componentName]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const scrolled = target.scrollTop;
    const maxScroll = target.scrollHeight - target.clientHeight;
    const progress = maxScroll > 0 ? (scrolled / maxScroll) * 100 : 0;
    setScrollProgress(progress);

    if (currentChapter) {
      updateProgress({ chapterId: currentChapter.id, progress });
    }
  };

  const canGoPrevious = currentChapterIndex > 0;
  const canGoNext = currentChapterIndex < allChapters.length - 1;

  const renderContentBlock = (block: ContentBlock, index: number) => {
    if (block.type === 'text') {
      return (
        <div key={index} className="space-y-4">
          {block.content.split('\n\n').map((paragraph, pIndex) => (
            <p key={pIndex} className="leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>
      );
    }
    if (block.type === 'image') {
      return (
        <figure key={index} className="my-8">
          <div className="relative w-full overflow-hidden rounded-2xl bg-accent" style={{ maxHeight: '70vh' }}>
            <ImageComponent
              src={block.content}
              alt={block.alt || 'Chapter illustration'}
              object_cover={false}
            />
          </div>
          {block.caption && (
            <figcaption className="mt-3 text-center text-sm text-muted-foreground italic">
              {block.caption}
            </figcaption>
          )}
        </figure>
      );
    }
    return null;
  };

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
    return (
      <div className="fixed inset-0 bg-background flex items-center justify-center z-50" />
    );
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
                {currentChapter?.title || 'Reading'}
              </h1>
              {book && (
                <p className="text-xs text-muted-foreground truncate">
                  {book.title} • Chapter {currentChapter?.sequence}
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
              Chapter {currentChapter?.sequence}
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-3">{currentChapter?.title}</h1>
            {currentChapter?.description && (
              <p className="text-muted-foreground text-base">{currentChapter.description}</p>
            )}
          </div>

          {/* Chapter Content */}
          <div className="prose prose-sm sm:prose-base max-w-none space-y-6">
            {currentChapter?.content && currentChapter.content.length > 0 ? (
              currentChapter.content.map((block, index) => renderContentBlock(block, index))
            ) : (
              <p className="leading-relaxed text-muted-foreground text-center py-12">
                No content available for this chapter.
              </p>
            )}
          </div>

          {/* End of Chapter */}
          {canGoNext && (
            <div className="mt-16 mb-8 text-center">
              <div className="inline-block border-t border-border w-32 mb-6" />
              <p className="text-sm text-muted-foreground mb-4">
                End of Chapter {currentChapter?.sequence}
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
            <span className="font-semibold">{currentChapter?.sequence}</span>
            {allChapters.length > 0 && (
              <>
                <span className="text-muted-foreground">of</span>
                <span className="font-semibold">{allChapters.length}</span>
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
