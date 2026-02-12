/**
 * Route protection config: paths that require the user to be logged in.
 * Used by middleware to redirect unauthenticated users.
 */
export const PROTECTED_PATH_PREFIXES = ['/admin', '/user-dashboard'] as const;

export const AUTH_COOKIE_NAME = 'taaluma_authenticated';
export const AUTH_COOKIE_MAX_AGE_DAYS = 7;
export const AUTH_REDIRECT_PATH = '/';

/** Dummy token for auth until real auth is wired up */
export const DUMMY_AUTH_TOKEN = 'dummy-jwt-token-placeholder';

/**
 * Returns true if the given pathname is a protected route (requires login).
 */
export function isProtectedPath(pathname: string): boolean {
  return PROTECTED_PATH_PREFIXES.some((prefix) =>
    pathname === prefix || pathname.startsWith(prefix + '/')
  );
}

/**
 * Get the auth token from cookies (client-only).
 */
export function getAuthToken(): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(
    new RegExp('(?:^|; )' + AUTH_COOKIE_NAME.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '=([^;]*)')
  );
  return match ? decodeURIComponent(match[1]) : null;
}

/**
 * Returns true if the auth cookie exists and has a non-empty value.
 */
export function hasAuthCookie(): boolean {
  const token = getAuthToken();
  return !!token && token.length > 0;
}

/**
 * Set auth cookie with dummy token (client-only). Call after sign-in so middleware can allow protected routes.
 */
export function setAuthCookie(token?: string): void {
  if (typeof document === 'undefined') return;
  const value = token ?? DUMMY_AUTH_TOKEN;
  const maxAge = AUTH_COOKIE_MAX_AGE_DAYS * 24 * 60 * 60;
  document.cookie = `${AUTH_COOKIE_NAME}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

/**
 * Clear auth cookie (client-only). Call on sign-out so middleware blocks protected routes.
 */
export function clearAuthCookie(): void {
  if (typeof document === 'undefined') return;
  document.cookie = `${AUTH_COOKIE_NAME}=; path=/; max-age=0`;
}
