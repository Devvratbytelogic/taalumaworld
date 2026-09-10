import { X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  AdminSearchInput,
  AdminSearchPanel,
  adminFilterPillClass,
  adminSelectClass,
} from '@/components/admin/layout/AdminContent';
import { cn } from '@/components/ui/utils';
import type { InboxTypeFilter } from '@/types/inbox';

const TYPE_OPTIONS: { value: InboxTypeFilter; label: string }[] = [
  { value: 'all', label: 'All types' },
  { value: 'newsletter', label: 'Newsletter' },
  { value: 'contact_us', label: 'Contact Us' },
];

interface AdminInboxSearchProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  typeFilter: InboxTypeFilter;
  onTypeFilterChange: (value: InboxTypeFilter) => void;
  fromDate: string;
  onFromDateChange: (value: string) => void;
  toDate: string;
  onToDateChange: (value: string) => void;
}

export function AdminInboxSearch({
  searchQuery,
  onSearchChange,
  typeFilter,
  onTypeFilterChange,
  fromDate,
  onFromDateChange,
  toDate,
  onToDateChange,
}: AdminInboxSearchProps) {
  const hasActiveFilters = typeFilter !== 'all' || !!fromDate || !!toDate;
  const selectedTypeLabel = TYPE_OPTIONS.find((opt) => opt.value === typeFilter)?.label;

  const clearFilters = () => {
    onTypeFilterChange('all');
    onFromDateChange('');
    onToDateChange('');
  };

  return (
    <AdminSearchPanel>
      <div className="flex flex-col gap-3 xl:flex-row xl:items-end">
        <div className="min-w-0 flex-1">
          <AdminSearchInput
            value={searchQuery}
            onChange={onSearchChange}
            placeholder="Search by email, name, or subject…"
          />
        </div>

        <div className="flex flex-wrap items-end gap-2">
          <select
            value={typeFilter}
            onChange={(e) => onTypeFilterChange(e.target.value as InboxTypeFilter)}
            className={cn(adminSelectClass, 'h-9')}
          >
            {TYPE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <div className="flex min-w-0 flex-col gap-1 xl:w-36">
            <label className="text-xs font-medium text-slate-500">From</label>
            <Input
              type="date"
              value={fromDate}
              max={toDate || undefined}
              onChange={(e) => onFromDateChange(e.target.value)}
              className="h-9 w-full text-sm"
            />
          </div>
          <div className="flex min-w-0 flex-col gap-1 xl:w-36">
            <label className="text-xs font-medium text-slate-500">To</label>
            <Input
              type="date"
              value={toDate}
              min={fromDate || undefined}
              onChange={(e) => onToDateChange(e.target.value)}
              className="h-9 w-full text-sm"
            />
          </div>
          {hasActiveFilters ? (
            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-red-200 px-3 text-sm text-red-600 hover:bg-red-50"
            >
              <X className="h-3.5 w-3.5" />
              Clear
            </button>
          ) : null}
        </div>
      </div>

      {hasActiveFilters ? (
        <div className="flex flex-wrap gap-2">
          {typeFilter !== 'all' && selectedTypeLabel ? (
            <span className={adminFilterPillClass}>
              {selectedTypeLabel}
              <button type="button" onClick={() => onTypeFilterChange('all')}>
                <X className="h-3 w-3" />
              </button>
            </span>
          ) : null}
          {fromDate ? (
            <span className={adminFilterPillClass}>
              From {fromDate}
              <button type="button" onClick={() => onFromDateChange('')}>
                <X className="h-3 w-3" />
              </button>
            </span>
          ) : null}
          {toDate ? (
            <span className={adminFilterPillClass}>
              To {toDate}
              <button type="button" onClick={() => onToDateChange('')}>
                <X className="h-3 w-3" />
              </button>
            </span>
          ) : null}
        </div>
      ) : null}
    </AdminSearchPanel>
  );
}
