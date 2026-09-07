import { X } from 'lucide-react';
import {
  AdminSearchInput,
  AdminSearchPanel,
  adminFilterPillClass,
  adminSelectClass,
} from '@/components/admin/layout/AdminContent';
import { cn } from '@/components/ui/utils';

interface AdminReviewReportsSearchProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  type: string;
  onTypeChange: (value: string) => void;
}

const TYPE_OPTIONS = [
  { value: 'Chapter', label: 'Blueprint' },
  { value: '', label: 'All types' },
  { value: 'Book', label: 'Series' },
];

function formatTypeLabel(value: string) {
  if (value === 'Chapter') return 'Blueprint';
  if (value === 'Book') return 'Series';
  return value;
}

export function AdminReviewReportsSearch({
  searchQuery,
  onSearchChange,
  type,
  onTypeChange,
}: AdminReviewReportsSearchProps) {
  const hasTypeFilter = type !== 'Chapter';

  return (
    <AdminSearchPanel>
      <div className="flex flex-col gap-3 xl:flex-row xl:items-end">
        <div className="min-w-0 flex-1">
          <AdminSearchInput
            value={searchQuery}
            onChange={onSearchChange}
            placeholder="Search by reviewer, reporter, or title…"
          />
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
      </div>

      {hasTypeFilter ? (
        <div className="flex flex-wrap gap-2">
          {type ? (
            <span className={adminFilterPillClass}>
              {formatTypeLabel(type)}
              <button type="button" onClick={() => onTypeChange('Chapter')} className="hover:text-primary/70">
                <X className="h-3 w-3" />
              </button>
            </span>
          ) : (
            <span className={adminFilterPillClass}>
              All types
              <button type="button" onClick={() => onTypeChange('Chapter')} className="hover:text-primary/70">
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
        </div>
      ) : null}
    </AdminSearchPanel>
  );
}
