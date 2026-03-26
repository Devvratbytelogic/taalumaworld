import { useState, useEffect, useRef } from 'react';
import { useFormik } from 'formik';
import { Save, X, Upload } from 'lucide-react';
import Button from '../../ui/Button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Textarea } from '../../ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../ui/dialog';
import toast from '@/utils/toast';
import { authorSchema } from '@/utils/formValidation';

const initialFormValues = {
  fullName: '',
  email: '',
  professionalBio: '',
  status: 'Active' as 'Active' | 'Inactive',
  avatar: null as File | null,
};

export type AddAuthorFormValues = {
  fullName: string;
  email: string;
  professionalBio: string;
  status: 'Active' | 'Inactive';
  avatar: File | null;
};

interface AddAuthorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  onSubmitForm?: (values: AddAuthorFormValues) => Promise<void>;
}

export function AddAuthorModal({
  open,
  onOpenChange,
  onSuccess,
  onSubmitForm,
}: AddAuthorModalProps) {
  const [avatarPreviewUrl, setAvatarPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
    resetForm,
  } = useFormik({
    initialValues: initialFormValues,
    validationSchema: authorSchema,
    onSubmit: async () => {
      if (onSubmitForm) {
        await onSubmitForm(values);
      }
      resetForm({ values: initialFormValues });
      setAvatarPreviewUrl(null);
      onOpenChange(false);
      toast.success('Thought leader added successfully');
      onSuccess?.();
    },
  });

  useEffect(() => {
    if (values.avatar instanceof File) {
      const url = URL.createObjectURL(values.avatar);
      setAvatarPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
    setAvatarPreviewUrl(null);
  }, [values.avatar]);

  useEffect(() => {
    if (!open) {
      resetForm({ values: initialFormValues });
      setAvatarPreviewUrl(null);
    }
  }, [open, resetForm]);

  const closeModal = () => {
    resetForm({ values: initialFormValues });
    setAvatarPreviewUrl(null);
    onOpenChange(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setFieldValue('avatar', null);
        toast.error('Please select an image file');
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        setFieldValue('avatar', null);
        toast.error('Image must be less than 2MB');
        return;
      }
      setFieldValue('avatar', file);
    } else {
      setFieldValue('avatar', null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Thought Leader</DialogTitle>
          <DialogDescription>
            Add a new author or thought leader. Fill in the details below.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col min-h-0 admin_panel">
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="author-fullName">Full Name<span className="text-red-500">*</span></Label>
              <Input
                id="author-fullName"
                name="fullName"
                placeholder="e.g., Jane Doe"
                value={values.fullName}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={isSubmitting}
                className={errors.fullName && touched.fullName ? 'border-red-500' : ''}
              />
              {errors.fullName && touched.fullName && (
                <p className="text-sm text-red-600">{errors.fullName}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="author-email">Email<span className="text-red-500">*</span></Label>
              <Input
                id="author-email"
                name="email"
                type="email"
                placeholder="e.g., jane@example.com"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={isSubmitting}
                className={errors.email && touched.email ? 'border-red-500' : ''}
              />
              {errors.email && touched.email && (
                <p className="text-sm text-red-600">{errors.email}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="author-professionalBio">Professional Bio</Label>
              <Textarea
                id="author-professionalBio"
                name="professionalBio"
                placeholder="Expert in leadership..."
                value={values.professionalBio}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={isSubmitting}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="author-status">Status<span className="text-red-500">*</span></Label>
              <select
                id="author-status"
                name="status"
                value={values.status}
                onChange={(e) => setFieldValue('status', e.target.value as 'Active' | 'Inactive')}
                onBlur={handleBlur}
                disabled={isSubmitting}
                className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${errors.status && touched.status ? 'border-red-500' : ''}`}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
              {errors.status && touched.status && (
                <p className="text-sm text-red-600">{errors.status}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="author-avatar">Avatar (optional)</Label>
              <p className="text-sm text-muted-foreground">Select an image file.</p>
              <input
                ref={fileInputRef}
                id="author-avatar"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <Button
                type="button"
                className="global_btn rounded_full outline_primary w-full"
                onPress={() => fileInputRef.current?.click()}
                startContent={<Upload className="h-4 w-4" />}
              >
                {values.avatar ? values.avatar.name : 'Choose image'}
              </Button>
              {errors.avatar && touched.avatar && (
                <p className="text-sm text-red-600">{errors.avatar}</p>
              )}
              {avatarPreviewUrl && (
                <div className="mt-2 rounded-2xl overflow-hidden bg-muted border border-border w-20 h-20">
                  <img
                    src={avatarPreviewUrl}
                    alt="Avatar preview"
                    className="w-full h-full object-cover"
                    onError={() => setAvatarPreviewUrl(null)}
                  />
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
              Add Thought Leader
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
