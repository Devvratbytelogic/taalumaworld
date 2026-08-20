'use client';

import { useEffect, useRef, useState, type ComponentType } from 'react';
import Link from 'next/link';
import { BadgeCheck, BookOpen, CheckCircle2, FileText, Loader2, Search, Users, X } from 'lucide-react';
import { useGetSearchResultsQuery } from '@/store/rtkQueries/userGetAPI';
import type { BlueprintsEntity, MentorsEntity, SeriesEntity } from '@/types/user/saech';
import { useDebounce } from '@/hooks/useDebounce';
import { cn } from '@/components/ui/utils';
import ImageComponent from '@/components/ui/ImageComponent';
import { getBlueprintRoutePath, getSeriesRoutePath, getSingleAuthorRoutePath } from '@/routes/routes';

interface GlobalSearchBarProps {
  onSelect: () => void;
}

const MIN_QUERY_LENGTH = 2;

function formatPrice(price: number) {
  return price > 0 ? `KSH ${price.toFixed(2)}` : 'FREE';
}

export default function GlobalSearchBar({ onSelect }: GlobalSearchBarProps) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const debouncedQuery = useDebounce(query.trim(), 350);
  const isSearchable = debouncedQuery.length >= MIN_QUERY_LENGTH;

  const { data, isFetching, isError, error } = useGetSearchResultsQuery(debouncedQuery, {
    skip: !isSearchable,
  });

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const series = data?.data?.series ?? [];
  const blueprints = data?.data?.blueprints ?? [];
  const mentors = data?.data?.mentors ?? [];
  const hasResults = series.length > 0 || blueprints.length > 0 || mentors.length > 0;

  return (
    <div className="w-full">
      <div className="group/search flex items-center gap-3 border-b border-gray-100 px-4 py-3.5 sm:px-5">
        <Search
          className="h-5 w-5 shrink-0 text-gray-400 transition-colors group-focus-within/search:text-primary"
          aria-hidden
        />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Escape' && onSelect()}
          placeholder="Search series, blueprints, mentors..."
          className="h-6 w-full bg-transparent text-[15px] text-gray-900 outline-none placeholder:text-gray-400"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            aria-label="Clear search"
            className="shrink-0 rounded-full p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
        <kbd className="hidden shrink-0 items-center rounded-md border border-gray-200 bg-gray-50 px-1.5 py-1 text-[10px] font-medium text-gray-400 sm:inline-flex">
          ESC
        </kbd>
      </div>

      {isSearchable && (
        <div className="custom_scrollbar max-h-[60vh] overflow-y-auto">
          {isFetching ? (
            <div className="flex items-center justify-center gap-2 px-4 py-10 text-sm text-gray-500">
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              Searching...
            </div>
          ) : isError ? (
            <div className="px-4 py-10 text-center text-sm text-gray-500">
              {(error as any)?.data?.message || 'Something went wrong while searching. Please try again.'}
            </div>
          ) : !hasResults ? (
            <div className="px-4 py-10 text-center text-sm text-gray-500">
              No results found for &quot;{debouncedQuery}&quot;
            </div>
          ) : (
            <>
              <SearchResultSection
                icon={BookOpen}
                label="Series"
                items={series}
                onSelect={onSelect}
                getHref={(item) => getSeriesRoutePath(item?.slug ?? item?.id ?? '')}
                renderItem={(item) => <SeriesResultRow item={item} />}
              />
              <SearchResultSection
                icon={FileText}
                label="Blueprints"
                items={blueprints}
                onSelect={onSelect}
                getHref={(item) => getBlueprintRoutePath(item?.slug ?? item?.id ?? '')}
                renderItem={(item) => <BlueprintResultRow item={item} />}
              />
              <SearchResultSection
                icon={Users}
                label="Mentors"
                items={mentors}
                onSelect={onSelect}
                getHref={(item) => getSingleAuthorRoutePath(item?.short_code ?? item?.id ?? '')}
                renderItem={(item) => <MentorResultRow item={item} />}
              />
            </>
          )}
        </div>
      )}
    </div>
  );
}

interface SearchResultSectionProps<T extends { id: string }> {
  icon: ComponentType<{ className?: string }>;
  label: string;
  items: T[];
  onSelect: () => void;
  getHref: (item: T) => string;
  renderItem: (item: T) => React.ReactNode;
}

function SearchResultSection<T extends { id: string }>({
  icon: Icon,
  label,
  items,
  onSelect,
  getHref,
  renderItem,
}: SearchResultSectionProps<T>) {
  if (items?.length === 0) return null;

  return (
    <div className="border-b border-gray-100 p-2 last:border-b-0">
      <div className="flex items-center gap-2 px-3 py-2">
        <Icon className="h-4 w-4 text-primary" aria-hidden />
        <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">{label}</span>
      </div>
      {items?.map((item) => (
        <Link
          key={item?.id}
          href={getHref(item)}
          onClick={onSelect}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition-colors hover:bg-gray-50"
        >
          {renderItem(item)}
        </Link>
      ))}
    </div>
  );
}

function SearchResultThumbnail({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-gray-100">
      <ImageComponent src={src} alt={alt} object_cover />
    </div>
  );
}

function SearchResultPriceBadge({ isPurchased, price }: { isPurchased: boolean; price: number }) {
  if (isPurchased) {
    return (
      <span className="flex shrink-0 items-center gap-1 rounded-full bg-primary/10 px-2 py-1 text-[11px] font-medium text-primary">
        <CheckCircle2 className="h-3 w-3" aria-hidden />
        Owned
      </span>
    );
  }

  return (
    <span
      className={cn(
        'shrink-0 rounded-full px-2 py-1 text-[11px] font-medium',
        price > 0 ? 'bg-gray-100 text-gray-600' : 'bg-emerald-50 text-emerald-600'
      )}
    >
      {formatPrice(price)}
    </span>
  );
}

function SeriesResultRow({ item }: { item: SeriesEntity }) {
  return (
    <>
      <SearchResultThumbnail src={item.coverImage} alt={item.title} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-gray-900">{item.title}</p>
        <p className="truncate text-xs text-gray-500">Series</p>
      </div>
      <SearchResultPriceBadge isPurchased={item.isPurchased} price={item.effectivePrice} />
    </>
  );
}

function BlueprintResultRow({ item }: { item: BlueprintsEntity }) {
  return (
    <>
      <SearchResultThumbnail src={item.coverImage} alt={item.title} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-gray-900">{item.title}</p>
        <p className="truncate text-xs text-gray-500">
          Bp. {item.blueprintNumber} · {item.seriesTitle}
        </p>
      </div>
      <SearchResultPriceBadge
        isPurchased={item.isPurchased}
        price={item.isFree ? 0 : item.effectivePrice}
      />
    </>
  );
}

function MentorResultRow({ item }: { item: MentorsEntity }) {
  return (
    <>
      <div className="h-11 w-11 shrink-0 overflow-hidden rounded-full bg-gray-100">
        <ImageComponent src={item.profile_pic ?? undefined} alt={item.name} object_cover />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <p className="truncate text-sm font-medium text-gray-900">{item.name}</p>
          {item.is_verified_mentor && (
            <BadgeCheck className="h-3.5 w-3.5 shrink-0 text-primary" aria-hidden />
          )}
        </div>
        <p className="truncate text-xs text-gray-500">{item.professionalBio || 'Mentor'}</p>
      </div>
    </>
  );
}
