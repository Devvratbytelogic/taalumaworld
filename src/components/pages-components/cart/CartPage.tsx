'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useDispatch } from 'react-redux';
import { ArrowLeft, BookOpen, Eye, ShoppingBag } from 'lucide-react';
import { useGetCartQuery } from '@/store/rtkQueries/userGetAPI';
import { openModal } from '@/store/slices/allModalSlice';
import { ICartItemEntity } from '@/types/user/cart';
import { VISIBLE } from '@/constants/contentMode';
import { getBlueprintRoutePath, getHomeRoutePath, getSeriesRoutePath } from '@/routes/routes';
import { useMpesaPaymentFlow } from '@/hooks/useMpesaPaymentFlow';
import { MpesaPhoneModal } from '@/components/payments/MpesaPhoneModal';
import { MpesaWaitModal } from '@/components/payments/MpesaWaitModal';
import ImageComponent from '@/components/ui/ImageComponent';
import { Badge } from '@/components/ui/badge';
import CartPageSkeleton from '@/components/skeleton-loader/CartPageSkeleton';
import CartNoData from './CartNoData';
import CartSummary from './CartSummary';
import PaymentConfirmed from './PaymentConfirmed';

function CartItemCard({ item }: { item: ICartItemEntity }) {
  const dispatch = useDispatch();
  const router = useRouter();

  const isBlueprint = Boolean(item.blueprint) || item.type === VISIBLE.CHAPTER || item.legacyType === VISIBLE.CHAPTER;
  const title = (isBlueprint ? item.blueprint?.title : item.series?.title) ?? 'Untitled item';
  const coverImage = isBlueprint ? item.blueprint?.coverImage : item.series?.coverImage;
  const slug = isBlueprint ? item.blueprint?.slug : item.series?.slug;
  const parentSeriesTitle = isBlueprint ? item.blueprint?.series?.title : undefined;

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

  return (
    <div className="rounded-md border border-border bg-white p-4 transition-colors hover:border-primary/30 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <button
          type="button"
          onClick={handleViewDetails}
          className="mx-auto aspect-3/4 w-24 shrink-0 overflow-hidden rounded-sm bg-muted sm:mx-0"
        >
          <ImageComponent src={coverImage} alt={title} object_cover={true} />
        </button>

        <div className="min-w-0 w-full flex-1">
          <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
            <div className="min-w-0 flex-1 space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="rounded-full border-primary/20 bg-primary/10 px-3 py-0.5 text-xs text-primary">
                  {isBlueprint ? 'Blueprint' : 'Full Series'}
                </Badge>
              </div>

              <button type="button" onClick={handleViewDetails} className="block text-left">
                <h3 className="line-clamp-2 font-semibold tracking-tight transition-colors hover:text-primary">
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

            <div className="shrink-0 text-right">
              <p className="text-lg font-bold text-primary">KSH {item.selling_price?.toFixed(2)}</p>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 border-t pt-3">
            {/* <button
              type="button"
              onClick={handleViewDetails}
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <Eye className="h-4 w-4" />
              View Details
            </button> */}

            <button
              type="button"
              onClick={handleRemove}
              className="text-sm font-medium text-red-500 transition-colors hover:underline"
            >
              Remove
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CartPage() {
  const [isPaymentConfirmed, setIsPaymentConfirmed] = useState(false);
  const [acceptedAgreementIds, setAcceptedAgreementIds] = useState<string[]>([]);
  const { data: cartResponse, isLoading } = useGetCartQuery();

  const cartData = cartResponse?.data?.[0];
  const cartItems = cartData?.cart_item ?? [];

  const subtotal = cartItems.reduce(
    (sum, item) => sum + (item.selling_price ?? 0) * (item.quantity ?? 1),
    0
  );
  const discountAmount = cartData?.discount_amount ?? 0;
  const taxAmount = cartData?.tax_amount ?? 0;
  const total = cartData?.total_amount ?? Math.max(subtotal - discountAmount + taxAmount, 0);
  const itemCount = cartData?.item_count ?? cartItems.length;

  // Hooks must run unconditionally, so this is declared before the early returns below.
  const { startPayment, isInitiating, phoneModalProps, waitModalProps } = useMpesaPaymentFlow({
    cartID: cartData?._id,
    type: 'cart',
    acceptedAgreementIds,
    onSuccess: () => setIsPaymentConfirmed(true),
  });

  const handleCheckout = (ids: string[]) => {
    setAcceptedAgreementIds(ids);
    startPayment();
  };

  if (isPaymentConfirmed) {
    return <PaymentConfirmed />;
  }

  if (isLoading) {
    return <CartPageSkeleton />;
  }

  if (cartItems.length === 0) {
    return <CartNoData />;
  }

  return (
    <div className="min-h-screen py-6 sm:py-8">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-6 flex flex-wrap items-start justify-between gap-3 sm:mb-8">
          <div>
            <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight sm:text-3xl">
              <ShoppingBag className="h-6 w-6 text-primary sm:h-7 sm:w-7" />
              Your Cart
            </h1>
            <p className="mt-1 text-sm text-muted-foreground sm:text-base">
              {itemCount} {itemCount === 1 ? 'item' : 'items'} ready for checkout
            </p>
          </div>

          <Link
            href={getHomeRoutePath()}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-primary/80"
          >
            <ArrowLeft className="h-4 w-4" />
            Continue Shopping
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
          <div className="space-y-3 sm:space-y-4 lg:col-span-2">
            {cartItems.map((item) => (
              <CartItemCard key={item._id} item={item} />
            ))}
          </div>

          <div className="lg:col-span-1 lg:min-w-0">
            <CartSummary
              subtotal={subtotal}
              total={total}
              itemCount={itemCount}
              discountAmount={discountAmount}
              taxAmount={taxAmount}
              onCheckout={handleCheckout}
              isLoading={isInitiating}
              couponCode={cartData?.coupon_code}
            />
          </div>
        </div>
      </div>

      <MpesaPhoneModal {...phoneModalProps} />
      <MpesaWaitModal {...waitModalProps} />
    </div>
  );
}
