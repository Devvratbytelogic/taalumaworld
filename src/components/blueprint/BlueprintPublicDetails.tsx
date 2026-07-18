'use client';
import MarkdownContent from '@/components/ui/MarkdownContent';
import type { ISingleChapterAPIResponseData } from '@/types/user/singleChapter';
import MentorDetails from './MentorDetails';
import dynamic from 'next/dynamic';
import PdfViewerSkeleton from '@/components/skeleton-loader/PdfViewerSkeleton';
import { useReadingProgress } from '@/hooks/useReadingProgress';
import { useSyncReadingProgress } from '@/hooks/useSyncReadingProgress';
import { useMemo, useState } from 'react';

const PdfReader = dynamic(() => import('./PdfReader'), {
  ssr: false,
  loading: () => <PdfViewerSkeleton />,
});
interface BlueprintPublicDetailsProps {
  data: ISingleChapterAPIResponseData | null;
}

export default function BlueprintPublicDetails({ data }: BlueprintPublicDetailsProps) {
  const hasContent = Boolean(data?.content);
  const hasPdf = Boolean(data?.pdf);

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
      <section className="container">
        <div className="grid gap-14 lg:grid-cols-[minmax(220px,280px)_1fr] lg:gap-20">
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <p className="mb-6 text-xs font-medium uppercase tracking-[0.18em] text-[#6B6B6B]">
              Overview
            </p>
            <MentorDetails data={data?.createdBy ?? undefined} />
          </aside>

          <div className="min-w-0">
            <div>
              <div className="mb-8 flex items-center gap-4">
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#6B6B6B]">
                  Content
                </p>
                <div className="h-px flex-1 bg-[#E8E8E8]" />
              </div>

              <div className="overflow-hidden rounded-2xl border border-[#ECECEC] bg-white">
                {(hasContent || hasPdf) && (
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
                    {(hasContent || hasPdf) && (
                      <p className="shrink-0 text-xs font-medium tracking-[0.06em] text-[#6B6B6B]">
                        {readingProgress}% viewed
                      </p>
                    )}
                  </div>
                </div>

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

              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
