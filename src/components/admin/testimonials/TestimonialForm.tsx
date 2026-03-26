'use client';
import { useRef, useState, useEffect } from 'react';
import { useFormik } from 'formik';
import { Upload, UserCircle, Save, X } from 'lucide-react';
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
import type { ITestimonialsDataEntity } from '@/types/testimonial';
import { testimonialSchema } from '@/utils/formValidation';
import toast from '@/utils/toast';

interface TestimonialFormProps {
  initial?: Partial<ITestimonialsDataEntity>;
  onSubmit: (formData: FormData) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}

const STATUSES = ['Pending', 'Approved', 'Rejected'] as const;

export function TestimonialForm({ initial = {}, onSubmit, onCancel, isLoading }: TestimonialFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(initial.photo ?? null);

  useEffect(() => {
    if (photoFile) {
      const url = URL.createObjectURL(photoFile);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [photoFile]);

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
  } = useFormik({
    initialValues: {
      name: initial.name ?? '',
      title: initial.title ?? '',
      message: initial.message ?? '',
      rating: initial.rating ?? 5,
      status: initial.status ?? 'Pending',
      photo: null as File | null,
    },
    validationSchema: testimonialSchema,
    onSubmit: async (vals) => {
      const fd = new FormData();
      fd.append('name', vals.name);
      fd.append('title', vals.title);
      fd.append('message', vals.message);
      fd.append('rating', String(vals.rating));
      fd.append('status', vals.status);
      if (photoFile) fd.append('photo', photoFile);
      await onSubmit(fd);
    },
  });

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file (e.g. JPG, PNG)');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image must be less than 2MB');
      return;
    }
    setPhotoFile(file);
    setFieldValue('photo', file);
    e.target.value = '';
  };

  const clearPhoto = () => {
    setPhotoFile(null);
    setPreviewUrl(initial.photo ?? null);
    setFieldValue('photo', null);
  };

  const isSubmittingState = isSubmitting || isLoading;

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-xl p-6 space-y-6">

      {/* Photo upload */}
      <div className="flex items-center gap-5">
        <div className="relative shrink-0">
          <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100 border border-gray-200 flex items-center justify-center">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Photo preview"
                className="w-full h-full object-cover"
                onError={() => setPreviewUrl(null)}
              />
            ) : (
              <UserCircle className="h-10 w-10 text-gray-300" />
            )}
          </div>
          {previewUrl && (
            <button
              type="button"
              onClick={clearPhoto}
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-destructive text-white flex items-center justify-center"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>
        <div>
          <Label className="mb-1 block">
            Photo <span className="text-muted-foreground font-normal">(optional)</span>
          </Label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handlePhotoChange}
          />
          <Button
            type="button"
            className="global_btn rounded_full outline_primary"
            startContent={<Upload className="h-4 w-4" />}
            onPress={() => fileInputRef.current?.click()}
            isDisabled={isSubmittingState}
          >
            {photoFile ? photoFile.name : 'Choose image'}
          </Button>
          <p className="text-xs text-muted-foreground mt-1">JPG, PNG, WEBP — max 2 MB</p>
        </div>
      </div>

      {/* Name + Title */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="t-name">Name <span className="text-red-500">*</span></Label>
          <Input
            id="t-name"
            name="name"
            placeholder="Reviewer name"
            value={values.name}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={isSubmittingState}
            className={errors.name && touched.name ? 'border-red-500' : ''}
          />
          {errors.name && touched.name && (
            <p className="text-sm text-red-600">{errors.name}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="t-title">Title / Role <span className="text-red-500">*</span></Label>
          <Input
            id="t-title"
            name="title"
            placeholder="e.g. CEO at Acme"
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

        {/* Rating */}
        <div className="space-y-2">
          <Label htmlFor="t-rating">Rating (1–5) <span className="text-red-500">*</span></Label>
          <Input
            id="t-rating"
            name="rating"
            type="number"
            min={1}
            max={5}
            value={values.rating}
            onChange={(e) => {
              if (e.target.value === '') { setFieldValue('rating', ''); return; }
              setFieldValue('rating', Number(e.target.value));
            }}
            onBlur={(e) => {
              const n = parseInt(e.target.value, 10);
              setFieldValue('rating', Number.isNaN(n) || n < 1 ? 1 : Math.min(5, n));
              handleBlur(e);
            }}
            disabled={isSubmittingState}
            className={errors.rating && touched.rating ? 'border-red-500' : ''}
          />
          {errors.rating && touched.rating && (
            <p className="text-sm text-red-600">{errors.rating as string}</p>
          )}
        </div>

        {/* Status */}
        <div className="space-y-2">
          <Label htmlFor="t-status">Status <span className="text-red-500">*</span></Label>
          <Select
            value={values.status}
            onValueChange={(v) => { setFieldValue('status', v); setFieldTouched('status', true); }}
            disabled={isSubmittingState}
          >
            <SelectTrigger
              id="t-status"
              className={errors.status && touched.status ? 'border-red-500' : ''}
            >
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {STATUSES.map((s) => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.status && touched.status && (
            <p className="text-sm text-red-600">{errors.status}</p>
          )}
        </div>
      </div>

      {/* Message */}
      <div className="space-y-2">
        <Label htmlFor="t-message">Message <span className="text-red-500">*</span></Label>
        <Textarea
          id="t-message"
          name="message"
          rows={4}
          placeholder="Testimonial message…"
          value={values.message}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={isSubmittingState}
          className={`resize-none rounded-2xl ${errors.message && touched.message ? 'border-red-500' : ''}`}
        />
        {errors.message && touched.message && (
          <p className="text-sm text-red-600">{errors.message}</p>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3 justify-end pt-2 border-t border-border">
        <Button
          type="button"
          className="global_btn rounded_full outline_primary"
          startContent={<X className="h-4 w-4" />}
          onPress={onCancel}
          isDisabled={isSubmittingState}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="global_btn rounded_full bg_primary"
          startContent={<Save className="h-4 w-4" />}
          isLoading={isSubmittingState}
          isDisabled={isSubmittingState}
        >
          Save
        </Button>
      </div>
    </form>
  );
}
