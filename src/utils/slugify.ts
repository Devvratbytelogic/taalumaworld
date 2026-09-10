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

/** Converts a string into a URL-friendly slug via the `slugify` package. */
export function slugify(text: string, options: SlugifyOptions = {}): string {
  const slug = slugifyNpm(String(text ?? ''), SLUGIFY_OPTIONS);
  if (options.allowTrailingHyphen && text.endsWith('-') && slug) {
    return `${slug}-`;
  }
  return slug;
}
