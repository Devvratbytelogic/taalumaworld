'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useFormik } from 'formik';
import { useRouter } from 'next/navigation';
import { Save, X, Upload, FileText } from 'lucide-react';
import Button from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { RichTextEditor } from '@/components/editor/RichTextEditor';
import toast from '@/utils/toast';
import { addChapterSchema } from '@/utils/formValidation';
import { appendUserIpToFormData } from '@/utils/clientIp';
import { APP_SITE_URL } from '@/utils/config';
import { getUserId, getUserRole } from '@/utils/authCookies';
import { useUpdateChapterMutation, } from '@/store/rtkQueries/adminPostApi';
import { useGetAllBooksQuery, useGetChapterByIdQuery, } from '@/store/rtkQueries/adminGetApi';
import { getAdminSectionRoutePath, getContentOwnershipLicensingRoutePath, getReadChapterRoutePath } from '@/routes/routes';
import Link from 'next/link';
import { AgreementCheckbox } from '@/components/ui/AgreementCheckbox';
import { Label } from '@/components/ui/label';
import ReactSelect from 'react-select';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from '@/components/ui/select';
import { OpenGraphFieldsSection } from '@/components/admin/shared/OpenGraphFieldsSection';
import { cn } from '@/components/ui/utils';
import { SELECT_STYLES } from '@/constants/selectStyle';



function slugFromTitle(title: string): string {
  return title.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

interface EditChapterFormProps {
  chapterId: string;
}
export function EditChapterForm({ chapterId }: EditChapterFormProps) {
  const router = useRouter();
  const [featuredImageFile, setFeaturedImageFile] = useState<File | null>(null);
  const [featuredImagePreviewUrl, setFeaturedImagePreviewUrl] = useState<string | null>(null);
  const [ogImageFile, setOgImageFile] = useState<File | null>(null);
  const [ogImagePreviewUrl, setOgImagePreviewUrl] = useState<string | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const slugManuallyEdited = useRef(false);

  const { data: booksResponse } = useGetAllBooksQuery();
  const { data: chapterResponse } = useGetChapterByIdQuery(chapterId);
  const [updateChapter, { isLoading: isUpdating }] = useUpdateChapterMutation();

  const booksData = booksResponse?.data;
  const books = booksData?.data ?? [];
  const bookOptions = books && books?.length > 0 ? books?.map((book) => ({ value: book.id, label: book.title })) : [];

  const chapterData = chapterResponse?.data;


  const initialFormValues = {
    bookId: chapterData?.series?.id ?? '',
    title: chapterData?.title ?? '',
    slug: chapterData?.slug ?? '',
    description: chapterData?.description ?? '',
    content: chapterData?.content ?? '',
    sequence: chapterData?.number ?? 1,
    isFree: chapterData?.isFree ?? false,
    price: chapterData?.price ?? 0 as number | undefined,
    status: chapterData?.status ?? 'Published',
    cover_image: chapterData?.coverImage ?? null as File | null,
    agreeContentOwnership: false,
    meta_title: chapterData?.meta_title ?? '',
    meta_description: chapterData?.meta_description ?? '',
    og_title: chapterData?.og_title ?? '',
    og_description: chapterData?.og_description ?? '',
    og_image: chapterData?.og_image ?? null as File | null,
    json_ld: chapterData?.json_ld ?? '',
  };
  const { values, errors, touched, isSubmitting, handleChange, handleBlur, handleSubmit, setFieldValue, setFieldTouched, resetForm, } = useFormik({
    initialValues: initialFormValues,
    validationSchema: addChapterSchema,
    enableReinitialize: true,
    onSubmit: async (vals) => {
      const formData = new FormData();
      formData.append('book', vals.bookId);
      formData.append('number', String(vals.sequence));
      formData.append('title', vals.title);
      formData.append('description', vals.description ?? '');
      formData.append('content', vals.content ?? '');
      if (chapterPricingEnabled) {
        formData.append('isFree', String(vals.isFree));
        formData.append('price', String(!vals.isFree ? (vals.price ?? 0) : 0));
      }
      formData.append('status', vals.status);
      // formData.append('page', String(vals.page ?? 1));
      if (featuredImageFile) formData.append('cover_image', featuredImageFile);
      if (pdfFile) {
        formData.append('pdf_file', pdfFile);
      }
      if (vals.meta_title) formData.append('meta_title', vals.meta_title);
      if (vals.meta_description) formData.append('meta_description', vals.meta_description);
      if (vals.og_title) formData.append('og_title', vals.og_title);
      if (vals.og_description) formData.append('og_description', vals.og_description);
      if (ogImageFile) formData.append('og_image', ogImageFile);
      if (vals.json_ld) formData.append('json_ld', vals.json_ld);
      formData.append('slug', vals.slug);
      const baseUrl = APP_SITE_URL.replace(/\/$/, '');
      formData.append('shareable_link', `${baseUrl}${getReadChapterRoutePath(vals.slug ?? '')}?createdBy=${getUserId() ?? ''}&role=${getUserRole() ?? ''}`);
      await appendUserIpToFormData(formData);
      try {
        const res = await updateChapter({ id: chapterId, values: formData }).unwrap();
        if (featuredImageFile && featuredImagePreviewUrl) URL.revokeObjectURL(featuredImagePreviewUrl);
        if (ogImageFile && ogImagePreviewUrl) URL.revokeObjectURL(ogImagePreviewUrl);
        setFeaturedImageFile(null);
        setFeaturedImagePreviewUrl(null);
        setOgImageFile(null);
        setOgImagePreviewUrl(null);
        setPdfFile(null);
        resetForm({ values: initialFormValues });
        slugManuallyEdited.current = false;
        toast.success('Blueprint updated successfully');
        router.push(getAdminSectionRoutePath('chapters'));
      } catch (err) {
        console.error('error during update chapter', err);
      }
    },
  });

  const selectedBook = books.find((b) => b.id === values.bookId);
  const pricingModel = selectedBook?.pricingModel ?? (selectedBook as { type?: string })?.type ?? 'chapter';
  const chapterPricingEnabled = pricingModel === 'chapter';

  useEffect(() => {
    if (!chapterData) return;
    if (!featuredImageFile) setFeaturedImagePreviewUrl(chapterData.coverImage || null);
    if (!ogImageFile) setOgImagePreviewUrl(chapterData.og_image || null);
  }, [chapterData]);

  useEffect(() => {
    return () => {
      if (featuredImageFile && featuredImagePreviewUrl) URL.revokeObjectURL(featuredImagePreviewUrl);
      if (ogImageFile && ogImagePreviewUrl) URL.revokeObjectURL(ogImagePreviewUrl);
    };
  }, [featuredImageFile, featuredImagePreviewUrl, ogImageFile, ogImagePreviewUrl]);

  const handleFeaturedImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      if (featuredImagePreviewUrl) URL.revokeObjectURL(featuredImagePreviewUrl);
      setFeaturedImageFile(file);
      setFeaturedImagePreviewUrl(URL.createObjectURL(file));
      setFieldValue('cover_image', file);
      setFieldTouched('cover_image', true);
    }
    e.target.value = '';
  };

  const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        toast.error('Please select a PDF file');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error('PDF must be less than 5MB');
        return;
      }
      setPdfFile(file);
    }
    e.target.value = '';
  };

  const clearFeaturedImage = () => {
    if (featuredImageFile && featuredImagePreviewUrl) URL.revokeObjectURL(featuredImagePreviewUrl);
    setFeaturedImageFile(null);
    const existingCoverImage = chapterData?.coverImage || null;
    setFeaturedImagePreviewUrl(existingCoverImage);
    setFieldValue('cover_image', existingCoverImage);
    setFieldTouched('cover_image', true);
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
      if (ogImagePreviewUrl) URL.revokeObjectURL(ogImagePreviewUrl);
      setOgImageFile(file);
      setOgImagePreviewUrl(URL.createObjectURL(file));
      setFieldValue('og_image', file);
      setFieldTouched('og_image', true);
    }
    e.target.value = '';
  };

  const clearOgImage = () => {
    if (ogImageFile && ogImagePreviewUrl) URL.revokeObjectURL(ogImagePreviewUrl);
    setOgImageFile(null);
    const existingOgImage = chapterData?.og_image || null;
    setOgImagePreviewUrl(existingOgImage);
    setFieldValue('og_image', existingOgImage);
    setFieldTouched('og_image', true);
  };

  const clearPdf = () => setPdfFile(null);

  const isSubmittingState = isSubmitting || isUpdating;

  const handleContentChange = useCallback(
    (html: string) => setFieldValue('content', html),
    [setFieldValue]
  );

  return (
    <form onSubmit={handleSubmit} className="blueprint-form space-y-6">
      <div className="space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label>Series <span className="text-red-500">*</span></Label>
            <ReactSelect
              inputId="chapter-series"
              name="bookId"
              classNamePrefix="react-select"
              options={bookOptions}
              value={bookOptions?.find((o) => o.value === values.bookId) ?? null}
              onChange={(option) => {
                const value = option?.value ?? '';
                setFieldValue('bookId', value);
                setFieldTouched('bookId', true);
                const book = books.find((b) => b.id === value);
                const model = book?.pricingModel ?? (book as { type?: string })?.type ?? 'chapter';
                if (model === 'book') {
                  setFieldValue('isFree', true);
                  setFieldValue('price', 0);
                }
              }}
              onBlur={() => setFieldTouched('bookId', true)}
              placeholder={books.length === 0 ? 'No series available' : 'Select series'}
              isDisabled={books.length === 0 || isSubmittingState}
              menuPortalTarget={typeof document !== 'undefined' ? document.body : null}
              menuPosition="fixed"
              styles={SELECT_STYLES}
            />
            {books.length === 0 && (
              <p className="text-sm text-muted-foreground">Create a series first from the Admin Series section.</p>
            )}
            {errors.bookId && touched.bookId && (
              <p className="text-sm text-red-600">{errors.bookId}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="chapter-title">Title <span className="text-red-500">*</span></Label>
            <Input
              id="chapter-title"
              name="title"
              placeholder="e.g., Introduction to Leadership"
              value={values.title}
              onChange={(e) => {
                handleChange(e);
                if (!slugManuallyEdited.current) {
                  setFieldValue('slug', slugFromTitle(e.target.value));
                }
              }}
              onBlur={handleBlur}
              disabled={isSubmittingState}
              className={errors.title && touched.title ? 'border-red-500' : undefined}
            />
            {errors.title && touched.title && (
              <p className="text-sm text-red-600">{errors.title}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="chapter-slug">Slug</Label>
          <Input
            id="chapter-slug"
            name="slug"
            value={values.slug}
            onChange={(e) => {
              slugManuallyEdited.current = true;
              setFieldValue('slug', slugFromTitle(e.target.value));
            }}
            onBlur={handleBlur}
            disabled={isSubmittingState}
            placeholder="e.g., introduction-to-leadership"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="chapter-desc">Description</Label>
          <Textarea
            id="chapter-desc"
            name="description"
            placeholder="Brief description of the blueprint..."
            value={values.description}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={isSubmittingState}
            rows={3}

          />
        </div>

        <div className="space-y-2">
          <Label>Blueprint content</Label>
          <RichTextEditor
            value={values.content}
            onChange={handleContentChange}
            placeholder="Write your blueprint content here. Use the toolbar for headings, bold, lists, etc."
            disabled={isSubmittingState}
            minHeight="320px"
          />
        </div>

        <div className="blueprint-form-section">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Upload PDF (optional)</h3>
            <p className="mt-1 text-sm text-slate-500">Attach a PDF file for this blueprint (max 5MB).</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <label className="blueprint-file-picker w-fit">
              <Upload className="h-4 w-4 shrink-0" />
              <input type="file" accept="application/pdf" onChange={handlePdfChange} className="sr-only" />
              {pdfFile ? pdfFile.name : 'Choose PDF...'}
            </label>
            {pdfFile ? (
              <Button
                type="button"
                className="global_btn rounded_full outline_primary text-destructive hover:bg-destructive/10"
                onPress={clearPdf}
              >
                Remove PDF
              </Button>
            ) : null}
          </div>
          {!pdfFile && chapterData?.pdf ? (
            <Link
              href={chapterData.pdf}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm text-slate-700 transition-colors hover:bg-slate-100"
            >
              <FileText className="h-4 w-4 shrink-0 text-red-500" />
              <span className="truncate">Current PDF</span>
            </Link>
          ) : null}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {chapterPricingEnabled ? (
            <>
              <div className="space-y-2 flex flex-col justify-end">
                <div className="flex items-center gap-2">
                  <Switch
                    id="chapter-free"
                    checked={values.isFree}
                    onCheckedChange={(checked) => {
                      setFieldValue('isFree', checked);
                      if (checked) setFieldValue('price', 0);
                    }}
                    disabled={isSubmittingState}
                  />
                  <Label htmlFor="chapter-free" className="cursor-pointer">
                    Free blueprint
                  </Label>
                </div>
              </div>
              {!values.isFree && (
                <div className="space-y-2 max-w-xs">
                  <Label htmlFor="chapter-price">Price (KSH) <span className="text-red-500">*</span></Label>
                  <Input
                    id="chapter-price"
                    name="price"
                    type="number"
                    min={0}
                    step={0.01}
                    placeholder="0.00"
                    value={values.price ?? ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === '') {
                        setFieldValue('price', undefined);
                        return;
                      }
                      const n = Number(val);
                      setFieldValue('price', Number.isNaN(n) ? undefined : Math.max(0, n));
                    }}
                    onBlur={handleBlur}
                    disabled={isSubmittingState}
                    className={errors.price && touched.price ? 'border-red-500' : undefined}
                  />
                  {errors.price && touched.price && (
                    <p className="text-sm text-red-600">{errors.price}</p>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="space-y-2 flex flex-col justify-end text-sm text-muted-foreground">
              <span>Pricing is set at series level; this blueprint has no separate price.</span>
            </div>
          )}
          <div className="space-y-2 max-w-xs">
            <Label>Status <span className="text-red-500">*</span></Label>
            <Select
              value={values.status}
              onValueChange={(value) => {
                setFieldValue('status', value);
                setFieldTouched('status', true);
              }}
            >
              <SelectTrigger className={errors.status && touched.status ? 'border-red-500' : undefined}>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Published">Published</SelectItem>
                <SelectItem value="Draft">Draft</SelectItem>
              </SelectContent>
            </Select>
            {errors.status && touched.status && (
              <p className="text-sm text-red-600">{errors.status}</p>
            )}
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-6 items-start">
          <div className="space-y-2 flex-1 ">
            <Label htmlFor="chapter-image">Featured image <span className="text-red-500">*</span></Label>
            <label
              htmlFor="chapter-image"
              className={cn('blueprint-file-picker', errors.cover_image && touched.cover_image && 'border-red-500')}
            >
              <input
                id="chapter-image"
                type="file"
                accept="image/*"
                onChange={handleFeaturedImageChange}
                className="sr-only"
              />
              <span className="truncate">
                {featuredImageFile ? featuredImageFile.name : featuredImagePreviewUrl ? 'Replace cover image...' : 'Select cover image...'}
              </span>
            </label>
            {errors.cover_image && touched.cover_image && (
              <p className="text-sm text-red-600">{errors.cover_image as string}</p>
            )}
          </div>
          {featuredImagePreviewUrl ? (
            <div className="relative inline-block">
              <div className="image-preview">
                <img
                  src={featuredImagePreviewUrl}
                  alt="Blueprint preview"
                  className="w-full h-full object-cover"
                />
              </div>
              <Button
                type="button"
                isIconOnly
                className="absolute top-2 right-2 global_btn rounded_full outline_primary icon_btn fit_btn"
                onPress={clearFeaturedImage}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="image-preview-placeholder">
              <span className="px-3 text-center text-sm text-slate-400">Preview</span>
            </div>
          )}

        </div>

        <OpenGraphFieldsSection
          idPrefix="chapter"
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
          disabled={isSubmittingState}
          ogImagePreviewUrl={ogImagePreviewUrl}
          ogImageFileName={ogImageFile?.name ?? null}
          onOgImageChange={handleOgImageChange}
          onOgImageClear={clearOgImage}
        />

      </div>

      <AgreementCheckbox
        id="agreeContentOwnership"
        checked={values.agreeContentOwnership}
        error={errors.agreeContentOwnership}
        touched={touched.agreeContentOwnership}
        onCheckedChange={(checked) => setFieldValue('agreeContentOwnership', checked)}
        onBlur={() => setFieldTouched('agreeContentOwnership', true)}
        disabled={isSubmittingState}

      >
        I own or have rights to this content · No third-party infringement · I understand Taaluma may remove
        non-compliant content. See the{' '}
        <Link
          href={getContentOwnershipLicensingRoutePath()}
          target="_blank"
          className="font-semibold text-primary hover:text-primary/80 transition-colors"
          onClick={(e) => e.stopPropagation()}
        >
          Content Ownership Policy
        </Link>
      </AgreementCheckbox>

      <div className="form-footer">
        <Button
          type="submit"
          className="global_btn rounded_full bg_primary"
          startContent={<Save className="h-4 w-4" />}
          isDisabled={isSubmittingState || books.length === 0}
          isLoading={isSubmittingState}
        >
          Update Blueprint
        </Button>
        <Link href={getAdminSectionRoutePath('chapters')}>
          <Button
            type="button"
            className="global_btn rounded_full outline_primary"
            startContent={<X className="h-4 w-4" />}
            isDisabled={isSubmittingState}
          >
            Cancel
          </Button>
        </Link>
      </div>
    </form>
  );
}
