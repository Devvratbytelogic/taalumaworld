'use client';
import MarkdownContent from '@/components/ui/MarkdownContent';
import type { ISingleChapterAPIResponseData } from '@/types/user/singleChapter';
import MentorDetails from './MentorDetails';
import dynamic from 'next/dynamic';
import PdfViewerSkeleton from '@/components/skeleton-loader/PdfViewerSkeleton';
import { useReadingProgress } from '@/hooks/useReadingProgress';
import { useSyncReadingProgress } from '@/hooks/useSyncReadingProgress';
import { useMemo, useState } from 'react';
import { Lock } from 'lucide-react';
import { VISIBLE } from '@/constants/contentMode';

const PdfReader = dynamic(() => import('./PdfReader'), {
  ssr: false,
  loading: () => <PdfViewerSkeleton />,
});
interface BlueprintPublicDetailsProps {
  data?: Partial<ISingleChapterAPIResponseData> | null;
  hideMentorDetails?: boolean;
}

export default function BlueprintPublicDetails({ data, hideMentorDetails = false }: BlueprintPublicDetailsProps) {

  const hasContent = Boolean(data?.content);
  const hasPdf = Boolean(data?.pdf);
  const canRead = data?.canRead;
  const isPricingModelChapter = data?.series?.pricingModel === VISIBLE.CHAPTER;

  const { ref: contentRef, progress: contentReadingProgress } = useReadingProgress({
    enabled: hasContent,
    debounceMs: 150,
  });
  const [pdfReadingProgress, setPdfReadingProgress] = useState(0);

  // Overall progress blends both sources, weighted only by the sections that actually exist.
  const readingProgress = useMemo(() => {
    if (hasContent && hasPdf) return Math.round((contentReadingProgress + pdfReadingProgress) / 2);
    if (hasPdf) return pdfReadingProgress;
    if (hasContent) return contentReadingProgress;
    return 0;
  }, [hasContent, hasPdf, contentReadingProgress, pdfReadingProgress]);

  useSyncReadingProgress(data?.id, readingProgress);

  return (
    <>
      <section className="container mb-10">
        <div className="grid gap-14 lg:grid-cols-[minmax(220px,280px)_1fr] lg:gap-20">
          {!hideMentorDetails && <aside className="lg:sticky lg:top-28 lg:self-start">
            <p className="mb-6 text-xs font-medium uppercase tracking-[0.18em] text-[#6B6B6B]">
              Overview
            </p>
            <MentorDetails data={data?.createdBy ?? undefined} />
          </aside>}

          <div className={`min-w-0 ${hideMentorDetails ? 'col-span-full' : ''}`}>
            <div>
              <div className="mb-8 flex items-center gap-4">
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#6B6B6B]">
                  Content
                </p>
                <div className="h-px flex-1 bg-[#E8E8E8]" />
              </div>

              <div className="overflow-hidden rounded-2xl border border-[#ECECEC] bg-white">
                {(hasContent || hasPdf) && canRead && (
                  <div className="h-1 w-full bg-[#ECECEC]">
                    <div
                      className="h-full bg-primary transition-[width] duration-150 ease-out"
                      style={{ width: `${readingProgress}%` }}
                    />
                  </div>
                )}
                <div className="border-b border-[#ECECEC] px-6 py-4 sm:px-8">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium text-[#1A1A1A]">{data?.title}</p>
                      <p className="mt-1 text-xs text-[#6B6B6B]">
                        Blueprint {data?.chapterNumber}
                      </p>
                    </div>
                    {(hasContent || hasPdf) && canRead && (
                      <p className="shrink-0 text-xs font-medium tracking-[0.06em] text-[#6B6B6B]">
                        {readingProgress}% viewed
                      </p>
                    )}
                    {!canRead && (
                      <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-[#ECECEC] bg-[#FAFAFA] px-3 py-1 text-xs font-medium text-[#6B6B6B]">
                        <Lock className="h-3 w-3" />
                        Locked
                      </span>
                    )}
                  </div>
                </div>

                {canRead ? <>
                  {data?.content && (
                    <div ref={contentRef} className="p-6">
                      <MarkdownContent
                        content={data?.content ?? ''}
                        emptyMessage="No content available for this blueprint."
                        className="prose-headings:font-ubuntu prose-headings:tracking-tight prose-p:text-[#333333] prose-p:leading-8"
                      />
                    </div>
                  )}
                  {data?.pdf && (
                    <div className="flex items-center gap-4 px-6 py-4 sm:px-8">
                      <div className="h-px flex-1 bg-[#ECECEC]" />
                      <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#6B6B6B]">
                        Additional Document
                      </p>
                      <div className="h-px flex-1 bg-[#ECECEC]" />
                    </div>
                  )}
                  {data?.pdf && (
                    <div>
                      <PdfReader
                        url={data.pdf}
                        title={data?.title ?? ''}
                        onProgressChange={setPdfReadingProgress}
                      />
                    </div>
                  )}
                </> : (
                  <div className="flex flex-col items-center justify-center gap-4 px-6 py-16 text-center sm:px-8 sm:py-20">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[#ECECEC] bg-[#FAFAFA]">
                      <Lock className="h-6 w-6 text-[#6B6B6B]" />
                    </div>
                    <div className="max-w-sm space-y-2">
                      <p className="text-sm font-medium text-[#1A1A1A]">This blueprint is locked</p>
                      <p className="text-sm leading-relaxed text-[#6B6B6B]">
                        {isPricingModelChapter
                          ? 'Purchase this blueprint to unlock the full content.'
                          : 'Purchase the complete series to unlock this blueprint.'}
                      </p>
                    </div>
                  </div>
                )}

              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
