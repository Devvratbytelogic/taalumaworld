import type { Metadata } from 'next';
import Link from 'next/link';
import { BookOpen } from 'lucide-react';
import MentorProfileHero from '@/components/pages-components/mentor/MentorProfileHero';
import MentorBookCard from '@/components/pages-components/mentor/MentorBookCard';
import { getMentorDetailsServerAPI } from '@/store/server-api/serverSideAPIs';

const PAGE_LIMIT = 8;

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ page?: string }>;
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

export default async function MentorProfilePage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const resolvedSearchParams = await searchParams;
  const currentPage = Math.max(1, Number(resolvedSearchParams?.page) || 1);

  const response = await getMentorDetailsServerAPI(id, {
    page: currentPage,
    limit: PAGE_LIMIT,
  });

  const mentor = response?.data?.mentor_info ?? null;
  const books = response?.data?.books?.data ?? [];
  const total = response?.data?.books?.total ?? 0;
  const totalPages = response?.data?.books?.totalPages ?? 1;
  const hasBooks = books.length > 0;
  const pageNumbers = getPageNumbers(currentPage, totalPages);

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
    <div className="space-y-10 space_top">
      <MentorProfileHero mentor={mentor} totalBooks={total} />

      <section className="container space-y-8 pb-10">
        <div className="flex items-center gap-4">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
            Series by {mentor?.name}
          </p>
          <div className="h-px flex-1 bg-border" />
        </div>

        {hasBooks ? (
          <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {books?.map((book, index) => (
              <MentorBookCard key={book?.id ?? book?._id} book={book} index={index} />
            ))}
          </div>
        ) : (
          <div className="mx-auto flex max-w-md flex-col items-center py-16 text-center">
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-accent">
              <BookOpen className="h-7 w-7 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">No series published yet</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Series from this mentor will appear here once published.
            </p>
          </div>
        )}

        {hasBooks && totalPages > 1 && (
          <nav className="flex items-center justify-center gap-1.5" aria-label="Mentor series pagination">
            <Link
              href={buildHref(id, Math.max(1, currentPage - 1))}
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
                  href={buildHref(id, p)}
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
              href={buildHref(id, Math.min(totalPages, currentPage + 1))}
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
    </div>
  );
}
