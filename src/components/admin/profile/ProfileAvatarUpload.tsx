'use client';

import { useRef } from 'react';
import { Avatar } from '@heroui/react';
import { Camera, Loader2 } from 'lucide-react';
import { useUpdateProfilePicMutation } from '@/store/rtkQueries/adminPostApi';
import toast from '@/utils/toast';
import { cn } from '@/components/ui/utils';

interface ProfileAvatarUploadProps {
  src?: string;
  name: string;
  className?: string;
}

export function ProfileAvatarUpload({ src = '', name, className }: ProfileAvatarUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [updateProfilePic, { isLoading }] = useUpdateProfilePicMutation();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload a valid image file');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Photo must be less than 2MB');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('profile_pic', file);
      const res = await updateProfilePic(formData).unwrap();
      if (res?.http_status_code === 200 || res?.http_status_code === 201) {
        toast.success(res.message ?? 'Profile picture updated successfully');
      }
    } catch (error) {
      console.error('Failed to update profile picture', error);
    }
  };

  return (
    <div className="relative h-24 w-24 shrink-0 rounded-full overflow-hidden">
      <button
        type="button"
        onClick={() => !isLoading && inputRef.current?.click()}
        disabled={isLoading}
        className={cn(
          'group relative block h-full w-full overflow-hidden rounded-full ring-4 ring-white shadow-md outline-none',
          'focus-visible:ring-primary/40',
          isLoading ? 'cursor-wait' : 'cursor-pointer',
        )}
        title="Change profile picture"
        aria-label="Change profile picture"
      >
        <Avatar src={src} name={name} className={cn('h-24 w-24 text-2xl', className)} />
        <span
          className={cn(
            'absolute inset-0 flex flex-col items-center justify-center gap-1 bg-black/50 text-white transition-opacity',
            isLoading ? 'opacity-100' : 'opacity-0 group-hover:opacity-100',
          )}
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <>
              <Camera className="h-5 w-5" />
              <span className="text-[10px] font-medium">Change</span>
            </>
          )}
        </span>
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={handleFileChange}
        disabled={isLoading}
      />
    </div>
  );
}
