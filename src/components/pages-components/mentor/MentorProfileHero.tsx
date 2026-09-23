'use client';

import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { ShieldCheck, Linkedin, Facebook, BookOpen, Phone, Mail, Users, UserPlus, UserMinus } from 'lucide-react';
import { toast } from 'sonner';
import ImageComponent from '@/components/ui/ImageComponent';
import Button from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import { useGetMentorDetailsQuery } from '@/store/rtkQueries/userGetAPI';
import { useFollowMentorMutation } from '@/store/rtkQueries/userPostAPI';
import { openModal } from '@/store/slices/allModalSlice';
import type { IMentorInfo } from '@/types/user/mentorDetails';

function getInitials(name?: string) {
  if (!name) return 'M';
  const words = name.trim().split(/\s+/);
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
}

function HeroSkeleton({ className }: { className: string }) {
  return <div className={`animate-pulse bg-muted ${className}`} aria-hidden />;
}

function HeroContact({
  href,
  icon: Icon,
  label,
  value,
  loading = false,
}: {
  href?: string;
  icon: typeof Mail;
  label: string;
  value: string;
  loading?: boolean;
}) {
  const inner = (
    <>
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="text-left">
        <p className="text-xs text-muted-foreground">{label}</p>
        {loading ? (
          <HeroSkeleton className="mt-1 h-4 w-28 rounded" />
        ) : (
          <p className="font-medium text-foreground">{value}</p>
        )}
      </div>
    </>
  );

  if (href) {
    return (
      <a href={href} className="flex items-center gap-2.5 transition-colors hover:opacity-80">
        {inner}
      </a>
    );
  }

  return <div className="flex items-center gap-2.5">{inner}</div>;
}

interface MentorProfileHeroProps {
  mentor: IMentorInfo | null;
  totalBooks: number;
}

export default function MentorProfileHero({ mentor, totalBooks }: MentorProfileHeroProps) {
  const dispatch = useDispatch();
  const { isAuthenticated } = useAuth();
  const mentorKey = mentor?.short_code || mentor?._id || mentor?.id || '';
  const { data: authedMentor, isFetching: isLoadingFollowState } = useGetMentorDetailsQuery(mentorKey, {
    skip: !isAuthenticated || !mentorKey,
  });
  const viewer = authedMentor?.data?.mentor_info;
  const [isFollowing, setIsFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(mentor?.followerCount ?? 0);
  const [followMentor, { isLoading: isUpdatingFollow }] = useFollowMentorMutation();

  const mentorId = mentor?._id || mentor?.id || '';
  const email = viewer?.email ?? mentor?.email;
  const phone = viewer?.phone ?? mentor?.phone;
  const followStatePending = isAuthenticated && isLoadingFollowState && !viewer;

  useEffect(() => {
    if (!isAuthenticated) {
      setIsFollowing(false);
      setFollowerCount(mentor?.followerCount ?? 0);
      return;
    }
    if (!viewer) return;
    setIsFollowing(Boolean(viewer.isFollowed));
    if (typeof viewer.followerCount === 'number') {
      setFollowerCount(viewer.followerCount);
    }
  }, [isAuthenticated, viewer, mentor?.followerCount]);

  const handleToggleFollow = async () => {
    if (!mentorId) return;
    try {
      const res = await followMentor(mentorId).unwrap();
      const nextFollowing = !isFollowing;
      setIsFollowing(nextFollowing);
      setFollowerCount((count) => nextFollowing ? count + 1 : Math.max(0, count - 1));
      toast.success(
        res?.message ?? (nextFollowing
          ? `You are now following ${mentor?.name ?? 'this mentor'}`
          : `You unfollowed ${mentor?.name ?? 'this mentor'}`)
      );
    } catch (error) {
      console.error('error updating follow status', error);
    }
  };

  const openLogin = () => {
    dispatch(openModal({
      componentName: 'LoginRequiredModal',
      data: { action: 'follow', itemType: 'mentor', onSuccess: handleToggleFollow },
    }));
  };

  return (
    <>
      <div className="container">
        <div className="flex flex-col items-center gap-8 text-center md:flex-row md:items-start md:gap-10 md:text-left">
          <div className="relative shrink-0">
            <div className="h-28 w-28 overflow-hidden rounded-full border-4 border-card bg-muted shadow-md md:h-32 md:w-32">
              {mentor?.profile_pic ? (
                <ImageComponent src={mentor?.profile_pic} alt={mentor?.name ?? ''} object_cover />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-primary to-primary-dark text-2xl font-bold text-white">
                  {getInitials(mentor?.name)}
                </div>
              )}
            </div>
            {(mentor?.is_verified_mentor) && (
              <div className="absolute -right-1 -bottom-1 flex h-8 w-8 items-center justify-center rounded-full border-2 border-card bg-secondary-accent">
                <ShieldCheck className="h-4 w-4 text-white" aria-label="Verified mentor" />
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center justify-center gap-2 md:justify-start">
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
                {mentor?.role_id?.name || 'Mentor'}
              </span>
            </div>

            <div className="mt-4 flex flex-col items-center gap-4 md:flex-row md:items-center md:justify-between">
              <h1 className="font-ubuntu text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-4xl">
                {mentor?.name}
              </h1>

              {followStatePending ? (
                <HeroSkeleton className="h-10 w-28 shrink-0 rounded-full" />
              ) : (
                <Button
                  onPress={isAuthenticated ? handleToggleFollow : openLogin}
                  isLoading={isUpdatingFollow}
                  className={`global_btn rounded_full w_fit shrink-0 ${isFollowing ? 'outline_primary' : 'bg_primary'}`}
                  startContent={
                    isUpdatingFollow ? undefined : isFollowing ? (
                      <UserMinus className="h-4 w-4" />
                    ) : (
                      <UserPlus className="h-4 w-4" />
                    )
                  }
                >
                  {isFollowing ? 'Unfollow' : 'Follow'}
                </Button>
              )}
            </div>

            {mentor?.professionalBio && (
              <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground md:mx-0">
                {mentor?.professionalBio}
              </p>
            )}

            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 border-t border-border pt-4 md:justify-start">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Series</p>
                  <p className="font-medium text-foreground">{totalBooks} published</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
                  <Users className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Followers</p>
                  {followStatePending ? (
                    <HeroSkeleton className="mt-1 h-4 w-10 rounded" />
                  ) : (
                    <p className="font-medium text-foreground">{followerCount.toLocaleString()}</p>
                  )}
                </div>
              </div>

              {followStatePending && mentor?.email ? (
                <HeroContact icon={Mail} label="Email" value="" loading />
              ) : email ? (
                <HeroContact
                  href={email.includes('*') ? undefined : `mailto:${email}`}
                  icon={Mail}
                  label="Email"
                  value={email}
                />
              ) : null}

              {followStatePending && mentor?.phone ? (
                <HeroContact icon={Phone} label="Phone" value="" loading />
              ) : phone ? (
                <HeroContact
                  href={phone.includes('*') ? undefined : `tel:${phone}`}
                  icon={Phone}
                  label="Phone"
                  value={phone}
                />
              ) : null}
            </div>

            {(mentor?.linkedin || mentor?.facebook) && (
              <div className="mt-6 flex items-center justify-center gap-2 md:justify-start">
                {mentor?.linkedin && (
                  <a
                    href={mentor.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${mentor?.name} on LinkedIn`}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors hover:bg-primary hover:text-white"
                  >
                    <Linkedin className="h-4 w-4" />
                  </a>
                )}
                {mentor?.facebook && (
                  <a
                    href={mentor.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${mentor?.name} on Facebook`}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors hover:bg-primary hover:text-white"
                  >
                    <Facebook className="h-4 w-4" />
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
