'use client';

import { ArrowRight, Loader2 } from 'lucide-react';
import Button from '@/components/ui/Button';

interface CartSummaryProps {
  subtotal: number;
  total: number;
  itemCount: number;
  discountAmount: number;
  taxAmount: number;
  onCheckout: () => void;
  isLoading?: boolean;
}

export default function CartSummary({
  subtotal,
  total,
  itemCount,
  discountAmount,
  taxAmount,
  onCheckout,
  isLoading = false,
}: CartSummaryProps) {
  return (
    <div className="rounded-2xl border border-border bg-white p-4 shadow-sm sm:rounded-3xl sm:p-6 lg:sticky lg:top-24">
      <h2 className="mb-4 text-lg font-bold sm:mb-6 sm:text-xl">Order Summary</h2>

      <div className="space-y-3 mb-6 pb-6 border-b">
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
            <span className="text-muted-foreground">Discount</span>
            <span className="font-medium text-success">
              -KSH {discountAmount.toFixed(2)}
            </span>
          </div>
        )}
        {taxAmount > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Tax</span>
            <span className="font-medium">KSH {taxAmount.toFixed(2)}</span>
          </div>
        )}
      </div>

      <div className="mb-6 flex flex-wrap items-baseline justify-between gap-2 border-b pb-6">
        <span className="text-base font-bold sm:text-lg">Total</span>
        <span className="text-xl font-bold text-primary sm:text-2xl">
          KSH {total.toFixed(2)}
        </span>
      </div>

      <Button
        size="lg"
        className="global_btn rounded_full bg_primary w-full mb-3"
        onPress={onCheckout}
        disabled={itemCount === 0 || isLoading}
        startContent={isLoading ? <Loader2 className="h-5 w-5 mr-2 animate-spin" /> : undefined}
        endContent={!isLoading ? <ArrowRight className="h-5 w-5 ml-2" /> : undefined}
      >
        {isLoading ? 'Processing...' : 'Checkout Now'}
      </Button>
    </div>
  );
}
