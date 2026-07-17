import { X } from 'lucide-react';
import {
  AdminSearchInput,
  AdminSearchPanel,
  adminFilterPillClass,
  adminSelectClass,
} from '@/components/admin/layout/AdminContent';

interface AdminTestimonialsSearchProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedStatus: string;
  onStatusChange: (value: string) => void;
}

const STATUS_OPTIONS = ['Active', 'Inactive'];

export function AdminTestimonialsSearch({
  searchQuery,
  onSearchChange,
  selectedStatus,
  onStatusChange,
}: AdminTestimonialsSearchProps) {
  const hasActiveFilters = !!selectedStatus;

  return (
    <AdminSearchPanel>
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <AdminSearchInput
          value={searchQuery}
          onChange={onSearchChange}
          placeholder="Search testimonials by name, title, or message…"
        />

        <div className="flex flex-wrap items-center gap-2 lg:shrink-0">
          <select
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value)}
            className={adminSelectClass}
          >
            <option value="">All statuses</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          {hasActiveFilters ? (
            <button
              type="button"
              onClick={() => onStatusChange('')}
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
          <span className={adminFilterPillClass}>
            {selectedStatus}
            <button type="button" onClick={() => onStatusChange('')} className="hover:text-primary/70">
              <X className="h-3 w-3" />
            </button>
          </span>
        </div>
      ) : null}
    </AdminSearchPanel>
  );
}
