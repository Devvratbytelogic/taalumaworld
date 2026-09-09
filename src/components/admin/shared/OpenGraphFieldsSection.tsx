'use client';

import { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { cn } from '@/components/ui/utils';
import { FileUploadLimitHint } from '@/components/ui/FileUploadLimitHint';
import toast from '@/utils/toast';
import {
  ALLOWED_IMAGE_ACCEPT,
  IMAGE_UPLOAD_MAX_BYTES,
  getImageSizeLimitMessage,
  getImageTypeErrorMessage,
  isAllowedImageFile,
} from '@/constants/fileUpload';

export type OpenGraphFormValues = {
  meta_title: string;
  meta_description: string;
  og_title: string;
  og_description: string;
  og_image: File | string | null;
  twitter_title: string;
  twitter_description: string;
  twitter_image: File | string | null;
  json_ld: string;
};

export type OpenGraphSchemaType = 'Article' | 'Book' | 'WebSite' | 'WebPage';

type GeneratedOpenGraphFields = Pick<
  OpenGraphFormValues,
  | 'meta_title'
  | 'meta_description'
  | 'og_title'
  | 'og_description'
  | 'twitter_title'
  | 'twitter_description'
  | 'json_ld'
>;

const GENERATED_FIELDS: (keyof GeneratedOpenGraphFields)[] = [
  'meta_title',
  'meta_description',
  'og_title',
  'og_description',
  'twitter_title',
  'twitter_description',
  'json_ld',
];

/** Strip markdown/HTML noise and collapse whitespace for meta text. */
function toPlainText(value: string) {
  return value
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]*`/g, ' ')
    .replace(/!\[[^\]]*]\([^)]*\)/g, ' ')
    .replace(/\[[^\]]*]\([^)]*\)/g, ' ')
    .replace(/[#>*_~`-]+/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function truncateAtWord(value: string, maxLength: number) {
  if (value.length <= maxLength) return value;
  const truncated = value.slice(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  return (lastSpace > maxLength * 0.6 ? truncated.slice(0, lastSpace) : truncated).trim();
}

export function buildOpenGraphMetadata({
  title,
  description = '',
  schemaType = 'Article',
}: {
  title: string;
  description?: string;
  schemaType?: OpenGraphSchemaType;
}): GeneratedOpenGraphFields {
  const cleanTitle = toPlainText(title);
  const cleanDescription = toPlainText(description);
  const metaTitle = truncateAtWord(cleanTitle, 60);
  const metaDescription = truncateAtWord(cleanDescription || cleanTitle, 160);

  const jsonLdObject: Record<string, string> = {
    '@context': 'https://schema.org',
    '@type': schemaType,
    name: cleanTitle,
    description: metaDescription,
  };

  if (schemaType === 'Article') {
    jsonLdObject.headline = cleanTitle;
  }

  return {
    meta_title: metaTitle,
    meta_description: metaDescription,
    og_title: metaTitle,
    og_description: metaDescription,
    twitter_title: metaTitle,
    twitter_description: metaDescription,
    json_ld: JSON.stringify(jsonLdObject, null, 2),
  };
}

function getImageSourceKey(file?: File | null, previewUrl?: string | null) {
  if (file) return `file:${file.name}:${file.size}:${file.lastModified}`;
  if (previewUrl) return `url:${previewUrl}`;
  return null;
}

const OPEN_GRAPH_TEXT_FIELDS = [
  'meta_title',
  'meta_description',
  'og_title',
  'og_description',
  'twitter_title',
  'twitter_description',
  'json_ld',
] as const;

export const OPEN_GRAPH_FORM_FIELD_KEYS = [
  ...OPEN_GRAPH_TEXT_FIELDS,
  'og_image',
  'twitter_image',
] as const;

function isKeptRemoteImageUrl(value: string) {
  return /^(https?:|\/)/i.test(value);
}

function appendOpenGraphImageField(
  formData: FormData,
  field: 'og_image' | 'twitter_image',
  value: File | string | null | undefined,
) {
  if (value instanceof File) {
    formData.append(field, value);
    return;
  }

  // Keep an already-saved remote image by omitting the file field.
  if (typeof value === 'string' && value && isKeptRemoteImageUrl(value)) {
    return;
  }

  formData.append(field, '');
}

/** Always send OG/SEO fields, including empty strings, so the API can clear them. */
export function appendOpenGraphFieldsToFormData(
  formData: FormData,
  values: {
    meta_title?: string | null;
    meta_description?: string | null;
    og_title?: string | null;
    og_description?: string | null;
    twitter_title?: string | null;
    twitter_description?: string | null;
    json_ld?: string | null;
    ogImage: File | string | null | undefined;
    twitterImage: File | string | null | undefined;
  },
) {
  formData.append('meta_title', values.meta_title ?? '');
  formData.append('meta_description', values.meta_description ?? '');
  formData.append('og_title', values.og_title ?? '');
  formData.append('og_description', values.og_description ?? '');
  formData.append('twitter_title', values.twitter_title ?? '');
  formData.append('twitter_description', values.twitter_description ?? '');
  formData.append('json_ld', values.json_ld ?? '');
  appendOpenGraphImageField(formData, 'og_image', values.ogImage);
  appendOpenGraphImageField(formData, 'twitter_image', values.twitterImage);
}

/** Native picker via a hidden input so the dialog does not scroll a focused file control out of view. */
function FilePickerControl({
  id,
  accept,
  disabled,
  onChange,
  ariaLabel,
  error,
  children,
}: {
  id: string;
  accept: string;
  disabled?: boolean;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  ariaLabel: string;
  error?: boolean;
  children: React.ReactNode;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="relative">
      <input
        ref={inputRef}
        id={id}
        type="file"
        accept={accept}
        onChange={onChange}
        disabled={disabled}
        tabIndex={-1}
        className="hidden"
      />
      <button
        type="button"
        disabled={disabled}
        aria-label={ariaLabel}
        className={cn('blueprint-file-picker w-full text-left', error && 'border-red-500')}
        onClick={() => inputRef.current?.click()}
      >
        <span className="truncate">{children}</span>
      </button>
    </div>
  );
}

function ImagePreviewRemoveButton({
  ariaLabel,
  disabled,
  onRemove,
}: {
  ariaLabel: string;
  disabled?: boolean;
  onRemove: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      disabled={disabled}
      className="absolute top-1 right-1 z-10 flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm hover:text-red-500 disabled:pointer-events-none disabled:opacity-50"
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        onRemove();
      }}
    >
      <X className="h-4 w-4" />
    </button>
  );
}

interface OpenGraphFieldsSectionProps {
  idPrefix: string;
  values: OpenGraphFormValues;
  errors: Partial<Record<keyof OpenGraphFormValues, string>>;
  touched: Partial<Record<keyof OpenGraphFormValues, boolean>>;
  handleChange: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  handleBlur: React.FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  setFieldValue: (field: string, value: string | File | null) => void;
  /** Title used to auto-generate SEO / OG / JSON-LD fields. */
  sourceTitle?: string;
  /** Description used to auto-generate SEO / OG / JSON-LD fields. */
  sourceDescription?: string;
  /** Cover / featured / logo image file used to auto-fill OG image. */
  sourceImageFile?: File | null;
  /** Cover / featured / logo preview URL used to auto-fill OG image when no file is present. */
  sourceImagePreviewUrl?: string | null;
  /** schema.org @type for generated JSON-LD. */
  schemaType?: OpenGraphSchemaType;
  disabled?: boolean;
  ogImagePreviewUrl?: string | null;
  ogImageFileName?: string | null;
  onOgImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onOgImageClear: () => void;
  /** Called when OG image should mirror the source cover/featured/logo image. */
  onOgImagePrefill?: (payload: { file: File | null; previewUrl: string | null }) => void;
  /** Mirror featured/cover image into X image on create/add forms. */
  prefillTwitterFromSource?: boolean;
  ogImageOptional?: boolean;
}

export function OpenGraphFieldsSection({
  idPrefix,
  values,
  errors,
  touched,
  handleChange,
  handleBlur,
  setFieldValue,
  sourceTitle = '',
  sourceDescription = '',
  sourceImageFile = null,
  sourceImagePreviewUrl = null,
  schemaType = 'Article',
  disabled = false,
  ogImagePreviewUrl,
  ogImageFileName,
  onOgImageChange,
  onOgImageClear,
  onOgImagePrefill,
  prefillTwitterFromSource = false,
  ogImageOptional = true,
}: OpenGraphFieldsSectionProps) {
  const lastGeneratedRef = useRef<GeneratedOpenGraphFields | null>(null);
  const manualFieldsRef = useRef<Set<keyof GeneratedOpenGraphFields>>(new Set());
  const ogImageManualRef = useRef(false);
  const lastSourceImageKeyRef = useRef<string | null>(null);
  const twitterImageManualRef = useRef(false);
  const lastTwitterSourceImageKeyRef = useRef<string | null>(null);
  const valuesRef = useRef(values);
  valuesRef.current = values;

  // Keep SEO/OG/JSON-LD in sync with title + description until a field is edited manually.
  useEffect(() => {
    if (disabled) return;
    if (!toPlainText(sourceTitle)) return;

    const generated = buildOpenGraphMetadata({
      title: sourceTitle,
      description: sourceDescription,
      schemaType,
    });
    const previous = lastGeneratedRef.current;
    const currentValues = valuesRef.current;

    GENERATED_FIELDS.forEach((field) => {
      if (manualFieldsRef.current.has(field)) return;

      const current = currentValues[field] ?? '';
      const previousGenerated = previous?.[field] ?? '';

      if (current === '' || current === previousGenerated) {
        if (current !== generated[field]) {
          setFieldValue(field, generated[field]);
        }
        return;
      }

      // Existing value differs from auto output (e.g. edit form) — stop overwriting.
      manualFieldsRef.current.add(field);
    });

    lastGeneratedRef.current = generated;
  }, [sourceTitle, sourceDescription, schemaType, disabled, setFieldValue]);

  // Mirror cover/featured/logo into OG image until the user sets or clears OG manually.
  useEffect(() => {
    if (disabled || !onOgImagePrefill) return;

    const sourceKey = getImageSourceKey(sourceImageFile, sourceImagePreviewUrl);
    const currentOg = valuesRef.current.og_image;
    const hasExistingOg =
      (typeof currentOg === 'string' && currentOg.length > 0) ||
      currentOg instanceof File ||
      Boolean(ogImagePreviewUrl);

    // Form reset — allow prefilling again on the next cover upload.
    if (!sourceKey && !hasExistingOg) {
      ogImageManualRef.current = false;
      lastSourceImageKeyRef.current = null;
      return;
    }

    if (ogImageManualRef.current) return;
    if (!sourceKey || sourceKey === lastSourceImageKeyRef.current) return;

    // Preserve an already-saved OG image on edit forms.
    if (hasExistingOg && lastSourceImageKeyRef.current === null) {
      ogImageManualRef.current = true;
      lastSourceImageKeyRef.current = sourceKey;
      return;
    }

    lastSourceImageKeyRef.current = sourceKey;
    onOgImagePrefill({
      file: sourceImageFile ?? null,
      // Prefer the file so parents create a dedicated object URL (don't share the cover blob URL).
      previewUrl: sourceImageFile ? null : (sourceImagePreviewUrl ?? null),
    });
  }, [
    disabled,
    onOgImagePrefill,
    sourceImageFile,
    sourceImagePreviewUrl,
    ogImagePreviewUrl,
  ]);

  // Mirror featured/cover into X image on create until the user sets or clears it.
  useEffect(() => {
    if (disabled || !prefillTwitterFromSource) return;

    const sourceKey = getImageSourceKey(sourceImageFile, sourceImagePreviewUrl);
    const currentTwitter = valuesRef.current.twitter_image;
    const hasExistingTwitter =
      (typeof currentTwitter === 'string' && currentTwitter.length > 0) ||
      currentTwitter instanceof File;

    if (!sourceKey && !hasExistingTwitter) {
      twitterImageManualRef.current = false;
      lastTwitterSourceImageKeyRef.current = null;
      return;
    }

    if (twitterImageManualRef.current) return;
    if (!sourceKey || sourceKey === lastTwitterSourceImageKeyRef.current) return;

    if (hasExistingTwitter && lastTwitterSourceImageKeyRef.current === null) {
      twitterImageManualRef.current = true;
      lastTwitterSourceImageKeyRef.current = sourceKey;
      return;
    }

    lastTwitterSourceImageKeyRef.current = sourceKey;
    setFieldValue('twitter_image', sourceImageFile ?? sourceImagePreviewUrl ?? null);
  }, [
    disabled,
    prefillTwitterFromSource,
    sourceImageFile,
    sourceImagePreviewUrl,
    setFieldValue,
  ]);

  const [twitterImagePreviewUrl, setTwitterImagePreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (values.twitter_image instanceof File) {
      const url = URL.createObjectURL(values.twitter_image);
      setTwitterImagePreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
    if (typeof values.twitter_image === 'string' && values.twitter_image) {
      setTwitterImagePreviewUrl(values.twitter_image);
      return;
    }
    setTwitterImagePreviewUrl(null);
  }, [values.twitter_image]);

  const handleGeneratedFieldChange: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = (
    event,
  ) => {
    const field = event.target.name as keyof GeneratedOpenGraphFields;
    if (GENERATED_FIELDS.includes(field)) {
      manualFieldsRef.current.add(field);
    }
    handleChange(event);
  };

  const handleOgImageInputChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    ogImageManualRef.current = true;
    onOgImageChange(event);
  };

  const handleOgImageClearClick = () => {
    ogImageManualRef.current = true;
    lastSourceImageKeyRef.current =
      getImageSourceKey(sourceImageFile, sourceImagePreviewUrl) ?? lastSourceImageKeyRef.current;
    onOgImageClear();
  };

  const twitterImageFileName =
    values.twitter_image instanceof File ? values.twitter_image.name : null;

  const handleTwitterImageChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!isAllowedImageFile(file)) {
        toast.error(getImageTypeErrorMessage());
        event.target.value = '';
        return;
      }
      if (file.size > IMAGE_UPLOAD_MAX_BYTES) {
        toast.error(getImageSizeLimitMessage());
        event.target.value = '';
        return;
      }
      twitterImageManualRef.current = true;
      setFieldValue('twitter_image', file);
    }
    event.target.value = '';
  };

  const handleTwitterImageClear = () => {
    twitterImageManualRef.current = true;
    lastTwitterSourceImageKeyRef.current =
      getImageSourceKey(sourceImageFile, sourceImagePreviewUrl) ?? lastTwitterSourceImageKeyRef.current;
    setFieldValue('twitter_image', null);
  };

  return (
    <div className="blueprint-form-section">
      <div>
        <h3 className="text-sm font-semibold text-slate-900">SEO, Open Graph, X & structured data</h3>
        <p className="mt-1 text-sm text-slate-500">
          Text fields fill from the title and description. On create, OG and X images fill from the
          cover or featured image until you replace them or remove them with the X.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor={`${idPrefix}-meta-title`}>Meta title</Label>
          <Input
            id={`${idPrefix}-meta-title`}
            name="meta_title"
            placeholder="Page title for search engines"
            value={values.meta_title}
            onChange={handleGeneratedFieldChange}
            onBlur={handleBlur}
            disabled={disabled}
            className={errors.meta_title && touched.meta_title ? 'border-red-500' : undefined}
          />
          {errors.meta_title && touched.meta_title ? (
            <p className="text-sm text-red-600">{errors.meta_title}</p>
          ) : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${idPrefix}-meta-description`}>Meta description</Label>
          <Textarea
            id={`${idPrefix}-meta-description`}
            name="meta_description"
            placeholder="Page description for search engines"
            value={values.meta_description}
            onChange={handleGeneratedFieldChange}
            onBlur={handleBlur}
            disabled={disabled}
            rows={2}
            className={errors.meta_description && touched.meta_description ? 'border-red-500' : undefined}
          />
          {errors.meta_description && touched.meta_description ? (
            <p className="text-sm text-red-600">{errors.meta_description}</p>
          ) : null}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor={`${idPrefix}-og-title`}>OG title</Label>
          <Input
            id={`${idPrefix}-og-title`}
            name="og_title"
            placeholder="Social share title"
            value={values.og_title}
            onChange={handleGeneratedFieldChange}
            onBlur={handleBlur}
            disabled={disabled}
            className={errors.og_title && touched.og_title ? 'border-red-500' : undefined}
          />
          {errors.og_title && touched.og_title ? (
            <p className="text-sm text-red-600">{errors.og_title}</p>
          ) : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${idPrefix}-og-description`}>OG description</Label>
          <Textarea
            id={`${idPrefix}-og-description`}
            name="og_description"
            placeholder="Social share description"
            value={values.og_description}
            onChange={handleGeneratedFieldChange}
            onBlur={handleBlur}
            disabled={disabled}
            rows={2}
            className={errors.og_description && touched.og_description ? 'border-red-500' : undefined}
          />
          {errors.og_description && touched.og_description ? (
            <p className="text-sm text-red-600">{errors.og_description}</p>
          ) : null}
        </div>
      </div>

      <div className="flex flex-col items-start gap-4 sm:flex-row">
        <div className="min-w-0 flex-1 space-y-2">
          <Label>
            OG image
            {!ogImageOptional ? <span className="text-red-500"> *</span> : null}
            {ogImageOptional ? (
              <span className="ml-1 text-xs font-normal text-slate-400">(optional)</span>
            ) : null}
            <FileUploadLimitHint kind="image" />
          </Label>
          <FilePickerControl
            id={`${idPrefix}-og-image`}
            accept={ALLOWED_IMAGE_ACCEPT}
            onChange={handleOgImageInputChange}
            disabled={disabled}
            ariaLabel="OG image"
            error={Boolean(errors.og_image && touched.og_image)}
          >
            {ogImageFileName ?? (ogImagePreviewUrl ? 'Replace OG image...' : 'Select OG image...')}
          </FilePickerControl>
          {errors.og_image && touched.og_image ? (
            <p className="text-sm text-red-600">{errors.og_image as string}</p>
          ) : null}
        </div>
        {ogImagePreviewUrl ? (
          <div className="relative inline-block">
            <div className="image-preview max-w-24">
              <img src={ogImagePreviewUrl} alt="OG image preview" className="h-full w-full object-cover" />
            </div>
            <ImagePreviewRemoveButton
              ariaLabel="Remove OG image"
              disabled={disabled}
              onRemove={handleOgImageClearClick}
            />
          </div>
        ) : (
          <div className="image-preview-placeholder max-w-24 text-xs">
            <span className="px-2">Preview</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor={`${idPrefix}-twitter-title`}>X title</Label>
          <Input
            id={`${idPrefix}-twitter-title`}
            name="twitter_title"
            placeholder="X/Twitter share title"
            value={values.twitter_title ?? ''}
            onChange={handleGeneratedFieldChange}
            onBlur={handleBlur}
            disabled={disabled}
            className={errors.twitter_title && touched.twitter_title ? 'border-red-500' : undefined}
          />
          {errors.twitter_title && touched.twitter_title ? (
            <p className="text-sm text-red-600">{errors.twitter_title}</p>
          ) : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${idPrefix}-twitter-description`}>X description</Label>
          <Textarea
            id={`${idPrefix}-twitter-description`}
            name="twitter_description"
            placeholder="X/Twitter share description"
            value={values.twitter_description ?? ''}
            onChange={handleGeneratedFieldChange}
            onBlur={handleBlur}
            disabled={disabled}
            rows={2}
            className={
              errors.twitter_description && touched.twitter_description
                ? 'border-red-500'
                : undefined
            }
          />
          {errors.twitter_description && touched.twitter_description ? (
            <p className="text-sm text-red-600">{errors.twitter_description}</p>
          ) : null}
        </div>
      </div>

      <div className="flex flex-col items-start gap-4 sm:flex-row">
        <div className="min-w-0 flex-1 space-y-2">
          <Label>
            X image
            <span className="ml-1 text-xs font-normal text-slate-400">(optional)</span>
            <FileUploadLimitHint kind="image" />
          </Label>
          <FilePickerControl
            id={`${idPrefix}-twitter-image`}
            accept={ALLOWED_IMAGE_ACCEPT}
            onChange={handleTwitterImageChange}
            disabled={disabled}
            ariaLabel="X image"
            error={Boolean(errors.twitter_image && touched.twitter_image)}
          >
            {twitterImageFileName ??
              (twitterImagePreviewUrl ? 'Replace X image...' : 'Select X image...')}
          </FilePickerControl>
          {errors.twitter_image && touched.twitter_image ? (
            <p className="text-sm text-red-600">{errors.twitter_image as string}</p>
          ) : null}
        </div>
        {twitterImagePreviewUrl ? (
          <div className="relative inline-block">
            <div className="image-preview max-w-24">
              <img
                src={twitterImagePreviewUrl}
                alt="X image preview"
                className="h-full w-full object-cover"
              />
            </div>
            <ImagePreviewRemoveButton
              ariaLabel="Remove X image"
              disabled={disabled}
              onRemove={handleTwitterImageClear}
            />
          </div>
        ) : (
          <div className="image-preview-placeholder max-w-24 text-xs">
            <span className="px-2">Preview</span>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor={`${idPrefix}-json-ld`}>JSON-LD structured data</Label>
        <Textarea
          id={`${idPrefix}-json-ld`}
          name="json_ld"
          placeholder='{"@context": "https://schema.org", "@type": "Article", ...}'
          value={values.json_ld}
          onChange={handleGeneratedFieldChange}
          onBlur={handleBlur}
          disabled={disabled}
          rows={4}
          className={cn(
            'json-ld-field',
            errors.json_ld && touched.json_ld && 'border-red-500',
          )}
        />
        {errors.json_ld && touched.json_ld ? (
          <p className="text-sm text-red-600">{errors.json_ld}</p>
        ) : null}
      </div>
    </div>
  );
}
