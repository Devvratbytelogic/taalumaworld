import { ShieldCheck, Linkedin, Facebook, BookOpen } from 'lucide-react';
import ImageComponent from '@/components/ui/ImageComponent';
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
  return (
    <section className="border-b border-border pb-10">
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
            <div className="absolute -right-1 -bottom-1 flex h-8 w-8 items-center justify-center rounded-full border-2 border-card bg-secondary-accent">
              <ShieldCheck className="h-4 w-4 text-white" />
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center justify-center gap-2 md:justify-start">
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
                {mentor?.role_id?.name || 'Mentor'}
              </span>
            </div>

            <h1 className="mt-4 font-ubuntu text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-4xl">
              {mentor?.name}
            </h1>

            {mentor?.professionalBio && (
              <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground md:mx-0">
                {mentor?.professionalBio}
              </p>
            )}

            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 border-y border-border py-4 md:justify-start">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Series</p>
                  <p className="font-medium text-foreground">{totalBooks} published</p>
                </div>
              </div>
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
    </section>
  );
}
