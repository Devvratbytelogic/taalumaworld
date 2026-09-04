'use client';

import { useRef } from 'react';
import { Camera, Loader2 } from 'lucide-react';
import { useUpdateProfilePicMutation } from '@/store/rtkQueries/adminPostApi';
import { UserAvatar } from '@/components/ui/UserAvatar';
import toast from '@/utils/toast';
import { cn } from '@/components/ui/utils';
import { refreshAfterMentorChange } from '@/store/server-api/refreshCache';
import { ALLOWED_IMAGE_ACCEPT, IMAGE_UPLOAD_LIMIT_LABEL, IMAGE_UPLOAD_MAX_BYTES, getImageSizeLimitMessage, getImageTypeErrorMessage, isAllowedImageFile } from '@/constants/fileUpload';
import { FileUploadLimitHint } from '@/components/ui/FileUploadLimitHint';

type AvatarSize = 'md' | 'lg' | 'xl';

interface ProfileAvatarUploadProps {
  src?: string;
  name: string;
  size?: AvatarSize;
  className?: string;
  ringClassName?: string;
  /** Public mentor page cache clear after avatar upload */
  publicMentorShortCode?: string | null;
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
  publicMentorShortCode,
}: ProfileAvatarUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [updateProfilePic, { isLoading }] = useUpdateProfilePicMutation();
  const sizeConfig = SIZE_CLASSES[size];

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    if (!isAllowedImageFile(file)) {
      toast.error(getImageTypeErrorMessage());
      return;
    }
    if (file.size > IMAGE_UPLOAD_MAX_BYTES) {
      toast.error(getImageSizeLimitMessage('Photo'));
      return;
    }

    try {
      const formData = new FormData();
      formData.append('profile_pic', file);
      const res = await updateProfilePic(formData).unwrap();
      if (res?.http_status_code === 200 || res?.http_status_code === 201) {
        if (publicMentorShortCode) void refreshAfterMentorChange(publicMentorShortCode);
        toast.success(res.message ?? 'Profile picture updated successfully');
      }
    } catch (error) {
      console.error('Failed to update profile picture', error);
    }
  };

  return (
    <div className="relative z-10 flex shrink-0 flex-col items-center">
      <div className={cn('overflow-hidden rounded-full border bg-white', sizeConfig.wrap, className)}>
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
          title={`Change profile picture (${IMAGE_UPLOAD_LIMIT_LABEL})`}
          aria-label={`Change profile picture (${IMAGE_UPLOAD_LIMIT_LABEL})`}
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
          accept={ALLOWED_IMAGE_ACCEPT}
          className="sr-only"
          onChange={handleFileChange}
          disabled={isLoading}
        />
      </div>
      <FileUploadLimitHint kind="image" className="mt-1" />
    </div>
  );
}
