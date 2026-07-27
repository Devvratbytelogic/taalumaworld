'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useDispatch } from 'react-redux'
import { GoogleLogin, type CredentialResponse } from '@react-oauth/google'
import toast from '@/utils/toast'
import { closeModal } from '@/store/slices/allModalSlice'
import { useUserGoogleLoginMutation } from '@/store/rtkQueries/userAuthApi'
import { setAuthCookies } from '@/utils/authCookies'

interface GoogleAuthButtonProps {
    text?: 'signin_with' | 'signup_with'
    successMessage?: string
}

/** "Continue with Google" button + divider, used on both Sign In and Sign Up. */
export default function GoogleAuthButton({ text = 'signin_with', successMessage = 'Signed in with Google!' }: GoogleAuthButtonProps) {
    const dispatch = useDispatch()
    const router = useRouter()
    const searchParams = useSearchParams()
    const referralCodeFromParams = searchParams.get('referralCode') ?? ''
    const [googleLogin, { isLoading }] = useUserGoogleLoginMutation()

    const handleSuccess = async (credentialResponse: CredentialResponse) => {
        if (!credentialResponse.credential) return

        try {
            const payload = {
                id_token: credentialResponse.credential,
                referral_code: referralCodeFromParams,
            }
            const res = await googleLogin(payload).unwrap()

            if (res?.http_status_code === 200 || res?.http_status_code === 201) {
                setAuthCookies({
                    token: res?.data?.token ?? '',
                    user: { id: res?.data?.id, email: res?.data?.email },
                    role: res?.data?.role?.name ?? '',
                })
                toast.success(res?.message ?? successMessage)
                router.refresh()
                dispatch(closeModal())
            }
        } catch (error) {
            console.error('Google authentication failed. Please try again.', error)
            // toast.error('Google authentication failed. Please try again.')
        }
    }

    return (
        <div className="flex flex-col items-center gap-3">
            <div className={isLoading ? 'opacity-60 pointer-events-none' : ''}>
                <GoogleLogin
                    onSuccess={handleSuccess}
                    onError={() => toast.error('Google authentication failed. Please try again.')}
                    text={text}
                    shape="pill"
                    width="320"
                />
            </div>
            <div className="flex items-center gap-3 w-full">
                <div className="flex-1 h-px bg-border" />
                <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">or</span>
                <div className="flex-1 h-px bg-border" />
            </div>
        </div>
    )
}
