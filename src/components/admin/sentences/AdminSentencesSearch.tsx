import { X } from 'lucide-react';
import {
  AdminSearchPanel,
  adminFilterPillClass,
  adminSelectClass,
} from '@/components/admin/layout/AdminContent';
import { AGREEMENT_TOUCHPOINT_OPTIONS } from '@/constants/agreements';

interface AdminSentencesSearchProps {
  selectedTouchpoint: string;
  onTouchpointChange: (value: string) => void;
}

export function AdminSentencesSearch({ selectedTouchpoint, onTouchpointChange }: AdminSentencesSearchProps) {
  const hasActiveFilters = !!selectedTouchpoint;

  return (
    <AdminSearchPanel>
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
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

          {hasActiveFilters ? (
            <button
              type="button"
              onClick={() => onTouchpointChange('')}
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
            {AGREEMENT_TOUCHPOINT_OPTIONS.find((opt) => opt.value === selectedTouchpoint)?.label}
            <button type="button" onClick={() => onTouchpointChange('')} className="hover:text-primary/70">
              <X className="h-3 w-3" />
            </button>
          </span>
        </div>
      ) : null}
    </AdminSearchPanel>
  );
}
