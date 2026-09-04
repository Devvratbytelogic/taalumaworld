import { X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  AdminSearchInput,
  AdminSearchPanel,
  adminFilterPillClass,
  adminSelectClass,
} from '@/components/admin/layout/AdminContent';
import { cn } from '@/components/ui/utils';

interface AgreementTypeOption {
  value: string;
  label: string;
}

interface AdminConsentRecordsSearchProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  fromDate: string;
  onFromDateChange: (value: string) => void;
  toDate: string;
  onToDateChange: (value: string) => void;
  agreementTypeId: string;
  onAgreementTypeChange: (value: string) => void;
  agreementTypeOptions: AgreementTypeOption[];
}

export function AdminConsentRecordsSearch({
  searchQuery,
  onSearchChange,
  fromDate,
  onFromDateChange,
  toDate,
  onToDateChange,
  agreementTypeId,
  onAgreementTypeChange,
  agreementTypeOptions,
}: AdminConsentRecordsSearchProps) {
  const hasActiveFilters = !!fromDate || !!toDate || !!agreementTypeId;
  const selectedTypeName = agreementTypeOptions.find((opt) => opt.value === agreementTypeId)?.label;

  const clearFilters = () => {
    onFromDateChange('');
    onToDateChange('');
    onAgreementTypeChange('');
  };

  return (
    <AdminSearchPanel>
      <div className="flex flex-col gap-3 xl:flex-row xl:items-end">
        <div className="min-w-0 flex-1">
          <AdminSearchInput
            value={searchQuery}
            onChange={onSearchChange}
            placeholder="Search by name or email…"
          />
        </div>

        <div className="flex flex-wrap items-end gap-2">
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
          <select
            value={agreementTypeId}
            onChange={(e) => onAgreementTypeChange(e.target.value)}
            className={cn(adminSelectClass, 'h-9')}
          >
            <option value="">All agreement types</option>
            {agreementTypeOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
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
          {selectedTypeName ? (
            <span className={adminFilterPillClass}>
              {selectedTypeName}
              <button type="button" onClick={() => onAgreementTypeChange('')}>
                <X className="h-3 w-3" />
              </button>
            </span>
          ) : null}
        </div>
      ) : null}
    </AdminSearchPanel>
  );
}
