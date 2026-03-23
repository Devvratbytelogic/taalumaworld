'use client'
import React from 'react'
import { useDispatch } from 'react-redux';
import { useSearchParams } from 'next/navigation';
import Button from '@/components/ui/Button';
import { Badge } from '@/components/ui/badge';
import { SlidersHorizontal } from 'lucide-react';
import { openModal } from '@/store/slices/allModalSlice';
import { VISIBLE } from '@/constants/contentMode';

interface FilterOptionsProps {
    total?: number;
    viewMode?: string;
}

function parseArrayParam(value: string | null): string[] {
    if (!value) return [];
    return value.split(',').filter(Boolean);
}

export default function FilterOptions({ total = 0, viewMode }: FilterOptionsProps) {
    const dispatch = useDispatch();
    const searchParams = useSearchParams();

    const categoryId = parseArrayParam(searchParams.get('categoryId'));
    const thoughtLeaderId = parseArrayParam(searchParams.get('thoughtLeaderId'));
    const tags = parseArrayParam(searchParams.get('tags'));
    const readingProgress = parseArrayParam(searchParams.get('readingProgress'));
    const activeFilterCount = categoryId.length + thoughtLeaderId.length + tags.length + readingProgress.length;

    const contentLabel = viewMode === VISIBLE.BOOK ? 'books' : 'chapters';

    return (
        <>
            <div className="flex items-center gap-4">
                <Button
                    onPress={() => dispatch(openModal({ componentName: 'FilterModal', data: { displayMode: contentLabel } }))}
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
                    {total} {contentLabel} found
                </p>
            </div>
        </>
    )
}
