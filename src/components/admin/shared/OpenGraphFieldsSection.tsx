'use client';

import { X } from 'lucide-react';
import Button from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

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
    <div className="border border-border rounded-2xl p-6 space-y-4 bg-muted/10">
      <div>
        <h3 className="text-sm font-semibold">SEO, Open Graph &amp; Structured Data</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Optional page metadata and social sharing fields. Leave blank to fall back to the title, description, and cover image.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor={`${idPrefix}-meta-title`}>Meta Title</Label>
          <Input
            id={`${idPrefix}-meta-title`}
            name="meta_title"
            placeholder="Page title for search engines"
            value={values.meta_title}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={disabled}
            className={errors.meta_title && touched.meta_title ? 'border-red-500' : ''}
          />
          {errors.meta_title && touched.meta_title && (
            <p className="text-sm text-red-600">{errors.meta_title}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${idPrefix}-meta-description`}>Meta Description</Label>
          <Textarea
            id={`${idPrefix}-meta-description`}
            name="meta_description"
            placeholder="Page description for search engines"
            value={values.meta_description}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={disabled}
            rows={2}
            className={`rounded-2xl ${errors.meta_description && touched.meta_description ? 'border-red-500' : ''}`}
          />
          {errors.meta_description && touched.meta_description && (
            <p className="text-sm text-red-600">{errors.meta_description}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor={`${idPrefix}-og-title`}>OG Title</Label>
          <Input
            id={`${idPrefix}-og-title`}
            name="og_title"
            placeholder="Social share title"
            value={values.og_title}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={disabled}
            className={errors.og_title && touched.og_title ? 'border-red-500' : ''}
          />
          {errors.og_title && touched.og_title && (
            <p className="text-sm text-red-600">{errors.og_title}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${idPrefix}-og-description`}>OG Description</Label>
          <Textarea
            id={`${idPrefix}-og-description`}
            name="og_description"
            placeholder="Social share description"
            value={values.og_description}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={disabled}
            rows={2}
            className={`rounded-2xl ${errors.og_description && touched.og_description ? 'border-red-500' : ''}`}
          />
          {errors.og_description && touched.og_description && (
            <p className="text-sm text-red-600">{errors.og_description}</p>
          )}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start">
        <div className="space-y-2 flex-1 min-w-0">
          <Label htmlFor={`${idPrefix}-og-image`}>
            OG Image
            {!ogImageOptional && <span className="text-red-500">*</span>}
            {ogImageOptional && (
              <span className="text-xs text-muted-foreground font-normal ml-1">(optional)</span>
            )}
          </Label>
          <label
            htmlFor={`${idPrefix}-og-image`}
            className={`border-input bg-input-background focus-visible:border-ring flex h-10 w-full cursor-pointer items-center rounded-full border px-4 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted/50 ${errors.og_image && touched.og_image ? 'border-red-500' : ''}`}
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
          {errors.og_image && touched.og_image && (
            <p className="text-sm text-red-600">{errors.og_image as string}</p>
          )}
        </div>
        {ogImagePreviewUrl ? (
          <div className="relative inline-block">
            <div className="rounded-2xl overflow-hidden bg-muted border border-border aspect-square max-w-24">
              <img
                src={ogImagePreviewUrl}
                alt="OG image preview"
                className="w-full h-full object-cover"
              />
            </div>
            <Button
              type="button"
              isIconOnly
              className="absolute top-2 right-2 global_btn rounded_full outline_primary icon_btn fit_btn"
              onPress={onOgImageClear}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-muted-foreground/30 aspect-square max-w-24 flex items-center justify-center bg-muted/30">
            <span className="text-sm text-muted-foreground px-3 text-center">Preview</span>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor={`${idPrefix}-json-ld`}>JSON-LD Structured Data</Label>
        <Textarea
          id={`${idPrefix}-json-ld`}
          name="json_ld"
          placeholder='{"@context": "https://schema.org", "@type": "Article", ...}'
          value={values.json_ld}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={disabled}
          rows={4}
          className={`font-mono text-sm rounded-2xl ${errors.json_ld && touched.json_ld ? 'border-red-500' : ''}`}
        />
        {errors.json_ld && touched.json_ld && (
          <p className="text-sm text-red-600">{errors.json_ld}</p>
        )}
      </div>
    </div>
  );
}
