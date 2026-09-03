'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import GoogleAuthButton from '@/components/auth/GoogleAuthButton'
import { FacebookIcon, LinkedinIcon } from '@/components/ui/AllSVG'
import toast from '@/utils/toast'
import { LINKEDIN_CLIENT_ID, META_APP_ID } from '@/utils/config'
import { useUserMetaLoginMutation } from '@/store/rtkQueries/userAuthApi'
import { useCompleteSocialAuth } from '@/hooks/useCompleteSocialAuth'
import {
    beginSocialOAuth,
    buildSocialAuthBody,
    createSocialAuthorizeUrl,
    type SocialAuthExtras,
} from '@/utils/socialAuth'
import { loadFacebookSdk, requestFacebookAccessToken } from '@/utils/facebookSdk'

interface SocialAuthButtonsProps extends SocialAuthExtras {
    text?: 'signin_with' | 'signup_with'
}

/** Match the Google Identity Services icon button (40×40 circle, light outline). */
const providerButtonClassName =
    'inline-flex items-center justify-center w-10 h-10 box-border rounded-full! appearance-none bg-white border-solid border border-[#dadce0] shadow-none outline-none hover:bg-[#f8faff] disabled:opacity-60 disabled:pointer-events-none'

function isFacebookCancelled(error: unknown): boolean {
    const message =
        error instanceof Error
            ? error.message
            : typeof error === 'object' && error && 'message' in error
                ? String((error as { message: unknown }).message)
                : String(error ?? '')
    return message === 'cancelled'
}

/** Google + LinkedIn + Facebook — Career Architect sign-in / sign-up only. */
export default function SocialAuthButtons({
    text = 'signin_with',
    referralCode,
    acceptedAgreementIds,
}: SocialAuthButtonsProps) {
    const searchParams = useSearchParams()
    const completeSocialAuth = useCompleteSocialAuth()
    const referralCodeFromParams = searchParams.get('referralCode') ?? ''
    const [metaLogin, { isLoading: isMetaLoading }] = useUserMetaLoginMutation()
    const [isLinkedInRedirecting, setIsLinkedInRedirecting] = useState(false)
    const [isFacebookStarting, setIsFacebookStarting] = useState(false)

    const extras: SocialAuthExtras = {
        referralCode: referralCode || referralCodeFromParams,
        acceptedAgreementIds,
    }

    const isBusy = isLinkedInRedirecting || isFacebookStarting || isMetaLoading
    const isSignUp = text === 'signup_with'
    const linkedInLabel = isSignUp ? 'Sign up with LinkedIn' : 'Sign in with LinkedIn'
    const facebookLabel = isSignUp ? 'Sign up with Facebook' : 'Sign in with Facebook'

    useEffect(() => {
        if (!META_APP_ID) return
        void loadFacebookSdk().catch(() => undefined)
    }, [])

    const handleLinkedIn = () => {
        if (!LINKEDIN_CLIENT_ID) {
            toast.error('LinkedIn login is not configured.')
            return
        }
        setIsLinkedInRedirecting(true)
        const { state } = beginSocialOAuth('linkedin', extras)
        window.location.assign(createSocialAuthorizeUrl('linkedin', LINKEDIN_CLIENT_ID, state))
    }

    const handleFacebook = async () => {
        if (!META_APP_ID) {
            toast.error('Facebook login is not configured.')
            return
        }

        setIsFacebookStarting(true)
        try {
            const accessToken = await requestFacebookAccessToken()
            const res = await metaLogin({
                access_token: accessToken,
                ...buildSocialAuthBody(extras),
            }).unwrap()
            completeSocialAuth(res, 'Signed in with Facebook!')
        } catch (error) {
            if (isFacebookCancelled(error)) return
            console.error('Facebook authentication failed. Please try again.', error)
            // RTK Query already toasts API errors (including missing-email 400).
            const isApiError = typeof error === 'object' && error !== null && 'status' in error
            if (!isApiError) {
                toast.error('Facebook sign-in failed. Please try again.')
            }
        } finally {
            setIsFacebookStarting(false)
        }
    }

    return (
        <div className="flex flex-col items-center gap-3 w-full">
            <div className="flex items-center justify-center gap-3">
                <GoogleAuthButton
                    text={text}
                    buttonType="icon"
                    showDivider={false}
                    referralCode={extras.referralCode}
                    acceptedAgreementIds={acceptedAgreementIds}
                />

                <button
                    type="button"
                    className={providerButtonClassName}
                    onClick={handleLinkedIn}
                    disabled={isBusy}
                    aria-label={linkedInLabel}
                    title={linkedInLabel}
                >
                    <LinkedinIcon className="h-5 w-5 text-[#0A66C2]" />
                </button>

                <button
                    type="button"
                    className={providerButtonClassName}
                    onClick={() => void handleFacebook()}
                    disabled={isBusy}
                    aria-label={facebookLabel}
                    title={facebookLabel}
                >
                    <FacebookIcon className="h-5 w-5 text-[#1877F2]" />
                </button>
            </div>

            <div className="flex items-center gap-3 w-full">
                <div className="flex-1 h-px bg-border" />
                <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">or</span>
                <div className="flex-1 h-px bg-border" />
            </div>
        </div>
    )
}
