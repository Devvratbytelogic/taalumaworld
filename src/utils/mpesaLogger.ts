/**
 * M-Pesa payment flow logger.
 *
 * Sends structured log entries to POST /api/logs/mpesa (server-side file)
 * and also echoes them to the browser console for live debugging.
 *
 * Fire-and-forget: logging never blocks or throws in the payment flow.
 */

export type MpesaLogLevel = 'info' | 'warn' | 'error';

export type MpesaLogEvent =
  | 'PAYMENT_INITIATED'
  | 'STK_PUSH_SUCCESS'
  | 'STK_PUSH_FAILED'
  | 'POLL_TICK'
  | 'POLL_COMPLETED'
  | 'POLL_CANCELLED'
  | 'POLL_FAILED'
  | 'POLL_UNKNOWN_STATUS'
  | 'POLL_NETWORK_ERROR'
  | 'POLL_TIMEOUT'
  | 'CHECKOUT_ATTEMPT'
  | 'CHECKOUT_SUCCESS'
  | 'CHECKOUT_FAILED'
  | 'PAYMENT_CANCELLED_BY_USER'
  | 'TEST_MODE_SKIP';

export interface MpesaLogEntry {
  timestamp: string;
  event: MpesaLogEvent;
  level: MpesaLogLevel;
  checkoutId?: string | null;
  amount?: number;
  phone?: number;
  status?: string;
  responseCode?: string;
  error?: string;
  meta?: Record<string, unknown>;
}

const isDev = process.env.NODE_ENV === 'development';

const LEVEL_STYLES: Record<MpesaLogLevel, string> = {
  info:  'color: #2563eb; font-weight: bold',
  warn:  'color: #d97706; font-weight: bold',
  error: 'color: #dc2626; font-weight: bold',
};

function toConsole(entry: MpesaLogEntry) {
  if (!isDev) return;
  const style = LEVEL_STYLES[entry.level];
  const tag = `[M-Pesa][${entry.event}]`;
  const { timestamp, event, level, ...rest } = entry;
  console.groupCollapsed(`%c${tag}`, style, timestamp);
  console.table(rest);
  console.groupEnd();
}

async function sendToServer(entry: MpesaLogEntry) {
  try {
    await fetch('/api/logs/mpesa', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(entry),
      // Never let logging delay the page or throw to caller
      keepalive: true,
    });
  } catch {
    // Silently swallow — logging must never affect the payment flow
  }
}

export function mpesaLog(
  event: MpesaLogEvent,
  level: MpesaLogLevel,
  data?: Omit<MpesaLogEntry, 'timestamp' | 'event' | 'level'>
) {
  const entry: MpesaLogEntry = {
    timestamp: new Date().toISOString(),
    event,
    level,
    ...data,
  };

  toConsole(entry);
  void sendToServer(entry);
}
