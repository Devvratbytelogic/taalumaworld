'use client';

import { useState } from 'react';
import { Trash2, BookOpen, CheckCircle, Loader2 } from 'lucide-react';
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
import { getUserDashboardRoutePath } from '@/routes/routes';
import { initiateRazorpayPayment, RazorpayPaymentResponse } from '@/components/pages-components/chapter/Razorpay';
import PaymentLoader from './PaymentLoader';
import PaymentConfirmed from './PaymentConfirmed';
import { VISIBLE } from '@/constants/contentMode';

export default function CartDetailsComponent() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { data: cartResponse, isLoading } = useGetCartQuery();
  const [checkOutCart] = useCheckOutCartMutation();
  const [isOrderComplete, setIsOrderComplete] = useState(false);
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);

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

  const onRemoveFromCart = (itemId: string, chapterTitle: string) => {
    dispatch(openModal({ componentName: 'ConfirmRemoveCartModal', data: { itemId, chapterTitle } }));
  };

  const onCheckout = async () => {
    setIsPaymentProcessing(true);
    try {
      await initiateRazorpayPayment({
        amount: total,
        description: `Purchase of ${cartSummaryText.replace(' ready for checkout', '')}`,
        onSuccess: async (response: RazorpayPaymentResponse) => {
          await checkOutCart({
            payment_method: 'Razorpay',
            amount: total,
            transaction_id: response.razorpay_payment_id,
            payment_status: 'Paid',
          }).unwrap();
          setIsOrderComplete(true);
          setIsPaymentProcessing(false);
        },
        onDismiss: () => setIsPaymentProcessing(false),
      });
    } catch {
      setIsPaymentProcessing(false);
    }
  };

  if (isLoading) {
    return <CartPageSkeleton />;
  }

  if (cartItems.length === 0 && !isOrderComplete) {
    return <CartNoData />;
  }

  if (isOrderComplete) {
    return (
     <PaymentConfirmed />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {isPaymentProcessing && (
        <PaymentLoader />
      )}
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Shopping Cart</h1>
          <p className="text-muted-foreground">{cartSummaryText}</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map(item => {
              const isBookItem = item.type === VISIBLE.BOOK
              const coverImage = isBookItem ? item.book?.coverImage : item.chapter?.coverImage
              const title = isBookItem ? item.book?.title : item.chapter?.title
              const authorName = isBookItem
                ? item.book?.thoughtLeader?.fullName
                : item.chapter?.book?.thoughtLeader?.fullName
              const bookTitle = !isBookItem ? item.chapter?.book?.title : null

              return (
                <div key={item._id} className="bg-white rounded-3xl p-6 shadow-sm border border-border">
                  <div className="flex gap-4">
                    {/* Cover Image */}
                    <div className="shrink-0">
                      <div className="w-24 h-32 rounded-2xl overflow-hidden">
                        <ImageComponent
                          src={coverImage ?? ''}
                          alt={title ?? ''}
                          object_cover={true}
                        />
                      </div>
                    </div>

                    {/* Item Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className="text-xs rounded-full">
                              {isBookItem ? 'Full Book' : `Chapter ${item.chapter?.number}`}
                            </Badge>
                          </div>
                          <h3 className="font-bold text-lg mb-1 line-clamp-2">{title}</h3>
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
                        <div className="text-right shrink-0">
                          {item.chapter?.isFree ? (
                            <Badge className="bg-success/10 text-success border-success/20 rounded-full">
                              Free
                            </Badge>
                          ) : (
                            <p className="text-xl font-bold text-primary">
                              ₹{item.selling_price?.toFixed(2)}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Remove Button */}
                      <Button
                        onPress={() => onRemoveFromCart(item._id, title ?? '')}
                        className="global_btn danger_outline"
                        startContent={<Trash2 className="h-4 w-4 mr-2" />}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <CartSummary
              subtotal={subtotal}
              total={total}
              itemCount={cartItems.length}
              discountAmount={cartData?.discount_amount ?? 0}
              taxAmount={cartData?.tax_amount ?? 0}
              onCheckout={onCheckout}
              isLoading={isPaymentProcessing}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
