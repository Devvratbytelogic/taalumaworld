'use client';

import { useEffect, useState } from 'react';
import moment from 'moment';
import { ChevronLeft, ChevronRight, Loader2, Star } from 'lucide-react';
import Button from '@/components/ui/Button';
import ImageComponent from '@/components/ui/ImageComponent';
import { AddReviewButton } from '@/components/pages-components/user-dashboard/AddReviewButton';
import { useGetContentReviewsQuery } from '@/store/rtkQueries/userGetAPI';
import type { IUserReviewEntity } from '@/types/user/reviews';

interface BlueprintReviewsProps {
  itemId?: string | null;
  itemTitle?: string | null;
  type?: 'Chapter' | 'Book';
  isPurchased?: boolean;
  isReviewed?: boolean;
}

function StarRow({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'md' }) {
  const className = size === 'md' ? 'h-5 w-5' : 'h-3.5 w-3.5';
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((value) => (
        <Star
          key={value}
          className={`${className} ${value <= rating ? 'fill-amber-400 text-amber-400' : 'text-[#D4D4D4]'
            }`}
        />
      ))}
    </div>
  );
}

function ReviewCard({ review }: { review: IUserReviewEntity }) {
  return (
    <article className="rounded-md border border-[#ECECEC] bg-white p-5 sm:p-6">
      <div className="flex items-start gap-3">
        <div className="border h-10 w-10 rounded-full overflow-hidden shrink-0">
          <ImageComponent src={review.customer?.profile_pic ?? ''} alt={review.customer?.name ?? ''} object_cover={true} />
        </div>

        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-[#1A1A1A]">
                {review.customer?.name || 'Anonymous'}
              </p>
              <p className="text-xs text-[#6B6B6B]">
                {review.createdAt ? moment(review.createdAt).format('DD MMM YYYY') : '—'}
              </p>
            </div>
            <StarRow rating={review.rating ?? 0} />
          </div>

          <p className="text-sm leading-relaxed text-[#333333] whitespace-pre-wrap">
            {review.comment?.trim() || 'No comment provided.'}
          </p>
        </div>
      </div>
    </article>
  );
}

export default function BlueprintReviews({
  itemId,
  itemTitle,
  type = 'Chapter',
  isPurchased = false,
  isReviewed = false,
}: BlueprintReviewsProps) {
  const [page, setPage] = useState(1);
  const [hasReviewed, setHasReviewed] = useState(isReviewed);
  const limit = 3;
  const canAddReview = Boolean(itemId && isPurchased && !hasReviewed);

  useEffect(() => {
    setHasReviewed(isReviewed);
  }, [isReviewed]);

  const { data, isLoading, isFetching, refetch } = useGetContentReviewsQuery(
    { type, id: itemId!, page, limit },
    { skip: !itemId },
  );

  const summary = data?.data?.summary;
  const reviews = data?.data?.data ?? [];
  const total = data?.data?.total ?? 0;
  const totalPages = data?.data?.totalPages ?? 1;
  const averageRating = summary?.averageRating ?? 0;
  const lowestRating = summary?.lowestRating ?? 0;
  const highestRating = summary?.highestRating ?? 0;
  const totalReviews = summary?.totalReviews ?? total;

  if (!itemId) return null;

  return (
    <section className="container mb-16">
      <div className="mb-8 flex flex-wrap items-center gap-4">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#6B6B6B]">
          Reviews
        </p>
        <div className="h-px min-w-8 flex-1 bg-[#E8E8E8]" />
        {canAddReview ? (
          <AddReviewButton
            itemId={itemId}
            itemTitle={itemTitle ?? undefined}
            type={type}
            onSuccess={() => {
              setHasReviewed(true);
              setPage(1);
              void refetch();
            }}
          />
        ) : null}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      ) : (
        <div className="space-y-6">
          <div className="rounded-md border border-[#ECECEC] bg-[#FAFAFA] px-5 py-5 sm:px-6">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <p className="text-3xl font-semibold tracking-tight text-[#1A1A1A]">
                  {averageRating > 0 ? averageRating.toFixed(1) : '—'}
                </p>
                <div className="space-y-1">
                  <StarRow rating={Math.round(averageRating)} size="md" />
                  <p className="text-xs text-[#6B6B6B]">Average rating</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 sm:gap-6">
                <div className="rounded-md border border-[#ECECEC] bg-white px-3 py-2.5 text-center sm:min-w-24">
                  <p className="text-lg font-semibold text-[#1A1A1A]">
                    {totalReviews > 0 ? highestRating.toFixed(1) : '—'}
                  </p>
                  <p className="mt-0.5 text-xs text-[#6B6B6B]">Highest</p>
                </div>
                <div className="rounded-md border border-[#ECECEC] bg-white px-3 py-2.5 text-center sm:min-w-24">
                  <p className="text-lg font-semibold text-[#1A1A1A]">
                    {totalReviews > 0 ? lowestRating.toFixed(1) : '—'}
                  </p>
                  <p className="mt-0.5 text-xs text-[#6B6B6B]">Lowest</p>
                </div>
                <div className="rounded-md border border-[#ECECEC] bg-white px-3 py-2.5 text-center sm:min-w-24">
                  <p className="text-lg font-semibold text-[#1A1A1A]">{totalReviews}</p>
                  <p className="mt-0.5 text-xs text-[#6B6B6B]">
                    {totalReviews === 1 ? 'Review' : 'Reviews'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {reviews.length > 0 ? (
            <div className={`space-y-4 ${isFetching ? 'opacity-60' : ''}`}>
              {reviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-[#ECECEC] bg-white px-6 py-14 text-center">
              <p className="text-sm font-medium text-[#1A1A1A]">No reviews yet</p>
              <p className="mt-1 text-sm text-[#6B6B6B]">
                Be the first to share your thoughts on this blueprint.
              </p>
            </div>
          )}

          {totalPages > 1 ? (
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-[#6B6B6B]">
                Page <span className="font-medium text-[#1A1A1A]">{page}</span> of{' '}
                <span className="font-medium text-[#1A1A1A]">{totalPages}</span>
              </p>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  className="global_btn rounded_full outline_primary"
                  isDisabled={page <= 1 || isFetching}
                  onPress={() => setPage((prev) => Math.max(1, prev - 1))}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <Button
                  type="button"
                  className="global_btn rounded_full outline_primary"
                  isDisabled={page >= totalPages || isFetching}
                  onPress={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ) : null}
        </div>
      )}
    </section>
  );
}
