'use client'

import { useSearchParams } from 'next/navigation'
import { GoogleLogin, type CredentialResponse } from '@react-oauth/google'
import toast from '@/utils/toast'
import { useUserGoogleLoginMutation } from '@/store/rtkQueries/userAuthApi'
import { useCompleteSocialAuth } from '@/hooks/useCompleteSocialAuth'
import { buildSocialAuthBody, type SocialAuthExtras } from '@/utils/socialAuth'
import { GoogleIcon } from '@/components/ui/AllSVG'

interface GoogleAuthButtonProps extends SocialAuthExtras {
    text?: 'signin_with' | 'signup_with'
    successMessage?: string
    showDivider?: boolean
    /** Icon-only control, for a single-row social bar. */
    buttonType?: 'standard' | 'icon'
}

/** "Continue with Google" button, used on Career Architect Sign In and Sign Up. */
export default function GoogleAuthButton({
    text = 'signin_with',
    successMessage = 'Signed in with Google!',
    showDivider = true,
    buttonType = 'standard',
    referralCode,
    acceptedAgreementIds,
}: GoogleAuthButtonProps) {
    const searchParams = useSearchParams()
    const completeSocialAuth = useCompleteSocialAuth()
    const referralCodeFromParams = searchParams.get('referralCode') ?? ''
    const [googleLogin, { isLoading }] = useUserGoogleLoginMutation()

    const handleSuccess = async (credentialResponse: CredentialResponse) => {
        if (!credentialResponse.credential) return

        try {
            const payload = {
                id_token: credentialResponse.credential,
                ...buildSocialAuthBody({
                    referralCode: referralCode || referralCodeFromParams,
                    acceptedAgreementIds,
                }),
            }
            const res = await googleLogin(payload).unwrap()
            completeSocialAuth(res, successMessage)
        } catch (error) {
            console.error('Google authentication failed. Please try again.', error)
        }
    }

    const isIcon = buttonType === 'icon'
    const label = text === 'signup_with' ? 'Sign up with Google' : 'Sign in with Google'

    return (
        <div className={`flex flex-col items-center ${isIcon ? '' : 'gap-3 w-full'}`}>
            {isIcon ? (
                <div
                    className={`relative h-10 w-10 shrink-0 ${isLoading ? 'opacity-60 pointer-events-none' : ''}`}
                    title={label}
                    aria-label={label}
                >
                    <div className="absolute inset-0 overflow-hidden rounded-full">
                        <GoogleLogin
                            onSuccess={handleSuccess}
                            onError={() => toast.error('Google authentication failed. Please try again.')}
                            type="icon"
                            shape="circle"
                            size="large"
                        />
                    </div>
                    <div className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-full border border-[#dadce0] bg-white">
                        <GoogleIcon className="h-5 w-5" />
                    </div>
                </div>
            ) : (
                <div className={isLoading ? 'opacity-60 pointer-events-none' : ''}>
                    <GoogleLogin
                        onSuccess={handleSuccess}
                        onError={() => toast.error('Google authentication failed. Please try again.')}
                        text={text}
                        shape="pill"
                        size="large"
                        width="320"
                    />
                </div>
            )}
            {showDivider ? (
                <div className="flex items-center gap-3 w-full">
                    <div className="flex-1 h-px bg-border" />
                    <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">or</span>
                    <div className="flex-1 h-px bg-border" />
                </div>
            ) : null}
        </div>
    )
}
