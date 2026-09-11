import slugifyNpm from 'slugify';

type SlugifyOptions = {
  /** Keep a single trailing hyphen so users can type "hello-world" in a slug field. */
  allowTrailingHyphen?: boolean;
};

const SLUGIFY_OPTIONS = {
  lower: true,
  strict: true,
  trim: true,
} as const;

/**
 * The `slugify` package rewrites these into English words (`%` → "percent").
 * Strip them first so titles like "ter%%%" become "ter", not "terpercentpercentpercent".
 */
const SLUG_WORD_SYMBOLS =
  /[%$<>|¢£¤¥©®™℠฿€₹₿♥∞∑∆∂†•…§₠₢₣₤₥₦₧₨₩₪₫₭₮₯₰₱₲₳₴₵₸₺₽元円﷼]/g;

function collapseHyphens(slug: string): string {
  return slug.replace(/-+/g, '-').replace(/^-+|-+$/g, '');
}

/** Converts a string into a URL-friendly slug via the `slugify` package. */
export function slugify(text: string, options: SlugifyOptions = {}): string {
  const prepared = String(text ?? '').replace(SLUG_WORD_SYMBOLS, ' ');
  const slug = collapseHyphens(slugifyNpm(prepared, SLUGIFY_OPTIONS));
  if (options.allowTrailingHyphen && text.endsWith('-') && slug) {
    return `${slug}-`;
  }
  return slug;
}
