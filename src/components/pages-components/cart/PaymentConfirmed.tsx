import React from 'react'
import { CheckCircle } from 'lucide-react'
import Button from '@/components/ui/Button'
import { useRouter } from 'next/navigation'
import { getUserDashboardRoutePath } from '@/routes/routes'

export default function PaymentConfirmed() {
    const router = useRouter();
    return (
        <>
            <div className="min-h-screen bg-gray-50 py-12 flex items-center justify-center">
                <div className="mx-auto sm:px-4 max-w-lg">
                    <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm text-center">
                        <div className="bg-success/10 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                            <CheckCircle className="h-12 w-12 text-success" />
                        </div>
                        <h1 className="text-3xl font-bold mb-3">Order Confirmed!</h1>
                        <p className="text-muted-foreground mb-8">
                            Your chapters are now unlocked and ready to read. Head to your
                            dashboard to start exploring.
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
        </>
    )
}
