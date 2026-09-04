import { X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  AdminSearchInput,
  AdminSearchPanel,
  adminFilterPillClass,
  adminSelectClass,
} from '@/components/admin/layout/AdminContent';
import { cn } from '@/components/ui/utils';
import type { IAllMentorTiersEntity } from '@/types/mentorTier';

interface AdminMentorPerformanceSearchProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  fromDate: string;
  onFromDateChange: (value: string) => void;
  toDate: string;
  onToDateChange: (value: string) => void;
  status: string;
  onStatusChange: (value: string) => void;
  tierId: string;
  onTierIdChange: (value: string) => void;
  verified: string;
  onVerifiedChange: (value: string) => void;
  hasSales: string;
  onHasSalesChange: (value: string) => void;
  tiers: IAllMentorTiersEntity[];
}

const STATUS_OPTIONS = [
  { value: '', label: 'All statuses' },
  { value: 'active', label: 'Active' },
  { value: 'suspended', label: 'Suspended' },
];

const VERIFIED_OPTIONS = [
  { value: '', label: 'All mentors' },
  { value: 'true', label: 'Verified' },
  { value: 'false', label: 'Unverified' },
];

const HAS_SALES_OPTIONS = [
  { value: '', label: 'All sales' },
  { value: 'true', label: 'With sales' },
  { value: 'false', label: 'No sales' },
];

export function AdminMentorPerformanceSearch({
  searchQuery,
  onSearchChange,
  fromDate,
  onFromDateChange,
  toDate,
  onToDateChange,
  status,
  onStatusChange,
  tierId,
  onTierIdChange,
  verified,
  onVerifiedChange,
  hasSales,
  onHasSalesChange,
  tiers,
}: AdminMentorPerformanceSearchProps) {
  const hasActiveFilters = !!fromDate || !!toDate || !!status || !!tierId || !!verified || !!hasSales;
  const selectedTier = tiers.find((tier) => tier._id === tierId);

  const clearFilters = () => {
    onFromDateChange('');
    onToDateChange('');
    onStatusChange('');
    onTierIdChange('');
    onVerifiedChange('');
    onHasSalesChange('');
  };

  return (
    <AdminSearchPanel>
      <div className="flex flex-col gap-3 xl:flex-row xl:items-end">
        <div className="min-w-0 flex-1">
          <AdminSearchInput
            value={searchQuery}
            onChange={onSearchChange}
            placeholder="Search by mentor name or email…"
          />
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 xl:flex xl:shrink-0 xl:flex-wrap xl:items-end xl:gap-2">
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
          <div className="flex min-w-0 flex-col gap-1 xl:w-36">
            <label className="text-xs font-medium text-slate-500">Status</label>
            <select
              value={status}
              onChange={(e) => onStatusChange(e.target.value)}
              className={cn(adminSelectClass, 'min-w-0 w-full')}
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value || 'all'} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex min-w-0 flex-col gap-1 xl:w-36">
            <label className="text-xs font-medium text-slate-500">Tier</label>
            <select
              value={tierId}
              onChange={(e) => onTierIdChange(e.target.value)}
              className={cn(adminSelectClass, 'min-w-0 w-full')}
            >
              <option value="">All tiers</option>
              {tiers.map((tier) => (
                <option key={tier._id} value={tier._id}>
                  {tier.code}
                </option>
              ))}
            </select>
          </div>
          <div className="flex min-w-0 flex-col gap-1 xl:w-36">
            <label className="text-xs font-medium text-slate-500">Verified</label>
            <select
              value={verified}
              onChange={(e) => onVerifiedChange(e.target.value)}
              className={cn(adminSelectClass, 'min-w-0 w-full')}
            >
              {VERIFIED_OPTIONS.map((opt) => (
                <option key={opt.value || 'all'} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex min-w-0 flex-col gap-1 xl:w-36">
            <label className="text-xs font-medium text-slate-500">Sales</label>
            <select
              value={hasSales}
              onChange={(e) => onHasSalesChange(e.target.value)}
              className={cn(adminSelectClass, 'min-w-0 w-full')}
            >
              {HAS_SALES_OPTIONS.map((opt) => (
                <option key={opt.value || 'all'} value={opt.value}>
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
          {status ? (
            <span className={adminFilterPillClass}>
              {STATUS_OPTIONS.find((opt) => opt.value === status)?.label ?? status}
              <button type="button" onClick={() => onStatusChange('')} className="hover:text-primary/70">
                <X className="h-3 w-3" />
              </button>
            </span>
          ) : null}
          {selectedTier ? (
            <span className={adminFilterPillClass}>
              {selectedTier.code}
              <button type="button" onClick={() => onTierIdChange('')} className="hover:text-primary/70">
                <X className="h-3 w-3" />
              </button>
            </span>
          ) : null}
          {verified ? (
            <span className={adminFilterPillClass}>
              {VERIFIED_OPTIONS.find((opt) => opt.value === verified)?.label ?? verified}
              <button type="button" onClick={() => onVerifiedChange('')} className="hover:text-primary/70">
                <X className="h-3 w-3" />
              </button>
            </span>
          ) : null}
          {hasSales ? (
            <span className={adminFilterPillClass}>
              {HAS_SALES_OPTIONS.find((opt) => opt.value === hasSales)?.label ?? hasSales}
              <button type="button" onClick={() => onHasSalesChange('')} className="hover:text-primary/70">
                <X className="h-3 w-3" />
              </button>
            </span>
          ) : null}
        </div>
      ) : null}
    </AdminSearchPanel>
  );
}
