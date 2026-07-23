'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useFormik } from 'formik';
import { Avatar } from '@heroui/react';
import { Ban, Calendar, Camera, Check, CheckCircle2, Facebook, Linkedin, Lock, Mail, Pencil, Phone, Shield, User, X } from 'lucide-react';
import Button from '@/components/ui/Button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  AdminPage,
  AdminPageHeader,
  AdminPanel,
  adminPanelClass,
} from '@/components/admin/layout/AdminContent';
import { useGetAdminProfileQuery } from '@/store/rtkQueries/adminGetApi';
import { useUpdateAdminProfileMutation } from '@/store/rtkQueries/adminPostApi';
import { mentorProfileDetailsSchema } from '@/utils/formValidation';
import toast from '@/utils/toast';
import { cn } from '@/components/ui/utils';
import { ProfileAvatarUpload } from '@/components/admin/profile/ProfileAvatarUpload';

function formatDate(iso?: string) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
}

function PrivacyBadge({ isPrivate }: { isPrivate?: boolean }) {
  return (
    <span
      className={cn(
        'ml-2 inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide',
        isPrivate ? 'bg-slate-100 text-slate-600' : 'bg-emerald-50 text-emerald-700',
      )}
    >
      {isPrivate ? 'Private' : 'Public'}
    </span>
  );
}

function PrivacyToggle({
  id,
  label,
  description,
  checked,
  onCheckedChange,
  disabled,
}: {
  id: string;
  label: string;
  description: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-md border border-slate-200 px-3.5 py-2.5">
      <div>
        <p className="text-sm font-medium text-slate-900">{label}</p>
        <p className="text-xs text-slate-500">{description}</p>
      </div>
      <Switch id={id} checked={checked} onCheckedChange={onCheckedChange} disabled={disabled} />
    </div>
  );
}

function ProfileSkeleton() {
  return (
    <AdminPage>
      <div className={cn(adminPanelClass, 'animate-pulse p-6 h-28')} />
      <div className={cn(adminPanelClass, 'animate-pulse p-6 h-80')} />
    </AdminPage>
  );
}

export function AdminProfileTab() {
  const [isEditing, setIsEditing] = useState(false);
  const [tempPhoto, setTempPhoto] = useState('');
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  const { data: profileData, isLoading } = useGetAdminProfileQuery();
  const [updateAdminProfile] = useUpdateAdminProfileMutation();
  const profile = profileData?.data;

  const { errors, touched, isSubmitting, values, handleSubmit, handleChange, handleBlur, resetForm, setFieldValue } = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: profile?.name ?? '',
      phone: profile?.phone ?? '',
      professionalBio: profile?.professionalBio ?? '',
      facebook: profile?.facebook ?? '',
      linkedin: profile?.linkedin ?? '',
      isEmailPrivate: profile?.isEmailPrivate ?? false,
      isNamePrivate: profile?.isNamePrivate ?? false,
      isPhonePrivate: profile?.isPhonePrivate ?? false,
    },
    validationSchema: mentorProfileDetailsSchema,
    onSubmit: async (formValues) => {
      try {
        const formData = new FormData();
        formData.append('name', formValues.name.trim());
        formData.append('email', profile?.email ?? '');
        formData.append('phone', formValues.phone.trim());
        formData.append('professionalBio', formValues.professionalBio?.trim() ?? '');
        formData.append('facebook', formValues.facebook?.trim() ?? '');
        formData.append('linkedin', formValues.linkedin?.trim() ?? '');
        formData.append('isEmailPrivate', String(formValues.isEmailPrivate));
        formData.append('isNamePrivate', String(formValues.isNamePrivate));
        formData.append('isPhonePrivate', String(formValues.isPhonePrivate));
        if (photoFile) formData.append('profile_pic', photoFile);

        const res = await updateAdminProfile(formData).unwrap();
        if (res?.http_status_code === 200 || res?.http_status_code === 201) {
          setTempPhoto('');
          setPhotoFile(null);
          setIsEditing(false);
          toast.success(res.message ?? 'Profile updated successfully!');
        }
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
  const displayName = values.name || profile?.name || 'Admin';
  const roleName = profile?.role?.name ?? 'Admin';
  const isSuspended = !!profile?.isSuspended;
  const permissions = profile?.permission ?? [];

  return (
    <AdminPage>
      <AdminPageHeader
        eyebrow="System"
        title="My Profile"
        description="Manage your administrator account information."
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
            <ProfileAvatarUpload src={profile?.profile_pic ?? ''} name={displayName} />
            <div className="min-w-0 flex-1">
              <h2 className="text-xl font-semibold text-slate-900">{profile?.name ?? '—'}</h2>
              <p className="mt-1 flex items-center gap-2 text-sm text-slate-500">
                <Mail className="h-4 w-4 shrink-0" />
                {profile?.email ?? '—'}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20! bg-primary/10! px-3 py-1 text-xs font-medium text-primary">
                  <Shield className="h-3.5 w-3.5" />
                  {roleName}
                </span>
                <span
                  className={cn(
                    'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium capitalize',
                    isSuspended
                      ? 'border-red-200! bg-red-50 text-red-700'
                      : 'border-emerald-200! bg-emerald-50 text-emerald-700',
                  )}
                >
                  {isSuspended ? <Ban className="h-3.5 w-3.5" /> : <CheckCircle2 className="h-3.5 w-3.5" />}
                  {isSuspended ? 'Suspended' : (profile?.status ?? 'Active')}
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
        </div>

        <div className="p-6">
          {!isEditing ? (
            <dl className="grid gap-6 sm:grid-cols-2">
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Full name
                  <PrivacyBadge isPrivate={profile?.isNamePrivate} />
                </dt>
                <dd className="mt-1 text-sm font-medium text-slate-900">{profile?.name ?? '—'}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Email
                  <PrivacyBadge isPrivate={profile?.isEmailPrivate} />
                </dt>
                <dd className="mt-1 text-sm font-medium text-slate-900">{profile?.email ?? '—'}</dd>
                <p className="mt-1 text-xs text-slate-400">Email cannot be changed</p>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Phone number
                  <PrivacyBadge isPrivate={profile?.isPhonePrivate} />
                </dt>
                <dd className="mt-1 flex items-center gap-1.5 text-sm font-medium text-slate-900">
                  <Phone className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                  {profile?.phone || '—'}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">Role</dt>
                <dd className="mt-1 text-sm font-medium text-slate-900">{roleName}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">Member since</dt>
                <dd className="mt-1 text-sm font-medium text-slate-900">{formatDate(profile?.createdAt)}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">Username</dt>
                <dd className="mt-1 flex items-center gap-1.5 text-sm font-medium text-slate-900">
                  <User className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                  {profile?.username || '—'}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">Date of birth</dt>
                <dd className="mt-1 text-sm font-medium text-slate-900">{formatDate(profile?.dob ?? undefined)}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">Facebook</dt>
                <dd className="mt-1 flex items-center gap-1.5 text-sm font-medium text-slate-900">
                  {profile?.facebook ? (
                    <Link
                      href={profile.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-primary hover:underline"
                    >
                      <Facebook className="h-3.5 w-3.5 shrink-0" />
                      <span className="truncate">{profile.facebook}</span>
                    </Link>
                  ) : (
                    '—'
                  )}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">LinkedIn</dt>
                <dd className="mt-1 flex items-center gap-1.5 text-sm font-medium text-slate-900">
                  {profile?.linkedin ? (
                    <Link
                      href={profile.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-primary hover:underline"
                    >
                      <Linkedin className="h-3.5 w-3.5 shrink-0" />
                      <span className="truncate">{profile.linkedin}</span>
                    </Link>
                  ) : (
                    '—'
                  )}
                </dd>
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
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={values.phone}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    disabled={isSubmitting}
                    placeholder="e.g. +254712345678"
                    className={errors.phone && touched.phone ? 'border-red-500' : ''}
                  />
                  {errors.phone && touched.phone ? (
                    <p className="text-sm text-red-600">{errors.phone}</p>
                  ) : null}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="facebook">Facebook URL</Label>
                  <Input
                    id="facebook"
                    name="facebook"
                    value={values.facebook}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    disabled={isSubmitting}
                    placeholder="https://facebook.com/yourprofile"
                    className={errors.facebook && touched.facebook ? 'border-red-500' : ''}
                  />
                  {errors.facebook && touched.facebook ? <p className="text-sm text-red-600">{errors.facebook}</p> : null}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="linkedin">LinkedIn URL</Label>
                  <Input
                    id="linkedin"
                    name="linkedin"
                    value={values.linkedin}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    disabled={isSubmitting}
                    placeholder="https://linkedin.com/in/yourprofile"
                    className={errors.linkedin && touched.linkedin ? 'border-red-500' : ''}
                  />
                  {errors.linkedin && touched.linkedin ? <p className="text-sm text-red-600">{errors.linkedin}</p> : null}
                </div>
                <div className="space-y-3 sm:col-span-2">
                  <p className="text-sm font-medium text-slate-900">Privacy</p>
                  <p className="text-xs text-slate-500">Control what others can see on your public profile.</p>
                  <div className="grid gap-3 sm:grid-cols-3">
                    <PrivacyToggle
                      id="isNamePrivate"
                      label="Hide name"
                      description="Keep your name private"
                      checked={values.isNamePrivate}
                      onCheckedChange={(checked) => setFieldValue('isNamePrivate', checked)}
                      disabled={isSubmitting}
                    />
                    <PrivacyToggle
                      id="isEmailPrivate"
                      label="Hide email"
                      description="Keep your email private"
                      checked={values.isEmailPrivate}
                      onCheckedChange={(checked) => setFieldValue('isEmailPrivate', checked)}
                      disabled={isSubmitting}
                    />
                    <PrivacyToggle
                      id="isPhonePrivate"
                      label="Hide phone"
                      description="Keep your phone private"
                      checked={values.isPhonePrivate}
                      onCheckedChange={(checked) => setFieldValue('isPhonePrivate', checked)}
                      disabled={isSubmitting}
                    />
                  </div>
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

      <AdminPanel padding={false} className="overflow-hidden">
        <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-6 py-4">
          <div>
            <h2 className="text-base font-semibold text-slate-900">Role Permissions</h2>
            <p className="mt-0.5 text-xs text-slate-500">
              Access granted via the <span className="font-medium">{roleName}</span> role.
            </p>
          </div>
          <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-500">
            <Lock className="h-3.5 w-3.5" />
            Read-only
          </span>
        </div>
        {permissions.length > 0 ? (
          <ul className="max-h-[420px] divide-y divide-slate-100 overflow-y-auto p-6 pt-0">
            {permissions.map((entry) => (
              <li key={entry._id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                <span className="text-sm font-medium text-slate-800">{entry.model}</span>
                {entry.permission && entry.permission.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {entry.permission.map((perm) => (
                      <Badge key={perm} variant="outline" className="capitalize bg-primary/5 text-primary border-primary/20">
                        {perm}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <span className="text-xs text-slate-400">No access</span>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <div className="p-6 text-sm text-slate-500">
            No permission restrictions are configured for this role — full platform access is granted by default.
          </div>
        )}
      </AdminPanel>
    </AdminPage>
  );
}
