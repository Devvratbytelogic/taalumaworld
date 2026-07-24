'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Check, Lock, MapPin, ShoppingBag } from 'lucide-react';
import { useGetCartQuery } from '@/store/rtkQueries/userGetAPI';
import { getCartCheckoutRoutePath, getCartRoutePath, getHomeRoutePath } from '@/routes/routes';
import CartPageSkeleton from '@/components/skeleton-loader/CartPageSkeleton';
import CartCheckoutAddresses from './CartCheckoutAddresses';
import CartItemCard from './CartItemCard';
import CartNoData from './CartNoData';
import CartSummary from './CartSummary';
import PaymentConfirmed from './PaymentConfirmed';

function CheckoutSteps({ current }: { current: 'cart' | 'checkout' }) {
  const steps = [
    { id: 'cart' as const, label: 'Cart', href: getCartRoutePath() },
    { id: 'checkout' as const, label: 'Checkout', href: getCartCheckoutRoutePath() },
  ];

  return (
    <ol className="mt-4 flex items-center gap-2 text-sm sm:mt-5">
      {steps.map((step, index) => {
        const isActive = step.id === current;
        const isComplete = current === 'checkout' && step.id === 'cart';

        return (
          <li key={step.id} className="flex items-center gap-2">
            {index > 0 && <span className="h-px w-6 bg-border sm:w-10" aria-hidden />}
            <Link
              href={step.href}
              className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 transition-colors ${
                isActive
                  ? 'bg-primary text-white'
                  : isComplete
                    ? 'bg-primary/10 text-primary hover:bg-primary/15'
                    : 'bg-muted text-muted-foreground hover:text-foreground'
              }`}
            >
              <span
                className={`flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-semibold ${
                  isActive
                    ? 'bg-white/20 text-white'
                    : isComplete
                      ? 'bg-primary text-white'
                      : 'bg-background text-muted-foreground'
                }`}
              >
                {isComplete ? <Check className="h-3 w-3" /> : index + 1}
              </span>
              {step.label}
            </Link>
          </li>
        );
      })}
    </ol>
  );
}

export default function CartPage() {
  const pathname = usePathname();
  const isCheckoutPage = pathname === getCartCheckoutRoutePath();
  const [isPaymentConfirmed, setIsPaymentConfirmed] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [transactionId, setTransactionId] = useState<string | null>(null);
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

  if (isPaymentConfirmed) {
    return <PaymentConfirmed transactionId={transactionId} />;
  }

  if (isLoading) {
    return <CartPageSkeleton />;
  }

  if (cartItems.length === 0) {
    return <CartNoData />;
  }

  return (
    <div className="min-h-screen sm:py-10">
      <div className="container">
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4 sm:mb-8">
          <div>
            <h1 className="flex items-center gap-2.5 text-2xl font-bold tracking-tight sm:text-3xl">
              {isCheckoutPage ? (
                <>
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Lock className="h-5 w-5" />
                  </span>
                  Checkout
                </>
              ) : (
                <>
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <ShoppingBag className="h-5 w-5" />
                  </span>
                  Your Cart
                </>
              )}
            </h1>
            <p className="mt-1.5 text-sm text-muted-foreground sm:text-base">
              {isCheckoutPage
                ? 'Confirm your billing address and complete payment securely'
                : `${itemCount} ${itemCount === 1 ? 'item' : 'items'} ready for checkout`}
            </p>
            <CheckoutSteps current={isCheckoutPage ? 'checkout' : 'cart'} />
          </div>

          <Link
            href={isCheckoutPage ? getCartRoutePath() : getHomeRoutePath()}
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white px-3.5 py-2 text-sm font-medium text-foreground transition-colors hover:border-primary/30 hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            {isCheckoutPage ? 'Back to Cart' : 'Continue Shopping'}
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
          <div className="space-y-5 sm:space-y-6 lg:col-span-2">
            {isCheckoutPage && (
              <section className="rounded-md border border-border bg-white p-4 sm:p-5">
                <div className="mb-4 flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <MapPin className="h-4 w-4" />
                  </span>
                  <div>
                    <h2 className="text-base font-bold sm:text-lg">Billing Address</h2>
                    <p className="text-xs text-muted-foreground sm:text-sm">
                      Select an address for this order
                    </p>
                  </div>
                </div>
                <CartCheckoutAddresses
                  selectedAddressId={selectedAddressId}
                  onSelectAddress={setSelectedAddressId}
                />
              </section>
            )}

            <section className={isCheckoutPage ? 'rounded-md border border-border bg-white p-4 sm:p-5' : undefined}>
              {isCheckoutPage && (
                <div className="mb-4 flex items-center justify-between gap-3">
                  <h2 className="text-base font-bold sm:text-lg">
                    Order Items
                    <span className="ml-2 text-sm font-medium text-muted-foreground">({itemCount})</span>
                  </h2>
                </div>
              )}
              <div className="space-y-3 sm:space-y-4">
                {cartItems.map((item) => (
                  <CartItemCard key={item._id} item={item} compact={isCheckoutPage} />
                ))}
              </div>
            </section>
          </div>

          <div className="lg:col-span-1 lg:min-w-0">
            <CartSummary
              subtotal={subtotal}
              total={total}
              itemCount={itemCount}
              discountAmount={discountAmount}
              taxAmount={taxAmount}
              taxPercent={cartData?.tax_percent}
              couponType={cartData?.coupon_type}
              couponValue={cartData?.coupon_value}
              cartId={cartData?._id}
              selectedAddressId={selectedAddressId}
              onPaymentSuccess={(result) => {
                setTransactionId(result?.transactionId ?? null);
                setIsPaymentConfirmed(true);
              }}
              couponCode={cartData?.coupon_code}
              isCheckoutPage={isCheckoutPage}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
