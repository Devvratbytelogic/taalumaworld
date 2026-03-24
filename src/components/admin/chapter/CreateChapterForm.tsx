'use client';

import { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import { useRouter } from 'next/navigation';
import { Save, X, FileText, Upload } from 'lucide-react';
import Button from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { RichTextEditor } from '@/components/editor/RichTextEditor';
import toast from '@/utils/toast';
import { addChapterSchema } from '@/utils/formValidation';
import {
  useAddChapterMutation,
} from '@/store/rtkQueries/adminPostApi';
import {
  useGetAllBooksQuery,
  useGetAllAuthorLeadersQuery,
} from '@/store/rtkQueries/adminGetApi';
import type { Book, Author } from '@/types/content';
import { getAdminSectionRoutePath } from '@/routes/routes';
import Link from 'next/link';

const initialFormValues = {
  bookId: '',
  title: '',
  description: '',
  content: '',
  sequence: 1,
  page: 1,
  isFree: false,
  price: 0 as number | undefined,
  status: 'Published',
};

export function CreateChapterForm() {
  const router = useRouter();
  const [featuredImageFile, setFeaturedImageFile] = useState<File | null>(null);
  const [featuredImagePreviewUrl, setFeaturedImagePreviewUrl] = useState<string | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);

  const { data: booksResponse } = useGetAllBooksQuery();
  const { data: leadersResponse } = useGetAllAuthorLeadersQuery();
  const [addChapter, { isLoading: isAdding }] = useAddChapterMutation();

  const rawBooks = booksResponse?.data ?? [];
  const leaders = leadersResponse?.data?.leaders ?? [];
  const books = rawBooks.map((b: { id?: string; _id?: string; thoughtLeader?: { _id?: string; id?: string } }) => ({
    ...b,
    id: b.id ?? b._id,
    authorId: (b as { thoughtLeader?: { _id?: string; id?: string } }).thoughtLeader?._id ?? (b as { thoughtLeader?: { id?: string } }).thoughtLeader?.id,
  })) as unknown as Book[];
  const authors = leaders.map((l: { _id: string; fullName: string }) => ({ id: l._id, name: l.fullName })) as unknown as Author[];

  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
    setFieldTouched,
    resetForm,
  } = useFormik({
    initialValues: initialFormValues,
    validationSchema: addChapterSchema,
    onSubmit: async (vals) => {
      if (!featuredImageFile) {
        toast.error('Cover image is required (upload a file)');
        return;
      }
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
      formData.append('page', String(vals.page ?? 1));
      formData.append('cover_image', featuredImageFile);
      if (pdfFile) {
        formData.append('pdf_file', pdfFile);
      }
      try {
        const res = await addChapter(formData).unwrap();
        if (featuredImagePreviewUrl) URL.revokeObjectURL(featuredImagePreviewUrl);
        setFeaturedImageFile(null);
        setFeaturedImagePreviewUrl(null);
        setPdfFile(null);
        resetForm({ values: initialFormValues });
        toast.success('Chapter created successfully');
        router.push(`/admin/chapters`);
      } catch (err: unknown) {
        const message =
          (err as { data?: { message?: string }; message?: string })?.data?.message ||
          (err as { message?: string })?.message ||
          'Failed to create chapter';
        toast.error(message);
      }
    },
  });

  const selectedBook = books.find((b) => b.id === values.bookId);
  const pricingModel = selectedBook?.pricingModel ?? (selectedBook as { type?: string })?.type ?? 'chapter';
  const chapterPricingEnabled = pricingModel === 'chapter';

  useEffect(() => {
    return () => {
      if (featuredImagePreviewUrl) URL.revokeObjectURL(featuredImagePreviewUrl);
    };
  }, [featuredImagePreviewUrl]);

  const handleFeaturedImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file (e.g. JPG, PNG)');
        return;
      }
      if (featuredImagePreviewUrl) URL.revokeObjectURL(featuredImagePreviewUrl);
      setFeaturedImageFile(file);
      setFeaturedImagePreviewUrl(URL.createObjectURL(file));
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
      setPdfFile(file);
    }
    e.target.value = '';
  };

  const clearFeaturedImage = () => {
    if (featuredImagePreviewUrl) URL.revokeObjectURL(featuredImagePreviewUrl);
    setFeaturedImageFile(null);
    setFeaturedImagePreviewUrl(null);
  };

  const clearPdf = () => setPdfFile(null);

  const isSubmittingState = isSubmitting || isAdding;

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="chapter-book">Book<span className="text-red-500">*</span></Label>
            <Select
              value={values.bookId || undefined}
              onValueChange={(value) => {
                setFieldValue('bookId', value ?? '');
                setFieldTouched('bookId', true);
                const book = books.find((b) => b.id === value);
                const model = book?.pricingModel ?? (book as { type?: string })?.type ?? 'chapter';
                if (model === 'book') {
                  setFieldValue('isFree', true);
                  setFieldValue('price', 0);
                }
              }}
              disabled={books.length === 0}
            >
              <SelectTrigger
                className={errors.bookId && touched.bookId ? 'border-red-500' : ''}
              >
                <SelectValue placeholder={books.length === 0 ? 'No books available' : 'Select book'} />
              </SelectTrigger>
              <SelectContent>
                {books.map((book) => (
                  <SelectItem key={book.id} value={book.id}>
                    {book.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {books.length === 0 && (
              <p className="text-sm text-muted-foreground">Create a book first from the Admin Books section.</p>
            )}
            {errors.bookId && touched.bookId && (
              <p className="text-sm text-red-600">{errors.bookId}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="chapter-title">Title<span className="text-red-500">*</span></Label>
            <Input
              id="chapter-title"
              name="title"
              placeholder="e.g., Introduction to Leadership"
              value={values.title}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={isSubmittingState}
              className={errors.title && touched.title ? 'border-red-500' : ''}
            />
            {errors.title && touched.title && (
              <p className="text-sm text-red-600">{errors.title}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="chapter-desc">Description</Label>
          <Textarea
            id="chapter-desc"
            name="description"
            placeholder="Brief description of the chapter..."
            value={values.description}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={isSubmittingState}
            rows={3}
            className="rounded-2xl"
          />
        </div>

        <div className="space-y-2">
          <Label>Chapter content</Label>
          <RichTextEditor
            value={values.content}
            onChange={(html) => setFieldValue('content', html)}
            placeholder="Write your chapter content here. Use the toolbar for headings, bold, lists, etc."
            disabled={isSubmittingState}
            minHeight="320px"
          />
        </div>

        <div className="border border-dashed border-border rounded-2xl p-6 bg-muted/20 space-y-3">
          <div className="flex items-center gap-2 text-muted-foreground">
            <FileText className="h-5 w-5" />
            <span className="font-medium">Upload PDF (optional)</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Attach a PDF file for this chapter. The file can be stored and linked for readers.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <label className="border-input bg-input-background focus-visible:border-ring flex h-10 cursor-pointer items-center gap-2 rounded-full border px-4 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted/50">
              <Upload className="h-4 w-4" />
              <input
                type="file"
                accept="application/pdf"
                onChange={handlePdfChange}
                className="sr-only"
              />
              {pdfFile ? pdfFile.name : 'Choose PDF...'}
            </label>
            {pdfFile && (
              <Button
                type="button"
                className="global_btn rounded_full outline_primary text-destructive hover:bg-destructive/10"
                onPress={clearPdf}
              >
                Remove PDF
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label htmlFor="chapter-sequence">Sequence<span className="text-red-500">*</span></Label>
            <Input
              id="chapter-sequence"
              name="sequence"
              type="number"
              min={1}
              value={values.sequence ?? ''}
              onChange={(e) => {
                if (e.target.value === '') {
                  setFieldValue('sequence', '');
                  return;
                }
                const n = parseInt(e.target.value, 10);
                setFieldValue('sequence', Number.isNaN(n) ? 1 : Math.max(1, n));
              }}
              onBlur={(e) => {
                const n = parseInt(e.target.value, 10);
                setFieldValue('sequence', Number.isNaN(n) || n < 1 ? 1 : n);
                handleBlur(e);
              }}
              disabled={isSubmittingState}
              className={errors.sequence && touched.sequence ? 'border-red-500' : ''}
            />
            {errors.sequence && touched.sequence && (
              <p className="text-sm text-red-600">{errors.sequence}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="chapter-page">Page<span className="text-red-500">*</span></Label>
            <Input
              id="chapter-page"
              name="page"
              type="number"
              min={0}
              value={values.page ?? ''}
              onChange={(e) => {
                if (e.target.value === '') {
                  setFieldValue('page', '');
                  return;
                }
                const n = parseInt(e.target.value, 10);
                setFieldValue('page', Number.isNaN(n) ? 0 : Math.max(0, n));
              }}
              onBlur={(e) => {
                const n = parseInt(e.target.value, 10);
                setFieldValue('page', Number.isNaN(n) || n < 0 ? 0 : n);
                handleBlur(e);
              }}
              disabled={isSubmittingState}
              className={errors.page && touched.page ? 'border-red-500' : ''}
            />
            {errors.page && touched.page && (
              <p className="text-sm text-red-600">{errors.page}</p>
            )}
          </div>
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
                    Free chapter
                  </Label>
                </div>
              </div>
              {!values.isFree && (
                <div className="space-y-2 max-w-xs">
                  <Label htmlFor="chapter-price">Price ($)<span className="text-red-500">*</span></Label>
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
                    className={errors.price && touched.price ? 'border-red-500' : ''}
                  />
                  {errors.price && touched.price && (
                    <p className="text-sm text-red-600">{errors.price}</p>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="space-y-2 flex flex-col justify-end text-sm text-muted-foreground">
              <span>Pricing is set at book level; this chapter has no separate price.</span>
            </div>
          )}
          <div className="space-y-2 max-w-xs">
            <Label htmlFor="chapter-status">Status<span className="text-red-500">*</span></Label>
            <Select
              value={values.status}
              onValueChange={(value) => {
                setFieldValue('status', value);
                setFieldTouched('status', true);
              }}
            >
              <SelectTrigger
                className={errors.status && touched.status ? 'border-red-500' : ''}
              >
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
            <Label htmlFor="chapter-image">Featured Image<span className="text-red-500">*</span></Label>
            <label
              htmlFor="chapter-image"
              className="border-input bg-input-background focus-visible:border-ring flex h-10 w-full cursor-pointer items-center rounded-full border px-4 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted/50"
            >
              <input
                id="chapter-image"
                type="file"
                accept="image/*"
                onChange={handleFeaturedImageChange}
                className="sr-only"
              />
              <span className="truncate">
                {featuredImageFile ? featuredImageFile.name : 'Select cover image...'}
              </span>
            </label>
          </div>
          {featuredImagePreviewUrl ? (
            <div className="relative inline-block">
              <div className="rounded-2xl overflow-hidden bg-muted border border-border aspect-square max-w-32">
                <img
                  src={featuredImagePreviewUrl}
                  alt="Chapter preview"
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
            <div className="rounded-2xl border border-dashed border-muted-foreground/30 aspect-square max-w-32 flex items-center justify-center bg-muted/30">
              <span className="text-xs text-muted-foreground px-3 text-center">
                Preview
              </span>
            </div>
          )}
        </div>



      </div>

      <div className="flex flex-wrap gap-4 pt-4 border-t border-border">
        <Button
          type="submit"
          className="global_btn rounded_full bg_primary"
          startContent={<Save className="h-4 w-4" />}
          isDisabled={isSubmittingState || books.length === 0}
          isLoading={isSubmittingState}
        >
          Create Chapter
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
