'use client';

import { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@heroui/react';
import Button from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { closeModal } from '@/store/slices/allModalSlice';
import { RootState } from '@/store/store';
import {
  useAddStaffMutation,
  useGetAllRolesQuery,
  useUpdateUserMutation,
} from '@/store/rtkQueries/rolesPermissionsApi';
import { staffSchema } from '@/utils/formValidation';
import toast from '@/utils/toast';
import ReactSelect from 'react-select';
import { SELECT_STYLES } from '@/constants/selectStyle';
import { USER_TYPE } from '@/constants/common';
import { cn } from '@/components/ui/utils';

const DISABLED_ROLE_NAMES = new Set<string>(Object.values(USER_TYPE));

function buildStaffFormData(
  formValues: {
    name: string;
    email: string;
    role_id: string;
    phone: string;
    facebook: string;
    linkedin: string;
    professionalBio: string;
  },
  profilePicFile: File | null,
) {
  const formData = new FormData();
  formData.append('name', formValues.name.trim());
  formData.append('email', formValues.email.trim());
  formData.append('phone', formValues.phone.trim());
  formData.append('facebook', formValues.facebook.trim());
  formData.append('linkedin', formValues.linkedin.trim());
  formData.append('professionalBio', formValues.professionalBio.trim());
  formData.append('role_id', formValues.role_id);
  if (profilePicFile) {
    formData.append('profile_pic', profilePicFile);
  }
  return formData;
}

export function AddEditStaffModal() {
  const dispatch = useDispatch();
  const { isOpen, data } = useSelector((state: RootState) => state.allModal);
  const staff = data?.staff ?? null;
  const isEdit = data?.isEdit ?? false;

  const { data: rolesData } = useGetAllRolesQuery();
  const roles = rolesData?.data?.data ?? [];
  const roleOptions = roles.map((r) => ({
    value: r._id,
    label: r.name,
    isDisabled: DISABLED_ROLE_NAMES.has(r.name),
  }));
  const [addStaff, { isLoading: isAdding }] = useAddStaffMutation();
  const [updateUser, { isLoading: isUpdatingUser }] = useUpdateUserMutation();
  const [profilePicFile, setProfilePicFile] = useState<File | null>(null);
  const [profilePicPreview, setProfilePicPreview] = useState<string | null>(null);

  const onClose = () => dispatch(closeModal());

  useEffect(() => {
    if (isOpen) return;
    setProfilePicFile(null);
    setProfilePicPreview((prev) => {
      if (prev?.startsWith('blob:')) URL.revokeObjectURL(prev);
      return null;
    });
  }, [isOpen]);

  const { values, errors, touched, isSubmitting, handleChange, handleBlur, handleSubmit, setFieldValue, setFieldTouched, resetForm } =
    useFormik({
      enableReinitialize: true,
      initialValues: {
        name: staff?.name ?? '',
        email: staff?.email ?? '',
        role_id: staff?.role_id ?? staff?.role?._id ?? '',
        phone: staff?.phone ?? staff?.phone_number ?? '',
        facebook: staff?.facebook ?? '',
        linkedin: staff?.linkedin ?? '',
        professionalBio: staff?.professionalBio ?? '',
        profile_pic: null as File | null,
      },
      validationSchema: staffSchema,
      onSubmit: async (formValues) => {
        try {
          const formData = buildStaffFormData(formValues, profilePicFile);

          if (isEdit) {
            const res = await updateUser({ id: data?.staff._id, payload: formData }).unwrap();
            if (res?.http_status_code === 200 || res?.http_status_code === 201) {
              toast.success(res?.message ?? 'Staff member updated successfully');
              resetForm();
              setProfilePicFile(null);
              setProfilePicPreview(null);
              onClose();
            }
          } else {
            const res = await addStaff(formData).unwrap();
            if (res?.http_status_code === 200 || res?.http_status_code === 201) {
              toast.success(res?.message ?? 'Staff member added successfully');
              resetForm();
              setProfilePicFile(null);
              setProfilePicPreview(null);
              onClose();
            }
          }
        } catch (error) {
          console.error('Error adding/updating staff', error);
        }
      },
    });

  const isLoading = isAdding || isSubmitting || isUpdatingUser;
  const previewSrc = profilePicPreview || staff?.profile_pic || '';

  const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file (e.g. JPG, PNG)');
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
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="modal_container"
      size="lg"
      scrollBehavior="inside"
      classNames={{
        base: 'max-h-[90vh]',
        body: 'custom_scrollbar',
      }}
    >
      <ModalContent className="admin_panel max-h-[90vh]">
        <form noValidate onSubmit={handleSubmit} className="flex max-h-[90vh] flex-col overflow-hidden">
          <ModalHeader className="flex shrink-0 flex-col gap-1">
            <p className="text-xl font-bold">{isEdit ? 'Edit Staff' : 'Add Staff'}</p>
            <p className="text-sm font-normal text-muted-foreground">
              {isEdit
                ? 'Update staff profile details and role assignment.'
                : 'Add a new staff member with profile details and role assignment.'}
            </p>
          </ModalHeader>

          <ModalBody className="min-h-0 flex-1 overflow-y-auto py-2 p-6!">
            <div className="flex items-center gap-4">
              <Avatar className="border h-16 w-16 shrink-0">
                <AvatarImage src={previewSrc} alt={values.name || 'Staff'} />
                <AvatarFallback>{values.name?.[0]?.toUpperCase() ?? 'S'}</AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1 space-y-2">
                <Label htmlFor="staff-profile-pic">Profile picture</Label>
                <label
                  htmlFor="staff-profile-pic"
                  className={cn(
                    'flex h-10 cursor-pointer items-center rounded-md border border-dashed border-slate-300 bg-slate-50 px-3 text-sm text-slate-600 transition-colors hover:bg-slate-100',
                    errors.profile_pic && touched.profile_pic && 'border-red-500',
                  )}
                >
                  <input
                    id="staff-profile-pic"
                    type="file"
                    accept="image/*"
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
              <Label htmlFor="name">
                Full Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                name="name"
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="e.g. Jane Doe"
                disabled={isLoading}
                className={errors.name && touched.name ? 'border-red-500' : undefined}
              />
              {touched.name && errors.name ? (
                <p className="text-sm text-red-600">{errors.name as string}</p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">
                Email <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="name@taaluma.world"
                disabled={isLoading}
                className={errors.email && touched.email ? 'border-red-500' : undefined}
              />
              {touched.email && errors.email ? (
                <p className="text-sm text-red-600">{errors.email as string}</p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="role_id">
                Role <span className="text-red-500">*</span>
              </Label>
              <ReactSelect
                inputId="role_id"
                name="role_id"
                classNamePrefix="react-select"
                options={roleOptions}
                value={roleOptions.find((o) => o.value === values.role_id) ?? null}
                onChange={(option) => {
                  setFieldValue('role_id', option?.value ?? '');
                  setFieldTouched('role_id', true);
                }}
                onBlur={() => setFieldTouched('role_id', true)}
                placeholder="Select a role"
                isDisabled={isLoading}
                styles={SELECT_STYLES}
                // menuPortalTarget={typeof document !== 'undefined' ? document.body : null}
                menuPosition="fixed"
              />
              {touched.role_id && errors.role_id ? (
                <p className="text-sm text-red-600">{errors.role_id as string}</p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
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
                <p className="text-sm text-red-600">{errors.phone as string}</p>
              ) : null}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="facebook">Facebook</Label>
                <Input
                  id="facebook"
                  name="facebook"
                  value={values.facebook}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="https://facebook.com/..."
                  disabled={isLoading}
                  className={errors.facebook && touched.facebook ? 'border-red-500' : undefined}
                />
                {touched.facebook && errors.facebook ? (
                  <p className="text-sm text-red-600">{errors.facebook as string}</p>
                ) : null}
              </div>
              <div className="space-y-2">
                <Label htmlFor="linkedin">LinkedIn</Label>
                <Input
                  id="linkedin"
                  name="linkedin"
                  value={values.linkedin}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="https://linkedin.com/in/..."
                  disabled={isLoading}
                  className={errors.linkedin && touched.linkedin ? 'border-red-500' : undefined}
                />
                {touched.linkedin && errors.linkedin ? (
                  <p className="text-sm text-red-600">{errors.linkedin as string}</p>
                ) : null}
              </div>
            </div>

            <div className="space-y-2 pb-1">
              <Label htmlFor="professionalBio">Professional bio</Label>
              <Textarea
                id="professionalBio"
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
                <p className="text-sm text-red-600">{errors.professionalBio as string}</p>
              ) : null}
            </div>
          </ModalBody>

          <ModalFooter className="shrink-0 border-t border-slate-100">
            <Button className="global_btn outline_primary" onPress={onClose} isDisabled={isLoading}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="global_btn bg_primary"
              isLoading={isLoading}
              isDisabled={isLoading}
            >
              {isEdit ? 'Update Staff' : 'Add Staff'}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
