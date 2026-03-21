'use client';

import { Trash2, ShoppingCart, ArrowRight, BookOpen } from 'lucide-react';
import Button from '@/components/ui/Button';
import { Badge } from '@/components/ui/badge';
import { useGetCartQuery } from '@/store/rtkQueries/userGetAPI';
import ImageComponent from '@/components/ui/ImageComponent';
import { useDispatch } from 'react-redux';
import { openModal } from '@/store/slices/allModalSlice';

export default function CartDetailsComponent() {
  const dispatch = useDispatch();
  const { data: cartResponse, isLoading } = useGetCartQuery();

  const cartData = cartResponse?.data?.[0];
  const cartItems = cartData?.cart_item ?? [];

  const subtotal = cartItems.reduce(
    (sum, item) => sum + (item.chapter.isFree ? 0 : (item.selling_price ?? 0)),
    0
  );
  const total = cartData?.total_amount ?? subtotal;

  const onRemoveFromCart = (itemId: string, chapterTitle: string) => {
    dispatch(openModal({ componentName: 'ConfirmRemoveCartModal', data: { itemId, chapterTitle } }));
  };

  const onCheckout = () => {
    console.log('Proceed to checkout');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-muted-foreground">Loading cart...</p>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center py-16">
            <div className="bg-white rounded-3xl p-12 shadow-sm">
              <ShoppingCart className="h-24 w-24 mx-auto text-muted-foreground/30 mb-6" />
              <h2 className="text-2xl font-bold mb-3">Your cart is empty</h2>
              <p className="text-muted-foreground mb-6">
                Start adding chapters to your cart to begin your reading journey!
              </p>
              <Button
                className="global_btn rounded_full"
                onPress={() => window.history.back()}
              >
                Browse Chapters
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Shopping Cart</h1>
          <p className="text-muted-foreground">
            {cartItems.length} {cartItems.length === 1 ? 'chapter' : 'chapters'} ready for checkout
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map(item => {
              const { chapter } = item;

              return (
                <div
                  key={item._id}
                  className="bg-white rounded-3xl p-6 shadow-sm border border-border"
                >
                  <div className="flex gap-4">
                    {/* Chapter Image */}
                    <div className="shrink-0">
                      <div className="w-24 h-32 rounded-2xl overflow-hidden">
                        <ImageComponent
                          src={chapter.coverImage}
                          alt={chapter.title}
                          object_cover={true}
                        />
                      </div>
                    </div>

                    {/* Chapter Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className="text-xs rounded-full">
                              Chapter {chapter.number}
                            </Badge>
                          </div>
                          <h3 className="font-bold text-lg mb-1 line-clamp-2">
                            {chapter.title}
                          </h3>
                          {chapter.book && (
                            <p className="text-sm text-muted-foreground mb-1 line-clamp-1">
                              <BookOpen className="h-3.5 w-3.5 inline mr-1" />
                              {chapter.book.title}
                            </p>
                          )}
                          {chapter.book?.thoughtLeader && (
                            <p className="text-sm text-muted-foreground line-clamp-1">
                              by {chapter.book?.thoughtLeader?.fullName}
                            </p>
                          )}
                        </div>

                        {/* Price */}
                        <div className="text-right shrink-0">
                          {chapter.isFree ? (
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
                        onPress={() => onRemoveFromCart(item._id, chapter.title)}
                        className="global_btn danger_outline"
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
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-border sticky top-24">
              <h2 className="text-xl font-bold mb-6">Order Summary</h2>

              <div className="space-y-3 mb-6 pb-6 border-b">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Items</span>
                  <span className="font-medium">{cartItems.length}</span>
                </div>
                {(cartData?.discount_amount ?? 0) > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Discount</span>
                    <span className="font-medium text-success">
                      -₹{cartData?.discount_amount?.toFixed(2)}
                    </span>
                  </div>
                )}
                {(cartData?.tax_amount ?? 0) > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tax</span>
                    <span className="font-medium">₹{cartData?.tax_amount?.toFixed(2)}</span>
                  </div>
                )}
              </div>

              <div className="flex justify-between mb-6 pb-6 border-b">
                <span className="font-bold text-lg">Total</span>
                <span className="font-bold text-2xl text-primary">
                  ₹{total.toFixed(2)}
                </span>
              </div>

              <Button
                size="lg"
                className="global_btn rounded_full bg_primary w-full mb-3"
                onPress={onCheckout}
                disabled={cartItems.length === 0}
                endContent={<ArrowRight className="h-5 w-5 ml-2" />}

              >
                Proceed to Checkout
              </Button>

              {/* <Button
                className="global_btn rounded_full outline_primary w-full"
                onPress={() => window.history.back()}
              >
                Continue Shopping
              </Button> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
