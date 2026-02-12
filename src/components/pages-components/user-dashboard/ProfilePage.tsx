import { useState } from 'react';
import { User, Mail, Camera, X, Check } from 'lucide-react';
import Button from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { UserAvatar } from '@/components/ui/UserAvatar';
import toast from '@/utils/toast';

interface ProfilePageProps {
  userEmail: string;
  userName: string;
  userPhoto: string;
}

export function ProfilePage({
  userEmail,
  userName,
  userPhoto
}: ProfilePageProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(userName);
  const [editedPhoto, setEditedPhoto] = useState(userPhoto);
  const [tempPhoto, setTempPhoto] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Photo must be less than 5MB');
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload a valid image file');
        return;
      }

      // Read file and convert to base64
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setTempPhoto('');
    setEditedPhoto('');
  };

  const handleSave = async () => {
    setIsSaving(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // In a real app, this would update the backend
    if (tempPhoto) {
      setEditedPhoto(tempPhoto);
    }

    setIsSaving(false);
    setIsEditing(false);
    toast.success('Profile updated successfully!');
  };

  const handleCancel = () => {
    setEditedName(userName);
    setTempPhoto('');
    setIsEditing(false);
  };

  const displayPhoto = tempPhoto || editedPhoto;

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
        <p className="text-muted-foreground">
          Manage your personal information
        </p>
      </div>

      {/* Profile Content */}
      <div className="bg-white rounded-3xl p-8 shadow-sm">
        <div className="max-w-2xl">
          {/* Profile Photo Section */}
          <div className="flex items-start gap-6 mb-8 pb-8 border-b border-gray-200">
            <div className="w-24 h-24 shrink-0">
              <UserAvatar
                userName={editedName || userName}
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
                        disabled={isSaving}
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
                          disabled={isSaving}
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
                        disabled={isSaving}
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

          {/* Profile Information */}
          <div className="space-y-6">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#000000' }}>
                Full Name
              </label>
              {isEditing ? (
                <Input
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  placeholder="Enter your full name"
                  disabled={isSaving}
                  className="max-w-md"
                />
              ) : (
                <p className="text-base py-2 font-medium" style={{ color: '#000000' }}>{userName}</p>
              )}
            </div>

            {/* Email (Read-only) */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#000000' }}>
                Email Address
              </label>
              <div className="flex items-center gap-3 text-base py-2">
                <Mail className="h-5 w-5" style={{ color: '#000000' }} />
                <span className="font-medium" style={{ color: '#000000' }}>{userEmail}</span>
              </div>
              <p className="text-xs mt-1" style={{ color: '#666666' }}>
                Email address cannot be changed
              </p>
            </div>

            {/* Member Since */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#000000' }}>
                Member Since
              </label>
              <p className="text-base py-2 font-medium" style={{ color: '#000000' }}>
                January 2026
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-8 pt-6 border-t border-gray-200">
            {isEditing ? (
              <>
                <Button
                  className='global_btn rounded_full bg_primary'
                  onPress={handleSave}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Check className="h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
                <Button
                  className='global_btn rounded_full outline_primary'
                  onPress={handleCancel}
                  disabled={isSaving}
                >
                  Cancel
                </Button>
              </>
            ) : (
              <Button className='global_btn rounded_full bg_primary' onPress={() => setIsEditing(true)}>
                Edit Profile
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}