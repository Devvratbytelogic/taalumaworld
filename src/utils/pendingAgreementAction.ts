const STORAGE_KEY = 'free-reading-after-login'

let action: (() => void) | null = null
let resumeStarted = false
let reading = false

export function beginFreeReading() {
  if (reading) return false
  reading = true
  return true
}

export function endFreeReading() {
  reading = false
}

export function rememberAction(next: () => void) {
  action = next
}

export function rememberActionIfBlocked(error: unknown, next: () => void) {
  const status = (error as { data?: { httpStatus?: number } })?.data?.httpStatus
  if (status === 403) rememberAction(next)
}

export function runRememberedAction() {
  const next = action
  action = null
  next?.()
}

export function rememberFreeReading(id: string, type?: string) {
  if (typeof window === 'undefined') return
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ id, type: type ?? '' }))
}

/** Read the saved free-reading click once after a social login redirect. */
export function claimFreeReadingResume(): { id: string; type?: string } | null {
  if (resumeStarted || typeof window === 'undefined') return null
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    resumeStarted = true
    return JSON.parse(raw) as { id: string; type?: string }
  } catch {
    return null
  }
}

export function forgetAction() {
  action = null
  if (typeof window !== 'undefined') sessionStorage.removeItem(STORAGE_KEY)
}
