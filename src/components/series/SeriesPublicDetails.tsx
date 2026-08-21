'use client';

import Link from 'next/link';
import { Check, ChevronRight, Lock } from 'lucide-react';
import MentorDetails from '@/components/blueprint/MentorDetails';
import ImageComponent from '@/components/ui/ImageComponent';
import type { IChapterEntity, ISingleBookAPIResponseData } from '@/types/user/singleBook';
import { getBlueprintRoutePath } from '@/routes/routes';
import { VISIBLE } from '@/constants/contentMode';

interface SeriesPublicDetailsProps {
  data: ISingleBookAPIResponseData | null;
}

function formatIndex(n?: number) {
  return String(n ?? 0).padStart(2, '0');
}

function BlueprintStatus({
  chapter,
  isPricingModelChapter,
}: {
  chapter: IChapterEntity;
  isPricingModelChapter: boolean;
}) {
  const price = Number(chapter.effectivePrice ?? chapter.price) || 0;

  if (chapter.canRead || chapter.isPurchased) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-border px-2.5 py-1 text-xs font-medium text-foreground">
        <Check className="h-3 w-3" />
        Available
      </span>
    );
  }

  if (chapter.isFree) {
    return (
      <span className="inline-flex items-center rounded-full border border-border px-2.5 py-1 text-xs font-medium text-foreground">
        Free to read
      </span>
    );
  }

  if (isPricingModelChapter && price > 0) {
    return (
      <span className="font-ubuntu text-sm font-bold tabular-nums tracking-tight text-primary">
        KSH {price.toFixed(2)}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-border px-2.5 py-1 text-xs font-medium text-muted-foreground">
      <Lock className="h-3 w-3" />
      Locked
    </span>
  );
}

export default function SeriesPublicDetails({ data }: SeriesPublicDetailsProps) {
  const bookDetails = data?.bookDetails ?? null;
  const chapters = data?.chapters?.data ?? [];
  const isPricingModelChapter = bookDetails?.pricingModel === VISIBLE.CHAPTER;

  return (
    <section className="container pt-12 pb-16">
      <div className="grid gap-14 lg:grid-cols-[minmax(220px,280px)_1fr] lg:gap-20">
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <p className="mb-6 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
            Overview
          </p>
          <MentorDetails data={bookDetails?.mentor} />
        </aside>

        <div id="series-blueprints" className="min-w-0 scroll-mt-24">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                In this series
              </p>
              <h2 className="mt-2 font-ubuntu text-2xl font-bold tracking-tight text-foreground">
                Blueprints
              </h2>
            </div>
            {chapters.length > 0 && (
              <p className="pb-1 text-sm tabular-nums text-muted-foreground">
                {chapters.length} {chapters.length === 1 ? 'item' : 'items'}
              </p>
            )}
          </div>

          {chapters.length > 0 ? (
            <ol className="space-y-3">
              {chapters.map((chapter) => (
                <li key={chapter?.slug ?? chapter?.id}>
                  <Link
                    href={getBlueprintRoutePath(chapter?.slug ?? '')}
                    className="group flex items-center gap-4 rounded-lg border border-border p-4 transition-colors hover:border-primary sm:gap-5 sm:p-5"
                  >
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md border border-border font-ubuntu text-lg font-bold tabular-nums text-foreground transition-colors group-hover:border-primary group-hover:text-primary">
                      {formatIndex(chapter?.chapterNumber ?? chapter?.blueprintNumber)}
                    </span>

                    {chapter?.coverImage && (
                      <div className="hidden h-18 w-12 shrink-0 overflow-hidden rounded-md border border-border sm:block">
                        <ImageComponent src={chapter.coverImage} alt={chapter.title} object_cover />
                      </div>
                    )}

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                        <p className="font-medium leading-snug text-foreground transition-colors group-hover:text-primary sm:text-lg">
                          {chapter?.title}
                        </p>
                        <span className="sm:hidden">
                          <BlueprintStatus
                            chapter={chapter}
                            isPricingModelChapter={isPricingModelChapter}
                          />
                        </span>
                      </div>
                      {chapter?.description && (
                        <p className="mt-1 line-clamp-2 text-sm leading-6 text-muted-foreground">
                          {chapter.description}
                        </p>
                      )}
                      {!!chapter?.pageCount && (
                        <p className="mt-1.5 text-xs text-muted-foreground">
                          {chapter.pageCount} {chapter.pageCount === 1 ? 'page' : 'pages'}
                        </p>
                      )}
                    </div>

                    <div className="hidden shrink-0 sm:block">
                      <BlueprintStatus
                        chapter={chapter}
                        isPricingModelChapter={isPricingModelChapter}
                      />
                    </div>

                    <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
                  </Link>
                </li>
              ))}
            </ol>
          ) : (
            <p className="border-t border-border pt-8 text-sm text-muted-foreground">
              No blueprints available yet.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
