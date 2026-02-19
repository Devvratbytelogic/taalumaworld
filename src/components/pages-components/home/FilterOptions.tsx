'use client'
import React from 'react'
import { useDispatch } from 'react-redux';
import { useSearchParams } from 'next/navigation';
import Button from '@/components/ui/Button';
import { Badge } from '@/components/ui/badge';
import { SlidersHorizontal } from 'lucide-react';
import { openModal } from '@/store/slices/allModalSlice';

function parseArrayParam(value: string | null): string[] {
    if (!value) return [];
    return value.split(',').filter(Boolean);
}

export default function FilterOptions() {
    const dispatch = useDispatch();
    const searchParams = useSearchParams();

    const categories = parseArrayParam(searchParams.get('categories'));
    const authors = parseArrayParam(searchParams.get('authors'));
    const books = parseArrayParam(searchParams.get('books'));
    const tags = parseArrayParam(searchParams.get('tags'));
    const progress = parseArrayParam(searchParams.get('progress'));
    const activeFilterCount = categories.length + authors.length + books.length + tags.length + progress.length;

    return (
        <>
            <div className="flex items-center gap-4">
                <Button
                    onPress={() => dispatch(openModal({ componentName: 'FilterModal', data: { displayMode: 'chapters' } }))}
                    className="global_btn rounded_full outline_primary"
                    startContent={<SlidersHorizontal className="h-5 w-5" />}
                >
                    Filters
                    {activeFilterCount > 0 && (
                        <Badge className="ml-1 bg-primary text-white rounded-full">
                            {activeFilterCount}
                        </Badge>
                    )}
                </Button>
                <p className="text-muted-foreground">
                    {/* {filteredCount} chapter{filteredCount !== 1 ? 's' : ''} found */}
                    11 chapters found
                </p>
            </div>
        </>
    )
}
