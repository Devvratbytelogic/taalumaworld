import { X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  AdminSearchPanel,
  adminFilterPillClass,
  adminSelectClass,
} from '@/components/admin/layout/AdminContent';

interface MentorWalletSearchProps {
  entryType: string;
  onEntryTypeChange: (value: string) => void;
  status: string;
  onStatusChange: (value: string) => void;
  fromDate: string;
  onFromDateChange: (value: string) => void;
  toDate: string;
  onToDateChange: (value: string) => void;
}

const ENTRY_TYPE_OPTIONS = [
  { value: '', label: 'All entries' },
  { value: 'credit', label: 'Credit' },
  { value: 'debit', label: 'Debit' },
];

const STATUS_OPTIONS = [
  { value: '', label: 'All statuses' },
  { value: 'pending', label: 'Pending' },
  { value: 'completed', label: 'Completed' },
  { value: 'rejected', label: 'Rejected' },
];

function formatEntryTypeLabel(value: string) {
  if (value === 'credit') return 'Credit';
  if (value === 'debit') return 'Debit';
  return value;
}

function formatStatusLabel(value: string) {
  if (!value) return '';
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function MentorWalletSearch({
  entryType,
  onEntryTypeChange,
  status,
  onStatusChange,
  fromDate,
  onFromDateChange,
  toDate,
  onToDateChange,
}: MentorWalletSearchProps) {
  const hasActiveFilters = !!entryType || !!status || !!fromDate || !!toDate;

  const clearFilters = () => {
    onEntryTypeChange('');
    onStatusChange('');
    onFromDateChange('');
    onToDateChange('');
  };

  return (
    <AdminSearchPanel>
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-slate-900">Wallet ledger</h2>
          <p className="text-xs text-slate-500">Filter ledger entries by date, type, or status.</p>
        </div>
        {hasActiveFilters ? (
          <button
            type="button"
            onClick={clearFilters}
            className="inline-flex h-9 w-fit items-center gap-1.5 whitespace-nowrap rounded-lg border border-red-200! px-3 text-sm text-red-600 transition-colors hover:bg-red-50"
          >
            <X className="h-3.5 w-3.5" />
            Clear filters
          </button>
        ) : null}
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <div className="flex min-w-0 flex-col gap-1.5">
          <label className="text-xs font-medium text-slate-500">From</label>
          <Input
            type="date"
            value={fromDate}
            max={toDate || undefined}
            onChange={(e) => onFromDateChange(e.target.value)}
            className="h-9 w-full text-sm"
          />
        </div>

        <div className="flex min-w-0 flex-col gap-1.5">
          <label className="text-xs font-medium text-slate-500">To</label>
          <Input
            type="date"
            value={toDate}
            min={fromDate || undefined}
            onChange={(e) => onToDateChange(e.target.value)}
            className="h-9 w-full text-sm"
          />
        </div>

        <div className="flex min-w-0 flex-col gap-1.5">
          <label className="text-xs font-medium text-slate-500">Entry type</label>
          <select
            value={entryType}
            onChange={(e) => onEntryTypeChange(e.target.value)}
            className={adminSelectClass}
          >
            {ENTRY_TYPE_OPTIONS.map((opt) => (
              <option key={opt.value || 'all-entries'} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex min-w-0 flex-col gap-1.5">
          <label className="text-xs font-medium text-slate-500">Status</label>
          <select
            value={status}
            onChange={(e) => onStatusChange(e.target.value)}
            className={adminSelectClass}
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value || 'all-statuses'} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
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
          {entryType ? (
            <span className={adminFilterPillClass}>
              {formatEntryTypeLabel(entryType)}
              <button type="button" onClick={() => onEntryTypeChange('')} className="hover:text-primary/70">
                <X className="h-3 w-3" />
              </button>
            </span>
          ) : null}
          {status ? (
            <span className={adminFilterPillClass}>
              {formatStatusLabel(status)}
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
