import {
  CAMPAIGN_CLICK_ID_KEYS,
  CAMPAIGN_FIELD_MAX_LENGTH,
  CAMPAIGN_REGISTER_KEYS,
  CAMPAIGN_STORAGE_KEY,
  CAMPAIGN_TTL_MS,
  CAMPAIGN_UTM_KEYS,
} from '@/constants/campaignAttribution';

export type CampaignRegisterKey = (typeof CAMPAIGN_REGISTER_KEYS)[number];

export type CampaignRegisterFields = Partial<Record<CampaignRegisterKey, string>>;

export type StoredCampaignAttribution = CampaignRegisterFields & {
  referral_code?: string;
  captured_at: number;
};

const TRACKING_QUERY_KEYS = [...CAMPAIGN_UTM_KEYS, ...CAMPAIGN_CLICK_ID_KEYS];

function clip(value: string | null | undefined, max: number): string | undefined {
  const trimmed = value?.trim();
  if (!trimmed) return undefined;
  return trimmed.slice(0, max);
}

function hasCampaignSignal(fields: CampaignRegisterFields): boolean {
  return [...CAMPAIGN_UTM_KEYS, ...CAMPAIGN_CLICK_ID_KEYS].some((key) => Boolean(fields[key]));
}

function readFromLocation(): Omit<StoredCampaignAttribution, 'captured_at'> {
  const params = new URLSearchParams(window.location.search);
  const fields: Omit<StoredCampaignAttribution, 'captured_at'> = {};

  for (const key of CAMPAIGN_REGISTER_KEYS) {
    if (key === 'landing_url' || key === 'referrer') continue;
    const value = clip(params.get(key), CAMPAIGN_FIELD_MAX_LENGTH[key]);
    if (value) fields[key] = value;
  }

  const referral = clip(params.get('referral_code') || params.get('referralCode'), 200);
  if (referral) fields.referral_code = referral;

  if (hasCampaignSignal(fields)) {
    const landingUrl = clip(window.location.href, CAMPAIGN_FIELD_MAX_LENGTH.landing_url);
    const referrer = clip(document.referrer, CAMPAIGN_FIELD_MAX_LENGTH.referrer);
    if (landingUrl) fields.landing_url = landingUrl;
    if (referrer) fields.referrer = referrer;
  }

  return fields;
}

function isExpired(stored: StoredCampaignAttribution): boolean {
  if (!stored.captured_at || Number.isNaN(stored.captured_at)) return true;
  return Date.now() - stored.captured_at > CAMPAIGN_TTL_MS;
}

function readStored(): StoredCampaignAttribution | null {
  try {
    const raw = window.localStorage.getItem(CAMPAIGN_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredCampaignAttribution;
    if (!parsed || typeof parsed !== 'object') return null;
    if (isExpired(parsed)) {
      window.localStorage.removeItem(CAMPAIGN_STORAGE_KEY);
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

function writeStored(value: StoredCampaignAttribution): void {
  try {
    window.localStorage.setItem(CAMPAIGN_STORAGE_KEY, JSON.stringify(value));
  } catch {
    // Ignore quota / private-mode failures; registration still works without attribution.
  }
}

function stripTrackingParamsFromUrl(): void {
  const url = new URL(window.location.href);
  let changed = false;
  for (const key of TRACKING_QUERY_KEYS) {
    if (url.searchParams.has(key)) {
      url.searchParams.delete(key);
      changed = true;
    }
  }
  if (!changed) return;
  const next = `${url.pathname}${url.search}${url.hash}`;
  window.history.replaceState(window.history.state, '', next);
}

function isOAuthCallbackSearch(search: string): boolean {
  const params = new URLSearchParams(search);
  return Boolean(params.get('state') && (params.get('code') || params.get('error')));
}

function peekStored(): StoredCampaignAttribution | null {
  if (typeof window === 'undefined') return null;
  return readStored();
}

function shouldStripTrackingParams(): boolean {
  const path = window.location.pathname;
  // Never mutate payment-return URLs; Paystack uses `reference` / `trxref`.
  return path !== '/cart' && !path.startsWith('/cart/');
}

/**
 * Capture UTM / click ids / referral on first visit. First-touch only:
 * an existing unexpired campaign record is never overwritten.
 */
export function captureCampaignAttribution(): void {
  if (typeof window === 'undefined') return;
  if (isOAuthCallbackSearch(window.location.search)) return;

  const fromUrl = readFromLocation();
  const existing = readStored();
  const now = Date.now();

  if (!existing) {
    if (hasCampaignSignal(fromUrl) || fromUrl.referral_code) {
      writeStored({ ...fromUrl, captured_at: now });
    }
  } else if (!hasCampaignSignal(existing) && hasCampaignSignal(fromUrl)) {
    writeStored({
      ...fromUrl,
      referral_code: fromUrl.referral_code || existing.referral_code,
      captured_at: now,
    });
  } else if (!existing.referral_code && fromUrl.referral_code) {
    writeStored({ ...existing, referral_code: fromUrl.referral_code });
  }

  if (shouldStripTrackingParams()) {
    stripTrackingParamsFromUrl();
  }
}

export function getStoredCampaignAttribution(): StoredCampaignAttribution | null {
  return peekStored();
}

export function getStoredReferralCode(): string {
  return getStoredCampaignAttribution()?.referral_code?.trim() || '';
}

export function getCampaignRegisterFields(): CampaignRegisterFields {
  const stored = getStoredCampaignAttribution();
  if (!stored || !hasCampaignSignal(stored)) return {};

  const fields: CampaignRegisterFields = {};
  for (const key of CAMPAIGN_REGISTER_KEYS) {
    const value = stored[key]?.trim();
    if (value) fields[key] = value;
  }
  return fields;
}

export function appendCampaignAttributionToFormData(formData: FormData): void {
  const fields = getCampaignRegisterFields();
  for (const [key, value] of Object.entries(fields)) {
    if (value) formData.append(key, value);
  }
}

export function getReferralCodeFromSearch(searchParams: {
  get: (key: string) => string | null;
}): string {
  return (searchParams.get('referral_code') || searchParams.get('referralCode') || '').trim();
}
