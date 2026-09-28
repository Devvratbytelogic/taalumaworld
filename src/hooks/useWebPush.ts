'use client'

import { useCallback, useEffect, useState } from 'react'
import toast from '@/utils/toast'
import {
    disableWebPush,
    enableWebPush,
    getPushState,
} from '@/utils/webPush'

export function useWebPush() {
    const [supported, setSupported] = useState(false)
    const [permission, setPermission] = useState<NotificationPermission | 'unsupported'>('default')
    const [subscribed, setSubscribed] = useState(false)
    const [ready, setReady] = useState(false)
    const [busy, setBusy] = useState(false)

    const refresh = useCallback(async () => {
        const state = await getPushState()
        setSupported(state.supported)
        setPermission(state.permission)
        setSubscribed(state.subscribed)
        setReady(true)
    }, [])

    useEffect(() => {
        void refresh()
        window.addEventListener('auth-changed', refresh)
        return () => window.removeEventListener('auth-changed', refresh)
    }, [refresh])

    const enable = useCallback(async () => {
        setBusy(true)
        try {
            await enableWebPush()
            toast.success('Browser notifications are on')
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Could not turn on notifications.')
        } finally {
            await refresh()
            setBusy(false)
        }
    }, [refresh])

    const disable = useCallback(async () => {
        setBusy(true)
        try {
            await disableWebPush()
            toast.success('Browser notifications are off')
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Could not turn off notifications.')
        } finally {
            await refresh()
            setBusy(false)
        }
    }, [refresh])

    return {
        ready,
        supported,
        permission,
        subscribed,
        busy,
        enable,
        disable,
    }
}
