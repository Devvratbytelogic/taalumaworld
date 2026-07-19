import Link from 'next/link';
import { ShieldCheck, Linkedin, Facebook, ArrowUpRight } from 'lucide-react';
import ImageComponent from '@/components/ui/ImageComponent';
import { getSingleAuthorRoutePath } from '@/routes/routes';
import type { IUserAllAuthorsDataEntity } from '@/types/user/allAuthors';

const AVATAR_GRADIENTS = [
    'from-[#0A66C2] to-[#22346B]',
    'from-[#8B5CF6] to-[#4C1D95]',
    'from-[#10B981] to-[#065F46]',
    'from-[#F59E0B] to-[#92400E]',
    'from-[#EC4899] to-[#831843]',
];

function getInitials(name?: string) {
    if (!name) return 'M';
    const words = name.trim().split(/\s+/);
    if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
    return (words[0][0] + words[words.length - 1][0]).toUpperCase();
}

interface MentorCardProps {
    mentor: IUserAllAuthorsDataEntity;
    index: number;
}

export default function MentorCard({ mentor, index }: MentorCardProps) {
    const mentorId = mentor?.id || mentor?._id;
    const gradient = AVATAR_GRADIENTS[index % AVATAR_GRADIENTS.length];

    return (
        <div
            className="group relative flex flex-col overflow-hidden rounded-lg border border-border bg-card animate-fade-in transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/10"
            style={{ animationDelay: `${index * 40}ms` }}
        >
            {/* Banner strip */}
            <div className={`h-24 w-full bg-linear-to-br ${gradient} opacity-90`} />

            <div className="flex flex-1 flex-col items-center px-6 pb-6 text-center">
                {/* Avatar overlapping banner */}
                <div className="relative -mt-10 mb-3">
                    <div className="h-20 w-20 overflow-hidden rounded-full border-4 border-card bg-muted shadow-md">
                        {mentor?.profile_pic ? (
                            <ImageComponent src={mentor?.profile_pic} alt={mentor?.name} object_cover />
                        ) : (
                            <div
                                className={`flex h-full w-full items-center justify-center bg-linear-to-br ${gradient} text-lg font-bold text-white`}
                            >
                                {getInitials(mentor?.name)}
                            </div>
                        )}
                    </div>
                    {mentor?.is_verified_mentor && (
                        <div className="absolute -right-1 -bottom-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-card bg-secondary-accent">
                            <ShieldCheck className="h-3.5 w-3.5 text-white" />
                        </div>
                    )}
                </div>

                <h3 className="line-clamp-1 text-base font-semibold text-foreground">{mentor?.name}</h3>
                <span className="mt-1 text-xs font-medium tracking-wide text-primary uppercase">
                    {mentor?.is_verified_mentor ? 'Verified Mentor' : 'Mentor'}
                </span>

                <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                    {mentor?.professionalBio || 'Sharing real-world experience through Blueprints on TaalumaWorld.'}
                </p>

                <div className="mt-5 flex w-full items-center justify-between border-t border-border-subtle pt-4">
                    <div className="flex items-center gap-2">
                        {mentor?.linkedin && (
                            <a
                                href={mentor.linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={`${mentor?.name} on LinkedIn`}
                                className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors hover:bg-primary hover:text-white"
                            >
                                <Linkedin className="h-3.5 w-3.5" />
                            </a>
                        )}
                        {mentor?.facebook && (
                            <a
                                href={mentor.facebook}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={`${mentor?.name} on Facebook`}
                                className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors hover:bg-primary hover:text-white"
                            >
                                <Facebook className="h-3.5 w-3.5" />
                            </a>
                        )}
                    </div>

                    {mentorId ? (
                        <Link
                            href={getSingleAuthorRoutePath(mentorId)}
                            className="inline-flex items-center gap-1 text-sm font-medium text-primary transition-colors group-hover:gap-1.5 hover:text-primary-dark"
                        >
                            View profile
                            <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </Link>
                    ) : (
                        <span className="text-sm text-muted-foreground/60">Profile soon</span>
                    )}
                </div>
            </div>
        </div>
    );
}
