import { Search } from 'lucide-react';
import { Input } from '../../ui/input';

interface AdminTransactionsSearchProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  fromDate: string;
  onFromDateChange: (value: string) => void;
  toDate: string;
  onToDateChange: (value: string) => void;
  status: string;
  onStatusChange: (value: string) => void;
}

const STATUS_OPTIONS = [
  { label: 'All Statuses', value: '' },
  { label: 'Completed', value: 'completed' },
  { label: 'Pending', value: 'pending' },
  { label: 'Failed', value: 'failed' },
];

export function AdminTransactionsSearch({
  searchQuery,
  onSearchChange,
  fromDate,
  onFromDateChange,
  toDate,
  onToDateChange,
  status,
  onStatusChange,
}: AdminTransactionsSearchProps) {
  return (
    <div className="admin-surface p-5">
      <div className="flex flex-col gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by transaction ID, user, or item..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-3 sm:items-end">
          <div className="flex flex-col gap-1">
            <label className="text-xs text-muted-foreground font-medium">From</label>
            <Input
              type="date"
              value={fromDate}
              max={toDate || undefined}
              onChange={(e) => onFromDateChange(e.target.value)}
              className="w-full sm:w-40 text-sm"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs text-muted-foreground font-medium">To</label>
            <Input
              type="date"
              value={toDate}
              min={fromDate || undefined}
              onChange={(e) => onToDateChange(e.target.value)}
              className="w-full sm:w-40 text-sm"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs text-muted-foreground font-medium">Status</label>
            <select
              value={status}
              onChange={(e) => onStatusChange(e.target.value)}
              className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {(fromDate || toDate || status) && (
            <div className="col-span-2 sm:col-span-1 flex flex-col gap-1">
              <span className="text-xs text-transparent select-none sm:block hidden">Clear</span>
              <button
                type="button"
                onClick={() => {
                  onFromDateChange('');
                  onToDateChange('');
                  onStatusChange('');
                }}
                className="w-full sm:w-auto h-10 px-4 text-sm rounded-md border border-input hover:bg-gray-50 transition-colors text-muted-foreground"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
