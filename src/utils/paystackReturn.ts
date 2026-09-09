import type { PaystackVerifyResponse } from '@/store/rtkQueries/userGetAPI';

export type PaystackVerifyOutcome = 'pending' | 'completed' | 'failed';

const SUCCESS_STATUSES = new Set(['success', 'successful', 'completed', 'paid']);
const FAILED_STATUSES = new Set([
  'failed',
  'fail',
  'cancelled',
  'canceled',
  'cancel',
  'abandoned',
  'unpaid',
]);

function firstSearchParam(value?: string | string[] | null): string {
  const raw = Array.isArray(value) ? value[0] : value;
  return raw?.trim() || '';
}

type PaystackSearchRecord = {
  reference?: string | string[] | null;
  trxref?: string | string[] | null;
};

function isSearchParamsLike(
  value: URLSearchParams | PaystackSearchRecord,
): value is URLSearchParams {
  return typeof (value as URLSearchParams).get === 'function';
}

function getSearchValue(
  searchParams: URLSearchParams | PaystackSearchRecord,
  key: 'reference' | 'trxref',
): string {
  if (isSearchParamsLike(searchParams)) {
    return searchParams.get(key)?.trim() || '';
  }
  return firstSearchParam(searchParams[key]);
}

export function getPaystackReturnReference(
  searchParams: URLSearchParams | PaystackSearchRecord,
): string | null {
  return getSearchValue(searchParams, 'reference') || getSearchValue(searchParams, 'trxref') || null;
}

/** Direct blueprint/series confirm modal: Paystack callbacks always include `trxref`. */
export function getDirectPurchasePaystackReference(
  searchParams: URLSearchParams | PaystackSearchRecord,
): string | null {
  const trxref = getSearchValue(searchParams, 'trxref');
  if (!trxref) return null;
  return getSearchValue(searchParams, 'reference') || trxref;
}

function normalizeStatus(value?: string | null) {
  return value?.trim().toLowerCase() ?? '';
}

export function getPaystackVerifyOutcome(res?: PaystackVerifyResponse): PaystackVerifyOutcome {
  const raw =
    normalizeStatus(res?.data?.status) || normalizeStatus(res?.data?.payment_status);

  if (SUCCESS_STATUSES.has(raw)) return 'completed';
  if (FAILED_STATUSES.has(raw)) return 'failed';
  if (raw === 'pending' || raw === 'processing') return 'pending';
  if (!raw && (res?.success || res?.status || res?.http_status_code === 200)) {
    return 'completed';
  }
  return 'pending';
}
