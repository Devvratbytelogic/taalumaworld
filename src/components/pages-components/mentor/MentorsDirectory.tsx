'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Users2 } from 'lucide-react';
import MentorCard from '@/components/pages-components/mentor/MentorCard';
import { API_BASE_URL } from '@/utils/config';
import type { IUserAllAuthorsAPIResponse, IUserAllAuthorsDataEntity } from '@/types/user/allAuthors';

const PAGE_LIMIT = 12;

type MentorsDirectoryProps = {
    initialMentors: IUserAllAuthorsDataEntity[];
    initialTotalPages: number;
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

export default function MentorsDirectory({
    initialMentors,
    initialTotalPages,
}: MentorsDirectoryProps) {
    const searchParams = useSearchParams();
    const currentPage = Math.max(1, Number(searchParams.get('page')) || 1);

    const [mentors, setMentors] = useState(initialMentors);
    const [totalPages, setTotalPages] = useState(initialTotalPages);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (currentPage === 1) {
            setMentors(initialMentors);
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
                const res = await fetch(`${API_BASE_URL}/user/mentor-list?${query}`, {
                    headers: { Accept: 'application/json' },
                });
                if (!res.ok) return;
                const data = (await res.json()) as IUserAllAuthorsAPIResponse;
                if (cancelled) return;
                setMentors(data?.data?.data ?? []);
                setTotalPages(data?.data?.totalPages ?? 1);
            } finally {
                if (!cancelled) setIsLoading(false);
            }
        }

        void loadPage();
        return () => {
            cancelled = true;
        };
    }, [currentPage, initialMentors, initialTotalPages]);

    const hasResults = mentors.length > 0;
    const pageNumbers = getPageNumbers(currentPage, totalPages);

    return (
        <section className="container space-y-8">
            {isLoading ? (
                <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {Array.from({ length: PAGE_LIMIT }).map((_, index) => (
                        <div
                            key={index}
                            className="h-72 animate-pulse rounded-lg border border-border bg-muted/40"
                        />
                    ))}
                </div>
            ) : hasResults ? (
                <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {mentors.map((mentor, index) => (
                        <MentorCard key={mentor?.short_code || mentor?.id || index} mentor={mentor} index={index} />
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

            {hasResults && totalPages > 1 && (
                <nav className="flex items-center justify-center gap-1.5" aria-label="Mentor pagination">
                    <Link
                        href={buildHref(Math.max(1, currentPage - 1))}
                        aria-disabled={currentPage === 1}
                        className={`flex h-9 min-w-9 items-center justify-center rounded-full border border-border px-6 text-sm font-medium transition-colors ${
                            currentPage === 1
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
                        href={buildHref(Math.min(totalPages, currentPage + 1))}
                        aria-disabled={currentPage === totalPages}
                        className={`flex h-9 min-w-9 items-center justify-center rounded-full border border-border px-6 text-sm font-medium transition-colors ${
                            currentPage === totalPages
                                ? 'pointer-events-none text-muted-foreground/40'
                                : 'text-foreground hover:border-primary hover:text-primary'
                        }`}
                    >
                        Next
                    </Link>
                </nav>
            )}
        </section>
    );
}
