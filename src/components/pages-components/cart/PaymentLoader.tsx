import { Loader2 } from 'lucide-react'
import React from 'react'

export default function PaymentLoader() {
    return (
        <>
            <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center">
                <div className="bg-white rounded-3xl p-10 flex flex-col items-center gap-4 shadow-xl max-w-xs w-full mx-4">
                    <Loader2 className="h-12 w-12 text-primary animate-spin" />
                    <p className="text-lg font-semibold">Processing Payment</p>
                    <p className="text-sm text-muted-foreground text-center">
                        Please complete the payment in the Razorpay window. Do not close or refresh the page.
                    </p>
                </div>
            </div>
        </>
    )
}
