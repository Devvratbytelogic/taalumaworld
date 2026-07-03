import { X } from 'lucide-react';
import {
  AdminSearchInput,
  AdminSearchPanel,
  adminFilterPillClass,
  adminSelectClass,
} from '@/components/admin/layout/AdminContent';

interface FilterOption {
  id: string;
  name: string;
}

interface AdminBooksSearchProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  categories: FilterOption[];
  leaders: FilterOption[];
  selectedCategory: string;
  selectedLeader: string;
  onCategoryChange: (value: string) => void;
  onLeaderChange: (value: string) => void;
}

export function AdminBooksSearch({
  searchQuery,
  onSearchChange,
  categories,
  leaders,
  selectedCategory,
  selectedLeader,
  onCategoryChange,
  onLeaderChange,
}: AdminBooksSearchProps) {
  const hasActiveFilters = selectedCategory || selectedLeader;

  return (
    <AdminSearchPanel>
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <AdminSearchInput
          value={searchQuery}
          onChange={onSearchChange}
          placeholder="Search series by title or description..."
        />

        <div className="flex flex-wrap items-center gap-2 lg:shrink-0">
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className={adminSelectClass}
          >
            <option value="">All categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          <select
            value={selectedLeader}
            onChange={(e) => onLeaderChange(e.target.value)}
            className={adminSelectClass}
          >
            <option value="">All mentors</option>
            {leaders.map((l) => (
              <option key={l.id} value={l.id}>{l.name}</option>
            ))}
          </select>

          {hasActiveFilters ? (
            <button
              type="button"
              onClick={() => { onCategoryChange(''); onLeaderChange(''); }}
              className="inline-flex h-9 items-center gap-1.5 whitespace-nowrap rounded-lg border border-red-200 px-3 text-sm text-red-600 transition-colors hover:bg-red-50"
            >
              <X className="h-3.5 w-3.5" />
              Clear
            </button>
          ) : null}
        </div>
      </div>

      {hasActiveFilters ? (
        <div className="flex flex-wrap gap-2">
          {selectedCategory ? (
            <span className={adminFilterPillClass}>
              {categories.find((c) => c.id === selectedCategory)?.name}
              <button type="button" onClick={() => onCategoryChange('')} className="hover:text-primary/70">
                <X className="h-3 w-3" />
              </button>
            </span>
          ) : null}
          {selectedLeader ? (
            <span className={adminFilterPillClass}>
              {leaders.find((l) => l.id === selectedLeader)?.name}
              <button type="button" onClick={() => onLeaderChange('')} className="hover:text-primary/70">
                <X className="h-3 w-3" />
              </button>
            </span>
          ) : null}
        </div>
      ) : null}
    </AdminSearchPanel>
  );
}
