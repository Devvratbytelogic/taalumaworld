'use client'

import { useEffect } from 'react'
import { applyLogoutIfAuthCookieGone, applyRemoteLogout } from '@/utils/refreshSession'
import { subscribeToRemoteLogout } from '@/utils/authSync'

/** Keeps other open tabs in sync when this browser signs out. */
export function AuthSessionSync() {
    useEffect(() => {
        const unsubscribe = subscribeToRemoteLogout(() => {
            applyRemoteLogout()
        })

        const checkGatedTab = () => applyLogoutIfAuthCookieGone()
        window.addEventListener('focus', checkGatedTab)
        window.addEventListener('pageshow', checkGatedTab)

        return () => {
            unsubscribe()
            window.removeEventListener('focus', checkGatedTab)
            window.removeEventListener('pageshow', checkGatedTab)
        }
    }, [])

    return null
}
