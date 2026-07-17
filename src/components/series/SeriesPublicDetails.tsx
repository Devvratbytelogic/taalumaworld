'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import ImageComponent from '@/components/ui/ImageComponent';
import MentorDetails from '@/components/blueprint/MentorDetails';
import type { ISingleBookAPIResponseData } from '@/types/user/singleBook';
import type { IMentor } from '@/types/user/singleChapter';
import { getBlueprintRoutePath } from '@/routes/routes';

interface SeriesPublicDetailsProps {
  data: ISingleBookAPIResponseData | null;
}

export default function SeriesPublicDetails({ data }: SeriesPublicDetailsProps) {
  const bookDetails = data?.bookDetails ?? null;
  const chapters = data?.chapters?.data ?? [];

  const mentor: IMentor | null = bookDetails?.mentor
    ? {
        name: bookDetails.mentor.name,
        profilePicture: bookDetails.mentor.profile_pic,
        email: bookDetails.mentor.email,
        phone: '',
        bio: '',
        linkedin: bookDetails.mentor.linkedin,
        facebook: bookDetails.mentor.facebook,
      }
    : null;

  return (
    <section className="container">
      <div className="grid gap-14 lg:grid-cols-[minmax(220px,280px)_1fr] lg:gap-20">
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <p className="mb-6 text-xs font-medium uppercase tracking-[0.18em] text-[#6B6B6B]">
            Overview
          </p>
          <MentorDetails data={mentor} />
        </aside>

        <div className="min-w-0">
          <div className="mb-8 flex items-center gap-4">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#6B6B6B]">
              Blueprints
            </p>
            <div className="h-px flex-1 bg-[#E8E8E8]" />
          </div>

          <div className="overflow-hidden rounded-2xl border border-[#ECECEC] bg-white">
            {chapters && chapters?.length > 0 ? (
              <div className="divide-y divide-[#ECECEC]">
                {chapters?.map((chapter) => (
                  <Link
                    key={chapter?.slug ?? ''}
                    href={getBlueprintRoutePath(chapter?.slug ?? '')}
                    className="flex items-center gap-4 px-6 py-5 transition-colors hover:bg-[#FAFAFA] sm:px-8"
                  >
                    {chapter?.coverImage ? (
                      <div className="h-16 w-12 shrink-0 overflow-hidden rounded-lg border border-[#ECECEC] bg-muted">
                        <ImageComponent src={chapter?.coverImage ?? ''} alt={chapter?.title ?? ''} object_cover />
                      </div>
                    ) : (
                      <div className="flex h-16 w-12 shrink-0 items-center justify-center rounded-lg border border-[#ECECEC] bg-primary/10 text-sm font-bold text-primary">
                        {chapter?.chapterNumber}
                      </div>
                    )}

                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium uppercase tracking-[0.12em] text-primary">
                        Blueprint {chapter?.chapterNumber ?? 0}
                      </p>
                      <p className="mt-1 font-medium text-[#1A1A1A]">{chapter?.title}</p>
                      {chapter?.description && (
                        <p className="mt-1 line-clamp-2 text-sm text-[#6B6B6B]">{chapter?.description}</p>
                      )}
                    </div>

                    <ChevronRight className="h-4 w-4 shrink-0 text-[#6B6B6B]" />
                  </Link>
                ))}
              </div>
            ) : (
              <p className="px-6 py-8 text-sm text-[#6B6B6B] sm:px-8">No blueprints available yet.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
