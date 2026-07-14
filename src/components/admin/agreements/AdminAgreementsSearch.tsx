import { X } from 'lucide-react';
import {
  AdminSearchInput,
  AdminSearchPanel,
  adminFilterPillClass,
  adminSelectClass,
} from '@/components/admin/layout/AdminContent';
import { AGREEMENT_STATUS_OPTIONS } from '@/constants/agreements';

interface AgreementTypeOption {
  value: string;
  label: string;
}

interface AdminAgreementsSearchProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedStatus: string;
  onStatusChange: (value: string) => void;
  selectedAgreementType: string;
  onAgreementTypeChange: (value: string) => void;
  agreementTypeOptions: AgreementTypeOption[];
}

export function AdminAgreementsSearch({
  searchQuery,
  onSearchChange,
  selectedStatus,
  onStatusChange,
  selectedAgreementType,
  onAgreementTypeChange,
  agreementTypeOptions,
}: AdminAgreementsSearchProps) {
  const hasActiveFilters = !!selectedStatus || !!selectedAgreementType;

  const clearAll = () => {
    onStatusChange('');
    onAgreementTypeChange('');
  };

  return (
    <AdminSearchPanel>
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <AdminSearchInput value={searchQuery} onChange={onSearchChange} placeholder="Search agreements by title..." />

        <div className="flex flex-wrap items-center gap-2 lg:shrink-0">
          <select
            value={selectedAgreementType}
            onChange={(e) => onAgreementTypeChange(e.target.value)}
            className={adminSelectClass}
          >
            <option value="">All agreement types</option>
            {agreementTypeOptions.map((opt) => (
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
          {selectedAgreementType ? (
            <span className={adminFilterPillClass}>
              {agreementTypeOptions.find((opt) => opt.value === selectedAgreementType)?.label}
              <button type="button" onClick={() => onAgreementTypeChange('')} className="hover:text-primary/70">
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
