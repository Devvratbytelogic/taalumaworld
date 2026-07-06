'use client';
import MarkdownContent from '@/components/ui/MarkdownContent';
import type { ISingleChapterAPIResponseData } from '@/types/user/singleChapter';
import MentorDetails from './MentorDetails';
import PdfReader from './PdfReader';


interface BlueprintPublicDetailsProps {
  data: ISingleChapterAPIResponseData | null;
}

export default function BlueprintPublicDetails({ data }: BlueprintPublicDetailsProps) {

  return (
    <>
      <section className="container">
        <div className="grid gap-14 lg:grid-cols-[minmax(220px,280px)_1fr] lg:gap-20">
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <p className="mb-6 text-xs font-medium uppercase tracking-[0.18em] text-[#6B6B6B]">
              Overview
            </p>
            <MentorDetails data={data?.mentor ?? null} />
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
                <div className="border-b border-[#ECECEC] px-6 py-4 sm:px-8">
                  <p className="text-sm font-medium text-[#1A1A1A]">{data?.title}</p>
                  <p className="mt-1 text-xs text-[#6B6B6B]">
                    Blueprint {data?.chapterNumber}
                    {data?.pageCount ? ` · ${data?.pageCount} pages` : ''}
                  </p>
                </div>

                <div className="px-6 py-8 sm:px-8 sm:py-10">
                  {data?.pdf ? (
                    <PdfReader url={data?.pdf} title={data?.title} />
                  ) : (
                    <MarkdownContent
                      content={data?.content ?? ''}
                      emptyMessage="No content available for this blueprint."
                      className="prose-headings:font-ubuntu prose-headings:tracking-tight prose-p:text-[#333333] prose-p:leading-8"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
