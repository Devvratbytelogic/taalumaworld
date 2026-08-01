import type { Metadata } from 'next';
import { Suspense } from 'react';
import { ShieldCheck, ArrowRight, Globe2, Users2 } from 'lucide-react';
import Button from '@/components/ui/Button';
import MentorsDirectory from '@/components/pages-components/mentor/MentorsDirectory';
import { getAllMentorsServerAPI } from '@/store/server-api/serverSideAPIs';
import { getMentorSignupRoutePath } from '@/routes/routes';

export const revalidate = 300;

export const metadata: Metadata = {
    title: 'Meet Our Mentors | TaalumaWorld',
    description:
        'Explore verified, real-world mentors from around the globe sharing their journeys through Blueprints on TaalumaWorld.',
};

const PAGE_LIMIT = 12;

export default async function AllMentorsPage() {
    const response = await getAllMentorsServerAPI({
        page: 1,
        limit: PAGE_LIMIT,
    });

    const mentors = response?.data?.data ?? [];
    const total = response?.data?.total ?? 0;
    const totalPages = response?.data?.totalPages ?? 1;

    return (
        <>
            <div className="space-y-8">
                {/* ───────────────────────── Hero ───────────────────────── */}
                <section className="relative py-10">
                    <div className="container">
                        <div className="mx-auto max-w-3xl text-center">
                            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5">
                                <span className="text-xs font-medium tracking-wide text-primary uppercase">
                                    A global roster of real mentors
                                </span>
                            </div>

                            <h1 className="mt-6 font-ubuntu text-4xl leading-tight font-bold text-foreground md:text-5xl lg:text-6xl">
                                Meet the minds behind the{' '}
                                <span className="gradient_text">Blueprints</span>
                            </h1>

                            <p className="mx-auto mt-5 max-w-xl text-base text-muted-foreground md:text-lg">
                                Verified professionals who have walked the path — now distilling their experience into
                                guidance you can actually use.
                            </p>

                            {/* Stat chips */}
                            <div className="mx-auto mt-10 flex flex-wrap items-center justify-center gap-3">
                                <div className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground">
                                    <Users2 className="h-4 w-4 text-primary" />
                                    <span className="font-semibold text-foreground">{total}+</span> mentors
                                </div>
                                <div className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground">
                                    <ShieldCheck className="h-4 w-4 text-secondary-accent" />
                                    Identity verified
                                </div>
                                <div className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground">
                                    <Globe2 className="h-4 w-4 text-primary" />
                                    Worldwide experience
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ───────────────────────── Grid ───────────────────────── */}
                <Suspense
                    fallback={
                        <section className="container">
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
                    <MentorsDirectory initialMentors={mentors} initialTotalPages={totalPages} />
                </Suspense>

                {/* ───────────────────────── CTA ───────────────────────── */}
                <section className="pb-10">
                    <div className="container">
                        <div className="relative overflow-hidden rounded-xl bg-[#0A0F1F] px-8 py-12 md:px-16 md:py-16">
                            <div className="pointer-events-none absolute inset-0">
                                <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-secondary-accent/25 blur-[100px]" />
                                <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-primary/25 blur-[100px]" />
                            </div>

                            <div className="relative z-10 flex flex-col items-center gap-6 text-center md:flex-row md:justify-between md:text-left">
                                <div>
                                    <h2 className="font-ubuntu text-2xl font-bold text-white md:text-3xl">
                                        Have expertise worth sharing?
                                    </h2>
                                    <p className="mt-2 max-w-md text-sm text-white/60 md:text-base">
                                        Join a growing community of mentors turning their experience into Blueprints that
                                        change careers.
                                    </p>
                                </div>

                                <Button
                                    href={getMentorSignupRoutePath()}
                                    className="global_btn rounded_full bg_primary w_fit shrink-0 shadow-lg shadow-primary/30"
                                >
                                    Become a mentor
                                    <ArrowRight className="ml-1.5 h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
}
