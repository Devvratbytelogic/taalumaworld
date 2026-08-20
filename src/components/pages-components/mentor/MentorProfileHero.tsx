'use client';

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { ShieldCheck, Linkedin, Facebook, BookOpen, Phone, Mail, Users, UserPlus, UserCheck } from 'lucide-react';
import { toast } from 'sonner';
import ImageComponent from '@/components/ui/ImageComponent';
import Button from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import { useFollowMentorMutation } from '@/store/rtkQueries/userPostAPI';
import { openModal } from '@/store/slices/allModalSlice';
import type { IMentorInfo } from '@/types/user/mentorDetails';

function getInitials(name?: string) {
  if (!name) return 'M';
  const words = name.trim().split(/\s+/);
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
}

interface MentorProfileHeroProps {
  mentor: IMentorInfo | null;
  totalBooks: number;
}

export default function MentorProfileHero({ mentor, totalBooks }: MentorProfileHeroProps) {
  const dispatch = useDispatch();
  const { isAuthenticated } = useAuth();
  const [isFollowing, setIsFollowing] = useState(Boolean(mentor?.isFollowed));
  const [followerCount, setFollowerCount] = useState(mentor?.followerCount ?? 0);
  const [followMentor, { isLoading: isFollowingLoading }] = useFollowMentorMutation();

  const mentorId = mentor?._id || mentor?.id || '';

  const openLogin = () => {
    dispatch(openModal({ componentName: 'LoginRequiredModal', data: { action: 'follow', itemType: 'mentor', onSuccess: handleFollow } }));
  };

  const handleFollow = async () => {
    if (!mentorId || isFollowing) return;
    try {
      const res = await followMentor(mentorId).unwrap();
      setIsFollowing(true);
      setFollowerCount((count) => count + 1);
      toast.success(res?.message ?? `You are now following ${mentor?.name ?? 'this mentor'}`);
    } catch (error) {
      console.error('error following mentor', error);
    }
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

              <Button
                onPress={isAuthenticated ? handleFollow : openLogin}
                isLoading={isFollowingLoading}
                isDisabled={isFollowing}
                className={`global_btn rounded_full w_fit shrink-0 ${isFollowing ? 'outline_primary' : 'bg_primary'}`}
                startContent={
                  isFollowingLoading ? undefined : isFollowing ? (
                    <UserCheck className="h-4 w-4" />
                  ) : (
                    <UserPlus className="h-4 w-4" />
                  )
                }
              >
                {isFollowing ? 'Following' : 'Follow'}
              </Button>
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
                  <p className="font-medium text-foreground">{followerCount.toLocaleString()}</p>
                </div>
              </div>

              {mentor?.email && (
                <a href={`mailto:${mentor.email}`} className="flex items-center gap-2.5 transition-colors hover:opacity-80">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="font-medium text-foreground">{mentor.email}</p>
                  </div>
                </a>
              )}

              {mentor?.phone && (
                <a href={`tel:${mentor.phone}`} className="flex items-center gap-2.5 transition-colors hover:opacity-80">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs text-muted-foreground">Phone</p>
                    <p className="font-medium text-foreground">{mentor.phone}</p>
                  </div>
                </a>
              )}
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
