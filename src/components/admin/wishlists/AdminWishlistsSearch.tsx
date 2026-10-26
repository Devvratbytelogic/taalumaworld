import { X } from 'lucide-react';
import ReactSelect from 'react-select';
import { Input } from '@/components/ui/input';
import { AdminSearchInput, AdminSearchPanel } from '@/components/admin/layout/AdminContent';
import { filterSelectStyles, type FilterOption } from '@/constants/filterSelectStyle';

const TYPE_OPTIONS: FilterOption[] = [
  { value: 'series', label: 'Series' },
  { value: 'blueprint', label: 'Book' },
];

export type WishlistFilters = {
  search: string;
  type: string;
  from: string;
  to: string;
  userId: string;
  seriesId: string;
  blueprintId: string;
};

type AdminWishlistsSearchProps = {
  filters: WishlistFilters;
  onChange: (filters: WishlistFilters) => void;
  userOptions: FilterOption[];
  seriesOptions: FilterOption[];
  blueprintOptions: FilterOption[];
};

export function AdminWishlistsSearch({
  filters,
  onChange,
  userOptions,
  seriesOptions,
  blueprintOptions,
}: AdminWishlistsSearchProps) {
  const menuPortalTarget = typeof document !== 'undefined' ? document.body : null;
  const hasFilters = Boolean(filters.type || filters.from || filters.to || filters.userId || filters.seriesId || filters.blueprintId);
  const today = new Date().toLocaleDateString('en-CA');
  const fromMax = filters.to && filters.to < today ? filters.to : today;

  const update = (patch: Partial<WishlistFilters>) => {
    const next = { ...filters, ...patch };
    if (patch.seriesId !== undefined && patch.seriesId !== filters.seriesId) next.blueprintId = '';
    onChange(next);
  };

  const select = (id: string, placeholder: string, options: FilterOption[], value: string, key: keyof WishlistFilters) => (
    <ReactSelect<FilterOption, false>
      inputId={id}
      classNamePrefix="react-select"
      options={options}
      value={options.find((option) => option.value === value) ?? null}
      onChange={(option) => update({ [key]: option?.value ?? '' })}
      placeholder={placeholder}
      isClearable
      isSearchable
      menuPortalTarget={menuPortalTarget}
      menuPosition="fixed"
      styles={filterSelectStyles}
    />
  );

  return (
    <AdminSearchPanel>
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <AdminSearchInput
            value={filters.search}
            onChange={(search) => update({ search })}
            placeholder="Search by name, email, or title…"
          />
          {hasFilters ? (
            <button
              type="button"
              onClick={() => onChange({ ...filters, type: '', from: '', to: '', userId: '', seriesId: '', blueprintId: '' })}
              className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-lg border border-red-200! px-3 text-sm text-red-600 hover:bg-red-50"
            >
              <X className="h-3.5 w-3.5" />
              Clear
            </button>
          ) : null}
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {select('wishlist-type', 'All types', TYPE_OPTIONS, filters.type, 'type')}
          {select('wishlist-user', 'All users', userOptions, filters.userId, 'userId')}
          {select('wishlist-series', 'All series', seriesOptions, filters.seriesId, 'seriesId')}
          {select('wishlist-blueprint', 'All blueprints', blueprintOptions, filters.blueprintId, 'blueprintId')}
          <Input
            id="wishlist-from"
            type="date"
            aria-label="From"
            value={filters.from}
            max={fromMax}
            onChange={(event) => update({ from: event.target.value })}
            className="h-9"
          />
          <Input
            id="wishlist-to"
            type="date"
            aria-label="To"
            value={filters.to}
            min={filters.from || undefined}
            max={today}
            onChange={(event) => update({ to: event.target.value })}
            className="h-9"
          />
        </div>
      </div>
    </AdminSearchPanel>
  );
}
