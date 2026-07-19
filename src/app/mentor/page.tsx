import type { Metadata } from 'next';
import Link from 'next/link';
import { ShieldCheck, ArrowRight, Globe2, Users2 } from 'lucide-react';
import Button from '@/components/ui/Button';
import MentorCard from '@/components/pages-components/mentor/MentorCard';
import { getAllMentorsServerAPI } from '@/store/server-api/serverSideAPIs';
import { getMentorSignupRoutePath } from '@/routes/routes';

export const metadata: Metadata = {
    title: 'Meet Our Mentors | TaalumaWorld',
    description:
        'Explore verified, real-world mentors from around the globe sharing their journeys through Blueprints on TaalumaWorld.',
};

const PAGE_LIMIT = 12;

type PageProps = {
    searchParams: Promise<{ page?: string }>;
};

function buildHref(page: number) {
    const params = new URLSearchParams();
    if (page > 1) params.set('page', String(page));
    const qs = params.toString();
    return `/mentor${qs ? `?${qs}` : ''}`;
}

function getPageNumbers(current: number, total: number): (number | 'ellipsis')[] {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

    const pages: (number | 'ellipsis')[] = [1];
    const start = Math.max(2, current - 1);
    const end = Math.min(total - 1, current + 1);

    if (start > 2) pages.push('ellipsis');
    for (let p = start; p <= end; p++) pages.push(p);
    if (end < total - 1) pages.push('ellipsis');

    pages.push(total);
    return pages;
}

export default async function AllMentorsPage({ searchParams }: PageProps) {
    const resolvedParams = await searchParams;
    const currentPage = Math.max(1, Number(resolvedParams?.page) || 1);

    const response = await getAllMentorsServerAPI({
        page: currentPage,
        limit: PAGE_LIMIT,
    });

    const mentors = response?.data?.data ?? [];
    const total = response?.data?.total ?? 0;
    const totalPages = response?.data?.totalPages ?? 1;
    const hasResults = mentors.length > 0;
    const pageNumbers = getPageNumbers(currentPage, totalPages);

    return (
        <>
            <div className='space-y-8'>
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
                                <span className="gradient_text">
                                    Blueprints
                                </span>
                            </h1>

                            <p className="mx-auto mt-5 max-w-xl text-base text-muted-foreground md:text-lg">
                                Verified professionals who have walked the path — now distilling their
                                experience into guidance you can actually use.
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
                <section className="container space-y-8">
                    {hasResults ? (
                        <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {mentors && mentors?.length > 0 && mentors?.map((mentor, index) => (
                                <MentorCard
                                    key={index}
                                    mentor={mentor}
                                    index={index}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="mx-auto flex max-w-md flex-col items-center py-16 text-center">
                            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-accent">
                                <Users2 className="h-7 w-7 text-primary" />
                            </div>
                            <h3 className="text-lg font-semibold text-foreground">No mentors found</h3>
                            <p className="mt-2 text-sm text-muted-foreground">
                                Mentors will appear here as soon as they join the platform.
                            </p>
                        </div>
                    )}

                    {/* Pagination */}
                    {hasResults && totalPages > 1 && (
                        <nav className="flex items-center justify-center gap-1.5" aria-label="Mentor pagination">
                            <Link
                                href={buildHref(Math.max(1, currentPage - 1))}
                                aria-disabled={currentPage === 1}
                                className={`flex h-9 min-w-9 items-center justify-center rounded-full border border-border px-6 text-sm font-medium transition-colors ${currentPage === 1
                                    ? 'pointer-events-none text-muted-foreground/40'
                                    : 'text-foreground hover:border-primary hover:text-primary'
                                    }`}
                            >
                                Prev
                            </Link>

                            {pageNumbers.map((p, i) =>
                                p === 'ellipsis' ? (
                                    <span key={`ellipsis-${i}`} className="px-1.5 text-sm text-muted-foreground/60">
                                        …
                                    </span>
                                ) : (
                                    <Link
                                        key={p}
                                        href={buildHref(p)}
                                        className={`flex h-9 min-w-9 items-center justify-center rounded-full px-3 text-sm font-medium transition-colors ${p === currentPage
                                            ? 'bg-primary text-white shadow-md shadow-primary/25'
                                            : 'border border-border text-foreground hover:border-primary hover:text-primary'
                                            }`}
                                    >
                                        {p}
                                    </Link>
                                )
                            )}

                            <Link
                                href={buildHref(Math.min(totalPages, currentPage + 1))}
                                aria-disabled={currentPage === totalPages}
                                className={`flex h-9 min-w-9 items-center justify-center rounded-full border border-border px-6 text-sm font-medium transition-colors ${currentPage === totalPages
                                    ? 'pointer-events-none text-muted-foreground/40'
                                    : 'text-foreground hover:border-primary hover:text-primary'
                                    }`}
                            >
                                Next
                            </Link>
                        </nav>
                    )}
                </section>

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
                                        Join a growing community of mentors turning their experience into Blueprints
                                        that change careers.
                                    </p>
                                </div>

                                <Button
                                    // as={Link}
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
