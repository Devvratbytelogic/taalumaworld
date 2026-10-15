let action: (() => void) | null = null

export function rememberActionIfBlocked(error: unknown, next: () => void) {
  const status = (error as { data?: { httpStatus?: number } })?.data?.httpStatus
  if (status === 403) action = next
}

export function runRememberedAction() {
  const next = action
  action = null
  next?.()
}

export function forgetAction() {
  action = null
}
