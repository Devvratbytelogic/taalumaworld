const STORAGE_KEY = 'auth-session-sync'
const CHANNEL_NAME = 'taalumaworld-auth'

type AuthSyncMessage = {
    type: 'logout'
    at: number
}

function isLogoutMessage(value: unknown): value is AuthSyncMessage {
    if (!value || typeof value !== 'object') return false
    const message = value as AuthSyncMessage
    return message.type === 'logout' && typeof message.at === 'number'
}

/** Tell other same-origin tabs that this tab signed out. Does not run in the sender tab. */
export function broadcastLogout(): void {
    if (typeof window === 'undefined') return

    const message: AuthSyncMessage = { type: 'logout', at: Date.now() }

    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(message))
    } catch {
        // Private mode or blocked storage — BroadcastChannel may still work.
    }

    try {
        const channel = new BroadcastChannel(CHANNEL_NAME)
        channel.postMessage(message)
        channel.close()
    } catch {
        // Unsupported — storage event is the fallback.
    }
}

export function subscribeToRemoteLogout(onLogout: () => void): () => void {
    let handledAt = 0

    const handle = (value: unknown) => {
        if (!isLogoutMessage(value) || value.at <= handledAt) return
        handledAt = value.at
        onLogout()
    }

    const onStorage = (event: StorageEvent) => {
        if (event.key !== STORAGE_KEY || !event.newValue) return
        try {
            handle(JSON.parse(event.newValue) as unknown)
        } catch {
            // Ignore malformed payloads.
        }
    }

    window.addEventListener('storage', onStorage)

    let channel: BroadcastChannel | null = null
    try {
        channel = new BroadcastChannel(CHANNEL_NAME)
        channel.onmessage = (event) => handle(event.data)
    } catch {
        channel = null
    }

    return () => {
        window.removeEventListener('storage', onStorage)
        channel?.close()
    }
}
