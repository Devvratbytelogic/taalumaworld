import { AdminSearchInput, AdminSearchPanel } from '@/components/admin/layout/AdminContent';
import { cn } from '@/components/ui/utils';

const STATUS_TABS = [
  { value: '', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'accepted', label: 'Accepted' },
  { value: 'ignored', label: 'Ignored' },
] as const;

interface AdminReviewReportsSearchProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  status: string;
  onStatusChange: (value: string) => void;
}

export function AdminReviewReportsSearch({
  searchQuery,
  onSearchChange,
  status,
  onStatusChange,
}: AdminReviewReportsSearchProps) {
  return (
    <AdminSearchPanel>
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <AdminSearchInput
          value={searchQuery}
          onChange={onSearchChange}
          placeholder="Search by reviewer, reporter, or title…"
        />

        <div
          role="tablist"
          aria-label="Report status"
          className="inline-flex h-10 w-full shrink-0 rounded-lg border border-slate-200 bg-slate-50 p-1 lg:w-auto"
        >
          {STATUS_TABS.map((tab) => {
            const isActive = status === tab.value;
            return (
              <button
                key={tab.value || 'all'}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => onStatusChange(tab.value)}
                className={cn(
                  'flex-1 rounded-md px-4 text-sm font-medium transition-colors lg:flex-none',
                  isActive
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800',
                )}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>
    </AdminSearchPanel>
  );
}
