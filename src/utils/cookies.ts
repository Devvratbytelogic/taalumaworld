/**
 * Client-side cookie utilities.
 * Use only in components/hooks that run in the browser (e.g. after mount or in event handlers).
 */

/**
 * Get a cookie value by name.
 * @param name - Cookie name
 * @returns The decoded cookie value, or undefined if not found or when run on the server
 */
export function getCookie(name: string): string | undefined {
  if (typeof document === 'undefined') return undefined;
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = document.cookie.match(
    new RegExp('(?:^|; )' + escaped + '=([^;]*)')
  );
  return match ? decodeURIComponent(match[1]) : undefined;
}

/**
 * Get all cookies as a key-value object.
 * @returns Record of cookie names to decoded values
 */
export function getAllCookies(): Record<string, string> {
  if (typeof document === 'undefined') return {};
  return document.cookie.split(';').reduce<Record<string, string>>((acc, part) => {
    const [rawName, ...valueParts] = part.trim().split('=');
    const name = rawName?.trim();
    const value = valueParts.join('=').trim();
    if (name) acc[name] = decodeURIComponent(value);
    return acc;
  }, {});
}

/**
 * Check if a cookie exists and has a non-empty value.
 */
export function hasCookie(name: string): boolean {
  const value = getCookie(name);
  return value !== undefined && value !== '';
}
