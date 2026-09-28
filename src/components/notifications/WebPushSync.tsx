'use client'

import { useEffect } from 'react'
import { hasAuthCookie } from '@/utils/authCookies'
import { isPushSupported, syncWebPush } from '@/utils/webPush'

/** Chrome only shows its permission dialog from a click, so ask on the next one. */
export function WebPushSync() {
    useEffect(() => {
        const ask = () => {
            if (!hasAuthCookie()) return
            void syncWebPush()
        }

        ask()
        window.addEventListener('auth-changed', ask)

        const onClick = () => {
            if (!hasAuthCookie() || !isPushSupported()) return
            if (Notification.permission !== 'default') {
                window.removeEventListener('click', onClick)
                return
            }
            window.removeEventListener('click', onClick)
            ask()
        }
        window.addEventListener('click', onClick)

        return () => {
            window.removeEventListener('auth-changed', ask)
            window.removeEventListener('click', onClick)
        }
    }, [])

    return null
}
