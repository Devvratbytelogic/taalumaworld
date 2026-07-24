'use client';

import { useRef } from 'react';
import { Camera, Loader2 } from 'lucide-react';
import { useUpdateProfilePicMutation } from '@/store/rtkQueries/adminPostApi';
import { UserAvatar } from '@/components/ui/UserAvatar';
import toast from '@/utils/toast';
import { cn } from '@/components/ui/utils';

type AvatarSize = 'md' | 'lg' | 'xl';

interface ProfileAvatarUploadProps {
  src?: string;
  name: string;
  size?: AvatarSize;
  className?: string;
  ringClassName?: string;
}

const SIZE_CLASSES: Record<AvatarSize, { wrap: string; icon: string; showLabel: boolean }> = {
  md: { wrap: 'h-14 w-14', icon: 'h-4 w-4', showLabel: true },
  lg: { wrap: 'h-16 w-16', icon: 'h-4 w-4', showLabel: true },
  xl: { wrap: 'h-24 w-24', icon: 'h-5 w-5', showLabel: true },
};

export function ProfileAvatarUpload({
  src = '',
  name,
  size = 'xl',
  className,
  ringClassName = 'ring-4 ring-white',
}: ProfileAvatarUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [updateProfilePic, { isLoading }] = useUpdateProfilePicMutation();
  const sizeConfig = SIZE_CLASSES[size];

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
    <div className={cn('relative z-10 shrink-0 rounded-full overflow-hidden border bg-white', sizeConfig.wrap, className)}>
      <button
        type="button"
        onClick={() => !isLoading && inputRef.current?.click()}
        disabled={isLoading}
        className={cn(
          'group relative block h-full w-full overflow-hidden rounded-full shadow-md outline-none',
          ringClassName,
          'focus-visible:ring-primary/40',
          isLoading ? 'cursor-wait' : 'cursor-pointer',
        )}
        title="Change profile picture"
        aria-label="Change profile picture"
      >
        <UserAvatar
          userName={name}
          userPhoto={src}
          size="xl"
          className="h-full! w-full! text-2xl"
        />
        <span
          className={cn(
            'pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center gap-0.5 rounded-full bg-black/50 text-white transition-opacity',
            isLoading ? 'opacity-100' : 'opacity-0 group-hover:opacity-100',
          )}
        >
          {isLoading ? (
            <Loader2 className={cn('animate-spin', sizeConfig.icon)} />
          ) : (
            <>
              <Camera className={sizeConfig.icon} />
              {sizeConfig.showLabel ? (
                <span className="text-[10px] font-medium">Change</span>
              ) : null}
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
