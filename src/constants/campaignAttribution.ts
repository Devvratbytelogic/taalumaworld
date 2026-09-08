export const CAMPAIGN_STORAGE_KEY = 'taaluma_campaign';

/** First-touch TTL. After expiry a later visit may capture a new campaign. */
export const CAMPAIGN_TTL_MS = 90 * 24 * 60 * 60 * 1000;

export const CAMPAIGN_USERS_MODEL = 'Campaign Users';

export const CAMPAIGN_UTM_KEYS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
] as const;

export const CAMPAIGN_CLICK_ID_KEYS = ['fbclid', 'gclid', 'ttclid'] as const;

export const CAMPAIGN_REGISTER_KEYS = [
  ...CAMPAIGN_UTM_KEYS,
  ...CAMPAIGN_CLICK_ID_KEYS,
  'landing_url',
  'referrer',
] as const;

export const CAMPAIGN_FIELD_MAX_LENGTH: Record<(typeof CAMPAIGN_REGISTER_KEYS)[number], number> = {
  utm_source: 200,
  utm_medium: 200,
  utm_campaign: 200,
  utm_term: 200,
  utm_content: 200,
  fbclid: 200,
  gclid: 200,
  ttclid: 200,
  landing_url: 2000,
  referrer: 2000,
};

export const CAMPAIGN_SOURCE_OPTIONS = ['meta', 'google', 'tiktok', 'linkedin', 'email'] as const;
