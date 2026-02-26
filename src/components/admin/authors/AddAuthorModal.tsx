import { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import { Save, X } from 'lucide-react';
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
  name: '',
  bio: '',
  avatar: '',
};

interface AddAuthorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function AddAuthorModal({
  open,
  onOpenChange,
  onSuccess,
}: AddAuthorModalProps) {
  const [avatarPreviewUrl, setAvatarPreviewUrl] = useState<string | null>(null);

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
    onSubmit: () => {
      resetForm({ values: initialFormValues });
      setAvatarPreviewUrl(null);
      onOpenChange(false);
      toast.success('Thought leader added successfully');
      onSuccess?.();
    },
  });

  useEffect(() => {
    if (values.avatar && /^https?:\/\//.test(values.avatar)) {
      setAvatarPreviewUrl(values.avatar);
    } else {
      setAvatarPreviewUrl(null);
    }
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
              <Label htmlFor="author-name">Name<span className="text-red-500">*</span></Label>
              <Input
                id="author-name"
                name="name"
                placeholder="e.g., Dr. Sarah Mitchell"
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={isSubmitting}
                className={errors.name && touched.name ? 'border-red-500' : ''}
              />
              {errors.name && touched.name && (
                <p className="text-sm text-red-600">{errors.name}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="author-bio">Bio</Label>
              <Textarea
                id="author-bio"
                name="bio"
                placeholder="Brief bio or description..."
                value={values.bio}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={isSubmitting}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="author-avatar">Avatar URL</Label>
              <Input
                id="author-avatar"
                name="avatar"
                type="url"
                placeholder="https://..."
                value={values.avatar}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={isSubmitting}
                className={errors.avatar && touched.avatar ? 'border-red-500' : ''}
              />
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
