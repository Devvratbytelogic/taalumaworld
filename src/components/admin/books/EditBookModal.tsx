import { useState, useEffect, useRef } from 'react';
import { useFormik } from 'formik';
import { Save, X } from 'lucide-react';
import Button from '../../ui/Button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Textarea } from '../../ui/textarea';
import { nativeSelectClassName } from '../../ui/field-styles';
import { cn } from '../../ui/utils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../ui/dialog';
import toast from '@/utils/toast';
import { editBookSchema } from '@/utils/formValidation';
import { OpenGraphFieldsSection } from '@/components/admin/shared/OpenGraphFieldsSection';
import { IBook } from '@/types/books';
import { slugify } from '@/utils/slugify';

const emptyFormValues = {
  title: '',
  description: '',
  tags: [] as string[],
  tagsInput: '',
  pricingModel: 'book',
  status: 'Published',
  price: '' as number | '',
  cover_image: null as File | null,
  meta_title: '',
  meta_description: '',
  og_title: '',
  og_description: '',
  og_image: null as File | string | null,
  json_ld: '',
};

interface EditBookModalProps {
  book: IBook | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (args: { id: string; values: FormData }) => { unwrap: () => Promise<unknown> };
  isSubmitting?: boolean;
}

export function EditBookModal({
  book,
  open,
  onOpenChange,
  onSubmit,
  isSubmitting = false,
}: EditBookModalProps) {
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreviewUrl, setCoverPreviewUrl] = useState<string | null>(null);
  const [ogImageFile, setOgImageFile] = useState<File | null>(null);
  const [ogImagePreviewUrl, setOgImagePreviewUrl] = useState<string | null>(null);
  const coverIsObjectUrlRef = useRef(false);
  const ogImageIsObjectUrlRef = useRef(false);

  const initialValues = {
    title: book?.title ?? '',
    description: book?.description ?? '',
    tags: Array.isArray(book?.tags) ? (book?.tags.filter(Boolean) as string[]) : [],
    tagsInput: '',
    pricingModel: book?.pricingModel === 'chapter' ? 'chapter' : 'book',
    status: book?.status ?? 'Published',
    price: (book?.price ?? '') as number | '',
    cover_image: null as File | null,
    meta_title: book?.meta_title ?? '',
    meta_description: book?.meta_description ?? '',
    og_title: book?.og_title ?? '',
    og_description: book?.og_description ?? '',
    og_image: (book?.og_image ?? null) as File | string | null,
    json_ld: book?.json_ld ?? '',
  }

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
    setFieldTouched,
    resetForm,
  } = useFormik({
    initialValues,
    validationSchema: editBookSchema,
    enableReinitialize: true,
    onSubmit: async (vals) => {
      if (!book) return;
      const formData = new FormData();
      formData.append('title', vals.title);
      formData.append('slug', slugify(vals.title));
      formData.append('description', vals.description ?? '');
      formData.append('pricingModel', vals.pricingModel);
      formData.append('status', vals.status);
      formData.append('price', String(vals.price === '' ? 0 : vals.price));
      if (coverFile) formData.append('cover_image', coverFile);
      values.tags.forEach((tag, index) => formData.append(`tags[${index}]`, tag));
      if (vals.meta_title) formData.append('meta_title', vals.meta_title);
      if (vals.meta_description) formData.append('meta_description', vals.meta_description);
      if (vals.og_title) formData.append('og_title', vals.og_title);
      if (vals.og_description) formData.append('og_description', vals.og_description);
      if (ogImageFile) formData.append('og_image', ogImageFile);
      if (vals.json_ld) formData.append('json_ld', vals.json_ld);

      try {
        const res = (await onSubmit({ id: book._id, values: formData }).unwrap()) as { http_status_code?: number; message?: string };
        if (res?.http_status_code === 200 || res?.http_status_code === 201) {
          if (coverIsObjectUrlRef.current && coverPreviewUrl) URL.revokeObjectURL(coverPreviewUrl);
          if (ogImageIsObjectUrlRef.current && ogImagePreviewUrl) URL.revokeObjectURL(ogImagePreviewUrl);
          setCoverFile(null);
          setCoverPreviewUrl(null);
          setOgImageFile(null);
          setOgImagePreviewUrl(null);
          coverIsObjectUrlRef.current = false;
          ogImageIsObjectUrlRef.current = false;
          onOpenChange(false);
          toast.success(res.message ?? 'Series updated successfully');
        }
      } catch {
        console.error('Failed to update series');
      }
    },
  });

  useEffect(() => {
    if (open && book) {
      setCoverPreviewUrl(book.coverImage || null);
      coverIsObjectUrlRef.current = false;
      setCoverFile(null);
      setOgImagePreviewUrl(book.og_image ?? null);
      ogImageIsObjectUrlRef.current = false;
      setOgImageFile(null);
    }
  }, [open, book]);

  useEffect(() => {
    if (!open) {
      if (coverIsObjectUrlRef.current && coverPreviewUrl) URL.revokeObjectURL(coverPreviewUrl);
      if (ogImageIsObjectUrlRef.current && ogImagePreviewUrl) URL.revokeObjectURL(ogImagePreviewUrl);
      setCoverFile(null);
      setCoverPreviewUrl(null);
      setOgImageFile(null);
      setOgImagePreviewUrl(null);
      coverIsObjectUrlRef.current = false;
      ogImageIsObjectUrlRef.current = false;
      resetForm({ values: emptyFormValues });
    }
  }, [open, resetForm]);

  const addTag = (tag: string) => {
    const t = tag.trim();
    if (!t || values.tags.includes(t)) return;
    setFieldValue('tags', [...values.tags, t]);
    setFieldValue('tagsInput', '');
  };

  const removeTag = (index: number) => {
    setFieldValue('tags', values.tags.filter((_, i) => i !== index));
  };

  const handleTagsInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(values.tagsInput);
    }
  };

  const handleCoverFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file (e.g. JPG, PNG)');
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Image must be less than 2MB');
        return;
      }
      if (coverIsObjectUrlRef.current && coverPreviewUrl) URL.revokeObjectURL(coverPreviewUrl);
      setCoverFile(file);
      setCoverPreviewUrl(URL.createObjectURL(file));
      coverIsObjectUrlRef.current = true;
      setFieldValue('cover_image', file);
      setFieldTouched('cover_image', true);
    }
    e.target.value = '';
  };

  const clearCoverImage = () => {
    if (coverIsObjectUrlRef.current && coverPreviewUrl) URL.revokeObjectURL(coverPreviewUrl);
    setCoverFile(null);
    setCoverPreviewUrl(book?.coverImage || null);
    coverIsObjectUrlRef.current = false;
    setFieldValue('cover_image', null);
  };

  const handleOgImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file (e.g. JPG, PNG)');
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Image must be less than 2MB');
        return;
      }
      if (ogImageIsObjectUrlRef.current && ogImagePreviewUrl) URL.revokeObjectURL(ogImagePreviewUrl);
      setOgImageFile(file);
      setOgImagePreviewUrl(URL.createObjectURL(file));
      ogImageIsObjectUrlRef.current = true;
      setFieldValue('og_image', file);
      setFieldTouched('og_image', true);
    }
    e.target.value = '';
  };

  const clearOgImage = () => {
    if (ogImageIsObjectUrlRef.current && ogImagePreviewUrl) URL.revokeObjectURL(ogImagePreviewUrl);
    setOgImageFile(null);
    const existingOgImage = book?.og_image ?? null;
    setOgImagePreviewUrl(existingOgImage);
    ogImageIsObjectUrlRef.current = false;
    setFieldValue('og_image', existingOgImage);
    setFieldTouched('og_image', true);
  };

  const closeModal = () => {
    if (coverIsObjectUrlRef.current && coverPreviewUrl) URL.revokeObjectURL(coverPreviewUrl);
    if (ogImageIsObjectUrlRef.current && ogImagePreviewUrl) URL.revokeObjectURL(ogImagePreviewUrl);
    setCoverFile(null);
    setCoverPreviewUrl(null);
    setOgImageFile(null);
    setOgImagePreviewUrl(null);
    coverIsObjectUrlRef.current = false;
    ogImageIsObjectUrlRef.current = false;
    resetForm({ values: emptyFormValues });
    onOpenChange(false);
  };

  if (!book) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="xl" className="admin_panel flex max-h-[90vh] flex-col gap-0 overflow-hidden p-0 max-w-2xl">
        <DialogHeader className="shrink-0 border-b border-slate-100 px-6 pb-4 pt-6 pr-12">
          <DialogTitle>Edit Series</DialogTitle>
          <DialogDescription>
            Update the details for &quot;{book.title}&quot;.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="admin_panel flex min-h-0 flex-1 flex-col">
          <div className="custom_scrollbar flex-1 space-y-4 overflow-y-auto p-6!">
            <div className="space-y-2">
              <Label htmlFor="edit-book-title">Title<span className="text-red-500">*</span></Label>
              <Input
                id="edit-book-title"
                name="title"
                placeholder="e.g., Career Mastery"
                value={values.title}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={isSubmitting}
                className={errors.title && touched.title ? 'border-red-500' : ''}
              />
              {errors.title && touched.title && (
                <p className="text-sm text-red-600">{errors.title}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-book-desc">Description<span className="text-red-500">*</span></Label>
              <Textarea
                id="edit-book-desc"
                name="description"
                placeholder="Brief description of the series..."
                value={values.description}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={isSubmitting}
                rows={3}
                className={errors.description && touched.description ? 'border-red-500' : ''}
              />
              {errors.description && touched.description && (
                <p className="text-sm text-red-600">{errors.description}</p>
              )}
            </div>
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-book-tags">Tags</Label>
                <Input
                  id="edit-book-tags"
                  name="tagsInput"
                  placeholder="Type a tag and press Enter or comma to add"
                  value={values.tagsInput}
                  onChange={handleChange}
                  onKeyDown={handleTagsInputKeyDown}
                  disabled={isSubmitting}
                />
                {values.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {values.tags.map((tag, index) => (
                      <span
                        key={`${tag}-${index}`}
                        className="inline-flex items-center gap-1 rounded-full bg-primary/10 text-primary px-3 py-1 text-sm"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(index)}
                          className="rounded-full p-0.5 hover:bg-muted-foreground/20 outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          aria-label={`Remove tag ${tag}`}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="flex justify-between gap-4">
              <div className="space-y-2 flex-1 min-w-0">
                <Label htmlFor="edit-book-cover">Cover Image <span className="text-xs text-muted-foreground font-normal">(leave unchanged to keep current)</span></Label>
                <label
                  htmlFor="edit-book-cover"
                  className="blueprint-file-picker"
                >
                  <input
                    id="edit-book-cover"
                    type="file"
                    accept="image/*"
                    onChange={handleCoverFileChange}
                    className="sr-only"
                  />
                  <span className="truncate">
                    {coverFile ? coverFile.name : 'Change image...'}
                  </span>
                </label>
              </div>
              {coverPreviewUrl ? (
                <div className="mt-3 relative inline-block">
                  <div className="image-preview max-w-24">
                    <img
                      src={coverPreviewUrl}
                      alt="Cover preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <Button
                    type="button"
                    isIconOnly={true}
                    className="absolute top-2 right-2 global_btn rounded_full outline_primary icon_btn fit_btn"
                    onPress={clearCoverImage}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="image-preview-placeholder max-w-24 text-xs">
                  <span className="px-2">Select an image to preview</span>
                </div>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-book-status">Status</Label>
                <select
                  id="edit-book-status"
                  name="status"
                  value={values.status}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={isSubmitting}
                  className={cn(nativeSelectClassName, errors.status && touched.status ? 'border-red-500' : '')}
                >
                  <option value="Draft">Draft</option>
                  <option value="Published">Published</option>
                </select>
                {errors.status && touched.status && (
                  <p className="text-sm text-red-600">{errors.status}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-book-pricingModel">Pricing model</Label>
                <select
                  id="edit-book-pricingModel"
                  name="pricingModel"
                  value={values.pricingModel}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={isSubmitting}
                  className={nativeSelectClassName}
                >
                  <option value="chapter">blueprint</option>
                  <option value="book">series</option>
                </select>
              </div>
              {values.pricingModel === 'book' && (
                <div className="space-y-2">
                  <Label htmlFor="edit-book-price">Price (KSH) <span className="text-red-500">*</span></Label>
                  <Input
                    id="edit-book-price"
                    name="price"
                    type="number"
                    min={0}
                    step={0.01}
                    placeholder="0.00"
                    value={values.price === '' ? '' : values.price}
                    onChange={(e) =>
                      setFieldValue(
                        'price',
                        e.target.value === '' ? '' : Number(e.target.value)
                      )
                    }
                    onBlur={handleBlur}
                    disabled={isSubmitting}
                    className={errors.price && touched.price ? 'border-red-500' : ''}
                  />
                  {errors.price && touched.price && (
                    <p className="text-sm text-red-600">{errors.price}</p>
                  )}
                </div>
              )}
            </div>
            <OpenGraphFieldsSection
              idPrefix="edit-book"
              values={{
                meta_title: values.meta_title,
                meta_description: values.meta_description,
                og_title: values.og_title,
                og_description: values.og_description,
                og_image: values.og_image,
                json_ld: values.json_ld,
              }}
              errors={errors}
              touched={touched}
              handleChange={handleChange}
              handleBlur={handleBlur}
              disabled={isSubmitting}
              ogImagePreviewUrl={ogImagePreviewUrl}
              ogImageFileName={ogImageFile?.name ?? null}
              onOgImageChange={handleOgImageChange}
              onOgImageClear={clearOgImage}
            />
          </div>
          <DialogFooter className="shrink-0 gap-3 border-t border-slate-100 px-6 py-4">
            <Button
              type="button"
              className="global_btn rounded_full outline_primary"
              onPress={closeModal}
              startContent={<X className="h-4 w-4" />}
              isDisabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="global_btn rounded_full bg_primary"
              startContent={<Save className="h-4 w-4" />}
              isDisabled={isSubmitting}
              isLoading={isSubmitting}
            >
              Update Series
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
