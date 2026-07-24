'use client';

import { useState } from 'react';
import Link from 'next/link';
import { addToast } from '@heroui/react';
import { ArrowRight, Lock, Tag, TicketPercent } from 'lucide-react';
import Button from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { getCartCheckoutRoutePath } from '@/routes/routes';
import { useGetAllCouponsQuery } from '@/store/rtkQueries/userGetAPI';
import { useApplyCouponMutation, useRemoveCouponMutation } from '@/store/rtkQueries/userPostAPI';
import { COUPON_TYPE_LABELS } from '@/constants/coupon';
import { IAllCouponsDataEntity } from '@/types/user/coupon';
import CartPayment from './CartPayment';

function formatCouponValue(coupon: IAllCouponsDataEntity): string {
  if (coupon.coupon_type === 'Free') return 'Free';
  if (coupon.coupon_type === 'Percentage') return `${coupon.value}% off`;
  return `KSH ${coupon.value?.toLocaleString?.() ?? coupon.value} off`;
}

function isPercentCouponType(couponType?: string | null) {
  const normalized = (couponType ?? '').toLowerCase();
  return normalized === 'percent' || normalized === 'percentage';
}

interface CartSummaryProps {
  isCheckoutPage?: boolean;
  cartId?: string;
  selectedAddressId?: string | null;
  subtotal: number;
  total: number;
  itemCount: number;
  discountAmount: number;
  taxAmount: number;
  taxPercent?: number | null;
  couponType?: string | null;
  couponValue?: number | null;
  onPaymentSuccess: (result?: { transactionId?: string }) => void;
  isLoading?: boolean;
  couponCode?: string | null;
}

export default function CartSummary({
  isCheckoutPage = false,
  cartId,
  selectedAddressId = null,
  subtotal,
  total,
  itemCount,
  discountAmount,
  taxAmount,
  taxPercent = null,
  couponType = null,
  couponValue = null,
  onPaymentSuccess,
  isLoading = false,
  couponCode = null,
}: CartSummaryProps) {
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState<string | undefined>();
  const [showAllCoupons, setShowAllCoupons] = useState(false);

  const [applyCoupon, { isLoading: isApplyingCoupon }] = useApplyCouponMutation();
  const [removeCoupon, { isLoading: isRemovingCoupon }] = useRemoveCouponMutation();
  const { data: allCouponsResponse, isFetching: isFetchingCoupons } = useGetAllCouponsQuery(undefined, {
    skip: !showAllCoupons,
  });

  const availableCoupons = allCouponsResponse?.data?.data ?? [];
  const isPercentCoupon = isPercentCouponType(couponType);
  const couponPercentLabel =
    isPercentCoupon && couponValue != null ? `${Number(couponValue)}%` : null;
  const couponTypeLabel = couponType
    ? COUPON_TYPE_LABELS[couponType as keyof typeof COUPON_TYPE_LABELS] ?? couponType
    : null;

  const handleApplyCoupon = async (code: string) => {
    const trimmedCode = code.trim();
    if (!trimmedCode) {
      setCouponError('Please enter a coupon code');
      return;
    }
    try {
      const res = await applyCoupon({ coupon_code: trimmedCode }).unwrap();
      if (res?.http_status_code === 200 || res?.http_status_code === 201) {
        addToast({
          title: 'Coupon applied',
          description: res?.message ?? 'Coupon applied successfully.',
          color: 'success',
          timeout: 2000,
        });
        setCouponInput('');
        setCouponError(undefined);
        setShowAllCoupons(false);
      }
    } catch (error) {
      console.error('Error applying coupon', error);
    }
  };

  const handleRemoveCoupon = async () => {
    try {
      const res = await removeCoupon({}).unwrap();
      if (res?.http_status_code === 200 || res?.http_status_code === 201) {
        addToast({
          title: 'Coupon removed',
          description: res?.message ?? 'Coupon removed from cart.',
          color: 'success',
          timeout: 2000,
        });
      }
    } catch (error) {
      console.error('Error removing coupon', error);
    }
  };

  return (
    <div className="rounded-md border border-border bg-white p-4 sm:p-6 lg:sticky lg:top-24">
      <h2 className="mb-4 text-lg font-bold sm:mb-5 sm:text-xl">Order Summary</h2>

      <div className="mb-5 space-y-2.5">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="font-medium">KSH {subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Items</span>
          <span className="font-medium">{itemCount}</span>
        </div>
        {discountAmount > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">
              Discount{couponPercentLabel ? ` (${couponPercentLabel})` : ''}
            </span>
            <span className="font-medium text-success">
              -KSH {discountAmount.toFixed(2)}
            </span>
          </div>
        )}
        {taxAmount > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">
              Tax{taxPercent != null ? ` (${Number(taxPercent)}%)` : ''}
            </span>
            <span className="font-medium">KSH {taxAmount.toFixed(2)}</span>
          </div>
        )}
      </div>

      <div className="mb-6 space-y-2">
        {couponCode ? (
          <div className="flex items-center justify-between gap-2 rounded-md border border-success/30 bg-success/5 px-3 py-2.5">
            <div className="flex items-center gap-2 text-sm min-w-0">
              <TicketPercent className="h-4 w-4 shrink-0 text-success" />
              <span className="truncate font-semibold text-success">{couponCode}</span>
              <span className="text-muted-foreground">applied</span>
              {couponTypeLabel || couponPercentLabel || (!isPercentCoupon && couponValue != null) ? (
                <span className="text-muted-foreground truncate">
                  (
                  {[
                    couponTypeLabel,
                    couponPercentLabel
                      ?? (!isPercentCoupon && couponValue != null
                        ? `KSH ${Number(couponValue).toFixed(2)}`
                        : null),
                  ]
                    .filter(Boolean)
                    .join(' · ')}
                  )
                </span>
              ) : null}
            </div>
            <button
              type="button"
              onClick={handleRemoveCoupon}
              disabled={isRemovingCoupon || isLoading}
              className="shrink-0 text-sm font-medium text-danger transition-colors hover:underline disabled:opacity-50"
            >
              {isRemovingCoupon ? 'Removing…' : 'Remove'}
            </button>
          </div>
        ) : (
          <>
            <div className="flex gap-2">
              <Input
                value={couponInput}
                onChange={(e) => {
                  setCouponInput(e.target.value.toUpperCase());
                  if (couponError) setCouponError(undefined);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleApplyCoupon(couponInput);
                  }
                }}
                placeholder="Enter coupon code"
                disabled={isApplyingCoupon || isLoading}
                aria-invalid={!!couponError}
                className="h-10 flex-1"
              />
              <Button
                className="global_btn rounded_full outline_primary w_fit shrink-0 px-5"
                onPress={() => handleApplyCoupon(couponInput)}
                isLoading={isApplyingCoupon}
                isDisabled={isApplyingCoupon || isLoading}
              >
                Apply
              </Button>
            </div>
            {couponError && <p className="text-xs text-danger">{couponError}</p>}

            <button
              type="button"
              onClick={() => setShowAllCoupons((prev) => !prev)}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-primary/80"
            >
              <Tag className="h-3.5 w-3.5" />
              {showAllCoupons ? 'Hide available offers' : 'View available offers'}
            </button>

            {showAllCoupons && (
              <div className="max-h-64 space-y-2 overflow-y-auto rounded-md border border-border bg-muted/30 p-3">
                {isFetchingCoupons ? (
                  <p className="text-sm text-muted-foreground">Loading offers…</p>
                ) : availableCoupons.length > 0 ? (
                  availableCoupons.map((coupon) => {
                    const isDisabled = !coupon.isApplicable || isApplyingCoupon || isLoading;
                    return (
                      <div
                        key={coupon._id}
                        className="flex items-center justify-between gap-2 rounded-md border border-border bg-white px-3 py-2"
                      >
                        <div className="min-w-0">
                          <p className="text-sm font-semibold">{coupon.coupon_code}</p>
                          <p className="truncate text-xs text-muted-foreground">
                            {COUPON_TYPE_LABELS[coupon.coupon_type as keyof typeof COUPON_TYPE_LABELS] ?? coupon.coupon_type}
                            {' · '}
                            {formatCouponValue(coupon)}
                          </p>
                          {!coupon.isApplicable && (
                            <p className="text-xs text-danger">Not applicable to your cart</p>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => handleApplyCoupon(coupon.coupon_code)}
                          disabled={isDisabled}
                          className="shrink-0 text-sm font-medium text-primary transition-colors hover:underline disabled:opacity-50"
                        >
                          Apply
                        </button>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-sm text-muted-foreground">No offers available right now.</p>
                )}
              </div>
            )}
          </>
        )}
      </div>

      <div className="mb-5 flex items-baseline justify-between gap-3 border-t border-border/70 pt-4">
        <span className="shrink-0 text-base font-bold sm:text-lg">Total</span>
        {total > 0 ? (
          <span className="text-right text-xl font-bold text-primary sm:text-2xl">
            KSH {total.toFixed(2)}
          </span>
        ) : (
          <span className="text-right text-xl font-bold text-primary sm:text-2xl">
            FREE
          </span>
        )}
      </div>

      {isCheckoutPage ? (
        <CartPayment
          cartId={cartId}
          itemCount={itemCount}
          selectedAddressId={selectedAddressId}
          onPaymentSuccess={onPaymentSuccess}
        />
      ) : (
        <Link
          href={getCartCheckoutRoutePath()}
          aria-disabled={itemCount === 0 || isLoading}
          className={`global_btn rounded_full bg_primary mb-2 h-12 w-full justify-center gap-2 whitespace-nowrap px-4 text-sm font-medium sm:gap-3 sm:px-6 sm:text-base ${
            itemCount === 0 || isLoading ? 'pointer-events-none opacity-50' : ''
          }`}
        >
          <span>Proceed to Checkout</span>
          <ArrowRight className="h-5 w-5 shrink-0" />
        </Link>
      )}

      <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
        <Lock className="h-3.5 w-3.5 shrink-0" />
        {total > 0 ? 'Secure M-Pesa checkout' : 'No payment required'}
      </p>
    </div>
  );
}
