import { X } from 'lucide-react';
import {
  AdminSearchInput,
  AdminSearchPanel,
  adminFilterPillClass,
  adminSelectClass,
} from '@/components/admin/layout/AdminContent';

interface AdminWithdrawalsSearchProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  walletType: string;
  onWalletTypeChange: (value: string) => void;
  status: string;
  onStatusChange: (value: string) => void;
}

const STATUS_OPTIONS = [
  { value: '', label: 'All statuses' },
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
];

const WALLET_TYPE_OPTIONS = [
  { value: '', label: 'All wallets' },
  { value: 'mentor', label: 'Mentor' },
  { value: 'affiliate', label: 'Affiliate' },
];

function formatWalletType(walletType: string) {
  if (walletType === 'mentor') return 'Mentor';
  if (walletType === 'affiliate') return 'Affiliate';
  return walletType;
}

function formatStatusLabel(status: string) {
  if (!status) return '';
  return status.charAt(0).toUpperCase() + status.slice(1);
}

export function AdminWithdrawalsSearch({
  searchQuery,
  onSearchChange,
  walletType,
  onWalletTypeChange,
  status,
  onStatusChange,
}: AdminWithdrawalsSearchProps) {
  const hasActiveFilters = !!status || !!walletType;

  return (
    <AdminSearchPanel>
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <AdminSearchInput
          value={searchQuery}
          onChange={onSearchChange}
          placeholder="Search by user name or email..."
        />

        <div className="flex flex-wrap items-center gap-2 lg:shrink-0">
          <select
            value={walletType}
            onChange={(e) => onWalletTypeChange(e.target.value)}
            className={adminSelectClass}
          >
            {WALLET_TYPE_OPTIONS.map((opt) => (
              <option key={opt.value || 'all'} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          <select
            value={status}
            onChange={(e) => onStatusChange(e.target.value)}
            className={adminSelectClass}
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value || 'all'} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          {hasActiveFilters ? (
            <button
              type="button"
              onClick={() => {
                onStatusChange('');
                onWalletTypeChange('');
              }}
              className="inline-flex h-9 items-center gap-1.5 whitespace-nowrap rounded-lg border border-red-200! px-3 text-sm text-red-600 transition-colors hover:bg-red-50"
            >
              <X className="h-3.5 w-3.5" />
              Clear
            </button>
          ) : null}
        </div>
      </div>

      {hasActiveFilters ? (
        <div className="flex flex-wrap gap-2">
          {walletType ? (
            <span className={adminFilterPillClass}>
              {formatWalletType(walletType)}
              <button
                type="button"
                onClick={() => onWalletTypeChange('')}
                className="hover:text-primary/70"
              >
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
