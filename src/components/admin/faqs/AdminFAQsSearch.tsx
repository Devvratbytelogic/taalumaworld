import { Search, X } from 'lucide-react';
import { Input } from '../../ui/input';
import { adminFilterPillClass, adminSelectClass } from '@/components/admin/layout/AdminContent';

interface AdminFAQsSearchProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedStatus: string;
  onStatusChange: (value: string) => void;
}

const STATUS_OPTIONS = ['Active', 'Inactive'];

export function AdminFAQsSearch({ searchQuery, onSearchChange, selectedStatus, onStatusChange }: AdminFAQsSearchProps) {
  const hasActiveFilters = !!selectedStatus;

  return (
    <div className="admin-surface p-5 space-y-3">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search FAQs by question or answer…"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>

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
    </div>
  );
}
