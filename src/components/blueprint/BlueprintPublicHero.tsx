'use client';

import { BookOpen, FileText } from 'lucide-react';
import ImageComponent from '@/components/ui/ImageComponent';
import BlueprintShareButtons from '@/components/blueprint/BlueprintShareButtons';
import { ISingleChapterAPIResponseData } from '@/types/user/singleChapter';
import { getSeriesRoutePath } from '@/routes/routes';
import Link from 'next/link';

interface BlueprintPublicHeroProps {
  data: ISingleChapterAPIResponseData | null;
}

export default function BlueprintPublicHero({ data }: BlueprintPublicHeroProps) {
  const priceLabel = data?.isFree ? 'Free' : `KSH ${data?.price?.toFixed(2) ?? '0.00'}`;

  return (
    <>
      <section className="border-b border-border pb-10">
        <div className="container">
          <div className="flex flex-col gap-10 md:flex-row md:items-start md:gap-12 lg:gap-16">
            {/* Content */}
            <div className="min-w-0 flex-1 space-y-6">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                  Blueprint {data?.chapterNumber}
                </span>
                {data?.category?.name && (
                  <span className="rounded-full border border-border px-3 py-1 text-xs font-medium text-muted-foreground">
                    {data?.category?.name}
                  </span>
                )}
                <span className="rounded-full border border-border px-3 py-1 text-xs font-medium text-muted-foreground">
                  {priceLabel}
                </span>
              </div>

              <h1 className="font-ubuntu text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-4xl lg:text-[2.75rem] lg:leading-[1.15]">{data?.title}</h1>

              {data?.description && (
                <p className="text-base line-clamp-6">
                  {data?.description}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-x-6 gap-y-3 border-y border-border py-4 text-sm">
                {data?.author && (
                  <div className="flex items-center gap-2.5">
                    {data?.authorAvatar ? (
                      <div className="h-9 w-9 overflow-hidden rounded-full border border-border">
                        <ImageComponent src={data?.authorAvatar} alt={data?.author} object_cover />
                      </div>
                    ) : (
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-xs font-semibold uppercase text-foreground">
                        {data?.author?.slice(0, 2)}
                      </div>
                    )}
                    <div>
                      <p className="text-xs text-muted-foreground">Author</p>
                      <p className="font-medium text-foreground">{data?.author}</p>
                    </div>
                  </div>
                )}

                {data?.bookTitle && (
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
                      <BookOpen className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Series</p>
                      <Link href={getSeriesRoutePath(data?.bookId ?? '')}><p className="font-medium text-foreground">{data?.bookTitle}</p></Link   >
                    </div>
                  </div>
                )}
              </div>

              <div>
                <p className="mb-3 text-sm font-medium text-foreground">Share this blueprint</p>
                <BlueprintShareButtons
                  shareableLink={data?.shareable_link ?? ''}
                  title={data?.title ?? ''}
                  description={data?.description ?? ''}
                  size="md"
                />
              </div>
            </div>

            {/* Cover */}
            <div className="mx-auto w-48 shrink-0 sm:w-52 md:mx-0 md:w-56">
              <div className="aspect-3/4 overflow-hidden rounded-2xl border border-border bg-muted shadow-[0_20px_40px_-24px_rgba(0,0,0,0.18)]">
                {data?.coverImage ? (
                  <ImageComponent src={data?.coverImage} alt={data?.title} object_cover={false} priority />
                ) : (
                  <div className="flex h-full flex-col items-center justify-center gap-3 bg-muted p-6 text-center">
                    <FileText className="h-10 w-10 text-muted-foreground/40" />
                    <p className="text-xs font-medium text-muted-foreground">Blueprint {data?.chapterNumber}</p>
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
