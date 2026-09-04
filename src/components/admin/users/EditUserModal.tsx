'use client';

import { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import { Save, X } from 'lucide-react';
import Button from '@/components/ui/Button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/components/ui/utils';
import { editUserSchema } from '@/utils/formValidation';
import { useUpdateUserMutation } from '@/store/rtkQueries/rolesPermissionsApi';
import type { IAllUsersEntity } from '@/types/rolesPermissions';
import toast from '@/utils/toast';
import { USER_TYPE } from '@/constants/common';
import { refreshAfterMentorChange } from '@/store/server-api/refreshCache';
import { FileUploadLimitHint } from '@/components/ui/FileUploadLimitHint';
import { ALLOWED_IMAGE_ACCEPT, IMAGE_UPLOAD_MAX_BYTES, getImageSizeLimitMessage, getImageTypeErrorMessage, isAllowedImageFile } from '@/constants/fileUpload';

interface EditUserModalProps {
  user: IAllUsersEntity | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditUserModal({ user, open, onOpenChange }: EditUserModalProps) {
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  const [profilePicFile, setProfilePicFile] = useState<File | null>(null);
  const [profilePicPreview, setProfilePicPreview] = useState<string | null>(null);

  useEffect(() => {
    if (open) return;
    setProfilePicFile(null);
    setProfilePicPreview((prev) => {
      if (prev?.startsWith('blob:')) URL.revokeObjectURL(prev);
      return null;
    });
  }, [open]);

  const { values, errors, touched, handleChange, handleBlur, handleSubmit, resetForm, isSubmitting, setFieldValue, setFieldTouched } =
    useFormik({
      enableReinitialize: true,
      initialValues: {
        name: user?.name ?? '',
        email: user?.email ?? '',
        phone: user?.phone ?? user?.phone_number ?? '',
        facebook: user?.facebook ?? '',
        linkedin: user?.linkedin ?? '',
        professionalBio: user?.professionalBio ?? '',
        profile_pic: null as File | null,
      },
      validationSchema: editUserSchema,
      onSubmit: async (formValues) => {
        if (!user?._id) return;
        try {
          const formData = new FormData();
          formData.append('name', formValues.name.trim());
          formData.append('email', formValues.email.trim());
          formData.append('phone', formValues.phone.trim());
          formData.append('facebook', formValues.facebook.trim());
          formData.append('linkedin', formValues.linkedin.trim());
          formData.append('professionalBio', formValues.professionalBio.trim());
          if (profilePicFile) {
            formData.append('profile_pic', profilePicFile);
          }

          const res = await updateUser({ id: user._id, payload: formData }).unwrap();
          if (res?.http_status_code === 200 || res?.http_status_code === 201) {
            const isMentor =
              user.user_type === USER_TYPE.MENTOR || user.role?.name === USER_TYPE.MENTOR;
            if (isMentor) void refreshAfterMentorChange(user.short_code);
            toast.success(res.message ?? 'Customer updated successfully');
            resetForm();
            setProfilePicFile(null);
            setProfilePicPreview(null);
            onOpenChange(false);
          }
        } catch(error) {
          console.error('Failed to update user', error);
        }
      },
    });

  const isLoading = isUpdating || isSubmitting;
  const previewSrc = profilePicPreview || user?.profile_pic || '';

  const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (!file) return;
    if (!isAllowedImageFile(file)) {
      toast.error(getImageTypeErrorMessage());
      return;
    }
    if (file.size > IMAGE_UPLOAD_MAX_BYTES) {
      toast.error(getImageSizeLimitMessage());
      return;
    }
    if (profilePicPreview?.startsWith('blob:')) URL.revokeObjectURL(profilePicPreview);
    const url = URL.createObjectURL(file);
    setProfilePicFile(file);
    setProfilePicPreview(url);
    setFieldValue('profile_pic', file);
    setFieldTouched('profile_pic', true);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) resetForm();
        onOpenChange(nextOpen);
      }}
    >
      <DialogContent className="admin_panel flex max-h-[90vh] flex-col gap-0 overflow-hidden p-0 sm:max-w-lg">
        <form noValidate onSubmit={handleSubmit} className="flex max-h-[90vh] flex-col">
          <DialogHeader className="shrink-0 border-b border-slate-100 px-6 pb-4 pt-6 pr-12">
            <DialogTitle>Edit Customer</DialogTitle>
            <DialogDescription>
              Update profile details for {user?.name ?? 'this customer'}.
            </DialogDescription>
          </DialogHeader>

          <div className="custom_scrollbar flex-1 space-y-4 overflow-y-auto p-6!">
            <div className="flex items-center gap-4">
              <Avatar className="border h-16 w-16 shrink-0">
                <AvatarImage src={previewSrc} alt={values.name || 'Customer'} />
                <AvatarFallback>{values.name?.[0]?.toUpperCase() ?? 'C'}</AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1 space-y-2">
                <Label htmlFor="edit-user-profile-pic">
                  Profile picture
                  <FileUploadLimitHint kind="image" />
                </Label>
                <label
                  htmlFor="edit-user-profile-pic"
                  className={cn(
                    'flex h-10 cursor-pointer items-center rounded-md border border-dashed border-slate-300 bg-slate-50 px-3 text-sm text-slate-600 transition-colors hover:bg-slate-100',
                    errors.profile_pic && touched.profile_pic && 'border-red-500',
                  )}
                >
                  <input
                    id="edit-user-profile-pic"
                    type="file"
                    accept={ALLOWED_IMAGE_ACCEPT}
                    className="sr-only"
                    onChange={handleProfilePicChange}
                    disabled={isLoading}
                  />
                  <span className="truncate">
                    {profilePicFile ? profilePicFile.name : 'Choose image...'}
                  </span>
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-user-name">
                Full Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="edit-user-name"
                name="name"
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="e.g. Jane Doe"
                disabled={isLoading}
                className={errors.name && touched.name ? 'border-red-500' : undefined}
              />
              {touched.name && errors.name ? (
                <p className="text-sm text-red-600">{errors.name}</p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-user-email">
                Email <span className="text-red-500">*</span>
              </Label>
              <Input
                id="edit-user-email"
                name="email"
                type="email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="name@example.com"
                disabled={isLoading}
                className={errors.email && touched.email ? 'border-red-500' : undefined}
              />
              {touched.email && errors.email ? (
                <p className="text-sm text-red-600">{errors.email}</p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-user-phone">Phone Number</Label>
              <Input
                id="edit-user-phone"
                name="phone"
                type="tel"
                value={values.phone}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="e.g. +254712345678"
                disabled={isLoading}
                className={errors.phone && touched.phone ? 'border-red-500' : undefined}
              />
              {touched.phone && errors.phone ? (
                <p className="text-sm text-red-600">{errors.phone}</p>
              ) : null}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="edit-user-facebook">Facebook</Label>
                <Input
                  id="edit-user-facebook"
                  name="facebook"
                  value={values.facebook}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="https://facebook.com/..."
                  disabled={isLoading}
                  className={errors.facebook && touched.facebook ? 'border-red-500' : undefined}
                />
                {touched.facebook && errors.facebook ? (
                  <p className="text-sm text-red-600">{errors.facebook}</p>
                ) : null}
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-user-linkedin">LinkedIn</Label>
                <Input
                  id="edit-user-linkedin"
                  name="linkedin"
                  value={values.linkedin}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="https://linkedin.com/in/..."
                  disabled={isLoading}
                  className={errors.linkedin && touched.linkedin ? 'border-red-500' : undefined}
                />
                {touched.linkedin && errors.linkedin ? (
                  <p className="text-sm text-red-600">{errors.linkedin}</p>
                ) : null}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-user-bio">Professional bio</Label>
              <Textarea
                id="edit-user-bio"
                name="professionalBio"
                value={values.professionalBio}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Short professional bio..."
                disabled={isLoading}
                rows={4}
                className={errors.professionalBio && touched.professionalBio ? 'border-red-500' : undefined}
              />
              {touched.professionalBio && errors.professionalBio ? (
                <p className="text-sm text-red-600">{errors.professionalBio}</p>
              ) : null}
            </div>
          </div>

          <DialogFooter className="shrink-0 border-t border-slate-100 px-6 py-4">
            <Button
              type="button"
              className="global_btn rounded_full outline_primary"
              onPress={() => onOpenChange(false)}
              isDisabled={isLoading}
              startContent={<X className="h-4 w-4" />}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="global_btn rounded_full bg_primary"
              isLoading={isLoading}
              isDisabled={isLoading}
              startContent={!isLoading ? <Save className="h-4 w-4" /> : undefined}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
