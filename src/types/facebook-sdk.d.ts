export {}

interface FacebookAuthResponse {
    accessToken: string
    userID: string
    expiresIn?: number
    signedRequest?: string
}

interface FacebookLoginResponse {
    status: 'connected' | 'not_authorized' | 'unknown'
    authResponse: FacebookAuthResponse | null
}

interface FacebookSDK {
    init: (params: {
        appId: string
        cookie?: boolean
        xfbml?: boolean
        version: string
    }) => void
    login: (
        callback: (response: FacebookLoginResponse) => void,
        options?: { scope?: string }
    ) => void
}

declare global {
    interface Window {
        FB?: FacebookSDK
        fbAsyncInit?: () => void
    }
}
