/** Minimal Network Information API shape (not in all TS lib targets). */
export interface NetworkConnectionInfo {
  effectiveType?: 'slow-2g' | '2g' | '3g' | '4g';
  saveData?: boolean;
  downlink?: number;
  addEventListener(type: 'change', listener: () => void): void;
  removeEventListener(type: 'change', listener: () => void): void;
}

export type NetworkQuality = 'online' | 'offline' | 'slow';

const SLOW_EFFECTIVE_TYPES = new Set(['slow-2g', '2g']);

export function getNetworkConnection(): NetworkConnectionInfo | undefined {
  if (typeof navigator === 'undefined') return undefined;
  return (navigator as Navigator & { connection?: NetworkConnectionInfo }).connection;
}

export function isBrowserOnline(): boolean {
  if (typeof navigator === 'undefined') return true;
  return navigator.onLine;
}

export function isSlowConnection(connection = getNetworkConnection()): boolean {
  if (!connection) return false;
  if (connection.saveData) return true;
  if (connection.effectiveType && SLOW_EFFECTIVE_TYPES.has(connection.effectiveType)) {
    return true;
  }
  if (typeof connection.downlink === 'number' && connection.downlink > 0 && connection.downlink < 0.5) {
    return true;
  }
  return false;
}

export function getNetworkQuality(): NetworkQuality {
  if (!isBrowserOnline()) return 'offline';
  if (isSlowConnection()) return 'slow';
  return 'online';
}

export function isFetchNetworkError(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false;
  const status = (error as { status?: unknown }).status;
  return status === 'FETCH_ERROR' || status === 'TIMEOUT_ERROR' || status === 'PARSING_ERROR';
}

export const NETWORK_MESSAGES = {
  offline: 'You appear to be offline. Check your internet connection.',
  slow: 'Your connection seems slow. Some actions may take longer than usual.',
  backOnline: "You're back online.",
  requestFailedOffline: 'No internet connection. Please reconnect and try again.',
  requestFailedOnline: 'Unable to reach the server. Check your connection and try again.',
} as const;
