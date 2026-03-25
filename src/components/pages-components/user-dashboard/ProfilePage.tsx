'use client';
import { useState } from 'react';
import { useFormik } from 'formik';
import { User, Mail, Camera, X, Check } from 'lucide-react';
import Button from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { UserAvatar } from '@/components/ui/UserAvatar';
import toast from '@/utils/toast';
import { useGetUserProfileQuery } from '@/store/rtkQueries/userGetAPI';
import { useUserUpdateProfileMutation } from '@/store/rtkQueries/userAuthApi';
import { updateProfileSchema } from '@/utils/formValidation';

export function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [tempPhoto, setTempPhoto] = useState<string>('');
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  const { data: profileData, isLoading } = useGetUserProfileQuery();
  const [updateProfile] = useUserUpdateProfileMutation();

  const profile = profileData?.data;

  const { errors, touched, isSubmitting, values, handleSubmit, handleChange, handleBlur, resetForm } =
    useFormik({
      enableReinitialize: true,
      initialValues: {
        fullName: profile?.name ?? '',
      },
      validationSchema: updateProfileSchema,
      onSubmit: async (values) => {
        try {
          const formData = new FormData();
          formData.append('name', values.fullName.trim());
          if (photoFile) {
            formData.append('profile_pic', photoFile);
          }
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

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
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
      reader.onloadend = () => {
        setTempPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
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

  const formatDate = (iso?: string) => {
    if (!iso) return '—';
    return new Date(iso).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-3xl p-8 shadow-sm animate-pulse">
          <div className="h-8 w-40 bg-gray-200 rounded-xl mb-2" />
          <div className="h-4 w-64 bg-gray-100 rounded-xl" />
        </div>
        <div className="bg-white rounded-3xl p-8 shadow-sm animate-pulse space-y-6">
          <div className="flex items-center gap-6 pb-8 border-b border-gray-200">
            <div className="w-24 h-24 rounded-full bg-gray-200 shrink-0" />
            <div className="space-y-3 flex-1">
              <div className="h-5 w-32 bg-gray-200 rounded-xl" />
              <div className="h-4 w-56 bg-gray-100 rounded-xl" />
            </div>
          </div>
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 w-24 bg-gray-200 rounded-xl" />
              <div className="h-6 w-56 bg-gray-100 rounded-xl" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white rounded-3xl p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-primary/10 rounded-2xl">
            <User className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">Profile</h1>
        </div>
        <p className="text-muted-foreground">Manage your personal information</p>
      </div>

      {/* Profile Content */}
      <div className="bg-white rounded-3xl p-8 shadow-sm">
        <div className="max-w-2xl">
          {/* Profile Photo Section */}
          <div className="flex items-start gap-6 mb-8 pb-8 border-b border-gray-200">
            <div className="w-24 h-24 shrink-0">
              <UserAvatar
                userName={values.fullName || profile?.name || ''}
                userPhoto={displayPhoto}
                size="xl"
              />
            </div>

            <div className="flex-1">
              <h3 className="font-bold text-lg mb-2">Profile Photo</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Add or update your profile photo. This will be visible in the header.
              </p>

              {isEditing && (
                <div className="flex gap-2">
                  {!displayPhoto ? (
                    <label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                        disabled={isSubmitting}
                      />
                      <div className="cursor-pointer flex items-center justify-center gap-2 h-10 px-4 rounded-2xl border border-border hover:bg-accent transition-colors">
                        <Camera className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Upload Photo</span>
                      </div>
                    </label>
                  ) : (
                    <>
                      <label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoUpload}
                          className="hidden"
                          disabled={isSubmitting}
                        />
                        <div className="cursor-pointer flex items-center justify-center gap-2 h-10 px-4 rounded-2xl border border-border hover:bg-accent transition-colors">
                          <Camera className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">Change</span>
                        </div>
                      </label>
                      <button
                        type="button"
                        onClick={handleRemovePhoto}
                        className="flex items-center justify-center gap-2 h-10 px-4 rounded-2xl border border-red-200 hover:bg-red-50 text-red-600 transition-colors"
                        disabled={isSubmitting}
                      >
                        <X className="h-4 w-4" />
                        <span className="text-sm font-medium">Remove</span>
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Read-only view — rendered only when NOT editing */}
          {!isEditing && (
            <>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#000000' }}>
                    Full Name
                  </label>
                  <p className="text-base py-2 font-medium" style={{ color: '#000000' }}>
                    {profile?.name ?? '—'}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#000000' }}>
                    Email Address
                  </label>
                  <div className="flex items-center gap-3 text-base py-2">
                    <Mail className="h-5 w-5" style={{ color: '#000000' }} />
                    <span className="font-medium" style={{ color: '#000000' }}>
                      {profile?.email ?? '—'}
                    </span>
                  </div>
                  <p className="text-sm mt-1" style={{ color: '#666666' }}>
                    Email address cannot be changed
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#000000' }}>
                    Member Since
                  </label>
                  <p className="text-base py-2 font-medium" style={{ color: '#000000' }}>
                    {formatDate(profile?.createdAt)}
                  </p>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <Button
                  className="global_btn rounded_full bg_primary"
                  onPress={() => setIsEditing(true)}
                >
                  Edit Profile
                </Button>
              </div>
            </>
          )}

          {/* Edit form — rendered only when editing */}
          {isEditing && (
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium mb-2" style={{ color: '#000000' }}>
                    Full Name
                  </label>
                  <Input
                    id="fullName"
                    name="fullName"
                    value={values.fullName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Enter your full name"
                    disabled={isSubmitting}
                    className={`max-w-md ${errors.fullName && touched.fullName ? 'border-red-500' : ''}`}
                  />
                  {errors.fullName && touched.fullName && (
                    <p className="text-sm text-red-600 mt-1">{errors.fullName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#000000' }}>
                    Email Address
                  </label>
                  <div className="flex items-center gap-3 text-base py-2">
                    <Mail className="h-5 w-5" style={{ color: '#000000' }} />
                    <span className="font-medium" style={{ color: '#000000' }}>
                      {profile?.email ?? '—'}
                    </span>
                  </div>
                  <p className="text-sm mt-1" style={{ color: '#666666' }}>
                    Email address cannot be changed
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#000000' }}>
                    Member Since
                  </label>
                  <p className="text-base py-2 font-medium" style={{ color: '#000000' }}>
                    {formatDate(profile?.createdAt)}
                  </p>
                </div>
              </div>

              <div className="flex gap-3 mt-8 pt-6 border-t border-gray-200">
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
  );
}
