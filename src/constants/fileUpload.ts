export const IMAGE_UPLOAD_MAX_MB = 5;
export const PDF_UPLOAD_MAX_MB = 10;

export const IMAGE_UPLOAD_MAX_BYTES = IMAGE_UPLOAD_MAX_MB * 1024 * 1024;
export const PDF_UPLOAD_MAX_BYTES = PDF_UPLOAD_MAX_MB * 1024 * 1024;

export const IMAGE_UPLOAD_LIMIT_LABEL = `max ${IMAGE_UPLOAD_MAX_MB}MB`;
export const PDF_UPLOAD_LIMIT_LABEL = `max ${PDF_UPLOAD_MAX_MB}MB`;

export function getImageSizeLimitMessage(noun = 'Image') {
  return `${noun} must be less than ${IMAGE_UPLOAD_MAX_MB}MB`;
}

export function getPdfSizeLimitMessage() {
  return `PDF must be less than ${PDF_UPLOAD_MAX_MB}MB`;
}
