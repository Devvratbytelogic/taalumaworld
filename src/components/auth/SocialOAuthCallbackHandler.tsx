'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import toast from '@/utils/toast'
import { useUserLinkedInLoginMutation, useUserMetaLoginMutation } from '@/store/rtkQueries/userAuthApi'
import { setAuthCookies } from '@/utils/authCookies'
import {
    claimSocialOAuthCode,
    clearSocialOAuth,
    getSocialOAuthRedirectUri,
    hasSocialOAuthCallbackParams,
    isSocialOAuthCallbackPath,
    readSocialOAuthPending,
    readSocialOAuthState,
    stripOAuthQuery,
    type SocialOAuthProvider,
} from '@/utils/socialAuth'

const SUCCESS_MESSAGE: Record<SocialOAuthProvider, string> = {
    linkedin: 'Signed in with LinkedIn!',
    meta: 'Signed in with Facebook!',
}

const ERROR_MESSAGE: Record<SocialOAuthProvider, string> = {
    linkedin: 'LinkedIn sign-in was cancelled or failed. Please try again.',
    meta: 'Facebook sign-in was cancelled or failed. Please try again.',
}

const LOADING_LABEL: Record<SocialOAuthProvider, string> = {
    linkedin: 'Signing in with LinkedIn…',
    meta: 'Signing in with Facebook…',
}

function goTo(path: string) {
    window.location.replace(path)
}

export default function SocialOAuthCallbackHandler({ provider }: { provider: SocialOAuthProvider }) {
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const [linkedInLogin] = useUserLinkedInLoginMutation()
    const [metaLogin] = useUserMetaLoginMutation()
    const [isExchanging, setIsExchanging] = useState(false)
    const startedRef = useRef(false)

    const isCallbackScreen =
        isSocialOAuthCallbackPath(provider, pathname) && hasSocialOAuthCallbackParams(searchParams)

    useEffect(() => {
        if (!isSocialOAuthCallbackPath(provider, pathname)) return

        const error = searchParams.get('error')
        const code = searchParams.get('code')
        const state = searchParams.get('state')

        if (!error && !code) return

        const savedState = readSocialOAuthState(provider)
        const pending = readSocialOAuthPending(provider)
        const fallbackPath = pending?.returnTo || stripOAuthQuery(`${window.location.origin}/`)

        if (!savedState || !state || state !== savedState) {
            clearSocialOAuth(provider)
            toast.error(ERROR_MESSAGE[provider])
            goTo(fallbackPath)
            return
        }

        if (error) {
            clearSocialOAuth(provider)
            toast.error(ERROR_MESSAGE[provider])
            goTo(fallbackPath)
            return
        }

        if (!code) return
        if (startedRef.current || !claimSocialOAuthCode(provider, code)) return
        startedRef.current = true
        setIsExchanging(true)

        const exchange = provider === 'linkedin' ? linkedInLogin : metaLogin

        void (async () => {
            try {
                const res = await exchange({
                    code,
                    redirect_uri: getSocialOAuthRedirectUri(provider),
                    ...(pending?.referral_code ? { referral_code: pending.referral_code } : {}),
                    ...(pending?.accepted_agreement_ids?.length
                        ? { accepted_agreement_ids: pending.accepted_agreement_ids }
                        : {}),
                }).unwrap()

                const token = res?.data?.token
                if (!token) {
                    throw new Error(res?.message || `${provider} sign-in failed.`)
                }

                setAuthCookies({
                    token,
                    user: { id: res?.data?.id, email: res?.data?.email },
                    role: res?.data?.role?.name ?? '',
                })
                toast.success(res?.message ?? SUCCESS_MESSAGE[provider])
                clearSocialOAuth(provider)
                goTo(pending?.returnTo || fallbackPath)
            } catch (err) {
                console.error(`${provider} authentication failed. Please try again.`, err)
                clearSocialOAuth(provider)
                goTo(pending?.returnTo || fallbackPath)
            } finally {
                setIsExchanging(false)
            }
        })()
    }, [linkedInLogin, metaLogin, pathname, provider, searchParams])

    if (!isCallbackScreen && !isExchanging) return null

    return (
        <div className="fixed inset-0 z-99999 flex items-center justify-center bg-background">
            <div className="flex items-center gap-3 rounded-md border bg-white px-5 py-4 shadow-sm">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
                <p className="text-sm font-medium text-foreground">{LOADING_LABEL[provider]}</p>
            </div>
        </div>
    )
}
