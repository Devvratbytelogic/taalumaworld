'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { BookOpen, ChevronLeft, ChevronRight } from 'lucide-react';
import MentorBookCard, { MentorBlueprintCard } from '@/components/pages-components/mentor/MentorBookCard';
import { API_BASE_URL } from '@/utils/config';
import type { IMentorBlueprintsAPIResponse, IMentorBookEntity, IUserMentorDetailsAPIResponse } from '@/types/user/mentorDetails';
import type { IHomeAllChaptersItemsEntity } from '@/types/user/HomeAllChapters';

const PAGE_LIMIT = 8;

type MentorBooksSectionProps = {
    mentorId: string;
    routeId: string;
    mentorName: string;
    initialTotalPages: number;
    showSeries: boolean;
    initialBooks: IMentorBookEntity[];
    initialBlueprints: IHomeAllChaptersItemsEntity[];
};

function buildHref(id: string, page: number) {
    const params = new URLSearchParams();
    if (page > 1) params.set('page', String(page));
    const qs = params.toString();
    return `/mentor/${id}${qs ? `?${qs}` : ''}`;
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

export default function MentorBooksSection({
    mentorId,
    routeId,
    mentorName,
    initialTotalPages,
    showSeries,
    initialBooks,
    initialBlueprints,
}: MentorBooksSectionProps) {
    const searchParams = useSearchParams();
    const currentPage = Math.max(1, Number(searchParams.get('page')) || 1);

    const [books, setBooks] = useState(initialBooks);
    const [blueprints, setBlueprints] = useState(initialBlueprints);
    const [totalPages, setTotalPages] = useState(initialTotalPages);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (currentPage === 1) {
            setBooks(initialBooks);
            setBlueprints(initialBlueprints);
            setTotalPages(initialTotalPages);
            return;
        }

        let cancelled = false;

        async function loadPage() {
            setIsLoading(true);
            try {
                const query = new URLSearchParams({
                    page: String(currentPage),
                    limit: String(PAGE_LIMIT),
                });
                const path = showSeries
                    ? `/user/mentors/${encodeURIComponent(mentorId)}`
                    : `/user/mentors/${encodeURIComponent(mentorId)}/blueprints`;
                const res = await fetch(
                    `${API_BASE_URL}${path}?${query}`,
                    { headers: { Accept: 'application/json' } },
                );
                if (!res.ok) return;
                if (cancelled) return;
                if (showSeries) {
                    const data = (await res.json()) as IUserMentorDetailsAPIResponse;
                    setBooks(data?.data?.books?.data ?? []);
                    setTotalPages(data?.data?.books?.totalPages ?? 1);
                } else {
                    const data = (await res.json()) as IMentorBlueprintsAPIResponse;
                    setBlueprints(data?.data?.items ?? []);
                    setTotalPages(data?.data?.totalPages ?? 1);
                }
            } finally {
                if (!cancelled) setIsLoading(false);
            }
        }

        void loadPage();
        return () => {
            cancelled = true;
        };
    }, [currentPage, initialBlueprints, initialBooks, initialTotalPages, mentorId, showSeries]);

    const hasItems = showSeries ? books.length > 0 : blueprints.length > 0;
    const pageNumbers = getPageNumbers(currentPage, totalPages);
    const catalogLabel = showSeries ? 'Series' : 'Books';

    return (
        <section className="container space-y-8 pb-10">
            <div className="flex items-center gap-4">
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                    {catalogLabel} by {mentorName}
                </p>
                <div className="h-px flex-1 bg-border" />
            </div>

            {isLoading ? (
                <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {Array.from({ length: PAGE_LIMIT }).map((_, index) => (
                        <div
                            key={index}
                            className="h-72 animate-pulse rounded-lg border border-border bg-muted/40"
                        />
                    ))}
                </div>
            ) : hasItems ? (
                <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {showSeries
                        ? books.map((book, index) => (
                            <MentorBookCard key={book?.id ?? book?._id} book={book} index={index} />
                        ))
                        : blueprints.map((item, index) => (
                            <MentorBlueprintCard key={item?.id} item={item} index={index} />
                        ))}
                </div>
            ) : (
                <div className="mx-auto flex max-w-md flex-col items-center py-16 text-center">
                    <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-accent">
                        <BookOpen className="h-7 w-7 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">No {catalogLabel.toLowerCase()} published yet</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                        {catalogLabel} from this mentor will appear here once published.
                    </p>
                </div>
            )}

            {hasItems && totalPages > 1 && (
                <nav className="flex items-center justify-center gap-1.5" aria-label={`Mentor ${catalogLabel.toLowerCase()} pagination`}>
                    <Link
                        href={buildHref(routeId, Math.max(1, currentPage - 1))}
                        aria-disabled={currentPage === 1}
                        className={`flex h-9 min-w-9 items-center justify-center gap-1.5 rounded-full border border-border px-5 text-sm font-medium transition-colors ${
                            currentPage === 1
                                ? 'pointer-events-none text-muted-foreground/40'
                                : 'text-foreground hover:border-primary hover:text-primary'
                        }`}
                    >
                        <ChevronLeft className="h-4 w-4" />
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
                                href={buildHref(routeId, p)}
                                className={`flex h-9 min-w-9 items-center justify-center rounded-full px-3 text-sm font-medium transition-colors ${
                                    p === currentPage
                                        ? 'bg-primary text-white shadow-md shadow-primary/25'
                                        : 'border border-border text-foreground hover:border-primary hover:text-primary'
                                }`}
                            >
                                {p}
                            </Link>
                        ),
                    )}

                    <Link
                        href={buildHref(routeId, Math.min(totalPages, currentPage + 1))}
                        aria-disabled={currentPage === totalPages}
                        className={`flex h-9 min-w-9 items-center justify-center gap-1.5 rounded-full border border-border px-5 text-sm font-medium transition-colors ${
                            currentPage === totalPages
                                ? 'pointer-events-none text-muted-foreground/40'
                                : 'text-foreground hover:border-primary hover:text-primary'
                        }`}
                    >
                        Next
                        <ChevronRight className="h-4 w-4" />
                    </Link>
                </nav>
            )}
        </section>
    );
}
