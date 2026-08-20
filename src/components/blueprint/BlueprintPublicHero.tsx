'use client';

import { BookOpen, FileText, ShoppingCart, Wallet } from 'lucide-react';
import { useDispatch } from 'react-redux';
import ImageComponent from '@/components/ui/ImageComponent';
import ShareButtons from '@/components/blueprint/ShareButtons';
import Button from '@/components/ui/Button';
import AddToCartButton from '@/components/ui/AddToCartButton';
import { ISingleChapterAPIResponseData } from '@/types/user/singleChapter';
import { getSeriesRoutePath, getSingleAuthorRoutePath } from '@/routes/routes';
import Link from 'next/link';
import { VISIBLE } from '@/constants/contentMode';
import { openModal } from '@/store/slices/allModalSlice';
import { useAuth } from '@/hooks/useAuth';

interface BlueprintPublicHeroProps {
  data: ISingleChapterAPIResponseData | null;
}

export default function BlueprintPublicHero({ data }: BlueprintPublicHeroProps) {
  const dispatch = useDispatch();
  const { isAuthenticated } = useAuth();

  const isPricingModelChapter = data?.series?.pricingModel === VISIBLE.CHAPTER;
  const displayPrice = isPricingModelChapter
    ? data?.effectivePrice
    : data?.series?.effectivePrice;
  const purchaseId = isPricingModelChapter ? data?.id : data?.series?.id;
  const purchaseType = isPricingModelChapter ? VISIBLE.CHAPTER : VISIBLE.BOOK;
  const showPurchaseActions = Boolean(data && !data.canRead);
  const resolvedPrice = displayPrice ?? data?.price ?? 0;

  const openLogin = (action: string) => {
    dispatch(openModal({ componentName: 'LoginRequiredModal', data: { action, itemType: purchaseType, onSuccess: handleBuyNow } }));
  };

  const handleBuyNow = () => {
    if (!isAuthenticated) {
      openLogin('purchase');
      return;
    }
    dispatch(openModal({ componentName: 'ChapterPurchaseModal', data: { chapter: data } }));
  };

  const renderPriceLabel = () => {
    if (data?.isFree) {
      return <span className="font-medium text-success tracking-tight">Free to Read</span>;
    }

    if (resolvedPrice > 0) {
      return (
        <>
          KSH {resolvedPrice.toFixed(2)}
          {data?.series?.pricingModel === VISIBLE.BOOK && (
            <span className="ml-1 text-xs font-normal text-muted-foreground">(complete series)</span>
          )}
        </>
      );
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
                {/* <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                  Blueprint {data?.chapterNumber}
                </span> */}
                {/* {data?.category?.name && (
                  <span className="rounded-full border border-border px-3 py-1 text-xs font-medium text-muted-foreground">
                    {data?.category?.name}
                  </span>
                )} */}
                <p className="font-semibold text-lg text-primary">{renderPriceLabel()}</p>
                {/* {!data?.isFree && (
                  <span className="rounded-full border border-border px-3 py-1 text-xs font-medium text-muted-foreground">
                    {isPricingModelChapter ? 'By Blueprint' : 'Full Series'}
                  </span>
                )} */}
              </div>

              <h1 className="font-ubuntu text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-4xl lg:text-[2.75rem] lg:leading-[1.15]">{data?.title}</h1>

              {data?.description && (
                <p className="text-base line-clamp-6">
                  {data?.description}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-x-6 gap-y-3 border-y border-border py-4 text-sm">
                {data?.createdBy && (
                  <Link
                    href={getSingleAuthorRoutePath(data?.createdBy?.short_code || data?.createdBy?.id || '')}
                    className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
                  >
                    {data?.createdBy?.profile_pic ? (
                      <div className="h-9 w-9 overflow-hidden rounded-full border border-border">
                        <ImageComponent src={data?.createdBy?.profile_pic} alt={data?.createdBy?.name} object_cover />
                      </div>
                    ) : (
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-xs font-semibold uppercase text-foreground">
                        {data?.createdBy?.name?.slice(0, 2)}
                      </div>
                    )}
                    <div>
                      <p className="text-xs text-muted-foreground">Author</p>
                      <p className="font-medium text-foreground">{data?.createdBy?.name}</p>
                    </div>
                  </Link>
                )}

                {data?.seriesTitle && (
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
                      <BookOpen className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <Link href={getSeriesRoutePath(data?.series?.slug ?? data?.series?.id ?? '')}>
                        <p className="text-xs text-muted-foreground">Series</p>
                        <p className="font-medium text-foreground">{data?.bookTitle}</p>
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {showPurchaseActions && resolvedPrice > 0 && (
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <Button
                    className="global_btn rounded_full bg_primary w-full sm:w-auto sm:min-w-48"
                    onPress={handleBuyNow}
                    startContent={<Wallet className="h-4 w-4" />}
                  >
                    Buy Now - KSH {resolvedPrice.toFixed(2)}
                    {data?.series?.pricingModel === VISIBLE.BOOK && (
                      <span className="ml-1 text-xs font-normal opacity-80">(complete series)</span>
                    )}
                  </Button>

                    <AddToCartButton
                      id={purchaseId}
                      type={purchaseType}
                      className="global_btn rounded_full outline_primary w-full sm:w-auto sm:min-w-48"
                      label="Add to Cart"
                    />
                 
                </div>
              )}

              <div>
                <p className="mb-3 text-sm font-medium text-foreground">Share this blueprint</p>
                <ShareButtons
                  referralCode={data?.createdBy?.short_code ?? ''}
                  slug={data?.slug ?? ''}
                  type={VISIBLE.CHAPTER}
                  size="md"
                />
              </div>
            </div>

            {/* Cover */}
            <div className="mx-auto w-48 shrink-0 sm:w-52 md:mx-0 md:w-56">
              <div className="aspect-3/4 overflow-hidden rounded-2xl border border-border bg-muted shadow-[0_20px_40px_-24px_rgba(0,0,0,0.18)]">
                {data?.coverImage ? (
                  <ImageComponent src={data?.coverImage} alt={data?.title} object_cover={false} />
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
