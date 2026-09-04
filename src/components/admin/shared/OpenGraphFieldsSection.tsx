'use client';

import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import Button from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { cn } from '@/components/ui/utils';
import { FileUploadLimitHint } from '@/components/ui/FileUploadLimitHint';
import { ALLOWED_IMAGE_ACCEPT } from '@/constants/fileUpload';

export type OpenGraphFormValues = {
  meta_title: string;
  meta_description: string;
  og_title: string;
  og_description: string;
  og_image: File | string | null;
  json_ld: string;
};

export type OpenGraphSchemaType = 'Article' | 'Book' | 'WebSite' | 'WebPage';

type GeneratedOpenGraphFields = Pick<
  OpenGraphFormValues,
  'meta_title' | 'meta_description' | 'og_title' | 'og_description' | 'json_ld'
>;

const GENERATED_FIELDS: (keyof GeneratedOpenGraphFields)[] = [
  'meta_title',
  'meta_description',
  'og_title',
  'og_description',
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
    json_ld: JSON.stringify(jsonLdObject, null, 2),
  };
}

function getImageSourceKey(file?: File | null, previewUrl?: string | null) {
  if (file) return `file:${file.name}:${file.size}:${file.lastModified}`;
  if (previewUrl) return `url:${previewUrl}`;
  return null;
}

interface OpenGraphFieldsSectionProps {
  idPrefix: string;
  values: OpenGraphFormValues;
  errors: Partial<Record<keyof OpenGraphFormValues, string>>;
  touched: Partial<Record<keyof OpenGraphFormValues, boolean>>;
  handleChange: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  handleBlur: React.FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  setFieldValue: (field: string, value: string) => void;
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
  ogImageOptional = true,
}: OpenGraphFieldsSectionProps) {
  const lastGeneratedRef = useRef<GeneratedOpenGraphFields | null>(null);
  const manualFieldsRef = useRef<Set<keyof GeneratedOpenGraphFields>>(new Set());
  const ogImageManualRef = useRef(false);
  const lastSourceImageKeyRef = useRef<string | null>(null);
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
    onOgImageClear();
  };

  return (
    <div className="blueprint-form-section">
      <div>
        <h3 className="text-sm font-semibold text-slate-900">SEO, Open Graph & structured data</h3>
        <p className="mt-1 text-sm text-slate-500">
          Text fields fill from the title and description; OG image fills from the cover or logo
          image. Edit any field to customize it.
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
          <Label htmlFor={`${idPrefix}-og-image`}>
            OG image
            {!ogImageOptional ? <span className="text-red-500"> *</span> : null}
            {ogImageOptional ? (
              <span className="ml-1 text-xs font-normal text-slate-400">(optional)</span>
            ) : null}
            <FileUploadLimitHint kind="image" />
          </Label>
          <label
            htmlFor={`${idPrefix}-og-image`}
            className={cn(
              'blueprint-file-picker',
              errors.og_image && touched.og_image && 'border-red-500',
            )}
          >
            <input
              id={`${idPrefix}-og-image`}
              type="file"
              accept={ALLOWED_IMAGE_ACCEPT}
              onChange={handleOgImageInputChange}
              disabled={disabled}
              className="sr-only"
            />
            <span className="truncate">
              {ogImageFileName ?? (ogImagePreviewUrl ? 'Replace OG image...' : 'Select OG image...')}
            </span>
          </label>
          {errors.og_image && touched.og_image ? (
            <p className="text-sm text-red-600">{errors.og_image as string}</p>
          ) : null}
        </div>
        {ogImagePreviewUrl ? (
          <div className="relative inline-block">
            <div className="image-preview max-w-24">
              <img src={ogImagePreviewUrl} alt="OG image preview" className="h-full w-full object-cover" />
            </div>
            <Button
              type="button"
              isIconOnly
              className="absolute top-1 right-1 global_btn bg_transparent icon_btn"
              onPress={handleOgImageClearClick}
            >
              <X className="h-4 w-4" />
            </Button>
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
