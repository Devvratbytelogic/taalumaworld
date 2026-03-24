'use client';
import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { User, Mail, Camera, X, Check, Shield, Calendar } from 'lucide-react';
import { Avatar } from '@heroui/react';
import Button from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import toast from '@/utils/toast';
import { useGetAdminProfileQuery } from '@/store/rtkQueries/adminGetApi';
import { useUpdateAdminProfileMutation } from '@/store/rtkQueries/adminPostApi';
import { getRoleName } from '@/utils/adminPermissions';
import type { AdminRole } from '@/types/admin';

const updateAdminProfileSchema = Yup.object({
    name: Yup.string()
        .trim()
        .min(2, 'Name must be at least 2 characters')
        .max(60, 'Name must be at most 60 characters')
        .required('Name is required'),
    professionalBio: Yup.string()
        .trim()
        .max(500, 'Bio must be at most 500 characters')
        .optional(),
});

export function AdminProfileTab() {
    const [isEditing, setIsEditing] = useState(false);
    const [tempPhoto, setTempPhoto] = useState<string>('');
    const [photoFile, setPhotoFile] = useState<File | null>(null);

    const { data: profileData, isLoading } = useGetAdminProfileQuery();
    const [updateAdminProfile] = useUpdateAdminProfileMutation();

    const profile = profileData?.data;

    const { errors, touched, isSubmitting, values, handleSubmit, handleChange, handleBlur, resetForm } =
        useFormik({
            enableReinitialize: true,
            initialValues: {
                name: profile?.name ?? '',
                professionalBio: profile?.professionalBio ?? '',
            },
            validationSchema: updateAdminProfileSchema,
            onSubmit: async (formValues) => {
                try {
                    const formData = new FormData();
                    formData.append('name', formValues.name.trim());
                    formData.append('email', profile?.email ?? '');
                    formData.append('professionalBio', formValues.professionalBio?.trim() ?? '');
                    if (photoFile) {
                        formData.append('profile_pic', photoFile);
                    }
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
        if (file.size > 5 * 1024 * 1024) {
            toast.error('Photo must be less than 5MB');
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

    const handleRemovePhoto = () => {
        setTempPhoto('');
        setPhotoFile(null);
    };

    const handleCancel = () => {
        resetForm();
        setTempPhoto('');
        setPhotoFile(null);
        setIsEditing(false);
    };

    const displayPhoto = tempPhoto || profile?.profile_pic || '';
    const displayName = values.name || profile?.name || 'Admin';
    const roleName = getRoleName((profile?.role?.name ?? 'super_admin') as AdminRole);

    const formatDate = (iso?: string) => {
        if (!iso) return '—';
        return new Date(iso).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
    };

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="bg-white rounded-xl p-6 shadow-sm animate-pulse">
                    <div className="h-7 w-36 bg-gray-200 rounded-lg mb-2" />
                    <div className="h-4 w-56 bg-gray-100 rounded-lg" />
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm animate-pulse space-y-6">
                    <div className="flex items-center gap-5 pb-6 border-b border-gray-200">
                        <div className="w-20 h-20 rounded-full bg-gray-200 shrink-0" />
                        <div className="space-y-2 flex-1">
                            <div className="h-5 w-28 bg-gray-200 rounded-lg" />
                            <div className="h-4 w-48 bg-gray-100 rounded-lg" />
                        </div>
                    </div>
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="space-y-2">
                            <div className="h-4 w-20 bg-gray-200 rounded-lg" />
                            <div className="h-5 w-52 bg-gray-100 rounded-lg" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-1">
                    <div className="p-2 bg-primary/10 rounded-lg">
                        <User className="h-5 w-5 text-primary" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
                </div>
                <p className="text-sm text-gray-500 ml-12">Manage your admin account information</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left: Profile Card */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-xl p-6 shadow-sm flex flex-col items-center text-center gap-3">
                        <div className="relative">
                            <Avatar
                                src={displayPhoto}
                                name={displayName}
                                className="w-24 h-24 text-2xl"
                            />
                        </div>
                        <div>
                            <p className="font-semibold text-gray-900 text-lg">{profile?.name ?? '—'}</p>
                            <p className="text-sm text-gray-500">{profile?.email ?? '—'}</p>
                        </div>
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-medium border border-purple-100">
                            <Shield className="h-3 w-3" />
                            {roleName}
                        </span>
                        {profile?.createdAt && (
                            <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-1">
                                <Calendar className="h-3.5 w-3.5" />
                                <span>Joined {formatDate(profile.createdAt)}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right: Form */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-xl p-6 shadow-sm">
                        <h2 className="text-base font-semibold text-gray-900 mb-6">
                            {isEditing ? 'Edit Profile' : 'Profile Details'}
                        </h2>

                        {/* Avatar upload row */}
                        <div className="flex items-start gap-5 mb-6 pb-6 border-b border-gray-100">
                            <Avatar
                                src={displayPhoto}
                                name={displayName}
                                className="w-16 h-16 shrink-0 text-xl"
                            />
                            <div className="flex-1">
                                <p className="text-sm font-medium text-gray-900 mb-1">Profile Photo</p>
                                <p className="text-xs text-gray-500 mb-3">
                                    JPG or PNG, max 5 MB. Displayed in the admin header.
                                </p>
                                {isEditing && (
                                    <div className="flex flex-wrap gap-2">
                                        <label>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handlePhotoUpload}
                                                className="hidden"
                                                disabled={isSubmitting}
                                            />
                                            <div className="cursor-pointer inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 text-sm font-medium text-gray-700 transition-colors">
                                                <Camera className="h-4 w-4" />
                                                {displayPhoto ? 'Change Photo' : 'Upload Photo'}
                                            </div>
                                        </label>
                                        {displayPhoto && (
                                            <button
                                                type="button"
                                                onClick={handleRemovePhoto}
                                                disabled={isSubmitting}
                                                className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border border-red-200 bg-white hover:bg-red-50 text-sm font-medium text-red-600 transition-colors"
                                            >
                                                <X className="h-4 w-4" />
                                                Remove
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Read-only view */}
                        {!isEditing && (
                            <>
                                <div className="space-y-5">
                                    <div>
                                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Full Name</p>
                                        <p className="text-sm font-semibold text-gray-900">{profile?.name ?? '—'}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Email Address</p>
                                        <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                                            <Mail className="h-4 w-4 text-gray-400" />
                                            {profile?.email ?? '—'}
                                        </div>
                                        <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Role</p>
                                        <p className="text-sm font-semibold text-gray-900">{roleName}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Bio</p>
                                        <p className="text-sm text-gray-900 leading-relaxed whitespace-pre-wrap">
                                            {profile?.professionalBio?.trim() || <span className="text-gray-400">No bio added yet</span>}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Member Since</p>
                                        <p className="text-sm font-semibold text-gray-900">{formatDate(profile?.createdAt)}</p>
                                    </div>
                                </div>
                                <div className="mt-6 pt-5 border-t border-gray-100">
                                    <Button
                                        className="global_btn rounded_full bg_primary"
                                        onPress={() => setIsEditing(true)}
                                    >
                                        Edit Profile
                                    </Button>
                                </div>
                            </>
                        )}

                        {/* Edit form */}
                        {isEditing && (
                            <form onSubmit={handleSubmit}>
                                <div className="space-y-5">
                                    <div>
                                        <label htmlFor="name" className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">
                                            Full Name
                                        </label>
                                        <Input
                                            id="name"
                                            name="name"
                                            value={values.name}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            placeholder="Enter your full name"
                                            disabled={isSubmitting}
                                            className={`max-w-md ${errors.name && touched.name ? 'border-red-500' : ''}`}
                                        />
                                        {errors.name && touched.name && (
                                            <p className="text-xs text-red-600 mt-1">{errors.name}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="professionalBio" className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">
                                            Bio
                                        </label>
                                        <textarea
                                            id="professionalBio"
                                            name="professionalBio"
                                            value={values.professionalBio}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            placeholder="Write a short professional bio..."
                                            disabled={isSubmitting}
                                            rows={4}
                                            className={`w-full max-w-md resize-none rounded-lg border px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-60 ${errors.professionalBio && touched.professionalBio ? 'border-red-500' : 'border-gray-300'}`}
                                        />
                                        <div className="flex items-center justify-between max-w-md mt-1">
                                            {errors.professionalBio && touched.professionalBio ? (
                                                <p className="text-xs text-red-600">{errors.professionalBio}</p>
                                            ) : (
                                                <span />
                                            )}
                                            <p className="text-xs text-gray-400 ml-auto">{values.professionalBio?.length ?? 0}/500</p>
                                        </div>
                                    </div>

                                    <div>
                                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">Email Address</p>
                                        <div className="flex items-center gap-2 text-sm font-semibold text-gray-900 py-2">
                                            <Mail className="h-4 w-4 text-gray-400" />
                                            {profile?.email ?? '—'}
                                        </div>
                                        <p className="text-xs text-gray-400">Email cannot be changed</p>
                                    </div>

                                    <div>
                                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">Role</p>
                                        <p className="text-sm font-semibold text-gray-900">{roleName}</p>
                                    </div>
                                </div>

                                <div className="flex gap-3 mt-6 pt-5 border-t border-gray-100">
                                    <Button
                                        type="submit"
                                        className="global_btn rounded_full bg_primary"
                                        disabled={isSubmitting}
                                        isLoading={isSubmitting}
                                    >
                                        {!isSubmitting && (
                                            <>
                                                <Check className="h-4 w-4" />
                                                Save Changes
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
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
