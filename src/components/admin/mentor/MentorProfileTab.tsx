'use client';

import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Avatar } from '@heroui/react';
import { Calendar, Camera, Check, Mail, Pencil, Shield, X } from 'lucide-react';
import Button from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  AdminPage,
  AdminPageHeader,
  AdminPanel,
  adminPanelClass,
} from '@/components/admin/layout/AdminContent';
import { MENTOR_OVERVIEW } from '@/components/admin/mentor/data/mentorPerformanceData';
import { useGetAdminProfileQuery } from '@/store/rtkQueries/adminGetApi';
import { useUpdateAdminProfileMutation } from '@/store/rtkQueries/adminPostApi';
import toast from '@/utils/toast';
import { cn } from '@/components/ui/utils';

const updateProfileSchema = Yup.object({
  name: Yup.string().trim().min(2, 'Name must be at least 2 characters').max(60, 'Name must be at most 60 characters').required('Name is required'),
  professionalBio: Yup.string().trim().max(500, 'Bio must be at most 500 characters').optional(),
});

function formatDate(iso?: string) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
}

function ProfileSkeleton() {
  return (
    <AdminPage>
      <div className={cn(adminPanelClass, 'animate-pulse p-6 h-28')} />
      <div className={cn(adminPanelClass, 'animate-pulse p-6 h-80')} />
    </AdminPage>
  );
}

export function MentorProfileTab() {
  const [isEditing, setIsEditing] = useState(false);
  const [tempPhoto, setTempPhoto] = useState('');
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  const { data: profileData, isLoading } = useGetAdminProfileQuery();
  const [updateAdminProfile] = useUpdateAdminProfileMutation();
  const profile = profileData?.data;

  const { errors, touched, isSubmitting, values, handleSubmit, handleChange, handleBlur, resetForm } = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: profile?.name ?? '',
      professionalBio: profile?.professionalBio ?? '',
    },
    validationSchema: updateProfileSchema,
    onSubmit: async (formValues) => {
      try {
        const formData = new FormData();
        formData.append('name', formValues.name.trim());
        formData.append('email', profile?.email ?? '');
        formData.append('professionalBio', formValues.professionalBio?.trim() ?? '');
        if (photoFile) formData.append('profile_pic', photoFile);

        await updateAdminProfile(formData).unwrap();
        setTempPhoto('');
        setPhotoFile(null);
        setIsEditing(false);
        toast.success('Profile updated successfully!');
      } catch {
        toast.error('Failed to update profile. Please try again.');
      }
    },
  });

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

  if (isLoading) return <ProfileSkeleton />;

  const displayPhoto = tempPhoto || profile?.profile_pic || '';
  const displayName = values.name || profile?.name || 'Mentor';

  return (
    <AdminPage>
      <AdminPageHeader
        eyebrow="Account"
        title="My Profile"
        description="Manage your mentor profile, bio, and public information."
      >
        {!isEditing ? (
          <Button
            className="global_btn rounded_full bg_primary"
            startContent={<Pencil className="h-4 w-4" />}
            onPress={() => setIsEditing(true)}
          >
            Edit profile
          </Button>
        ) : null}
      </AdminPageHeader>

      <AdminPanel padding={false} className="overflow-hidden">
        <div className="border-b border-slate-100 bg-linear-to-r from-primary/5 via-slate-50 to-white px-6 py-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <Avatar src={displayPhoto} name={displayName} className="h-24 w-24 text-2xl ring-4 ring-white shadow-md" />
            <div className="min-w-0 flex-1">
              <h2 className="text-xl font-semibold text-slate-900">{profile?.name ?? '—'}</h2>
              <p className="mt-1 flex items-center gap-2 text-sm text-slate-500">
                <Mail className="h-4 w-4 shrink-0" />
                {profile?.email ?? '—'}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                  <Shield className="h-3.5 w-3.5" />
                  Mentor
                </span>
                {profile?.createdAt ? (
                  <span className="inline-flex items-center gap-1.5 text-xs text-slate-500">
                    <Calendar className="h-3.5 w-3.5" />
                    Joined {formatDate(profile.createdAt)}
                  </span>
                ) : null}
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg border border-slate-200/80 bg-white/80 px-4 py-3">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Profile completion</p>
              <p className="mt-1 text-lg font-semibold text-slate-900">{MENTOR_OVERVIEW.profileCompletion}%</p>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full rounded-full bg-primary" style={{ width: `${MENTOR_OVERVIEW.profileCompletion}%` }} />
              </div>
            </div>
            <div className="rounded-lg border border-slate-200/80 bg-white/80 px-4 py-3">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Verification</p>
              <p className="mt-1 text-sm font-semibold text-amber-700">{MENTOR_OVERVIEW.verificationStatus}</p>
            </div>
            <div className="rounded-lg border border-slate-200/80 bg-white/80 px-4 py-3">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Mentor type</p>
              <p className="mt-1 text-sm font-semibold text-slate-900">{MENTOR_OVERVIEW.mentorType}</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          {!isEditing ? (
            <dl className="grid gap-6 sm:grid-cols-2">
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">Full name</dt>
                <dd className="mt-1 text-sm font-medium text-slate-900">{profile?.name ?? '—'}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">Email</dt>
                <dd className="mt-1 text-sm font-medium text-slate-900">{profile?.email ?? '—'}</dd>
                <p className="mt-1 text-xs text-slate-400">Email cannot be changed</p>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">Role</dt>
                <dd className="mt-1 text-sm font-medium text-slate-900">Mentor</dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">Member since</dt>
                <dd className="mt-1 text-sm font-medium text-slate-900">{formatDate(profile?.createdAt)}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">Bio</dt>
                <dd className="mt-1 text-sm leading-relaxed text-slate-700 whitespace-pre-wrap">
                  {profile?.professionalBio?.trim() || 'No bio added yet'}
                </dd>
              </div>
            </dl>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex flex-col gap-4 border-b border-slate-100 pb-6 sm:flex-row sm:items-center">
                <Avatar src={displayPhoto} name={displayName} className="h-16 w-16 shrink-0 text-xl" />
                <div>
                  <p className="text-sm font-medium text-slate-900">Profile photo</p>
                  <p className="mt-0.5 text-xs text-slate-500">JPG or PNG, max 2 MB</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <label>
                      <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" disabled={isSubmitting} />
                      <span className="inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50">
                        <Camera className="h-4 w-4" />
                        {displayPhoto ? 'Change photo' : 'Upload photo'}
                      </span>
                    </label>
                    {displayPhoto ? (
                      <button
                        type="button"
                        onClick={() => { setTempPhoto(''); setPhotoFile(null); }}
                        disabled={isSubmitting}
                        className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-red-200 px-3 text-sm font-medium text-red-600 hover:bg-red-50"
                      >
                        <X className="h-4 w-4" />
                        Remove
                      </button>
                    ) : null}
                  </div>
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Full name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={values.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    disabled={isSubmitting}
                    className={errors.name && touched.name ? 'border-red-500' : ''}
                  />
                  {errors.name && touched.name ? <p className="text-sm text-red-600">{errors.name}</p> : null}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile?.email ?? ''}
                    readOnly
                    disabled
                    className="bg-slate-50 text-slate-600"
                  />
                  <p className="text-xs text-slate-400">Email cannot be changed</p>
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="professionalBio">Bio</Label>
                  <textarea
                    id="professionalBio"
                    name="professionalBio"
                    value={values.professionalBio}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    disabled={isSubmitting}
                    rows={4}
                    placeholder="Write a short professional bio..."
                    className={cn(
                      'w-full resize-none rounded-lg border px-3 py-2 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-primary/20',
                      errors.professionalBio && touched.professionalBio ? 'border-red-500' : 'border-slate-200',
                    )}
                  />
                  <div className="flex justify-between text-xs text-slate-400">
                    {errors.professionalBio && touched.professionalBio ? (
                      <span className="text-red-600">{errors.professionalBio}</span>
                    ) : (
                      <span />
                    )}
                    <span>{values.professionalBio?.length ?? 0}/500</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 border-t border-slate-100 pt-5">
                <Button type="submit" className="global_btn rounded_full bg_primary" isLoading={isSubmitting} startContent={<Check className="h-4 w-4" />}>
                  Save changes
                </Button>
                <Button type="button" className="global_btn rounded_full outline_primary" onPress={handleCancel} disabled={isSubmitting}>
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </div>
      </AdminPanel>
    </AdminPage>
  );
}
