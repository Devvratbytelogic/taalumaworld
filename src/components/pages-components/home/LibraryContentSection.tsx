'use client';
import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import CommonCard from '@/components/cards/CommonCard';
import FilterOptions from './FilterOptions';
import { useGetAllChaptersQuery } from '@/store/rtkQueries/userGetAPI';
import LibraryContentSectionSkeleton from '@/components/skeleton-loader/LibraryContentSectionSkeleton';
import NoDataFound from '@/components/ui/NoDataFound';
import Button from '@/components/ui/Button';

const PAGE_LIMIT = 8;

export default function LibraryContentSection() {
    const searchParams = useSearchParams();
    const [page, setPage] = useState(1);
    const sectionRef = useRef<HTMLElement>(null);
    const isFirstPageRender = useRef(true);

    const categoryId = searchParams.get('categoryId') ?? undefined;
    const thoughtLeaderId = searchParams.get('thoughtLeaderId') ?? undefined;
    const tags = searchParams.get('tags') ?? undefined;
    const readingProgress = searchParams.get('readingProgress') ?? undefined;

    useEffect(() => {
        setPage(1);
    }, [categoryId, thoughtLeaderId, tags, readingProgress]);

    const { data, isLoading, isFetching } = useGetAllChaptersQuery({
        categoryId,
        thoughtLeaderId,
        tags,
        readingProgress,
        page,
        limit: PAGE_LIMIT,
    });
    const chapters = data?.data?.items;
    const total = data?.data?.total ?? 0;
    const totalPages = data?.data?.totalPages ?? 0;
    const currentPage = data?.data?.page ?? page;
    const viewMode = data?.data?.viewMode;

    useEffect(() => {
        if (isFirstPageRender.current) {
            isFirstPageRender.current = false;
            return;
        }
        sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, [page]);

    if (isLoading) {
        return <LibraryContentSectionSkeleton />;
    }

    return (
        <>
            <section ref={sectionRef} className="container scroll-mt-24">
                <div className="flex items-center justify-between mb-6">
                    <FilterOptions total={total} viewMode={viewMode} />
                </div>

                <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 ${isFetching ? 'opacity-60' : ''}`}>
                    {chapters && chapters?.length > 0
                        ? chapters?.map((chapter, index) => (
                            <CommonCard key={chapter.id ?? index} data={chapter} />
                        ))
                        : <NoDataFound
                            title="No content found"
                            description="Try adjusting your filters or check back later."
                        />
                    }
                </div>

                {totalPages > 1 ? (
                    <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-sm text-muted-foreground">
                            Page <span className="font-medium text-foreground">{currentPage}</span> of{' '}
                            <span className="font-medium text-foreground">{totalPages}</span>
                        </p>
                        <div className="flex items-center gap-2">
                            <Button
                                type="button"
                                className="global_btn rounded_full outline_primary"
                                isDisabled={currentPage <= 1 || isFetching}
                                onPress={() => setPage((prev) => Math.max(1, prev - 1))}
                            >
                                <ChevronLeft className="h-4 w-4" />
                                Previous
                            </Button>
                            <Button
                                type="button"
                                className="global_btn rounded_full outline_primary"
                                isDisabled={currentPage >= totalPages || isFetching}
                                onPress={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                            >
                                Next
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                ) : null}
            </section>
        </>
    )
}
