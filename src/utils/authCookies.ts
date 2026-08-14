import Cookies from 'js-cookie'

const COOKIE_OPTIONS = { path: '/', sameSite: 'lax' as const, expires: 1 } // 7 days
const SESSION_COOKIE_OPTIONS = { ...COOKIE_OPTIONS }

/** Cookie name for auth token (used by server/layout for reading auth state) */
export const AUTH_COOKIE_NAME = 'auth_token'

/** Auth data returned by login / verify-email / verify-phone */
export interface AuthResponseData {
    token?: string
    access_token?: string
    user?: { id?: string; email?: string }
    role?: string
}

/**
 * Store auth token, user id and role in cookies after successful login.
 * Dispatches auth-changed so hooks (e.g. useAuth + profile query) refresh,
 * and invalidates RTK Query tags that depend on auth (e.g. purchase state on /user/content).
 */

/** Tags whose responses differ for guest vs authenticated users. */
const AUTH_DEPENDENT_TAGS = [
    'AllChapters',
    'SingleChapter',
    'Cart',
    'MyChapters',
    'Wishlist',
    'UserProfile',
    'FollowedMentors',
    'ReadingHistory',
    'UserOrders',
    'Address',
    'ReferralWalletLedger',
] as const

function dispatchAuthChanged(): void {
    if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('auth-changed'))
    }
}

/** Refetch mounted queries that were cached before login/logout. Dynamic import avoids a cycle with rtkQuerieSetup → authCookies. */
function invalidateAuthDependentQueries(): void {
    if (typeof window === 'undefined') return
    void import('@/store/store').then(({ store }) => {
        void import('@/store/services/rtkQuerieSetup').then(({ rtkQuerieSetup }) => {
            store.dispatch(rtkQuerieSetup.util.invalidateTags([...AUTH_DEPENDENT_TAGS]))
        })
    })
}

export function setAuthCookies(data: AuthResponseData): void {
    const token = data.token ?? data.access_token;
    const userId = data.user?.id;
    const email = data.user?.email;
    const role = data.role;

    if (token) {
        Cookies.set('auth_token', token, SESSION_COOKIE_OPTIONS)
    }
    if (userId) {
        Cookies.set('userID', userId, SESSION_COOKIE_OPTIONS)
    }
    if (email) {
        Cookies.set('user_email', email, SESSION_COOKIE_OPTIONS)
    }
    if (role) {
        Cookies.set('user_role', role, SESSION_COOKIE_OPTIONS)
    }

    dispatchAuthChanged()
    invalidateAuthDependentQueries()
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

export function getUserEmail(): string | undefined {
    return Cookies.get('user_email')
}

export function hasAuthCookie(): boolean {
    return !!getAuthToken()
}

/** Clear auth cookies on logout */
export function clearAuthCookies(): void {
    Cookies.remove('auth_token', { path: '/' })
    Cookies.remove('userID', { path: '/' })
    Cookies.remove('user_role', { path: '/' })
    Cookies.remove('user_email', { path: '/' })
    dispatchAuthChanged()
    invalidateAuthDependentQueries()
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
