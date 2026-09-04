export const IMAGE_UPLOAD_MAX_MB = 5;
export const PDF_UPLOAD_MAX_MB = 10;

export const IMAGE_UPLOAD_MAX_BYTES = IMAGE_UPLOAD_MAX_MB * 1024 * 1024;
export const PDF_UPLOAD_MAX_BYTES = PDF_UPLOAD_MAX_MB * 1024 * 1024;

export const ALLOWED_IMAGE_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const;

export const ALLOWED_IMAGE_ACCEPT = '.jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp';

export const ALLOWED_IMAGE_TYPES_LABEL = 'JPEG, PNG, or WEBP';

export const IMAGE_UPLOAD_LIMIT_LABEL = `${ALLOWED_IMAGE_TYPES_LABEL} · max ${IMAGE_UPLOAD_MAX_MB}MB`;
export const PDF_UPLOAD_LIMIT_LABEL = `max ${PDF_UPLOAD_MAX_MB}MB`;

const ALLOWED_IMAGE_MIME_TYPE_SET: ReadonlySet<string> = new Set([
  ...ALLOWED_IMAGE_MIME_TYPES,
  'image/jpg',
]);

export function isAllowedImageFile(file: File): boolean {
  return ALLOWED_IMAGE_MIME_TYPE_SET.has(file.type);
}

export function getImageTypeErrorMessage() {
  return `Please select a ${ALLOWED_IMAGE_TYPES_LABEL} image`;
}

/** Existing URL/string or empty is OK; a new File must be jpeg/png/webp. */
export function isAllowedImageValue(value: unknown): boolean {
  if (value == null || typeof value === 'string') return true;
  if (value instanceof File) return isAllowedImageFile(value);
  return false;
}

export function getImageSizeLimitMessage(noun = 'Image') {
  return `${noun} must be less than ${IMAGE_UPLOAD_MAX_MB}MB`;
}

export function getPdfSizeLimitMessage() {
  return `PDF must be less than ${PDF_UPLOAD_MAX_MB}MB`;
}
