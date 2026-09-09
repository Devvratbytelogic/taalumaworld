'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, BookOpen, Play } from 'lucide-react';
import Button from '@/components/ui/Button';
import ImageComponent from '@/components/ui/ImageComponent';
import { useGetPurchasedSeriesQuery } from '@/store/rtkQueries/userGetAPI';
import {
  getPurchasedBlueprintRoutePath,
  getUserDashboardMyBooksRoutePath,
} from '@/routes/routes';
import { UserDashboardPageHeader } from './UserDashboardPageHeader';
import { DashboardPurchasedSeriesSkeleton } from '@/components/skeleton-loader/userDashboardSkeletons';

export function MyPurchasedSeriesPage({ slug }: { slug: string }) {
  const router = useRouter();
  const { data: response, isLoading, isError } = useGetPurchasedSeriesQuery(slug, { skip: !slug });
  const book = response?.data?.bookDetails;
  const chapters = response?.data?.chapters?.data ?? [];

  if (isLoading) {
    return <DashboardPurchasedSeriesSkeleton />;
  }

  if (isError || !book) {
    return (
      <div className="space-y-6">
        <Link
          href={getUserDashboardMyBooksRoutePath()}
          className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-gray-500 transition-colors hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to My Series
        </Link>
        <div className="rounded-lg border border-gray-200 bg-white px-6 py-12 text-center text-sm text-gray-500">
          Series not found in your library.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <UserDashboardPageHeader
        title={book.title}
        description={book.description || undefined}
      >
        <Button
          type="button"
          className="global_btn rounded_full outline_primary"
          onPress={() => router.push(getUserDashboardMyBooksRoutePath())}
          startContent={<ArrowLeft className="h-4 w-4" />}
        >
          Back to My Series
        </Button>
      </UserDashboardPageHeader>

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
        {chapters.length > 0 ? (
          <div className="flex flex-col gap-4 p-4 sm:p-6">
            {chapters.map((chapter) => {
              const progress = chapter.percentage ?? 0;
              const isCompleted = chapter.completed;
              const readLabel = isCompleted ? 'Read again' : progress > 0 ? 'Continue reading' : 'Start reading';
              const ReadIcon = progress > 0 || isCompleted ? BookOpen : Play;

              return (
                <article
                  key={chapter.slug ?? chapter.id}
                  className="flex flex-col overflow-hidden rounded-lg border border-gray-200 sm:flex-row"
                >
                  <div className="aspect-16/10 w-full shrink-0 overflow-hidden bg-gray-100 sm:aspect-auto sm:w-40 sm:min-h-42 md:w-44">
                    <ImageComponent src={chapter.coverImage || ''} alt={chapter.title} object_cover />
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col sm:flex-row">
                    <div className="min-w-0 flex-1 p-4 sm:p-5">
                      <h3 className="text-base font-medium text-gray-900">{chapter.title}</h3>
                      {chapter.description ? (
                        <p className="mt-1.5 line-clamp-2 text-sm text-gray-500">{chapter.description}</p>
                      ) : null}
                    </div>
                    <div className="flex shrink-0 items-center border-t border-gray-100 p-4 sm:w-44 sm:border-l sm:border-t-0 sm:p-5 md:w-48">
                      <Button
                        type="button"
                        className="global_btn rounded_full bg_primary w-full"
                        onPress={() =>
                          router.push(getPurchasedBlueprintRoutePath(chapter.slug || chapter.id))
                        }
                      >
                        <ReadIcon className="h-4 w-4" />
                        {readLabel}
                      </Button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <p className="px-6 py-12 text-center text-sm text-gray-500">No blueprints available yet.</p>
        )}
      </div>
    </div>
  );
}
