import { useState, useEffect, useRef } from 'react';
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
import type { Chapter, Book, Author } from '../../../data/mockData';

function getInitialValuesFromChapter(chapter: Chapter | null) {
  if (!chapter) {
    return {
      bookId: '',
      title: '',
      description: '',
      sequence: 1,
      isFree: false,
      price: 0 as number | undefined,
    };
  }
  return {
    bookId: chapter.bookId,
    title: chapter.title,
    description: chapter.description,
    sequence: chapter.sequence,
    isFree: chapter.isFree,
    price: chapter.price,
  };
}

interface EditChapterModalProps {
  chapter: Chapter | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  books: Book[];
  authors: Author[];
  onSuccess?: () => void;
}

export function EditChapterModal({
  chapter,
  open,
  onOpenChange,
  books,
  onSuccess,
}: EditChapterModalProps) {
  const [featuredImageFile, setFeaturedImageFile] = useState<File | null>(null);
  const [featuredImagePreviewUrl, setFeaturedImagePreviewUrl] = useState<string | null>(null);
  const featuredImageIsObjectUrlRef = useRef(false);

  const initialValues = getInitialValuesFromChapter(chapter);

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
    initialValues,
    validationSchema: addChapterSchema,
    enableReinitialize: true,
    onSubmit: () => {
      if (featuredImageIsObjectUrlRef.current && featuredImagePreviewUrl) {
        URL.revokeObjectURL(featuredImagePreviewUrl);
      }
      setFeaturedImageFile(null);
      setFeaturedImagePreviewUrl(null);
      featuredImageIsObjectUrlRef.current = false;
      onOpenChange(false);
      toast.success('Chapter updated successfully');
      onSuccess?.();
    },
  });

  useEffect(() => {
    if (open && chapter) {
      setFeaturedImagePreviewUrl(chapter.featuredImage || null);
      featuredImageIsObjectUrlRef.current = false;
      setFeaturedImageFile(null);
    }
  }, [open, chapter]);

  useEffect(() => {
    if (!open) {
      if (featuredImageIsObjectUrlRef.current && featuredImagePreviewUrl) {
        URL.revokeObjectURL(featuredImagePreviewUrl);
      }
      setFeaturedImageFile(null);
      setFeaturedImagePreviewUrl(null);
      featuredImageIsObjectUrlRef.current = false;
      resetForm({ values: getInitialValuesFromChapter(null) });
    }
  }, [open, resetForm]);

  const handleFeaturedImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file (e.g. JPG, PNG)');
        return;
      }
      if (featuredImageIsObjectUrlRef.current && featuredImagePreviewUrl) {
        URL.revokeObjectURL(featuredImagePreviewUrl);
      }
      setFeaturedImageFile(file);
      setFeaturedImagePreviewUrl(URL.createObjectURL(file));
      featuredImageIsObjectUrlRef.current = true;
    }
    e.target.value = '';
  };

  const clearFeaturedImage = () => {
    if (featuredImageIsObjectUrlRef.current && featuredImagePreviewUrl) {
      URL.revokeObjectURL(featuredImagePreviewUrl);
    }
    setFeaturedImageFile(null);
    setFeaturedImagePreviewUrl(chapter?.featuredImage || null);
    featuredImageIsObjectUrlRef.current = false;
  };

  const closeModal = () => {
    if (featuredImageIsObjectUrlRef.current && featuredImagePreviewUrl) {
      URL.revokeObjectURL(featuredImagePreviewUrl);
    }
    setFeaturedImageFile(null);
    setFeaturedImagePreviewUrl(null);
    featuredImageIsObjectUrlRef.current = false;
    resetForm({ values: getInitialValuesFromChapter(null) });
    onOpenChange(false);
  };

  if (!chapter) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="xl" className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Chapter</DialogTitle>
          <DialogDescription>
            Update the details for &quot;{chapter.title}&quot;.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col min-h-0">
          <div className="space-y-4 py-4 admin_panel max-h-[70vh] custom_scrollbar overflow-y-auto">
            <div className="space-y-2">
              <Label htmlFor="edit-chapter-book">Book<span className="text-red-500">*</span></Label>
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
              <Label htmlFor="edit-chapter-title">Title<span className="text-red-500">*</span></Label>
              <Input
                id="edit-chapter-title"
                name="title"
                placeholder="e.g., Introduction to Leadership"
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
              <Label htmlFor="edit-chapter-desc">Description</Label>
              <Textarea
                id="edit-chapter-desc"
                name="description"
                placeholder="Brief description of the chapter..."
                value={values.description}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={isSubmitting}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-chapter-sequence">Sequence<span className="text-red-500">*</span></Label>
                <Input
                  id="edit-chapter-sequence"
                  name="sequence"
                  type="number"
                  min={1}
                  value={values.sequence}
                  onChange={(e) =>
                    setFieldValue('sequence', e.target.value ? parseInt(e.target.value, 10) : 1)
                  }
                  onBlur={handleBlur}
                  disabled={isSubmitting}
                  className={errors.sequence && touched.sequence ? 'border-red-500' : ''}
                />
                {errors.sequence && touched.sequence && (
                  <p className="text-sm text-red-600">{errors.sequence}</p>
                )}
              </div>
              <div className="space-y-2 flex flex-col justify-end">
                <div className="flex items-center gap-2">
                  <Switch
                    id="edit-chapter-free"
                    checked={values.isFree}
                    onCheckedChange={(checked) => {
                      setFieldValue('isFree', checked);
                      if (checked) setFieldValue('price', 0);
                    }}
                    disabled={isSubmitting}
                  />
                  <Label htmlFor="edit-chapter-free" className="cursor-pointer">
                    Free chapter
                  </Label>
                </div>
              </div>
            </div>

            {!values.isFree && (
              <div className="space-y-2">
                <Label htmlFor="edit-chapter-price">Price ($)<span className="text-red-500">*</span></Label>
                <Input
                  id="edit-chapter-price"
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
                  disabled={isSubmitting}
                  className={errors.price && touched.price ? 'border-red-500' : ''}
                />
                {errors.price && touched.price && (
                  <p className="text-sm text-red-600">{errors.price}</p>
                )}
              </div>
            )}

            <div className="flex justify-between gap-4">
              <div className="space-y-2 flex-1 min-w-0">
                <Label htmlFor="edit-chapter-image">Featured Image</Label>
                <label
                  htmlFor="edit-chapter-image"
                  className="border-input bg-input-background focus-visible:border-ring focus-visible:ring-ring/50 flex h-9 w-full cursor-pointer items-center rounded-full border px-4 py-1 text-sm text-muted-foreground transition-[color,box-shadow] outline-none focus-within:ring-[3px] focus-within:border-ring focus-within:ring-ring/50"
                >
                  <input
                    id="edit-chapter-image"
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
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
