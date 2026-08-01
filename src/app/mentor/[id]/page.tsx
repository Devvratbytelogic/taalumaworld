import type { Metadata } from 'next';
import { Suspense } from 'react';
import MentorProfileHero from '@/components/pages-components/mentor/MentorProfileHero';
import MentorBooksSection from '@/components/pages-components/mentor/MentorBooksSection';
import { getAllMentorsServerAPI, getMentorDetailsServerAPI } from '@/store/server-api/serverSideAPIs';

/** ISR: regenerate at most every 5 minutes */
export const revalidate = 300;
export const dynamicParams = true;

const PAGE_LIMIT = 8;

type PageProps = {
    params: Promise<{ id: string }>;
};

export async function generateStaticParams() {
    const response = await getAllMentorsServerAPI();
    const mentors = response?.data?.data ?? [];

    return mentors
        .map((mentor) => mentor?.short_code || mentor?.id)
        .filter((id): id is string => Boolean(id))
        .map((id) => ({ id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { id } = await params;
    const response = await getMentorDetailsServerAPI(id);
    const mentor = response?.data?.mentor_info;

    if (!mentor) {
        return {
            title: 'Mentor Not Found | TaalumaWorld',
            description: '',
        };
    }

    const title = `${mentor?.name} | TaalumaWorld`;
    const description = mentor?.professionalBio || '';

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            ...(mentor?.profile_pic ? { images: [{ url: mentor?.profile_pic }] } : {}),
        },
    };
}

export default async function MentorProfilePage({ params }: PageProps) {
    const { id } = await params;

    const response = await getMentorDetailsServerAPI(id, {
        page: 1,
        limit: PAGE_LIMIT,
    });

    const mentor = response?.data?.mentor_info ?? null;
    const books = response?.data?.books?.data ?? [];
    const total = response?.data?.books?.total ?? 0;
    const totalPages = response?.data?.books?.totalPages ?? 1;

    if (!mentor) {
        return (
            <div className="container py-24 text-center">
                <h1 className="font-ubuntu text-2xl font-bold text-foreground">Mentor not found</h1>
                <p className="mt-2 text-sm text-muted-foreground">
                    This mentor profile doesn&apos;t exist or is no longer available.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-5 space_top">
            <MentorProfileHero mentor={mentor} totalBooks={total} />

            <Suspense
                fallback={
                    <section className="container pb-10">
                        <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {Array.from({ length: PAGE_LIMIT }).map((_, index) => (
                                <div
                                    key={index}
                                    className="h-72 animate-pulse rounded-lg border border-border bg-muted/40"
                                />
                            ))}
                        </div>
                    </section>
                }
            >
                <MentorBooksSection
                    mentorId={id}
                    mentorName={mentor?.name ?? ''}
                    initialBooks={books}
                    initialTotalPages={totalPages}
                />
            </Suspense>
        </div>
    );
}
