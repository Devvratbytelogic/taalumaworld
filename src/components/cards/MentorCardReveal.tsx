'use client'

import React from 'react'
import { User } from 'lucide-react'
import ImageComponent from '../ui/ImageComponent'
import { FacebookIcon, LinkedinIcon } from '../ui/AllSVG'
import type { IAuthorSocialLinks } from '@/types/user/HomeAllChapters'

interface MentorCardRevealProps {
    name: string
    avatar?: string | null
    bio?: string | null
    social?: IAuthorSocialLinks | null
}

export default function MentorCardReveal({ name, avatar, bio, social }: MentorCardRevealProps) {
    const linkedin = social?.linkedin?.trim()
    const facebook = social?.facebook?.trim()

    return (
        <div
            className="absolute inset-0 z-1 flex flex-col items-center justify-center gap-2 p-4 text-center text-white bg-black/75 opacity-0 invisible transition-all duration-200 group-hover/card:opacity-100 group-hover/card:visible"
            onClick={(e) => e.stopPropagation()}
        >
            {avatar ? (
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/80 shrink-0">
                    <ImageComponent src={avatar} alt={name} object_cover={true} />
                </div>
            ) : (
                <div className="w-12 h-12 rounded-full bg-white/15 flex items-center justify-center shrink-0">
                    <User className="h-6 w-6" />
                </div>
            )}

            <p className="font-semibold text-sm leading-tight">{name}</p>

            {bio && (
                <p className="text-xs text-white/85 line-clamp-3 leading-relaxed max-w-[90%]">
                    {bio}
                </p>
            )}

            {(linkedin || facebook) && (
                <div className="flex items-center justify-center gap-2 mt-1">
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
        </div>
    )
}
