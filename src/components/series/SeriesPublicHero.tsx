'use client';

import { BookOpen, FileText } from 'lucide-react';
import ImageComponent from '@/components/ui/ImageComponent';
import ShareButtons from '@/components/blueprint/ShareButtons'; 
import type { ISingleBookAPIResponseData } from '@/types/user/singleBook';
import { VISIBLE } from '@/constants/contentMode';

interface SeriesPublicHeroProps {
  data: ISingleBookAPIResponseData | null;
  slug: string;
}

export default function SeriesPublicHero({ data, slug }: SeriesPublicHeroProps) {
  const bookDetails = data?.bookDetails ?? null;
  const mentor = bookDetails?.mentor ?? null;

  return (
    <section className="border-b border-border pb-10">
      <div className="container">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:gap-12 lg:gap-16">
          <div className="min-w-0 flex-1 space-y-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                Series
              </span>
             
              {bookDetails?.priceLabel && (
                <span className="rounded-full border border-border px-3 py-1 text-xs font-medium text-muted-foreground">
                  {bookDetails?.priceLabel ?? ''}
                </span>
              )}
            </div>

            <h1 className="font-ubuntu text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-4xl lg:text-[2.75rem] lg:leading-[1.15]">
              {bookDetails?.title}
            </h1>

            {bookDetails?.description && <p className="text-base line-clamp-6">{bookDetails?.description}</p>}

            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 border-y border-border py-4 text-sm">
              {mentor?.name && (
                <div className="flex items-center gap-2.5">
                  {mentor?.profile_pic ? (
                    <div className="h-9 w-9 overflow-hidden rounded-full border border-border">
                      <ImageComponent src={mentor?.profile_pic ?? ''} alt={mentor?.name ?? ''} object_cover />
                    </div>
                  ) : (
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-xs font-semibold uppercase text-foreground">
                      {mentor?.name?.slice(0, 2) ?? ''}
                    </div>
                  )}
                  <div>
                    <p className="text-xs text-muted-foreground">Mentor</p>
                    <p className="font-medium text-foreground">{mentor?.name ?? ''}</p>
                  </div>
                </div>
              )}

              {!!bookDetails?.chapterCount && (
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Blueprints</p>
                    <p className="font-medium text-foreground">{bookDetails?.chapterCount ?? 0} blueprints</p>
                  </div>
                </div>
              )}
            </div>

            <div>
              <p className="mb-3 text-sm font-medium text-foreground">Share this series</p>
              <ShareButtons
                referralCode={mentor?.short_code ?? ''}
                slug={slug ?? ''}
                type={VISIBLE.BOOK}
                size="md"
              />
            </div>
          </div>

          <div className="mx-auto w-48 shrink-0 sm:w-52 md:mx-0 md:w-56">
            <div className="aspect-3/4 overflow-hidden rounded-2xl border border-border bg-muted shadow-[0_20px_40px_-24px_rgba(0,0,0,0.18)]">
              {bookDetails?.coverImage ? (
                <ImageComponent src={bookDetails?.coverImage ?? ''} alt={bookDetails?.title ?? ''} object_cover={false} priority />
              ) : (
                <div className="flex h-full flex-col items-center justify-center gap-3 bg-muted p-6 text-center">
                  <FileText className="h-10 w-10 text-muted-foreground/40" />
                  <p className="text-xs font-medium text-muted-foreground">Series</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
