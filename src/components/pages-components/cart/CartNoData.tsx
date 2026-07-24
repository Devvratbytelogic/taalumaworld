'use client';

import { useRouter } from 'next/navigation';
import { ArrowRight, ShoppingBag } from 'lucide-react';
import Button from '@/components/ui/Button';
import { getHomeRoutePath } from '@/routes/routes';

export default function CartNoData() {
  const router = useRouter();

  return (
    <div className="flex min-h-[70vh] items-center justify-center py-10 sm:py-16">
      <div className="container max-w-lg px-4 sm:px-6">
        <div className="rounded-md border border-border bg-white px-6 py-12 text-center sm:px-10 sm:py-14">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary sm:mb-7 sm:h-20 sm:w-20">
            <ShoppingBag className="h-8 w-8 sm:h-9 sm:w-9" strokeWidth={1.75} />
          </div>

          <h2 className="mb-2 text-xl font-bold tracking-tight sm:text-2xl">Your cart is empty</h2>
          <p className="mx-auto mb-8 max-w-sm text-sm leading-relaxed text-muted-foreground sm:text-base">
            Start adding blueprints to your cart to begin your reading journey.
          </p>

          <div className="flex justify-center">
            <Button
              className="global_btn rounded_full bg_primary w_fit px-6"
              onPress={() => router.push(getHomeRoutePath())}
              endContent={<ArrowRight className="h-4 w-4" />}
            >
              Browse Blueprints
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
