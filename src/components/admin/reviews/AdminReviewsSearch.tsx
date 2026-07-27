import { X } from 'lucide-react';
import {
  AdminSearchInput,
  AdminSearchPanel,
  adminFilterPillClass,
  adminSelectClass,
} from '@/components/admin/layout/AdminContent';
import { cn } from '@/components/ui/utils';

interface AdminReviewsSearchProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  status: string;
  onStatusChange: (value: string) => void;
  type: string;
  onTypeChange: (value: string) => void;
}

const STATUS_OPTIONS = [
  { value: '', label: 'All statuses' },
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
];

const TYPE_OPTIONS = [
  { value: '', label: 'All types' },
  { value: 'Chapter', label: 'Blueprint' },
  { value: 'Book', label: 'Series' },
];

function formatStatusLabel(value: string) {
  if (!value) return '';
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function formatTypeLabel(value: string) {
  if (value === 'Chapter') return 'Blueprint';
  if (value === 'Book') return 'Series';
  return value;
}

export function AdminReviewsSearch({
  searchQuery,
  onSearchChange,
  status,
  onStatusChange,
  type,
  onTypeChange,
}: AdminReviewsSearchProps) {
  const hasActiveFilters = !!status || !!type;

  const clearFilters = () => {
    onStatusChange('');
    onTypeChange('');
  };

  return (
    <AdminSearchPanel>
      <div className="flex flex-col gap-3 xl:flex-row xl:items-end">
        <div className="min-w-0 flex-1">
          <AdminSearchInput
            value={searchQuery}
            onChange={onSearchChange}
            placeholder="Search by user, comment, or item…"
          />
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 xl:flex xl:shrink-0 xl:items-end xl:gap-2">
          <div className="flex min-w-0 flex-col gap-1 xl:w-40">
            <label className="text-xs font-medium text-slate-500">Status</label>
            <select
              value={status}
              onChange={(e) => onStatusChange(e.target.value)}
              className={cn(adminSelectClass, 'min-w-0 w-full')}
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value || 'all-status'} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex min-w-0 flex-col gap-1 xl:w-40">
            <label className="text-xs font-medium text-slate-500">Type</label>
            <select
              value={type}
              onChange={(e) => onTypeChange(e.target.value)}
              className={cn(adminSelectClass, 'min-w-0 w-full')}
            >
              {TYPE_OPTIONS.map((opt) => (
                <option key={opt.value || 'all-type'} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
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
          {status ? (
            <span className={adminFilterPillClass}>
              {formatStatusLabel(status)}
              <button type="button" onClick={() => onStatusChange('')} className="hover:text-primary/70">
                <X className="h-3 w-3" />
              </button>
            </span>
          ) : null}
          {type ? (
            <span className={adminFilterPillClass}>
              {formatTypeLabel(type)}
              <button type="button" onClick={() => onTypeChange('')} className="hover:text-primary/70">
                <X className="h-3 w-3" />
              </button>
            </span>
          ) : null}
        </div>
      ) : null}
    </AdminSearchPanel>
  );
}
