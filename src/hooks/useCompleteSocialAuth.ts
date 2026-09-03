'use client'

import { useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux'
import { closeModal } from '@/store/slices/allModalSlice'
import { setAuthCookies } from '@/utils/authCookies'
import toast from '@/utils/toast'
import { RootState } from '@/store/store'
import { isSocialLoginSuccess, type SocialLoginResult } from '@/utils/socialAuth'

/** Shared session write used by Google, LinkedIn, and Facebook login. */
export function useCompleteSocialAuth() {
    const dispatch = useDispatch()
    const router = useRouter()
    const { data } = useSelector((state: RootState) => state.allModal)
    const onSuccess = data?.onSuccess

    return useCallback((res: SocialLoginResult | undefined, successMessage: string) => {
        if (!isSocialLoginSuccess(res) || !res?.data?.token) return false

        setAuthCookies({
            token: res.data.token,
            user: { id: res.data.id, email: res.data.email },
            role: res.data.role?.name ?? '',
        })
        toast.success(res.message ?? successMessage)
        router.refresh()
        dispatch(closeModal())
        if (typeof onSuccess === 'function') {
            onSuccess()
        }
        return true
    }, [dispatch, onSuccess, router])
}
