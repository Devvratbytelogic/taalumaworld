'use client';

import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { BookOpen, Trash2 } from 'lucide-react';
import { openModal } from '@/store/slices/allModalSlice';
import { ICartItemEntity } from '@/types/user/cart';
import { VISIBLE } from '@/constants/contentMode';
import { getBlueprintRoutePath, getSeriesRoutePath } from '@/routes/routes';
import ImageComponent from '@/components/ui/ImageComponent';
import { Badge } from '@/components/ui/badge';

interface CartItemCardProps {
  item: ICartItemEntity;
  /** Compact layout used on the checkout page. */
  compact?: boolean;
}

export default function CartItemCard({ item, compact = false }: CartItemCardProps) {
  const dispatch = useDispatch();
  const router = useRouter();

  const isBlueprint = Boolean(item.blueprint) || item.type === VISIBLE.CHAPTER || item.legacyType === VISIBLE.CHAPTER;
  const title = (isBlueprint ? item.blueprint?.title : item.series?.title) ?? 'Untitled item';
  const coverImage = isBlueprint ? item.blueprint?.coverImage : item.series?.coverImage;
  const slug = isBlueprint ? item.blueprint?.slug : item.series?.slug;
  const parentSeriesTitle = isBlueprint ? item.blueprint?.series?.title : undefined;
  const taxAmount = item.tax ?? 0;

  const handleViewDetails = () => {
    if (!slug) return;
    router.push(isBlueprint ? getBlueprintRoutePath(slug) : getSeriesRoutePath(slug));
  };

  const handleRemove = () => {
    dispatch(
      openModal({
        componentName: 'ConfirmRemoveCartModal',
        data: { itemId: item._id, chapterTitle: title },
      })
    );
  };

  if (compact) {
    return (
      <div className="flex items-center gap-3 rounded-md border border-border/80 bg-muted/20 p-3 transition-colors hover:border-primary/25 sm:gap-4 sm:p-3.5">
        <button
          type="button"
          onClick={handleViewDetails}
          className="aspect-3/4 w-14 shrink-0 overflow-hidden rounded-md bg-muted sm:w-16"
        >
          <ImageComponent src={coverImage} alt={title} object_cover={true} />
        </button>

        <div className="min-w-0 flex-1">
          <Badge className="mb-1 rounded-full border-primary/20 bg-primary/10 px-2.5 py-0 text-[11px] text-primary">
            {isBlueprint ? 'Blueprint' : 'Full Series'}
          </Badge>
          <button type="button" onClick={handleViewDetails} className="block w-full text-left">
            <p className="line-clamp-1 text-sm font-semibold tracking-tight transition-colors hover:text-primary sm:text-base">
              {title}
            </p>
          </button>
          {isBlueprint && parentSeriesTitle && (
            <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
              <BookOpen className="h-3 w-3 shrink-0" />
              <span className="truncate">{parentSeriesTitle}</span>
            </p>
          )}
        </div>

        <div className="shrink-0 text-right">
          <p className="text-sm font-bold text-primary sm:text-base">
            KSH {(item.selling_price + taxAmount).toFixed(2)}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="group rounded-md border border-border bg-white p-4 transition-colors hover:border-primary/30 sm:p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <button
          type="button"
          onClick={handleViewDetails}
          className="mx-auto aspect-3/4 w-24 shrink-0 overflow-hidden rounded-md bg-muted ring-1 ring-border/60 sm:mx-0"
        >
          <ImageComponent src={coverImage} alt={title} object_cover={true} />
        </button>

        <div className="min-w-0 w-full flex-1">
          <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
            <div className="min-w-0 flex-1 space-y-1.5">
              <Badge className="rounded-full border-primary/20 bg-primary/10 px-3 py-0.5 text-xs text-primary">
                {isBlueprint ? 'Blueprint' : 'Full Series'}
              </Badge>

              <button type="button" onClick={handleViewDetails} className="block text-left">
                <h3 className="line-clamp-2 text-base font-semibold tracking-tight transition-colors hover:text-primary sm:text-lg">
                  {title}
                </h3>
              </button>

              {isBlueprint && parentSeriesTitle && (
                <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <BookOpen className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">{parentSeriesTitle}</span>
                </p>
              )}
            </div>

            <div className="shrink-0 sm:text-right">
              <p className="text-lg font-bold text-primary">
                KSH {(item.selling_price + taxAmount).toFixed(2)}
              </p>
              <p className="text-xs text-muted-foreground">
                includes KSH {taxAmount.toFixed(2)} tax
              </p>
            </div>
          </div>

          <div className="flex items-center justify-end border-t border-border/70 pt-3">
            <button
              type="button"
              onClick={handleRemove}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-red-500 transition-colors hover:text-red-600"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Remove
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
