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
import type { IAllBooksAPIResponseDataEntity } from '@/types/books';
import type { LeadersEntity } from '@/types/authleaders';
import type { CategoryEntity } from '@/types/categories';
import type { IAllCategoriesAPIResponseData, SubcategoriesEntity } from '@/types/categories';

const emptyFormValues = {
  title: '',
  description: '',
  thoughtLeader: '',
  category: '',
  subcategory: '',
  tags: [] as string[],
  tagsInput: '',
  pricingModel: 'book',
  price: '' as number | '',
  cover_image: null as File | null,
};

function getInitialValuesFromBook(book: IAllBooksAPIResponseDataEntity | null): typeof emptyFormValues {
  if (!book) return emptyFormValues;
  const thoughtLeaderId = typeof book.thoughtLeader === 'object' && book.thoughtLeader
    ? (book.thoughtLeader as { _id?: string })._id ?? ''
    : '';
  const categoryId = typeof book.category === 'object' && book.category
    ? (book.category as { _id?: string })._id ?? ''
    : '';
  const subcategoryId = book.subcategory && typeof book.subcategory === 'object'
    ? (book.subcategory as { _id?: string })._id ?? ''
    : '';
  const tags = Array.isArray(book.tags)
    ? (book.tags.filter(Boolean) as string[])
    : [];
  return {
    title: book.title ?? '',
    description: book.description ?? '',
    thoughtLeader: thoughtLeaderId,
    category: categoryId,
    subcategory: subcategoryId,
    tags,
    tagsInput: '',
    pricingModel: book.pricingModel === 'chapter' ? 'chapter' : 'book',
    price: book.price != null ? book.price : '',
    cover_image: null as File | null,
  };
}

interface EditBookModalProps {
  book: IAllBooksAPIResponseDataEntity | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  thoughtLeaders: LeadersEntity[];
  categories: CategoryEntity[];
  onSubmit: (args: { id: string; values: FormData }) => { unwrap: () => Promise<unknown> };
  isSubmitting?: boolean;
}

export function EditBookModal({
  book,
  open,
  onOpenChange,
  thoughtLeaders,
  categories,
  onSubmit,
  isSubmitting = false,
}: EditBookModalProps) {
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreviewUrl, setCoverPreviewUrl] = useState<string | null>(null);
  const coverIsObjectUrlRef = useRef(false);

  const initialValues = getInitialValuesFromBook(book);

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
      formData.append('thoughtLeader', vals.thoughtLeader);
      formData.append('category', vals.category);
      if (vals.subcategory) formData.append('subcategory', vals.subcategory);
      formData.append('description', vals.description ?? '');
      formData.append('pricingModel', vals.pricingModel);
      formData.append('price', String(vals.price === '' ? 0 : vals.price));
      if (coverFile) formData.append('cover_image', coverFile);
      formData.append('tags', values.tags.join(','));

      try {
        await onSubmit({ id: book._id, values: formData }).unwrap();
        if (coverIsObjectUrlRef.current && coverPreviewUrl) URL.revokeObjectURL(coverPreviewUrl);
        setCoverFile(null);
        setCoverPreviewUrl(null);
        coverIsObjectUrlRef.current = false;
        onOpenChange(false);
        toast.success('Book updated successfully');
      } catch {
        toast.error('Failed to update book');
      }
    },
  });

  const subcategories: SubcategoriesEntity[] = (() => {
    if (!values.category) return [];
    const cat = categories.find((c) => (c as IAllCategoriesAPIResponseData).id === values.category || (c as IAllCategoriesAPIResponseData)._id === values.category);
    return (cat?.subcategories ?? []).filter(Boolean) as SubcategoriesEntity[];
  })();

  useEffect(() => {
    if (open && book) {
      setCoverPreviewUrl(book.coverImage || null);
      coverIsObjectUrlRef.current = false;
      setCoverFile(null);
    }
  }, [open, book]);

  useEffect(() => {
    if (!open) {
      if (coverIsObjectUrlRef.current && coverPreviewUrl) URL.revokeObjectURL(coverPreviewUrl);
      setCoverFile(null);
      setCoverPreviewUrl(null);
      coverIsObjectUrlRef.current = false;
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

  const closeModal = () => {
    if (coverIsObjectUrlRef.current && coverPreviewUrl) URL.revokeObjectURL(coverPreviewUrl);
    setCoverFile(null);
    setCoverPreviewUrl(null);
    coverIsObjectUrlRef.current = false;
    resetForm({ values: emptyFormValues });
    onOpenChange(false);
  };

  const getCategoryId = (c: CategoryEntity) => (c as IAllCategoriesAPIResponseData).id ?? (c as IAllCategoriesAPIResponseData)._id;
  const getLeaderId = (l: LeadersEntity) => l.id ?? l._id;

  if (!book) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="xl" className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Book</DialogTitle>
          <DialogDescription>
            Update the details for &quot;{book.title}&quot;.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col min-h-0">
          <div className="space-y-4 py-4 admin_panel max-h-[70vh] custom_scrollbar overflow-y-auto">
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
                placeholder="Brief description of the book..."
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Thought Leader<span className="text-red-500">*</span></Label>
                <Select
                  value={values.thoughtLeader}
                  onValueChange={(value) => {
                    setFieldValue('thoughtLeader', value);
                    setFieldTouched('thoughtLeader', true);
                  }}
                >
                  <SelectTrigger
                    className={errors.thoughtLeader && touched.thoughtLeader ? 'border-red-500' : ''}
                  >
                    <SelectValue placeholder="Select thought leader" />
                  </SelectTrigger>
                  <SelectContent>
                    {thoughtLeaders.map((l) => (
                      <SelectItem key={getLeaderId(l)} value={l._id}>
                        {l.fullName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.thoughtLeader && touched.thoughtLeader && (
                  <p className="text-sm text-red-600">{errors.thoughtLeader}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Category<span className="text-red-500">*</span></Label>
                <Select
                  value={values.category}
                  onValueChange={(value) => {
                    setFieldValue('category', value);
                    setFieldValue('subcategory', '');
                    setFieldTouched('category', true);
                  }}
                >
                  <SelectTrigger
                    className={errors.category && touched.category ? 'border-red-500' : ''}
                  >
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={getCategoryId(c)} value={(c as IAllCategoriesAPIResponseData)._id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && touched.category && (
                  <p className="text-sm text-red-600">{errors.category}</p>
                )}
              </div>
            </div>
            {/* {subcategories.length > 0 && (
              <div className="space-y-2">
                <Label>Subcategory (optional)</Label>
                <Select
                  value={values.subcategory}
                  onValueChange={(value) => setFieldValue('subcategory', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select subcategory" />
                  </SelectTrigger>
                  <SelectContent>
                    {subcategories.map((s) => (
                      <SelectItem key={s.id ?? s._id} value={s._id}>
                        {s.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )} */}
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
                <Label htmlFor="edit-book-cover">Cover Image <span className="text-xs text-muted-foreground font-normal">(leave unchanged to keep current)</span></Label>
                <label
                  htmlFor="edit-book-cover"
                  className="border-input bg-input-background focus-visible:border-ring focus-visible:ring-ring/50 flex h-9 w-full cursor-pointer items-center rounded-full border px-4 py-1 text-sm text-muted-foreground transition-[color,box-shadow] outline-none focus-within:ring-[3px] focus-within:border-ring focus-within:ring-ring/50"
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
                  <span className="text-sm text-muted-foreground px-3 text-center">
                    Select an image to preview
                  </span>
                </div>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Pricing model</Label>
                <Select
                  value={values.pricingModel}
                  onValueChange={(value: 'book' | 'chapter') =>
                    setFieldValue('pricingModel', value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="chapter">chapter</SelectItem>
                    <SelectItem value="book">book</SelectItem>
                  </SelectContent>
                </Select>
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
              Update Book
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
