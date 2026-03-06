import { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import { Save, X } from 'lucide-react';
import Button from '../../ui/Button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Textarea } from '../../ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../ui/select';
import { Switch } from '../../ui/switch';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../ui/dialog';
import toast from '@/utils/toast';
import { addChapterSchema } from '@/utils/formValidation';
import type { Book, Author } from '../../../data/mockData';

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

interface AddChapterModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  books: Book[];
  authors: Author[];
  onSubmit?: (payload: FormData) => { unwrap: () => Promise<unknown> };
  isSubmitting?: boolean;
  onSuccess?: () => void;
}

export function AddChapterModal({
  open,
  onOpenChange,
  books,
  onSubmit,
  isSubmitting: isSubmittingProp = false,
  onSuccess,
}: AddChapterModalProps) {
  const [featuredImageFile, setFeaturedImageFile] = useState<File | null>(null);
  const [featuredImagePreviewUrl, setFeaturedImagePreviewUrl] = useState<string | null>(null);

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
      if (!onSubmit) {
        if (featuredImagePreviewUrl) URL.revokeObjectURL(featuredImagePreviewUrl);
        setFeaturedImageFile(null);
        setFeaturedImagePreviewUrl(null);
        resetForm({ values: initialFormValues });
        onOpenChange(false);
        toast.success('Chapter created successfully');
        onSuccess?.();
        return;
      }
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
      formData.append('isFree', String(vals.isFree));
      formData.append('price', String(vals.isFree ? 0 : (vals.price ?? 0)));
      formData.append('status', vals.status);
      formData.append('page', String(vals.page ?? 1));
      formData.append('cover_image', featuredImageFile);
      try {
        await onSubmit(formData).unwrap();
        if (featuredImagePreviewUrl) URL.revokeObjectURL(featuredImagePreviewUrl);
        setFeaturedImageFile(null);
        setFeaturedImagePreviewUrl(null);
        resetForm({ values: initialFormValues });
        onOpenChange(false);
        toast.success('Chapter created successfully');
        onSuccess?.();
      } catch {
        toast.error('Failed to create chapter');
      }
    },
  });

  const isSubmittingState = isSubmitting || isSubmittingProp;

  useEffect(() => {
    if (!open) {
      resetForm({ values: initialFormValues });
      setFeaturedImageFile(null);
      setFeaturedImagePreviewUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return null;
      });
    }
  }, [open, resetForm]);

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

  const clearFeaturedImage = () => {
    if (featuredImagePreviewUrl) URL.revokeObjectURL(featuredImagePreviewUrl);
    setFeaturedImageFile(null);
    setFeaturedImagePreviewUrl(null);
  };

  const closeModal = () => {
    if (featuredImagePreviewUrl) URL.revokeObjectURL(featuredImagePreviewUrl);
    setFeaturedImageFile(null);
    setFeaturedImagePreviewUrl(null);
    resetForm({ values: initialFormValues });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="xl" className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New Chapter</DialogTitle>
          <DialogDescription>
            Add a new chapter to a book. Fill in the details below.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col min-h-0">
          <div className="space-y-4 py-4 admin_panel max-h-[70vh] custom_scrollbar overflow-y-auto">
            <div className="space-y-2">
              <Label htmlFor="chapter-book">Book<span className="text-red-500">*</span></Label>
              <Select
                value={values.bookId}
                onValueChange={(value) => {
                  setFieldValue('bookId', value);
                  setFieldTouched('bookId', true);
                }}
              >
                <SelectTrigger
                  className={errors.bookId && touched.bookId ? 'border-red-500' : ''}
                >
                  <SelectValue placeholder="Select book" />
                </SelectTrigger>
                <SelectContent>
                  {books.map((book) => (
                    <SelectItem key={book.id} value={book.id}>
                      {book.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="chapter-content">Content</Label>
              <Textarea
                id="chapter-content"
                name="content"
                placeholder="Full chapter content here..."
                value={values.content}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={isSubmittingState}
                rows={5}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="chapter-sequence">Sequence<span className="text-red-500">*</span></Label>
                <Input
                  id="chapter-sequence"
                  name="sequence"
                  type="number"
                  min={1}
                  value={values.sequence}
                  onChange={(e) =>
                    setFieldValue('sequence', e.target.value ? parseInt(e.target.value, 10) : 1)
                  }
                  onBlur={handleBlur}
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
                  onChange={(e) =>
                    setFieldValue('page', e.target.value ? parseInt(e.target.value, 10) : 0)
                  }
                  onBlur={handleBlur}
                  disabled={isSubmittingState}
                  className={errors.page && touched.page ? 'border-red-500' : ''}
                />
                {errors.page && touched.page && (
                  <p className="text-sm text-red-600">{errors.page}</p>
                )}
              </div>
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
            </div>

            {!values.isFree && (
              <div className="space-y-2">
                <Label htmlFor="chapter-price">Price ($)<span className="text-red-500">*</span></Label>
                <Input
                  id="chapter-price"
                  name="price"
                  type="number"
                  min={0}
                  step={0.01}
                  placeholder="0.00"
                  value={values.price ?? ''}
                  onChange={(e) =>
                    setFieldValue(
                      'price',
                      e.target.value ? Number(e.target.value) : undefined
                    )
                  }
                  onBlur={handleBlur}
                  disabled={isSubmittingState}
                  className={errors.price && touched.price ? 'border-red-500' : ''}
                />
                {errors.price && touched.price && (
                  <p className="text-sm text-red-600">{errors.price}</p>
                )}
              </div>
            )}

            <div className="space-y-2">
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

            <div className="flex justify-between gap-4">
              <div className="space-y-2 flex-1 min-w-0">
                <Label htmlFor="chapter-image">Featured Image</Label>
                <label
                  htmlFor="chapter-image"
                  className="border-input bg-input-background focus-visible:border-ring focus-visible:ring-ring/50 flex h-9 w-full cursor-pointer items-center rounded-full border px-4 py-1 text-sm text-muted-foreground transition-[color,box-shadow] outline-none focus-within:ring-[3px] focus-within:border-ring focus-within:ring-ring/50"
                >
                  <input
                    id="chapter-image"
                    type="file"
                    accept="image/*"
                    onChange={handleFeaturedImageChange}
                    className="sr-only"
                  />
                  <span className="truncate">
                    {featuredImageFile ? featuredImageFile.name : 'Select image...'}
                  </span>
                </label>
              </div>
              {featuredImagePreviewUrl ? (
                <div className="mt-3 relative inline-block">
                  <div className="rounded-2xl overflow-hidden bg-muted border border-border aspect-4/4 max-w-24">
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
                <div className="mt-3 rounded-2xl border border-dashed border-muted-foreground/30 aspect-4/4 max-w-24 flex items-center justify-center bg-muted/30">
                  <span className="text-xs text-muted-foreground px-3 text-center">
                    Select an image to preview
                  </span>
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
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
              Create Chapter
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
