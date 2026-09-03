export type SocialAuthExtras = {
    referralCode?: string
    acceptedAgreementIds?: string[]
}

export type SocialLoginResult = {
    http_status_code?: number
    success?: boolean
    status?: boolean
    message?: string
    data?: {
        token?: string
        id?: string
        email?: string
        role?: { name?: string }
    }
}

export type SocialOAuthProvider = 'linkedin' | 'meta'

export type SocialOAuthPending = {
    referral_code?: string
    accepted_agreement_ids?: string[]
    returnTo: string
}

function oauthKeys(provider: SocialOAuthProvider) {
    return {
        state: `tw_${provider}_oauth_state`,
        pending: `tw_${provider}_oauth_pending`,
        lock: `tw_${provider}_oauth_lock`,
    }
}

export function getSocialOAuthRedirectUri(provider: SocialOAuthProvider): string {
    if (typeof window === 'undefined') return ''
    if (provider === 'linkedin') return window.location.origin
    return `${window.location.origin}/auth/meta/callback`
}

export function generateOAuthState(): string {
    const bytes = new Uint8Array(24)
    crypto.getRandomValues(bytes)
    return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('')
}

export function buildSocialAuthBody(extras: SocialAuthExtras): {
    referral_code?: string
    accepted_agreement_ids?: string[]
} {
    const body: { referral_code?: string; accepted_agreement_ids?: string[] } = {}
    const referral = extras.referralCode?.trim()
    if (referral) body.referral_code = referral
    if (extras.acceptedAgreementIds?.length) {
        body.accepted_agreement_ids = extras.acceptedAgreementIds
    }
    return body
}

export function isSocialLoginSuccess(res: SocialLoginResult | undefined): boolean {
    return Boolean(res?.data?.token)
}

export function createSocialAuthorizeUrl(provider: SocialOAuthProvider, clientId: string, state: string): string {
    const redirectUri = getSocialOAuthRedirectUri(provider)
    if (provider === 'linkedin') {
        const params = new URLSearchParams({
            response_type: 'code',
            client_id: clientId,
            redirect_uri: redirectUri,
            scope: 'openid profile email',
            state,
        })
        return `https://www.linkedin.com/oauth/v2/authorization?${params.toString()}`
    }

    const params = new URLSearchParams({
        client_id: clientId,
        redirect_uri: redirectUri,
        scope: 'email,public_profile',
        response_type: 'code',
        state,
    })
    return `https://www.facebook.com/v21.0/dialog/oauth?${params.toString()}`
}

export function beginSocialOAuth(provider: SocialOAuthProvider, extras: SocialAuthExtras): { state: string; pending: SocialOAuthPending } {
    const keys = oauthKeys(provider)
    const pending: SocialOAuthPending = {
        ...buildSocialAuthBody(extras),
        returnTo: `${window.location.pathname}${window.location.search}`,
    }
    const state = generateOAuthState()
    sessionStorage.setItem(keys.state, state)
    sessionStorage.setItem(keys.pending, JSON.stringify(pending))
    sessionStorage.removeItem(keys.lock)
    return { state, pending }
}

export function readSocialOAuthPending(provider: SocialOAuthProvider): SocialOAuthPending | null {
    try {
        const raw = sessionStorage.getItem(oauthKeys(provider).pending)
        if (!raw) return null
        return JSON.parse(raw) as SocialOAuthPending
    } catch {
        return null
    }
}

export function clearSocialOAuth(provider: SocialOAuthProvider): void {
    const keys = oauthKeys(provider)
    sessionStorage.removeItem(keys.state)
    sessionStorage.removeItem(keys.pending)
    sessionStorage.removeItem(keys.lock)
}

/** Returns false if this authorization code is already being exchanged (React Strict Mode remounts). */
export function claimSocialOAuthCode(provider: SocialOAuthProvider, code: string): boolean {
    const { lock } = oauthKeys(provider)
    if (sessionStorage.getItem(lock) === code) return false
    sessionStorage.setItem(lock, code)
    return true
}

export function readSocialOAuthState(provider: SocialOAuthProvider): string | null {
    return sessionStorage.getItem(oauthKeys(provider).state)
}

const OAUTH_QUERY_KEYS = ['code', 'state', 'error', 'error_description', 'error_reason']

export function stripOAuthQuery(href: string): string {
    const url = new URL(href)
    for (const key of OAUTH_QUERY_KEYS) {
        url.searchParams.delete(key)
    }
    return `${url.pathname}${url.search}${url.hash}`
}

export function isSocialOAuthCallbackPath(provider: SocialOAuthProvider, pathname: string): boolean {
    if (provider === 'meta') return pathname === '/auth/meta/callback'
    // LinkedIn's registered redirect URI is the site origin (no path), so the browser lands on `/`.
    return pathname === '/'
}

export function hasSocialOAuthCallbackParams(searchParams: { get: (key: string) => string | null }): boolean {
    return Boolean(searchParams.get('state') && (searchParams.get('code') || searchParams.get('error')))
}
