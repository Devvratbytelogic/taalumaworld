import Cookies from 'js-cookie'
import { isCareerArchitectRole, isMentorRole } from '@/constants/common'
import {
    getAdminPortalLoginRoutePath,
    getHomeRoutePath,
    getMentorLoginRoutePath,
} from '@/routes/routes'
import { API_BASE_URL } from '@/utils/config'
import {
    AUTH_COOKIE_NAME,
    clearAuthCookies,
    getUserRole,
    setAccessToken,
} from '@/utils/authCookies'
import toast from '@/utils/toast'

export type AuthApiPrefix = '/admin' | '/user'

/** Auth endpoints whose 401 is credentials/OTP, not an expired access token. Do not use a generic `/verify` — that would skip Paystack verify. */
const SKIP_REFRESH_PATH =
    /\/(admin|user)\/(login|logout|refresh)(\/|\?|$)|\/user\/auth\/|\/admin\/(register-mentor|forgot-password-change|forgot-password|resend-otp|verify|register)(\/|\?|$)/i

let refreshPromise: Promise<string | null> | null = null
let isEndingSession = false

export function isSessionEnding(): boolean {
    return isEndingSession
}

export function shouldSkipTokenRefresh(url: string): boolean {
    return SKIP_REFRESH_PATH.test(url)
}

/**
 * Mentors and staff log in via /admin; Career Architects via /user.
 * Role is the source of truth so a mentor shopping on /user APIs still hits /admin/refresh.
 */
export function getAuthApiPrefix(requestUrl = ''): AuthApiPrefix {
    const role = getUserRole()
    if (isCareerArchitectRole(role)) return '/user'
    if (role) return '/admin'

    const url = requestUrl || (typeof window !== 'undefined' ? window.location.pathname : '')
    if (url.includes('/admin') || url.includes('/portal') || url.includes('/mentor')) {
        return '/admin'
    }
    return '/user'
}

export function getSessionExpiredRedirectPath(): string {
    const role = getUserRole()
    if (isMentorRole(role)) return getMentorLoginRoutePath()
    if (isCareerArchitectRole(role)) return getHomeRoutePath()
    if (role) return getAdminPortalLoginRoutePath()

    if (typeof window !== 'undefined') {
        const path = window.location.pathname
        if (path.startsWith('/admin/mentor') || path.startsWith('/mentor')) {
            return getMentorLoginRoutePath()
        }
        if (path.startsWith('/admin') || path.startsWith('/portal')) {
            return getAdminPortalLoginRoutePath()
        }
    }
    return getHomeRoutePath()
}

function deviceHeaders(): HeadersInit {
    const headers: Record<string, string> = { Accept: 'application/json' }
    const deviceId = Cookies.get('device') || ''
    const userId = Cookies.get('userID') || ''
    if (deviceId) headers.device = deviceId
    if (userId) headers.userID = userId
    return headers
}

async function requestNewAccessToken(prefix: AuthApiPrefix): Promise<string | null> {
    const res = await fetch(`${API_BASE_URL}${prefix}/refresh`, {
        method: 'POST',
        credentials: 'include',
        headers: deviceHeaders(),
        signal: AbortSignal.timeout(15_000),
    })
    // Only a 401 means the refresh session is dead. 404/5xx must not force logout.
    if (res.status === 401) return null
    if (!res.ok) {
        throw new Error(`Token refresh failed (${res.status})`)
    }
    const body = (await res.json().catch(() => null)) as {
        data?: { token?: string }
    } | null
    const token = body?.data?.token
    if (!token) {
        throw new Error('Token refresh returned no access token')
    }
    setAccessToken(token)
    return token
}

/** Single-flight refresh: parallel 401s share one POST /refresh. */
export function refreshAccessToken(requestUrl?: string): Promise<string | null> {
    if (!refreshPromise) {
        const prefix = getAuthApiPrefix(requestUrl)
        refreshPromise = requestNewAccessToken(prefix).finally(() => {
            refreshPromise = null
        })
    }
    return refreshPromise
}

export async function signOut(options?: { redirectTo?: string }): Promise<void> {
    if (typeof window === 'undefined') return
    isEndingSession = true
    const prefix = getAuthApiPrefix()
    const redirectTo = options?.redirectTo ?? getHomeRoutePath()
    try {
        await fetch(`${API_BASE_URL}${prefix}/logout`, {
            method: 'POST',
            credentials: 'include',
            headers: deviceHeaders(),
            signal: AbortSignal.timeout(8_000),
        })
    } catch {
        // Local session is still cleared below.
    }
    // Full page navigation remounts as guest — do not invalidate or mounted queries refetch with no token.
    clearAuthCookies({ refetchQueries: false })
    window.location.href = redirectTo
}

export function endSessionAfterRefreshFailure(): void {
    if (typeof window === 'undefined' || isEndingSession) return
    isEndingSession = true
    toast.error('Session expired. Please login again.')
    void signOut({ redirectTo: getSessionExpiredRedirectPath() })
}

/** Authenticated fetch with credentials, Bearer token, and one 401 → refresh → retry. */
export async function authFetch(input: string, init: RequestInit = {}): Promise<Response> {
    const headers = new Headers(init.headers)
    const token = Cookies.get(AUTH_COOKIE_NAME)
    if (token && !headers.has('Authorization')) {
        headers.set('Authorization', `Bearer ${token}`)
    }
    const deviceId = Cookies.get('device') || ''
    const userId = Cookies.get('userID') || ''
    if (deviceId && !headers.has('device')) headers.set('device', deviceId)
    if (userId && !headers.has('userID')) headers.set('userID', userId)

    const requestUrl = input.startsWith(API_BASE_URL) ? input.slice(API_BASE_URL.length) : input

    const doFetch = (accessToken?: string) => {
        const nextHeaders = new Headers(headers)
        if (accessToken) nextHeaders.set('Authorization', `Bearer ${accessToken}`)
        return fetch(input, { ...init, headers: nextHeaders, credentials: 'include' })
    }

    let res = await doFetch()
    if (res.status !== 401 || shouldSkipTokenRefresh(requestUrl) || isEndingSession) {
        return res
    }

    try {
        const newToken = await refreshAccessToken(requestUrl)
        if (!newToken) {
            endSessionAfterRefreshFailure()
            return res
        }
        return doFetch(newToken)
    } catch {
        return res
    }
}
