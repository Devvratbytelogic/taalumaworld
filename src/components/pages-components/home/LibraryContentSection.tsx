'use client';
import React from 'react'
import CommonCard from '@/components/cards/CommonCard';
import FilterOptions from './FilterOptions';
import { useGetAllChaptersQuery } from '@/store/rtkQueries/userGetAPI';
import LibraryContentSectionSkeleton from '@/components/skeleton-loader/LibraryContentSectionSkeleton';

export default function LibraryContentSection() {
    const { data, isLoading } = useGetAllChaptersQuery();
    const chapters = data?.data?.items;

    if (isLoading) {
        return <LibraryContentSectionSkeleton />;
    }

    return (
        <>
            <section className="container mx-auto px-4">
                <div className="flex items-center justify-between mb-6">
                    <FilterOptions />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {
                        chapters && chapters.length > 0 && chapters.map((chapter) => (
                            <CommonCard key={chapter.id} data={chapter} />
                        ))
                    }
                </div>
            </section>
        </>
    )
}