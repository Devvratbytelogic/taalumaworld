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
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-border sticky top-24">
      <h2 className="text-xl font-bold mb-6">Order Summary</h2>

      <div className="space-y-3 mb-6 pb-6 border-b">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="font-medium">₹{subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Items</span>
          <span className="font-medium">{itemCount}</span>
        </div>
        {discountAmount > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Discount</span>
            <span className="font-medium text-success">
              -₹{discountAmount.toFixed(2)}
            </span>
          </div>
        )}
        {taxAmount > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Tax</span>
            <span className="font-medium">₹{taxAmount.toFixed(2)}</span>
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
        disabled={itemCount === 0 || isLoading}
        startContent={isLoading ? <Loader2 className="h-5 w-5 mr-2 animate-spin" /> : undefined}
        endContent={!isLoading ? <ArrowRight className="h-5 w-5 ml-2" /> : undefined}
      >
        {isLoading ? 'Processing...' : 'Checkout Now'}
      </Button>
    </div>
  );
}
