'use client';

import { BadgeCheck, BookOpen, FileText, Lock, Wallet } from 'lucide-react';
import { useDispatch } from 'react-redux';
import Link from 'next/link';
import ImageComponent from '@/components/ui/ImageComponent';
import ShareButtons from '@/components/blueprint/ShareButtons';
import Button from '@/components/ui/Button';
import AddToCartButton from '@/components/ui/AddToCartButton';
import type { ISingleBookAPIResponseData } from '@/types/user/singleBook';
import { getSingleAuthorRoutePath } from '@/routes/routes';
import { VISIBLE } from '@/constants/contentMode';
import { openModal } from '@/store/slices/allModalSlice';
import { useAuth } from '@/hooks/useAuth';

interface SeriesPublicHeroProps {
  data: ISingleBookAPIResponseData | null;
  slug: string;
}

export default function SeriesPublicHero({ data, slug }: SeriesPublicHeroProps) {
  const dispatch = useDispatch();
  const { isAuthenticated } = useAuth();

  const bookDetails = data?.bookDetails ?? null;
  const mentor = bookDetails?.mentor ?? null;
  const isPricingModelChapter = bookDetails?.pricingModel === VISIBLE.CHAPTER;
  const displayPrice = bookDetails?.effectivePrice;
  const purchaseId = bookDetails?.id;
  const purchaseType = VISIBLE.BOOK;
  const showPurchaseActions = Boolean(bookDetails && !bookDetails.canRead);
  const resolvedPrice = displayPrice ?? bookDetails?.price ?? 0;
  const tags = (bookDetails?.tags ?? []).filter(Boolean);
  const hasBlueprints = (data?.chapters?.data?.length ?? 0) > 0;
  const showStartReading = Boolean(bookDetails?.canRead && hasBlueprints);

  const scrollToBlueprints = () => {
    document.getElementById('series-blueprints')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const openLogin = (action: string) => {
    dispatch(openModal({ componentName: 'LoginRequiredModal', data: { action, itemType: purchaseType, onSuccess: handleBuyNow } }));
  };

  const handleBuyNow = () => {
    if (!isAuthenticated) {
      openLogin('purchase');
      return;
    }
    dispatch(openModal({
      componentName: 'ChapterPurchaseModal',
      data: { chapter: { ...bookDetails, series: bookDetails }, type: 'series' },
    }));
  };

  const renderPriceLabel = () => {
    if (resolvedPrice > 0) {
      return (
        <>
          KSH {resolvedPrice.toFixed(2)}
          {bookDetails?.pricingModel === VISIBLE.BOOK && (
            <span className="ml-1.5 text-sm font-normal text-muted-foreground">(complete series)</span>
          )}
        </>
      );
    }

    if (isPricingModelChapter) {
      if (bookDetails?.priceLabel) return bookDetails.priceLabel;
      const fromPrice = Number(bookDetails?.fromPrice) || 0;
      if (fromPrice > 0) return <>From KSH {fromPrice.toFixed(2)}</>;
      return 'Priced by blueprint';
    }

    return (
      <>
        FREE{' '}
        <span className="text-sm font-normal text-muted-foreground">(via institutional access)</span>
      </>
    );
  };

  return (
    <section className="border-b border-border pb-12">
      <div className="container">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-16">
          <div className="mx-auto w-52 shrink-0 sm:w-56 lg:mx-0 lg:w-64">
            <div className="relative aspect-3/4 overflow-hidden rounded-xl border border-border bg-muted">
              <span className="absolute inset-y-0 left-0 z-1 w-1.5 bg-foreground" aria-hidden />
              {bookDetails?.coverImage ? (
                <ImageComponent src={bookDetails.coverImage} alt={bookDetails.title} object_cover={false} />
              ) : (
                <div className="flex h-full flex-col items-center justify-center gap-3 p-6 text-center">
                  <FileText className="h-10 w-10 text-muted-foreground/40" />
                  <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">Series</p>
                </div>
              )}
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">Series</p>

            <h1 className="mt-3 font-ubuntu text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-4xl lg:text-[2.75rem] lg:leading-[1.15]">
              {bookDetails?.title}
            </h1>

            <p className="mt-4 font-ubuntu text-2xl font-bold tracking-tight text-primary">
              {renderPriceLabel()}
            </p>

            {bookDetails?.description && (
              <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground line-clamp-6">
                {bookDetails.description}
              </p>
            )}

            {tags.length > 0 && (
              <p className="mt-4 text-sm text-muted-foreground">
                {tags.join('  ·  ')}
              </p>
            )}

            <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4 border-y border-border py-5">
              {mentor && (
                <Link
                  href={getSingleAuthorRoutePath(mentor.short_code || mentor.id || '')}
                  className="flex items-center gap-3 transition-opacity hover:opacity-80"
                >
                  {mentor.profile_pic ? (
                    <div className="h-10 w-10 overflow-hidden rounded-full border border-border">
                      <ImageComponent src={mentor.profile_pic} alt={mentor.name} object_cover />
                    </div>
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-xs font-semibold uppercase text-foreground">
                      {mentor.name?.slice(0, 2)}
                    </div>
                  )}
                  <div>
                    <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Author</p>
                    <p className="flex items-center gap-1 font-medium text-foreground">
                      {mentor.name}
                      {(mentor.is_verified_mentor || mentor.is_mentor_verified) && (
                        <BadgeCheck className="h-3.5 w-3.5 shrink-0 text-primary" aria-label="Verified mentor" />
                      )}
                    </p>
                  </div>
                </Link>
              )}

              {!!bookDetails?.chapterCount && (
                <div>
                  <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Blueprints</p>
                  <p className="font-medium text-foreground">
                    {bookDetails.chapterCount} {bookDetails.chapterCount === 1 ? 'blueprint' : 'blueprints'}
                  </p>
                </div>
              )}

              {!!bookDetails?.totalPages && (
                <div>
                  <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Pages</p>
                  <p className="font-medium text-foreground">{bookDetails.totalPages}</p>
                </div>
              )}

              <div>
                <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Access</p>
                <p className="font-medium text-foreground">
                  {isPricingModelChapter ? 'By blueprint' : 'Full series'}
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              {showPurchaseActions && isPricingModelChapter && (
                <p className="flex items-start gap-2.5 text-sm leading-6 text-muted-foreground">
                  <Lock className="mt-0.5 h-4 w-4 shrink-0" />
                  This series is priced by blueprint. Purchase individual blueprints below to get access.
                </p>
              )}

              <div className="flex flex-wrap justify-between items-center gap-x-6 gap-y-4">
                {(showStartReading || (showPurchaseActions && !isPricingModelChapter && resolvedPrice > 0)) && (
                  <div className="flex flex-wrap items-center gap-3">
                    {showStartReading && (
                      <Button
                        className="global_btn rounded_full bg_primary w-auto sm:min-w-48"
                        onPress={scrollToBlueprints}
                        startContent={<BookOpen className="h-4 w-4" />}
                      >
                        Start reading
                      </Button>
                    )}

                    {showPurchaseActions && !isPricingModelChapter && resolvedPrice > 0 && (
                      <>
                        <Button
                          className="global_btn rounded_full bg_primary w-auto sm:min-w-48"
                          onPress={handleBuyNow}
                          startContent={<Wallet className="h-4 w-4" />}
                        >
                          Buy Now - KSH {resolvedPrice.toFixed(2)}
                          <span className="ml-1 text-xs font-normal opacity-80">(complete series)</span>
                        </Button>

                        <AddToCartButton
                          id={purchaseId}
                          type={purchaseType}
                          className="global_btn rounded_full outline_primary w-auto sm:min-w-48"
                          label="Add to Cart"
                        />
                      </>
                    )}
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-3">
                  <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
                    Share this series
                  </p>
                  <ShareButtons
                    referralCode={mentor?.short_code ?? ''}
                    slug={slug ?? ''}
                    type={VISIBLE.BOOK}
                    size="md"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
