import { X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  AdminSearchInput,
  AdminSearchPanel,
  adminFilterPillClass,
} from '@/components/admin/layout/AdminContent';

interface MentorFollowersSearchProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  fromDate: string;
  onFromDateChange: (value: string) => void;
  toDate: string;
  onToDateChange: (value: string) => void;
}

export function MentorFollowersSearch({
  searchQuery,
  onSearchChange,
  fromDate,
  onFromDateChange,
  toDate,
  onToDateChange,
}: MentorFollowersSearchProps) {
  const hasActiveFilters = !!fromDate || !!toDate;

  const clearFilters = () => {
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
            placeholder="Search by name, email, or phone…"
          />
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 xl:flex xl:shrink-0 xl:items-end xl:gap-2">
          <div className="flex min-w-0 flex-col gap-1 xl:w-40">
            <label className="text-xs font-medium text-slate-500">From</label>
            <Input
              type="date"
              value={fromDate}
              max={toDate || undefined}
              onChange={(e) => onFromDateChange(e.target.value)}
              className="h-9 w-full text-sm"
            />
          </div>

          <div className="flex min-w-0 flex-col gap-1 xl:w-40">
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
            <div className="col-span-2 flex items-end sm:col-span-1">
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex h-9 w-full items-center justify-center gap-1.5 whitespace-nowrap rounded-lg border border-red-200! px-3 text-sm text-red-600 transition-colors hover:bg-red-50 xl:w-auto"
              >
                <X className="h-3.5 w-3.5" />
                Clear
              </button>
            </div>
          ) : null}
        </div>
      </div>

      {hasActiveFilters ? (
        <div className="flex flex-wrap gap-2">
          {fromDate ? (
            <span className={adminFilterPillClass}>
              From {fromDate}
              <button type="button" onClick={() => onFromDateChange('')} className="hover:text-primary/70">
                <X className="h-3 w-3" />
              </button>
            </span>
          ) : null}
          {toDate ? (
            <span className={adminFilterPillClass}>
              To {toDate}
              <button type="button" onClick={() => onToDateChange('')} className="hover:text-primary/70">
                <X className="h-3 w-3" />
              </button>
            </span>
          ) : null}
        </div>
      ) : null}
    </AdminSearchPanel>
  );
}
