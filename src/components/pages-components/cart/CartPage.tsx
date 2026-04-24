'use client';

import { useCallback, useState } from 'react';
import { Trash2, BookOpen, CheckCircle } from 'lucide-react';
import Button from '@/components/ui/Button';
import { Badge } from '@/components/ui/badge';
import { useGetCartQuery } from '@/store/rtkQueries/userGetAPI';
import { useCheckOutCartMutation } from '@/store/rtkQueries/userPostAPI';
import ImageComponent from '@/components/ui/ImageComponent';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { openModal } from '@/store/slices/allModalSlice';
import CartPageSkeleton from '@/components/skeleton-loader/CartPageSkeleton';
import CartNoData from './CartNoData';
import CartSummary from './CartSummary';
import PaymentConfirmed from './PaymentConfirmed';
import { VISIBLE } from '@/constants/contentMode';
import Link from 'next/link';
import { getReadBookRoutePath, getReadChapterRoutePath } from '@/routes/routes';
import { useMpesaPaymentFlow } from '@/hooks/useMpesaPaymentFlow';
import { MpesaWaitModal } from '@/components/payments/MpesaWaitModal';
import { MpesaPhoneModal } from '@/components/payments/MpesaPhoneModal';

export default function CartDetailsComponent() {
  const dispatch = useDispatch();
  const { data: cartResponse, isLoading } = useGetCartQuery();
  const [checkOutCart] = useCheckOutCartMutation();
  const [isOrderComplete, setIsOrderComplete] = useState(false);

  const cartData = cartResponse?.data?.[0];
  const cartItems = cartData?.cart_item ?? [];

  const bookCount = cartItems.filter(item => item.type === VISIBLE.BOOK).length;
  const chapterCount = cartItems.filter(item => item.type !== VISIBLE.BOOK).length;
  const cartSummaryText = (() => {
    const parts: string[] = [];
    if (bookCount > 0) parts.push(`${bookCount} ${bookCount === 1 ? 'book' : 'books'}`);
    if (chapterCount > 0) parts.push(`${chapterCount} ${chapterCount === 1 ? 'chapter' : 'chapters'}`);
    return `${parts.join(' and ')} ready for checkout`;
  })();

  const subtotal = cartItems.reduce(
    (sum, item) => sum + (item.chapter?.isFree ? 0 : (item.selling_price ?? 0)),
    0
  );
  const total = cartData?.total_amount ?? subtotal;

  const getAmount = useCallback(() => total, [total]);

  const attemptComplete = useCallback(
    async (checkoutRequestId: string) => {
      try {
        await checkOutCart({
          payment_method: 'M-Pesa',
          amount: total,
          transaction_id: checkoutRequestId,
          invoice: checkoutRequestId,
          payment_status: 'Paid',
        }).unwrap();
        return true;
      } catch {
        return false;
      }
    },
    [checkOutCart, total]
  );

  const onMpesaSuccess = useCallback(() => {
    setIsOrderComplete(true);
  }, []);

  const { startPayment, isInitiating, phoneModalProps, waitModalProps } = useMpesaPaymentFlow({
    getAmount,
    attemptComplete,
    onSuccess: onMpesaSuccess,
  });

  const onRemoveFromCart = (itemId: string, chapterTitle: string) => {
    dispatch(openModal({ componentName: 'ConfirmRemoveCartModal', data: { itemId, chapterTitle } }));
  };

  if (isLoading) {
    return <CartPageSkeleton />;
  }

  if (cartItems?.length === 0 && !isLoading && !isOrderComplete) {
    return <CartNoData />;
  }

  if (isOrderComplete) {
    return <PaymentConfirmed />;
  }

  return (
    <>
      <MpesaPhoneModal {...phoneModalProps} />
      <MpesaWaitModal {...waitModalProps} />
      <div className="min-h-screen bg-gray-50 py-6 sm:py-8">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl font-bold mb-2 sm:text-3xl">Shopping Cart</h1>
            <p className="text-sm text-muted-foreground sm:text-base">{cartSummaryText}</p>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
            {/* Cart Items */}
            <div className="space-y-3 sm:space-y-4 lg:col-span-2">
              {cartItems.map(item => {
                const isBookItem = item.type === VISIBLE.BOOK;
                const coverImage = isBookItem ? item.book?.coverImage : item.chapter?.coverImage;
                const title = isBookItem ? item.book?.title : item.chapter?.title;
                const authorName = isBookItem
                  ? item.book?.thoughtLeader?.fullName
                  : item.chapter?.book?.thoughtLeader?.fullName;
                const bookTitle = !isBookItem ? item.chapter?.book?.title : null;

                return (
                  <div
                    key={item._id}
                    className="bg-white rounded-2xl border border-border p-4 shadow-sm sm:rounded-3xl sm:p-6"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                      {/* Cover Image */}
                      <div className="mx-auto shrink-0 sm:mx-0">
                        <Link
                          href={
                            isBookItem
                              ? getReadBookRoutePath(item.book?._id ?? '')
                              : getReadChapterRoutePath(item.chapter?._id ?? '')
                          }
                          className="block w-full overflow-hidden rounded-sm sm:h-32 sm:w-24 sm:rounded-2xl"
                        >
                          <ImageComponent
                            src={coverImage ?? ''}
                            alt={title ?? ''}
                            object_cover={true}
                          />
                        </Link>
                      </div>

                      {/* Item Info */}
                      <div className="min-w-0 w-full flex-1">
                        <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                          <div className="min-w-0 flex-1">
                            <div className="mb-1 flex flex-wrap items-center gap-2">
                              <Badge variant="outline" className="rounded-full text-xs sm:text-sm">
                                {isBookItem ? 'Full Book' : `Chapter ${item.chapter?.number}`}
                              </Badge>
                            </div>
                            <h3 className="mb-1 line-clamp-2 text-base font-bold sm:text-lg">{title}</h3>
                            {bookTitle && (
                              <p className="text-sm text-muted-foreground mb-1 line-clamp-1">
                                <BookOpen className="h-3.5 w-3.5 inline mr-1" />
                                {bookTitle}
                              </p>
                            )}
                            {authorName && (
                              <p className="text-sm text-muted-foreground line-clamp-1">
                                by {authorName}
                              </p>
                            )}
                          </div>

                          {/* Price */}
                          <div className="flex shrink-0 flex-col items-start sm:items-end sm:text-right">
                            {item.chapter?.isFree ? (
                              <Badge className="w-fit rounded-full border-success/20 bg-success/10 text-success">
                                Free
                              </Badge>
                            ) : (
                              <p className="text-lg font-bold text-primary sm:text-xl">
                                KSH {item.selling_price?.toFixed(2)}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Remove Button */}
                        <Button
                          onPress={() => onRemoveFromCart(item._id, title ?? '')}
                          className="global_btn danger_outline w-full sm:w-auto"
                          startContent={<Trash2 className="h-4 w-4 mr-2" />}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1 lg:min-w-0">
              <CartSummary
                subtotal={subtotal}
                total={total}
                itemCount={cartItems.length}
                discountAmount={cartData?.discount_amount ?? 0}
                taxAmount={cartData?.tax_amount ?? 0}
                onCheckout={startPayment}
                isLoading={isInitiating}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
