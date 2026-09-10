import { X } from 'lucide-react';
import {
  AdminSearchInput,
  AdminSearchPanel,
  adminFilterPillClass,
  adminSelectClass,
} from '@/components/admin/layout/AdminContent';
import { AGREEMENT_STATUS_OPTIONS, AGREEMENT_TOUCHPOINT_OPTIONS } from '@/constants/agreements';

interface AdminSentencesSearchProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedTouchpoint: string;
  onTouchpointChange: (value: string) => void;
  selectedStatus: string;
  onStatusChange: (value: string) => void;
}

export function AdminSentencesSearch({
  searchQuery,
  onSearchChange,
  selectedTouchpoint,
  onTouchpointChange,
  selectedStatus,
  onStatusChange,
}: AdminSentencesSearchProps) {
  const hasActiveFilters = !!selectedTouchpoint || !!selectedStatus;

  const clearAll = () => {
    onTouchpointChange('');
    onStatusChange('');
  };

  return (
    <AdminSearchPanel>
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <AdminSearchInput value={searchQuery} onChange={onSearchChange} placeholder="Search sentences by text..." />

        <div className="flex flex-wrap items-center gap-2 lg:shrink-0">
          <select
            value={selectedTouchpoint}
            onChange={(e) => onTouchpointChange(e.target.value)}
            className={adminSelectClass}
          >
            <option value="">All touchpoints</option>
            {AGREEMENT_TOUCHPOINT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          <select value={selectedStatus} onChange={(e) => onStatusChange(e.target.value)} className={adminSelectClass}>
            <option value="">All statuses</option>
            {AGREEMENT_STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </option>
            ))}
          </select>

          {hasActiveFilters ? (
            <button
              type="button"
              onClick={clearAll}
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
          {selectedTouchpoint ? (
            <span className={adminFilterPillClass}>
              {AGREEMENT_TOUCHPOINT_OPTIONS.find((opt) => opt.value === selectedTouchpoint)?.label}
              <button type="button" onClick={() => onTouchpointChange('')} className="hover:text-primary/70">
                <X className="h-3 w-3" />
              </button>
            </span>
          ) : null}
          {selectedStatus ? (
            <span className={adminFilterPillClass}>
              {selectedStatus.charAt(0).toUpperCase() + selectedStatus.slice(1)}
              <button type="button" onClick={() => onStatusChange('')} className="hover:text-primary/70">
                <X className="h-3 w-3" />
              </button>
            </span>
          ) : null}
        </div>
      ) : null}
    </AdminSearchPanel>
  );
}
