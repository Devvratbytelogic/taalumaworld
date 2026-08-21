'use client';

import { BookOpen, FileText, Wallet, BadgeCheck, Lock } from 'lucide-react';
import { useDispatch } from 'react-redux';
import ImageComponent from '@/components/ui/ImageComponent';
import ShareButtons from '@/components/blueprint/ShareButtons';
import Button from '@/components/ui/Button';
import AddToCartButton from '@/components/ui/AddToCartButton';
import type { ISingleBookAPIResponseData } from '@/types/user/singleBook';
import { getSingleAuthorRoutePath } from '@/routes/routes';
import Link from 'next/link';
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
            <span className="ml-1 text-xs font-normal text-muted-foreground">(complete series)</span>
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
        <span className="text-xs font-normal text-muted-foreground">(via institutional access)</span>
      </>
    );
  };

  return (
    <>
      <section className="border-b border-border pb-10">
        <div className="container">
          <div className="flex flex-col gap-10 md:flex-row md:items-start md:gap-12 lg:gap-16">
            {/* Content */}
            <div className="min-w-0 flex-1 space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-semibold text-lg text-primary">{renderPriceLabel()}</p>
                <span className="rounded-full border border-border px-3 py-1 text-xs font-medium text-muted-foreground">
                  {isPricingModelChapter ? 'By Blueprint' : 'Full Series'}
                </span>
              </div>

              <h1 className="font-ubuntu text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-4xl lg:text-[2.75rem] lg:leading-[1.15]">{bookDetails?.title}</h1>

              {bookDetails?.description && (
                <p className="text-base line-clamp-6">
                  {bookDetails?.description}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-x-6 gap-y-3 border-y border-border py-4 text-sm">
                {mentor && (
                  <Link
                    href={getSingleAuthorRoutePath(mentor?.short_code || mentor?.id || '')}
                    className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
                  >
                    {mentor?.profile_pic ? (
                      <div className="h-9 w-9 overflow-hidden rounded-full border border-border">
                        <ImageComponent src={mentor?.profile_pic} alt={mentor?.name} object_cover />
                      </div>
                    ) : (
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-xs font-semibold uppercase text-foreground">
                        {mentor?.name?.slice(0, 2)}
                      </div>
                    )}
                    <div>
                      <p className="text-xs text-muted-foreground">Author</p>
                      <p className="flex items-center gap-1 font-medium text-foreground">
                        {mentor?.name}
                        {(mentor?.is_verified_mentor || mentor?.is_mentor_verified) && (
                          <BadgeCheck className="h-3.5 w-3.5 text-primary shrink-0" aria-label="Verified mentor" />
                        )}
                      </p>
                    </div>
                  </Link>
                )}

                {!!bookDetails?.chapterCount && (
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
                      <BookOpen className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Blueprints</p>
                      <p className="font-medium text-foreground">{bookDetails?.chapterCount} blueprints</p>
                    </div>
                  </div>
                )}
              </div>

              {showPurchaseActions && (
                isPricingModelChapter ? (
                  <div className="relative flex items-center gap-2 rounded-md border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800" role="alert">
                    <Lock className="h-4 w-4 shrink-0" />
                    <span>This series is priced by blueprint. Purchase individual blueprints below to get access.</span>
                  </div>
                ) : resolvedPrice > 0 ? (
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <Button
                      className="global_btn rounded_full bg_primary w-full sm:w-auto sm:min-w-48"
                      onPress={handleBuyNow}
                      startContent={<Wallet className="h-4 w-4" />}
                    >
                      Buy Now - KSH {resolvedPrice.toFixed(2)}
                      <span className="ml-1 text-xs font-normal opacity-80">(complete series)</span>
                    </Button>

                    <AddToCartButton
                      id={purchaseId}
                      type={purchaseType}
                      className="global_btn rounded_full outline_primary w-full sm:w-auto sm:min-w-48"
                      label="Add to Cart"
                    />
                  </div>
                ) : null
              )}

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

            {/* Cover */}
            <div className="mx-auto w-48 shrink-0 sm:w-52 md:mx-0 md:w-56">
              <div className="aspect-3/4 overflow-hidden rounded-2xl border border-border bg-muted shadow-[0_20px_40px_-24px_rgba(0,0,0,0.18)]">
                {bookDetails?.coverImage ? (
                  <ImageComponent src={bookDetails?.coverImage} alt={bookDetails?.title} object_cover={false} />
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
    </>
  );
}
