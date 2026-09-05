import Cookies from 'js-cookie'

/** Access-token cookie lifetime matches the refresh session (1 day). JWT expiry is 15 min; the interceptor refreshes it. */
const COOKIE_OPTIONS = { path: '/', sameSite: 'lax' as const, expires: 1 }
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

/** Replace only the access token after a successful refresh. Does not fire auth-changed. */
export function setAccessToken(token: string | null): void {
    if (token) {
        Cookies.set(AUTH_COOKIE_NAME, token, SESSION_COOKIE_OPTIONS)
        return
    }
    Cookies.remove(AUTH_COOKIE_NAME, { path: '/' })
}

export function setAuthCookies(data: AuthResponseData): void {
    const token = data.token ?? data.access_token;
    const userId = data.user?.id;
    const email = data.user?.email;
    const role = data.role;

    if (token) {
        Cookies.set(AUTH_COOKIE_NAME, token, SESSION_COOKIE_OPTIONS)
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
    return Cookies.get(AUTH_COOKIE_NAME)
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
export function clearAuthCookies(options?: { refetchQueries?: boolean }): void {
    Cookies.remove(AUTH_COOKIE_NAME, { path: '/' })
    Cookies.remove('userID', { path: '/' })
    Cookies.remove('user_role', { path: '/' })
    Cookies.remove('user_email', { path: '/' })
    dispatchAuthChanged()
    if (options?.refetchQueries !== false) {
        invalidateAuthDependentQueries()
    }
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
