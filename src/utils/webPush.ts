import Cookies from 'js-cookie'
import { API_BASE_URL } from '@/utils/config'
import { AUTH_COOKIE_NAME, hasAuthCookie } from '@/utils/authCookies'
import { authFetch } from '@/utils/refreshSession'

const OFF_KEY = 'taaluma-push-off'

export function isPushSupported() {
    return typeof window !== 'undefined'
        && 'serviceWorker' in navigator
        && 'PushManager' in window
        && 'Notification' in window
}

export async function getPushState() {
    if (!isPushSupported()) {
        return { supported: false, permission: 'unsupported' as const, subscribed: false }
    }

    const registration = await navigator.serviceWorker.getRegistration('/')
    const subscription = registration ? await registration.pushManager.getSubscription() : null

    return {
        supported: true,
        permission: Notification.permission,
        subscribed: Boolean(subscription) && localStorage.getItem(OFF_KEY) !== '1',
    }
}

function urlBase64ToUint8Array(value: string) {
    const padding = '='.repeat((4 - (value.length % 4)) % 4)
    const base64 = (value + padding).replace(/-/g, '+').replace(/_/g, '/')
    const raw = window.atob(base64)
    const output = new Uint8Array(raw.length)
    for (let i = 0; i < raw.length; i += 1) output[i] = raw.charCodeAt(i)
    return output
}

async function pushRequest(path: string, method: 'GET' | 'POST' | 'DELETE', body?: unknown) {
    const response = await authFetch(`${API_BASE_URL}${path}`, {
        method,
        headers: body ? { 'Content-Type': 'application/json' } : undefined,
        body: body ? JSON.stringify(body) : undefined,
    })
    const payload = await response.json().catch(() => null)
    if (!response.ok) {
        const message = payload?.message
        throw new Error(typeof message === 'string' && message ? message : 'Notification request failed.')
    }
    return payload
}

function publicKeyFrom(payload: { data?: unknown; publicKey?: string; public_key?: string } | null) {
    const data = payload?.data
    if (typeof data === 'string' && data) return data
    const record = (data && typeof data === 'object' ? data : payload) as {
        publicKey?: string
        public_key?: string
        vapidPublicKey?: string
        vapid_public_key?: string
    } | null
    const key = record?.publicKey || record?.public_key || record?.vapidPublicKey || record?.vapid_public_key
    if (!key) throw new Error('Push public key was not found.')
    return key
}

async function createBrowserSubscription() {
    const registration = await navigator.serviceWorker.register('/sw.js')
    await navigator.serviceWorker.ready
    const existing = await registration.pushManager.getSubscription()
    if (existing) return existing

    const payload = await pushRequest('/admin/push/vapid-public-key', 'GET')
    return registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKeyFrom(payload)),
    })
}

/** Ask for permission, then save this browser with POST /admin/push/subscribe. */
export async function enableWebPush() {
    if (!isPushSupported()) throw new Error('This browser does not support notifications.')
    if (!hasAuthCookie()) throw new Error('Sign in to turn on notifications.')

    const permission = Notification.permission === 'granted'
        ? 'granted'
        : await Notification.requestPermission()

    if (permission === 'denied') {
        throw new Error('Notifications are blocked. Allow them in your browser settings, then try again.')
    }
    if (permission !== 'granted') throw new Error('Notification permission was not granted.')

    localStorage.removeItem(OFF_KEY)
    const subscription = await createBrowserSubscription()
    await pushRequest('/admin/push/subscribe', 'POST', subscription.toJSON())
}

/** Remove this browser with DELETE /admin/push/unsubscribe. */
export async function disableWebPush() {
    localStorage.setItem(OFF_KEY, '1')
    const registration = await navigator.serviceWorker.getRegistration('/')
    const subscription = registration ? await registration.pushManager.getSubscription() : null
    if (!subscription) return

    await pushRequest('/admin/push/unsubscribe', 'DELETE', subscription.toJSON())
    await subscription.unsubscribe()
}

/** Ask with the browser prompt when needed, then save this browser. */
export async function syncWebPush() {
    if (!isPushSupported() || !hasAuthCookie()) return
    if (Notification.permission === 'denied' || localStorage.getItem(OFF_KEY) === '1') return
    try {
        await enableWebPush()
    } catch {
        // Dismissing the browser prompt should not block the page.
    }
}

/** Called from sign-out, before the auth cookie is cleared. */
export async function unsubscribeCurrentWebPush() {
    try {
        const registration = await navigator.serviceWorker.getRegistration('/')
        const subscription = registration ? await registration.pushManager.getSubscription() : null
        const token = Cookies.get(AUTH_COOKIE_NAME)
        if (subscription && token) {
            await fetch(`${API_BASE_URL}/admin/push/unsubscribe`, {
                method: 'DELETE',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(subscription.toJSON()),
                signal: AbortSignal.timeout(8000),
            })
            await subscription.unsubscribe()
        }
    } catch {
        // Sign-out still continues.
    }
}
