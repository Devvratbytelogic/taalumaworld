'use client';

import ImageComponent from '@/components/ui/ImageComponent';
import NameInitials from '@/components/ui/NameInitials';
import type { IMentor } from '@/types/user/singleChapter';
import { Facebook, Globe, Linkedin, Mail, Phone } from 'lucide-react';

interface MentorDetailsProps {
    data: IMentor | null;
}


function SocialLink({ href, label, icon: Icon, }: {
    href: string;
    label: string;
    icon: typeof Globe;
}) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#E8E8E8] bg-white text-[#6B6B6B] transition-colors hover:border-primary/30 hover:bg-primary/5 hover:text-primary"
        >
            <Icon className="h-4 w-4" />
        </a>
    );
}

export default function MentorDetails({ data }: MentorDetailsProps) {
    // if (!data) {
    //     return (
    //         <div className="rounded-2xl border border-[#ECECEC] bg-[#FAFAFA] px-5 py-8 text-center">
    //             <p className="text-sm text-[#6B6B6B]">Mentor information is not available.</p>
    //         </div>
    //     );
    // }

    const hasContact = Boolean(data?.email || data?.phone);
    const hasSocial = Boolean(data?.linkedin || data?.facebook);

    return (
        <div className="overflow-hidden rounded-2xl border border-[#ECECEC] bg-white shadow-[0_12px_32px_-24px_rgba(0,0,0,0.18)]">
            <div className="border-b border-[#ECECEC] bg-[#FAFAFA] px-5 py-6 text-center">
                <div className="mx-auto mb-4 h-24 w-24 overflow-hidden rounded-full border-2 border-white bg-white shadow-[0_8px_24px_-12px_rgba(0,0,0,0.2)]">
                    {data?.profilePicture ? (
                        <ImageComponent
                            src={data?.profilePicture}
                            alt={data?.name}
                            object_cover
                        />
                    ) : (
                        <NameInitials
                            name={data?.name ?? 'Mentor'}
                            className="flex h-full w-full items-center justify-center bg-primary/10 text-xl font-semibold uppercase text-primary"
                        />
                    )}
                </div>

                <p className="text-xs font-medium uppercase tracking-[0.18em] text-primary">
                    Mentor
                </p>
                <h3 className="mt-2 font-ubuntu text-lg font-bold leading-tight text-[#1A1A1A]">
                    {data?.name ?? '-'}
                </h3>
            </div>

            <div className="space-y-5 px-5 py-6">
                {data?.bio ? (
                    <p className="text-sm leading-7 text-[#4A4A4A]">{data?.bio}</p>
                ) : (
                    <p className="text-sm leading-7 text-[#6B6B6B]">
                        This mentor guides learners through practical, real-world Blueprint content.
                    </p>
                )}

                {hasContact && (
                    <div className="space-y-3 border-t border-[#ECECEC] pt-5">
                        <p className="text-xs font-medium uppercase tracking-[0.16em] text-[#6B6B6B]">
                            Contact
                        </p>

                        {data?.email && (
                            <a
                                href={`mailto:${data.email}`}
                                className="flex items-center gap-3 rounded-xl border border-[#ECECEC] px-3 py-2.5 text-sm text-[#1A1A1A] transition-colors hover:border-primary/30 hover:bg-primary/5"
                            >
                                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                                    <Mail className="h-4 w-4" />
                                </span>
                                <span className="min-w-0 truncate">{data.email}</span>
                            </a>
                        )}

                        {data?.phone && (
                            <a
                                href={`tel:${data?.phone}`}
                                className="flex items-center gap-3 rounded-xl border border-[#ECECEC] px-3 py-2.5 text-sm text-[#1A1A1A] transition-colors hover:border-primary/30 hover:bg-primary/5"
                            >
                                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                                    <Phone className="h-4 w-4" />
                                </span>
                                <span className="min-w-0 truncate">{data.phone}</span>
                            </a>
                        )}
                    </div>
                )}

                {hasSocial && (
                    <div className="border-t border-[#ECECEC] pt-5">
                        <p className="mb-3 text-xs font-medium uppercase tracking-[0.16em] text-[#6B6B6B]">
                            Connect
                        </p>
                        <div className="flex flex-wrap gap-2">
                            <SocialLink href={data?.linkedin ?? ''} label="LinkedIn" icon={Linkedin} />
                            <SocialLink href={data?.facebook ?? ''} label="Facebook" icon={Facebook} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
