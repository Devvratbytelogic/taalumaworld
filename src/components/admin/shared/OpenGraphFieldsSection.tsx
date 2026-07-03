'use client';

import { X } from 'lucide-react';
import Button from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { cn } from '@/components/ui/utils';

export type OpenGraphFormValues = {
  meta_title: string;
  meta_description: string;
  og_title: string;
  og_description: string;
  og_image: File | string | null;
  json_ld: string;
};

interface OpenGraphFieldsSectionProps {
  idPrefix: string;
  values: OpenGraphFormValues;
  errors: Partial<Record<keyof OpenGraphFormValues, string>>;
  touched: Partial<Record<keyof OpenGraphFormValues, boolean>>;
  handleChange: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  handleBlur: React.FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  disabled?: boolean;
  ogImagePreviewUrl?: string | null;
  ogImageFileName?: string | null;
  onOgImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onOgImageClear: () => void;
  ogImageOptional?: boolean;
}

export function OpenGraphFieldsSection({
  idPrefix,
  values,
  errors,
  touched,
  handleChange,
  handleBlur,
  disabled = false,
  ogImagePreviewUrl,
  ogImageFileName,
  onOgImageChange,
  onOgImageClear,
  ogImageOptional = true,
}: OpenGraphFieldsSectionProps) {
  return (
    <div className="blueprint-form-section">
      <div>
        <h3 className="text-sm font-semibold text-slate-900">SEO, Open Graph & structured data</h3>
        <p className="mt-1 text-sm text-slate-500">Optional metadata for search engines and social sharing.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor={`${idPrefix}-meta-title`}>Meta title</Label>
          <Input
            id={`${idPrefix}-meta-title`}
            name="meta_title"
            placeholder="Page title for search engines"
            value={values.meta_title}
            onChange={handleChange}
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
            onChange={handleChange}
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
            onChange={handleChange}
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
            onChange={handleChange}
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
              accept="image/*"
              onChange={onOgImageChange}
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
              onPress={onOgImageClear}
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
          onChange={handleChange}
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
