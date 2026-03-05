import Cookies from 'js-cookie'

const COOKIE_OPTIONS = { path: '/', sameSite: 'lax' as const }
const TOKEN_MAX_AGE_DAYS = 7

/** Auth data returned by login / verify-email / verify-phone */
export interface AuthResponseData {
    token?: string
    access_token?: string
    user?: { _id?: string; id?: string; [key: string]: unknown }
    role?: { _id?: string; id?: string; name?: string; [key: string]: unknown }
}

/**
 * Store auth token, user id and role in cookies after successful login/verify.
 * Handles common API shapes: token or access_token; user._id or user.id; role.id, role.name.
 */
export function setAuthCookies(data: AuthResponseData): void {
    const token = data.token ?? data.access_token
    if (token) {
        Cookies.set('auth_token', token, { ...COOKIE_OPTIONS, expires: TOKEN_MAX_AGE_DAYS })
    }

    const userId = data.user?._id ?? data.user?.id
    if (userId) {
        Cookies.set('userID', String(userId), { ...COOKIE_OPTIONS, expires: TOKEN_MAX_AGE_DAYS })
    }

    const role = data.role
    if (role) {
        const roleValue = role.name ?? role.id ?? role._id
        if (roleValue) {
            Cookies.set('user_role', String(roleValue), { ...COOKIE_OPTIONS, expires: TOKEN_MAX_AGE_DAYS })
        }
    }
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

/** Clear auth cookies on logout */
export function clearAuthCookies(): void {
    Cookies.remove('auth_token', { path: '/' })
    Cookies.remove('userID', { path: '/' })
    Cookies.remove('user_role', { path: '/' })
}
