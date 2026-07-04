'use client';

import { useState } from 'react';
import { useFormik } from 'formik';
import { Mail, Camera, Check, Pencil, Calendar, UserRound, ShieldCheck } from 'lucide-react';
import Button from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { UserAvatar } from '@/components/ui/UserAvatar';
import toast from '@/utils/toast';
import { useGetUserProfileQuery } from '@/store/rtkQueries/userGetAPI';
import { useUserUpdateProfileMutation } from '@/store/rtkQueries/userAuthApi';
import { updateProfileSchema } from '@/utils/formValidation';
import moment from 'moment';
import { UserDashboardPageHeader } from './UserDashboardPageHeader';

export function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [tempPhoto, setTempPhoto] = useState('');
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  const { data: profileData, isLoading } = useGetUserProfileQuery();
  const [updateProfile] = useUserUpdateProfileMutation();
  const profile = profileData?.data;

  const { errors, touched, isSubmitting, values, handleSubmit, handleChange, handleBlur, resetForm } =
    useFormik({
      enableReinitialize: true,
      initialValues: { fullName: profile?.name ?? '' },
      validationSchema: updateProfileSchema,
      onSubmit: async (formValues) => {
        try {
          const formData = new FormData();
          formData.append('name', formValues.fullName.trim());
          if (photoFile) formData.append('profile_pic', photoFile);
          await updateProfile(formData).unwrap();
          setTempPhoto('');
          setPhotoFile(null);
          setIsEditing(false);
          toast.success('Profile updated successfully!');
        } catch {
          toast.error('Failed to update profile. Please try again.');
        }
      },
    });

  const displayPhoto = tempPhoto || profile?.profile_pic || '';

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Photo must be less than 2MB');
      return;
    }
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload a valid image file');
      return;
    }
    setPhotoFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setTempPhoto(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleCancel = () => {
    resetForm();
    setTempPhoto('');
    setPhotoFile(null);
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="flex justify-between">
          <div className="space-y-2">
            <div className="h-7 w-28 rounded bg-gray-200" />
            <div className="h-4 w-52 rounded bg-gray-100" />
          </div>
          <div className="h-10 w-28 rounded-full bg-gray-200" />
        </div>
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
          <div className="h-32 bg-gray-100" />
          <div className="space-y-4 px-6 py-8">
            <div className="h-20 w-20 -mt-14 rounded-full bg-gray-200" />
            <div className="grid gap-4 sm:grid-cols-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 rounded-lg bg-gray-50" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <UserDashboardPageHeader title="Profile" description="View and update your account details">
        {!isEditing ? (
          <Button
            type="button"
            className="global_btn rounded_full outline_primary"
            onPress={() => queueMicrotask(() => setIsEditing(true))}
          >
            <Pencil className="h-4 w-4" />
            Edit profile
          </Button>
        ) : (
          <>
            <Button
              type="button"
              className="global_btn rounded_full bg_primary"
              disabled={isSubmitting}
              isLoading={isSubmitting}
              onPress={() => handleSubmit()}
            >
              {!isSubmitting && (
                <>
                  <Check className="h-4 w-4" />
                  Save
                </>
              )}
            </Button>
            <Button
              type="button"
              className="global_btn rounded_full outline_primary"
              onPress={handleCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          </>
        )}
      </UserDashboardPageHeader>

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
        <div className="relative h-24 bg-linear-to-r from-primary/15 via-primary/8 to-gray-50">
          <span className="absolute right-6 bottom-0 inline-flex translate-y-1/2 items-center gap-1.5 rounded-md border border-primary/15 bg-white px-3 py-1.5 text-xs font-medium text-primary sm:right-8">
            <ShieldCheck className="h-3.5 w-3.5 shrink-0" aria-hidden />
            Career Architect
          </span>

          <div className="absolute left-6 bottom-0 flex max-w-[calc(100%-10rem)] translate-y-1/2 items-end gap-4 sm:left-8 sm:max-w-[calc(100%-12rem)] sm:gap-5">
            <label className={isEditing ? 'relative shrink-0 cursor-pointer' : 'relative shrink-0'}>
              <div className="rounded-full ring-4 ring-white">
                <UserAvatar
                  userName={values.fullName || profile?.name || ''}
                  userPhoto={displayPhoto}
                  size="xl"
                />
              </div>
              {isEditing && (
                <>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                    disabled={isSubmitting}
                  />
                  <span className="absolute inset-0 flex items-center justify-center rounded-full bg-black/45 opacity-0 transition-opacity hover:opacity-100">
                    <Camera className="h-5 w-5 text-white" />
                  </span>
                </>
              )}
            </label>

            <div className="min-w-0 pb-0.5">
              <h2 className="truncate text-xl font-semibold leading-tight text-gray-900">
                {profile?.name ?? '—'}
              </h2>
              <p className="mt-1 flex items-center gap-1.5 truncate text-sm text-gray-500">
                <Mail className="h-3.5 w-3.5 shrink-0 opacity-70" aria-hidden />
                {profile?.email ?? '—'}
              </p>
            </div>
          </div>
        </div>

        <div className="relative px-6 pb-8 pt-12 sm:px-8">
          {isEditing && (
            <p className="text-sm text-gray-500">Click your photo to upload a new image (max 2MB)</p>
          )}

          <div className="mt-8 border-t border-gray-100 pt-8">
            {!isEditing ? (
              <div className="overflow-hidden rounded-lg border border-gray-200 bg-gray-50/60">
                <dl className="divide-y divide-gray-200/70">
                  <div className="flex flex-col gap-2 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
                    <dt className="flex items-center gap-3 text-sm font-normal text-gray-600">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-gray-200 bg-white">
                        <UserRound className="h-4 w-4 text-primary" aria-hidden />
                      </span>
                      Full name
                    </dt>
                    <dd className="pl-12 text-base font-medium text-gray-900 sm:pl-0 sm:text-right">
                      {profile?.name ?? '—'}
                    </dd>
                  </div>

                  <div className="flex flex-col gap-2 px-5 py-4 sm:flex-row sm:items-start sm:justify-between sm:gap-8">
                    <dt className="flex items-center gap-3 text-sm font-normal text-gray-600">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-gray-200 bg-white">
                        <Mail className="h-4 w-4 text-primary" aria-hidden />
                      </span>
                      Email address
                    </dt>
                    <dd className="pl-12 sm:pl-0 sm:text-right">
                      <p className="text-base font-medium text-gray-900">{profile?.email ?? '—'}</p>
                      <p className="mt-1 text-xs text-gray-500">Email cannot be changed</p>
                    </dd>
                  </div>

                  <div className="flex flex-col gap-2 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
                    <dt className="flex items-center gap-3 text-sm font-normal text-gray-600">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-gray-200 bg-white">
                        <Calendar className="h-4 w-4 text-primary" aria-hidden />
                      </span>
                      Member since
                    </dt>
                    <dd className="pl-12 text-base font-medium text-gray-900 sm:pl-0 sm:text-right">
                      {profile?.createdAt && moment(profile.createdAt).isValid()
                        ? moment(profile.createdAt).format('MMMM D, YYYY')
                        : '—'}
                    </dd>
                  </div>
                </dl>
              </div>
            ) : (
              <div className="overflow-hidden rounded-lg border border-gray-200 bg-gray-50/60">
                <form id="profile-form" onSubmit={handleSubmit} className="divide-y divide-gray-200/70">
                  <div className="px-5 py-4">
                    <label
                      htmlFor="fullName"
                      className="mb-2 flex items-center gap-3 text-sm font-normal text-gray-600"
                    >
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-gray-200 bg-white">
                        <UserRound className="h-4 w-4 text-primary" aria-hidden />
                      </span>
                      Full name
                    </label>
                    <div className="pl-12 sm:max-w-md">
                      <Input
                        id="fullName"
                        name="fullName"
                        value={values.fullName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="Enter your full name"
                        disabled={isSubmitting}
                        className={errors.fullName && touched.fullName ? 'border-red-500 bg-white' : 'bg-white'}
                      />
                      {errors.fullName && touched.fullName ? (
                        <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
                      ) : null}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 px-5 py-4 sm:flex-row sm:items-start sm:justify-between sm:gap-8">
                    <p className="flex items-center gap-3 text-sm font-normal text-gray-600">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-gray-200 bg-white">
                        <Mail className="h-4 w-4 text-primary" aria-hidden />
                      </span>
                      Email address
                    </p>
                    <div className="pl-12 sm:pl-0 sm:text-right">
                      <p className="text-base font-normal text-gray-900">{profile?.email ?? '—'}</p>
                      <p className="mt-1 text-xs text-gray-500">Email cannot be changed</p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
                    <p className="flex items-center gap-3 text-sm font-normal text-gray-600">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-gray-200 bg-white">
                        <Calendar className="h-4 w-4 text-primary" aria-hidden />
                      </span>
                      Member since
                    </p>
                    <p className="pl-12 text-base font-normal text-gray-900 sm:pl-0 sm:text-right">
                      {profile?.createdAt && moment(profile.createdAt).isValid()
                        ? moment(profile.createdAt).format('MMMM D, YYYY')
                        : '—'}
                    </p>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
