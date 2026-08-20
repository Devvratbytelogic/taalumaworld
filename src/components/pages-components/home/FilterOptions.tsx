'use client'
import React from 'react'
import { useDispatch } from 'react-redux';
import Button from '@/components/ui/Button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { openModal } from '@/store/slices/allModalSlice';
import { VISIBLE } from '@/constants/contentMode';
import { useAuth } from '@/hooks/useAuth';

export type LibraryFilters = {
    isFree: boolean;
    isPurchased: boolean;
    mentorIds: string[];
    tags: string[];
};

interface FilterOptionsProps {
    total?: number;
    viewMode?: string;
    filters: LibraryFilters;
    search: string;
    onSearchChange: (value: string) => void;
    onFiltersChange: (filters: LibraryFilters) => void;
}

export default function FilterOptions({
    total = 0,
    viewMode,
    filters,
    search,
    onSearchChange,
    onFiltersChange,
}: FilterOptionsProps) {
    const dispatch = useDispatch();
    const { isAuthenticated } = useAuth();

    const activeFilterCount =
        (filters.isFree ? 1 : 0) +
        (isAuthenticated && filters.isPurchased ? 1 : 0) +
        filters.mentorIds.length +
        filters.tags.length;

    const contentLabel = viewMode === VISIBLE.BOOK ? 'series' : 'blueprints';

    return (
        <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-1 flex-wrap items-center gap-3">
                <div className="relative w-full max-w-xs">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        value={search}
                        onChange={(e) => onSearchChange(e.target.value)}
                        placeholder="Search content..."
                        className="h-10 rounded-full border-border pl-9 pr-9"
                        aria-label="Search content"
                    />
                    {search ? (
                        <button
                            type="button"
                            onClick={() => onSearchChange('')}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                            aria-label="Clear search"
                        >
                            <X className="h-3.5 w-3.5" />
                        </button>
                    ) : null}
                </div>

                <Button
                    onPress={() =>
                        dispatch(
                            openModal({
                                componentName: 'FilterModal',
                                data: {
                                    filters,
                                    onApply: (next: LibraryFilters) => {
                                        onFiltersChange(next);
                                    },
                                },
                            }),
                        )
                    }
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
        </div>
    )
}
