'use client';
import { useState, useRef, useEffect } from 'react';
import { Upload, UserCircle } from 'lucide-react';
import { Button } from '@heroui/react';
import type { ITestimonialsDataEntity } from '@/types/testimonial';

interface FormValues {
  name: string;
  title: string;
  message: string;
  rating: number;
  status: string;
  photo: File | null;
}

interface TestimonialFormProps {
  initial?: Partial<ITestimonialsDataEntity>;
  onSubmit: (formData: FormData) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}

const inputCls =
  'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary';

export function TestimonialForm({ initial = {}, onSubmit, onCancel, isLoading }: TestimonialFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [values, setValues] = useState<FormValues>({
    name: initial.name ?? '',
    title: initial.title ?? '',
    message: initial.message ?? '',
    rating: initial.rating ?? 5,
    status: initial.status ?? 'active',
    photo: null,
  });

  const [previewUrl, setPreviewUrl] = useState<string | null>(initial.photo ?? null);

  useEffect(() => {
    if (values.photo instanceof File) {
      const url = URL.createObjectURL(values.photo);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [values.photo]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setValues((prev) => ({ ...prev, photo: file }));
    }
  };

  const handleSubmit = async () => {
    const fd = new FormData();
    fd.append('name', values.name);
    fd.append('title', values.title);
    fd.append('message', values.message);
    fd.append('rating', String(values.rating));
    fd.append('status', values.status);
    if (values.photo) {
      fd.append('photo', values.photo);
    }
    await onSubmit(fd);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-5">

      {/* Photo upload */}
      <div className="flex items-center gap-5">
        <div className="shrink-0 w-20 h-20 rounded-full overflow-hidden bg-gray-100 border border-gray-200 flex items-center justify-center">
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
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-700 mb-1">
            Photo <span className="text-gray-400 font-normal">(optional)</span>
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
          <Button
            type="button"
            variant="bordered"
            size="sm"
            startContent={<Upload className="h-4 w-4" />}
            onPress={() => fileInputRef.current?.click()}
          >
            {values.photo ? values.photo.name : 'Choose image'}
          </Button>
          <p className="text-xs text-gray-400 mt-1">JPG, PNG, WEBP — max 5 MB</p>
        </div>
      </div>

      {/* Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            className={inputCls}
            value={values.name}
            onChange={(e) => setValues((p) => ({ ...p, name: e.target.value }))}
            placeholder="Reviewer name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            className={inputCls}
            value={values.title}
            onChange={(e) => setValues((p) => ({ ...p, title: e.target.value }))}
            placeholder="e.g. CEO at Acme"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Rating (1–5)</label>
          <input
            type="number"
            min={1}
            max={5}
            className={inputCls}
            value={values.rating}
            onChange={(e) =>
              setValues((p) => ({ ...p, rating: Math.min(5, Math.max(1, Number(e.target.value))) }))
            }
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            className={inputCls}
            value={values.status}
            onChange={(e) => setValues((p) => ({ ...p, status: e.target.value }))}
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Message <span className="text-red-500">*</span>
        </label>
        <textarea
          rows={4}
          className={`${inputCls} resize-none`}
          value={values.message}
          onChange={(e) => setValues((p) => ({ ...p, message: e.target.value }))}
          placeholder="Testimonial message…"
        />
      </div>

      <div className="flex gap-3 justify-end">
        <Button variant="bordered" onPress={onCancel} size="sm" isDisabled={isLoading}>
          Cancel
        </Button>
        <Button color="primary" isLoading={isLoading} onPress={handleSubmit} size="sm">
          Save
        </Button>
      </div>
    </div>
  );
}
