'use client'

import { ArrowRight, User } from 'lucide-react'
import ImageComponent from '../ui/ImageComponent'
import { FacebookIcon, LinkedinIcon } from '../ui/AllSVG'
import Button from '@/components/ui/Button'

interface MentorCardRevealSocial {
    linkedin?: string | null
    facebook?: string | null
}

interface MentorCardRevealProps {
    name?: string | null
    avatar?: string | null
    bio?: string | null
    social?: MentorCardRevealSocial | null
    ctaLabel?: string
    onCtaClick?: () => void
}

export default function MentorCardReveal({ name, avatar, bio, social, ctaLabel, onCtaClick }: MentorCardRevealProps) {
    const linkedin = social?.linkedin?.trim() ?? ''
    const facebook = social?.facebook?.trim() ?? ''
    const hasMentor = Boolean(name || avatar)

    return (
        <div className="absolute inset-0 z-1 flex flex-col items-center justify-center gap-2 p-4 text-center text-white bg-black/75 opacity-0 invisible pointer-events-none transition-all duration-200 group-hover/card:opacity-100 group-hover/card:visible">
            {hasMentor ? (
                <>
                    {avatar ? (
                        <div className="w-12 h-12 rounded-full overflow-hidden border border-white/50 shrink-0">
                            <ImageComponent src={avatar ?? ''} alt={name ?? ''} object_cover={true} />
                        </div>
                    ) : (
                        <div className="w-12 h-12 rounded-full bg-white/15 flex items-center justify-center shrink-0">
                            <User className="h-6 w-6" />
                        </div>
                    )}

                    {name ? <p className="font-semibold text-sm leading-tight">{name}</p> : null}

                    {bio && (
                        <p className="text-xs text-white/85 line-clamp-2 leading-relaxed max-w-[90%]">
                            {bio}
                        </p>
                    )}

                    {(linkedin || facebook) && (
                        <div className="flex items-center justify-center gap-2 mt-1 pointer-events-auto">
                            {linkedin && (
                                <a
                                    href={linkedin}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={`${name} on LinkedIn`}
                                    className="p-2 rounded-full bg-white/15 hover:bg-white/25 transition-colors"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <LinkedinIcon className="h-4 w-4" />
                                </a>
                            )}
                            {facebook && (
                                <a
                                    href={facebook}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={`${name} on Facebook`}
                                    className="p-2 rounded-full bg-white/15 hover:bg-white/25 transition-colors"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <FacebookIcon className="h-4 w-4" />
                                </a>
                            )}
                        </div>
                    )}
                </>
            ) : null}

            {ctaLabel && onCtaClick ? (
                <div className="pointer-events-auto mt-1" onClick={(e) => e.stopPropagation()}>
                    <Button
                        className="global_btn rounded_full bg_primary medium_height min-w-0 px-5 text-sm"
                        onPress={onCtaClick}
                    >
                        {ctaLabel}
                        <ArrowRight className="h-4 w-4" />
                    </Button>
                </div>
            ) : null}
        </div>
    )
}
