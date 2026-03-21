import Cookies from 'js-cookie'

const COOKIE_OPTIONS = { path: '/', sameSite: 'lax' as const }
/** Session cookies: no expires = removed when browser/tab is closed */
const SESSION_COOKIE_OPTIONS = { ...COOKIE_OPTIONS }

/** Cookie name for auth token (used by server/layout for reading auth state) */
export const AUTH_COOKIE_NAME = 'auth_token'

/** Auth data returned by login / verify-email / verify-phone */
export interface AuthResponseData {
    token?: string
    access_token?: string
    user?: { _id?: string; id?: string; [key: string]: unknown }
    /** Role can be a string (e.g. "Vendor") or object with name/id/_id */
    role?: string | { _id?: string; id?: string; name?: string; [key: string]: unknown }
}

/**
 * Store auth token, user id and role in cookies after successful login/verify.
 * Uses session cookies so the user is logged out when the browser is closed.
 * Handles common API shapes: token or access_token; user._id or user.id; role.id, role.name.
 */
export interface UserDisplayData {
    fullName: string;
    email: string;
    photo?: string | null;
}

const USER_DISPLAY_KEY = 'auth_user_display'

export function setUserDisplayData(data: UserDisplayData): void {
    if (typeof window === 'undefined') return
    localStorage.setItem(USER_DISPLAY_KEY, JSON.stringify(data))
}

export function getUserDisplayData(): UserDisplayData | null {
    if (typeof window === 'undefined') return null
    try {
        const raw = localStorage.getItem(USER_DISPLAY_KEY)
        return raw ? (JSON.parse(raw) as UserDisplayData) : null
    } catch {
        return null
    }
}

function clearUserDisplayData(): void {
    if (typeof window === 'undefined') return
    localStorage.removeItem(USER_DISPLAY_KEY)
}

function dispatchAuthChanged(): void {
    if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('auth-changed'))
    }
}

export function setAuthCookies(data: AuthResponseData): void {
    const token = data.token ?? data.access_token
    if (token) {
        Cookies.set('auth_token', token, SESSION_COOKIE_OPTIONS)
    }

    const userId = data.user?._id ?? data.user?.id
    if (userId) {
        Cookies.set('userID', String(userId), SESSION_COOKIE_OPTIONS)
    }

    const role = data.role
    if (role != null && role !== '') {
        const roleValue = typeof role === 'string' ? role : (role.name ?? role.id ?? role._id)
        if (roleValue) {
            Cookies.set('user_role', String(roleValue), SESSION_COOKIE_OPTIONS)
        }
    }

    dispatchAuthChanged()
}

export function getAuthToken(): string | undefined {
    return Cookies.get('auth_token')
}

export function getUserRole(): string | undefined {
    return Cookies.get('user_role')
}

export function getUserId(): string | undefined {
    return Cookies.get('userID')
}

/** Returns true if the user has an auth token (client-only). */
export function hasAuthCookie(): boolean {
    return !!getAuthToken()
}

/**
 * Temporary token used only for the forgot-password "new password" request.
 * When set, baseQuery uses this instead of auth_token cookie so the user is not logged in.
 * Cleared by baseQuery after the request is prepared.
 */
let resetTokenForNextRequest: string | null = null

export function setResetTokenForNextRequest(token: string | null): void {
    resetTokenForNextRequest = token
}

export function getAndClearResetTokenForNextRequest(): string | null {
    const token = resetTokenForNextRequest
    resetTokenForNextRequest = null
    return token
}

/** Clear auth cookies on logout */
export function clearAuthCookies(): void {
    Cookies.remove('auth_token', { path: '/' })
    Cookies.remove('userID', { path: '/' })
    Cookies.remove('user_role', { path: '/' })
    clearUserDisplayData()
    dispatchAuthChanged()
}

/** Clear all cookies for the current domain and reload the page (e.g. after logout). */
export function clearAllCookiesAndReload(homePath: string = '/'): void {
    const all = Cookies.get()
    Object.keys(all).forEach((name) => Cookies.remove(name, { path: '/' }))
    window.location.href = homePath
}

/**
 * Returns true if the error indicates invalid/expired token or unauthorized access.
 * Use this to trigger auto logout from API error handlers.
 */
export function isUnauthorizedError(message: string, status?: number): boolean {
    if (status === 401) return true
    const lower = (message || '').toLowerCase()
    return lower.includes('unauthorized') || lower.includes('invalid token') || lower.includes('token expired')
}

/**
 * Clear auth cookies and redirect to home. Safe to call from API error handlers.
 * No-op when run on server (no window).
 */
export function logoutAndRedirectToHome(): void {
    if (typeof window === 'undefined') return
    clearAuthCookies()
    window.location.href = '/'
}
