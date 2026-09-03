import { META_APP_ID } from '@/utils/config'

type FacebookSDK = NonNullable<Window['FB']>

const FACEBOOK_SDK_SCRIPT_ID = 'facebook-jssdk'
const FACEBOOK_GRAPH_VERSION = 'v21.0'

let sdkPromise: Promise<FacebookSDK> | null = null

export function loadFacebookSdk(appId = META_APP_ID): Promise<FacebookSDK> {
    if (typeof window === 'undefined') {
        return Promise.reject(new Error('Facebook SDK is only available in the browser'))
    }
    if (!appId) {
        return Promise.reject(new Error('Facebook app id is not configured'))
    }
    if (window.FB) return Promise.resolve(window.FB)
    if (sdkPromise) return sdkPromise

    sdkPromise = new Promise((resolve, reject) => {
        window.fbAsyncInit = function () {
            window.FB?.init({
                appId,
                cookie: true,
                xfbml: false,
                version: FACEBOOK_GRAPH_VERSION,
            })
            if (!window.FB) {
                sdkPromise = null
                reject(new Error('Facebook SDK failed to initialize'))
                return
            }
            resolve(window.FB)
        }

        if (document.getElementById(FACEBOOK_SDK_SCRIPT_ID)) {
            const started = Date.now()
            const timer = window.setInterval(() => {
                if (window.FB) {
                    window.clearInterval(timer)
                    window.FB.init({
                        appId,
                        cookie: true,
                        xfbml: false,
                        version: FACEBOOK_GRAPH_VERSION,
                    })
                    resolve(window.FB)
                } else if (Date.now() - started > 8000) {
                    window.clearInterval(timer)
                    sdkPromise = null
                    reject(new Error('Failed to load Facebook SDK'))
                }
            }, 50)
            return
        }

        const script = document.createElement('script')
        script.id = FACEBOOK_SDK_SCRIPT_ID
        script.async = true
        script.defer = true
        script.crossOrigin = 'anonymous'
        script.src = 'https://connect.facebook.net/en_US/sdk.js'
        script.onerror = () => {
            sdkPromise = null
            reject(new Error('Failed to load Facebook SDK'))
        }
        document.body.appendChild(script)
    })

    return sdkPromise
}

export function requestFacebookAccessToken(appId = META_APP_ID): Promise<string> {
    return loadFacebookSdk(appId).then((FB) => {
        return new Promise((resolve, reject) => {
            FB.login(
                (response) => {
                    const token = response.authResponse?.accessToken
                    if (!token) {
                        reject(new Error('cancelled'))
                        return
                    }
                    resolve(token)
                },
                { scope: 'email,public_profile' },
            )
        })
    })
}
