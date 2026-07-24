'use client';

import { CheckCircle } from 'lucide-react';
import Button from '@/components/ui/Button';
import { useRouter } from 'next/navigation';
import { getUserDashboardRoutePath } from '@/routes/routes';

interface PaymentConfirmedProps {
  transactionId?: string | null;
}

export default function PaymentConfirmed({ transactionId }: PaymentConfirmedProps) {
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 py-12">
      <div className="mx-auto max-w-lg sm:px-4">
        <div className="rounded-md border border-border bg-white p-8 text-center md:p-12">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-success/10">
            <CheckCircle className="h-12 w-12 text-success" />
          </div>
          <h1 className="mb-3 text-3xl font-bold">Order Confirmed!</h1>
          {transactionId && (
            <p className="mb-3 text-sm font-medium text-muted-foreground">
              Transaction ID{' '}
              <span className="font-semibold text-foreground">{transactionId}</span>
            </p>
          )}
          <p className="mb-8 text-muted-foreground">
            Your blueprints are now unlocked and ready to read. Head to your dashboard to start
            exploring.
          </p>
          <Button
            size="lg"
            className="global_btn rounded_full bg_primary w-full"
            onPress={() => router.push(getUserDashboardRoutePath())}
          >
            Go to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}
