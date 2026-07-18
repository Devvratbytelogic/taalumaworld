'use client';

import { useRouter } from 'next/navigation';
import { BookOpen, CheckCircle2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import ImageComponent from '@/components/ui/ImageComponent';
import { Badge } from '@/components/ui/badge';
import Button from '@/components/ui/Button';
import WishlistButton from '@/components/ui/WishlistButton';
import { getBlueprintRoutePath } from '@/routes/routes';
import { VISIBLE } from '@/constants/contentMode';
import type { IWishlistAPIResponseDataEntity } from '@/types/user/wishlist';

interface WishlistItemCardProps {
  item: IWishlistAPIResponseDataEntity;
}

export default function WishlistItemCard({ item }: WishlistItemCardProps) {
  const router = useRouter();

  const isBook = item.type === VISIBLE.BOOK;
  const coverImage = isBook ? item.series?.coverImage : item.blueprint?.coverImage;
  const title = isBook ? item.series?.title : item.blueprint?.title;
  const price = isBook ? item.series?.price : item.blueprint?.price;
  const isFree = !isBook && item.blueprint?.isFree;
  const seriesTitle = !isBook ? item.blueprint?.series?.title : undefined;
  const blueprintSlug = !isBook ? item.blueprint?.slug : undefined;
  const isClickable = !!blueprintSlug;

  const goToDetails = () => {
    if (blueprintSlug) router.push(getBlueprintRoutePath(blueprintSlug));
  };

  return (
    <Card
      className={`group/card overflow-hidden gap-4 transition-all hover:border-primary/50 rounded-md flex flex-col h-full ${isClickable ? 'cursor-pointer hover-lift' : ''}`}
      onClick={isClickable ? goToDetails : undefined}
    >
      <div className="aspect-2/2 overflow-hidden bg-muted relative shrink-0">
        <div className="w-full h-full transition-transform group-hover/card:scale-105">
          <ImageComponent src={coverImage ?? ''} alt={title ?? ''} object_cover={true} />
        </div>

        <WishlistButton itemId={item.item_id} type={item.type} isWishlisted />
      </div>

      <CardContent className="last:pb-4 px-4 space-y-1.5 flex flex-col flex-1">
        <div className="flex items-center gap-1.5 flex-wrap">
          <Badge className="backdrop-blur-sm bg-white/90 rounded-full px-3 py-1 text-xs text-primary border-primary/20">
            {isBook ? 'Full Series' : 'Blueprint'}
          </Badge>
          {isFree ? (
            <Badge className="text-success border-success/20 backdrop-blur-sm bg-white/90 rounded-full px-3 py-1 text-xs">
              Free
            </Badge>
          ) : null}
          {item.is_purchased ? (
            <Badge className="text-success border-success/20 backdrop-blur-sm bg-white/90 rounded-full px-3 py-1 text-xs">
              <CheckCircle2 className="h-3 w-3 mr-1" />
              Purchased
            </Badge>
          ) : null}
          {!isBook && seriesTitle ? (
            <Badge variant="outline" className="backdrop-blur-sm bg-white/90 rounded-full px-3 py-1 text-xs max-w-32">
              <BookOpen className="h-3 w-3 mr-1 shrink-0" />
              <span className="truncate">{seriesTitle}</span>
            </Badge>
          ) : null}
        </div>

        <h3 className="font-semibold text-lg line-clamp-2 tracking-tight">{title ?? 'Untitled'}</h3>

        <div className="flex-1" />

        <div className="flex items-center justify-between gap-2 pt-2 border-t border-border">
          {item.is_purchased ? (
            <p className="shrink-0 truncate font-medium text-success tracking-tight">Owned</p>
          ) : isFree ? (
            <p className="shrink-0 truncate font-medium text-success tracking-tight">Free to Read</p>
          ) : (
            <p className="shrink-0 truncate whitespace-nowrap font-semibold text-lg text-primary">
              KSH {(price ?? 0).toFixed(2)}
            </p>
          )}

          {isClickable ? (
            <div className="shrink-0" onClick={(e) => e.stopPropagation()}>
              <Button
                type="button"
                className="global_btn rounded_full outline_primary h-8! px-3! text-xs! whitespace-nowrap"
                onPress={goToDetails}
              >
                {item.is_purchased ? 'Read' : 'View'}
              </Button>
            </div>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
