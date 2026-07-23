import { X } from 'lucide-react';
import {
  AdminSearchInput,
  AdminSearchPanel,
  adminFilterPillClass,
  adminSelectClass,
} from '@/components/admin/layout/AdminContent';
import { COUPON_SCOPE_LABELS, COUPON_SCOPES, COUPON_STATUS_OPTIONS } from '@/constants/coupon';

interface AdminCouponsSearchProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedStatus: string;
  onStatusChange: (value: string) => void;
  selectedScope: string;
  onScopeChange: (value: string) => void;
}

export function AdminCouponsSearch({
  searchQuery,
  onSearchChange,
  selectedStatus,
  onStatusChange,
  selectedScope,
  onScopeChange,
}: AdminCouponsSearchProps) {
  const hasActiveFilters = !!selectedStatus || !!selectedScope;

  const clearAll = () => {
    onStatusChange('');
    onScopeChange('');
  };

  return (
    <AdminSearchPanel>
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <AdminSearchInput
          value={searchQuery}
          onChange={onSearchChange}
          placeholder="Search coupons by code..."
        />

        <div className="flex flex-wrap items-center gap-2 lg:shrink-0">
          <select
            value={selectedScope}
            onChange={(e) => onScopeChange(e.target.value)}
            className={adminSelectClass}
          >
            <option value="">All types</option>
            {COUPON_SCOPES.map((scope) => (
              <option key={scope} value={scope}>
                {COUPON_SCOPE_LABELS[scope as keyof typeof COUPON_SCOPE_LABELS]}
              </option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value)}
            className={adminSelectClass}
          >
            <option value="">All statuses</option>
            {COUPON_STATUS_OPTIONS.map((status) => (
              <option key={status} value={status} className="capitalize">
                {status.charAt(0).toUpperCase() + status.slice(1)}
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
          {selectedScope ? (
            <span className={adminFilterPillClass}>
              {COUPON_SCOPE_LABELS[selectedScope as keyof typeof COUPON_SCOPE_LABELS] ?? selectedScope}
              <button type="button" onClick={() => onScopeChange('')} className="hover:text-primary/70">
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
