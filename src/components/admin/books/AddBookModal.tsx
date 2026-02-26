import { useState, useEffect, useCallback } from 'react';
import { useFormik } from 'formik';
import { Save, X, Plus, Trash2, ChevronDownIcon } from 'lucide-react';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from '../../ui/dropdown-menu';
import toast from '@/utils/toast';
import { addBookSchema } from '@/utils/formValidation';
import type { Author, Category } from '../../../data/mockData';

export interface ChapterFormItem {
  id: string;
  title: string;
  description: string;
  featuredImageFile: File | null;
  featuredImagePreviewUrl: string | null;
  price?: number;
}

function newChapterFormItem(sequence: number): ChapterFormItem {
  return {
    id: `ch-${Date.now()}-${sequence}`,
    title: '',
    description: '',
    featuredImageFile: null,
    featuredImagePreviewUrl: null,
  };
}

const initialFormValues = {
  title: '',
  description: '',
  authorId: '',
  categoryIds: [] as string[],
  tags: [] as string[],
  tagsInput: '',
  pricingType: 'book' as 'chapter' | 'book',
  defaultChapterPrice: undefined as number | undefined,
  bookPrice: undefined as number | undefined,
  chapters: [] as ChapterFormItem[],
};

interface AddBookModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  authors: Author[];
  categories: Category[];
  onSuccess?: () => void;
}

export function AddBookModal({
  open,
  onOpenChange,
  authors,
  categories,
  onSuccess,
}: AddBookModalProps) {
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreviewUrl, setCoverPreviewUrl] = useState<string | null>(null);

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
    validationSchema: addBookSchema,
    onSubmit: (vals, { resetForm: reset }) => {
      if (coverPreviewUrl) URL.revokeObjectURL(coverPreviewUrl);
      revokeChapterPreviews(vals.chapters);
      setCoverFile(null);
      setCoverPreviewUrl(null);
      reset({ values: initialFormValues });
      onOpenChange(false);
      toast.success('Book created successfully');
      onSuccess?.();
    },
  });

  const revokeChapterPreviews = useCallback((chapters: ChapterFormItem[]) => {
    chapters.forEach((ch) => {
      if (ch.featuredImagePreviewUrl) URL.revokeObjectURL(ch.featuredImagePreviewUrl);
    });
  }, []);

  useEffect(() => {
    if (!open) {
      revokeChapterPreviews(values.chapters);
      resetForm({ values: initialFormValues });
      setCoverFile(null);
      setCoverPreviewUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return null;
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only run when modal closes
  }, [open]);

  const addTag = (tag: string) => {
    const t = tag.trim();
    if (!t || values.tags.includes(t)) return;
    setFieldValue('tags', [...values.tags, t]);
    setFieldValue('tagsInput', '');
  };

  const removeTag = (index: number) => {
    setFieldValue(
      'tags',
      values.tags.filter((_, i) => i !== index)
    );
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
      if (coverPreviewUrl) URL.revokeObjectURL(coverPreviewUrl);
      setCoverFile(file);
      setCoverPreviewUrl(URL.createObjectURL(file));
    }
    e.target.value = '';
  };

  const clearCoverImage = () => {
    if (coverPreviewUrl) URL.revokeObjectURL(coverPreviewUrl);
    setCoverFile(null);
    setCoverPreviewUrl(null);
  };

  const closeModal = () => {
    if (coverPreviewUrl) URL.revokeObjectURL(coverPreviewUrl);
    setCoverFile(null);
    setCoverPreviewUrl(null);
    resetForm({ values: initialFormValues });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="xl" className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New Book</DialogTitle>
          <DialogDescription>
            Add a new book to the platform. Fill in the details below.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col min-h-0">
          <div className="space-y-4 py-4 admin_panel max-h-[70vh] custom_scrollbar overflow-y-auto">
            <div className="space-y-2">
              <Label htmlFor="book-title">Title<span className="text-red-500">*</span></Label>
              <Input
                id="book-title"
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
              <Label htmlFor="book-desc">Description</Label>
              <Textarea
                id="book-desc"
                name="description"
                placeholder="Brief description of the book..."
                value={values.description}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={isSubmitting}
                rows={3}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Thought Leader<span className="text-red-500">*</span></Label>
                <Select
                  value={values.authorId}
                  onValueChange={(value) => {
                    setFieldValue('authorId', value);
                    setFieldTouched('authorId', true);
                  }}
                >
                  <SelectTrigger
                    className={errors.authorId && touched.authorId ? 'border-red-500' : ''}
                  >
                    <SelectValue placeholder="Select author" />
                  </SelectTrigger>
                  <SelectContent>
                    {authors.map((a) => (
                      <SelectItem key={a.id} value={a.id}>
                        {a.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.authorId && touched.authorId && (
                  <p className="text-sm text-red-600">{errors.authorId}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Categories<span className="text-red-500">*</span></Label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      className={`border-input flex h-9 w-full items-center justify-between gap-2 rounded-full border bg-input-background px-4 py-2 text-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:size-4 ${errors.categoryIds && touched.categoryIds ? 'border-red-500' : ''}`}
                    >
                      <span className={values.categoryIds.length === 0 ? 'text-muted-foreground' : ''}>
                        {values.categoryIds.length === 0
                          ? 'Select categories'
                          : values.categoryIds
                              .map((id) => categories.find((c) => c.id === id)?.name)
                              .filter(Boolean)
                              .join(', ')}
                      </span>
                      <ChevronDownIcon className="opacity-50 shrink-0" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="max-h-(--radix-dropdown-menu-content-available-height) w-(--radix-dropdown-menu-trigger-width)">
                    {categories.map((c) => (
                      <DropdownMenuCheckboxItem
                        key={c.id}
                        checked={values.categoryIds.includes(c.id)}
                        onCheckedChange={(checked) => {
                          const next = checked
                            ? [...values.categoryIds, c.id]
                            : values.categoryIds.filter((id) => id !== c.id);
                          setFieldValue('categoryIds', next);
                          setFieldTouched('categoryIds', true);
                        }}
                      >
                        {c.name}
                      </DropdownMenuCheckboxItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                {errors.categoryIds && touched.categoryIds && (
                  <p className="text-sm text-red-600">{errors.categoryIds}</p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="book-tags">Tags</Label>
              <Input
                id="book-tags"
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
                      className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-sm"
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
          <div className="flex justify-between gap-4">
            <div className="space-y-2 flex-1 min-w-0">
              <Label htmlFor="book-cover">Cover Image</Label>
              <label
                htmlFor="book-cover"
                className="border-input bg-input-background focus-visible:border-ring focus-visible:ring-ring/50 flex h-9 w-full cursor-pointer items-center rounded-full border px-4 py-1 text-sm text-muted-foreground transition-[color,box-shadow] outline-none focus-within:ring-[3px] focus-within:border-ring focus-within:ring-ring/50"
              >
                <input
                  id="book-cover"
                  type="file"
                  accept="image/*"
                  onChange={handleCoverFileChange}
                  className="sr-only"
                />
                <span className="truncate">
                  {coverFile ? coverFile.name : 'Select image...'}
                </span>
              </label>
            </div>
            {coverPreviewUrl ? (
              <div className="mt-3 relative inline-block">
                <div className="rounded-2xl overflow-hidden bg-muted border border-border aspect-4/4 max-w-24">
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
              <div className="mt-3 rounded-2xl border border-dashed border-muted-foreground/30 aspect-4/4 max-w-24 flex items-center justify-center bg-muted/30">
                <span className="text-xs text-muted-foreground px-3 text-center">
                  Select an image to preview
                </span>
              </div>
            )}
          </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Type</Label>
                <Select
                  value={values.pricingType}
                  onValueChange={(value: 'chapter' | 'book') =>
                    setFieldValue('pricingType', value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="chapter" disabled>
                      chapter
                    </SelectItem>
                    <SelectItem value="book">book</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {values.pricingType === 'book' && (
                <div className="space-y-2">
                  <Label htmlFor="book-price">Book Price ($)</Label>
                  <Input
                    id="book-price"
                    name="bookPrice"
                    type="number"
                    min={0}
                    step={0.01}
                    placeholder="0.00"
                    value={values.bookPrice ?? ''}
                    onChange={(e) =>
                      setFieldValue(
                        'bookPrice',
                        e.target.value ? Number(e.target.value) : undefined
                      )
                    }
                    onBlur={handleBlur}
                    disabled={isSubmitting}
                    className={errors.bookPrice && touched.bookPrice ? 'border-red-500' : ''}
                  />
                  {errors.bookPrice && touched.bookPrice && (
                    <p className="text-sm text-red-600">{errors.bookPrice}</p>
                  )}
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
              Create Book
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
