import { X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  AdminSearchPanel,
  adminFilterPillClass,
  adminSelectClass,
} from '@/components/admin/layout/AdminContent';
import { cn } from '@/components/ui/utils';
import {
  REFERRAL_PERFORMANCE_USER_TYPES,
  type ReferralPerformanceUserType,
} from '@/types/dashboard';

interface AdminReferralPerformanceSearchProps {
  fromDate: string;
  onFromDateChange: (value: string) => void;
  toDate: string;
  onToDateChange: (value: string) => void;
  userType: ReferralPerformanceUserType;
  onUserTypeChange: (value: ReferralPerformanceUserType) => void;
}

const USER_TYPE_LABELS: Record<ReferralPerformanceUserType, string> = {
  all: 'All',
  mentor: 'Mentor',
  user: 'User',
};

export function AdminReferralPerformanceSearch({
  fromDate,
  onFromDateChange,
  toDate,
  onToDateChange,
  userType,
  onUserTypeChange,
}: AdminReferralPerformanceSearchProps) {
  const hasActiveFilters = !!fromDate || !!toDate || userType !== 'all';

  const clearFilters = () => {
    onFromDateChange('');
    onToDateChange('');
    onUserTypeChange('all');
  };

  return (
    <AdminSearchPanel>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 xl:flex xl:flex-wrap xl:items-end xl:gap-2">
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
        <div className="flex min-w-0 flex-col gap-1 xl:w-44">
          <label className="text-xs font-medium text-slate-500">User type</label>
          <select
            value={userType}
            onChange={(e) => onUserTypeChange(e.target.value as ReferralPerformanceUserType)}
            className={cn(adminSelectClass, 'min-w-0 w-full')}
          >
            {REFERRAL_PERFORMANCE_USER_TYPES.map((value) => (
              <option key={value} value={value}>
                {USER_TYPE_LABELS[value]}
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
          {userType !== 'all' ? (
            <span className={adminFilterPillClass}>
              {USER_TYPE_LABELS[userType]}
              <button type="button" onClick={() => onUserTypeChange('all')} className="hover:text-primary/70">
                <X className="h-3 w-3" />
              </button>
            </span>
          ) : null}
        </div>
      ) : null}
    </AdminSearchPanel>
  );
}
