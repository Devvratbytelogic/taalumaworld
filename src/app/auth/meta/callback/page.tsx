'use client'

import { Suspense } from 'react'
import { Loader2 } from 'lucide-react'

/** Facebook / Meta OAuth redirect target. The actual token exchange runs in SocialOAuthCallbackHandler. */
export default function MetaCallbackPage() {
    return (
        <Suspense fallback={<MetaCallbackStatus />}>
            <MetaCallbackStatus />
        </Suspense>
    )
}

function MetaCallbackStatus() {
    return (
        <div className="min-h-[50vh] flex items-center justify-center px-4">
            <div className="flex items-center gap-3 rounded-md border bg-white px-5 py-4 shadow-sm">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
                <p className="text-sm font-medium text-foreground">Signing in with Facebook…</p>
            </div>
        </div>
    )
}
