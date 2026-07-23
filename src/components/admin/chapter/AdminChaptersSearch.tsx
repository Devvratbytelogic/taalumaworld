import { X } from 'lucide-react';
import {
  AdminSearchInput,
  AdminSearchPanel,
  adminFilterPillClass,
  adminSelectClass,
} from '@/components/admin/layout/AdminContent';
import { Checkbox } from '@/components/ui/checkbox';
import { BLUEPRINT_STATUSES } from '@/constants/blueprint';

interface BookOption {
  id: string;
  title: string;
}

interface AdminChaptersSearchProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  books: BookOption[];
  selectedBook: string;
  onBookChange: (value: string) => void;
  selectedStatus: string;
  onStatusChange: (value: string) => void;
  isMine: boolean;
  onIsMineChange: (value: boolean) => void;
  isContentFlagged: boolean;
  onContentFlaggedChange: (value: boolean) => void;
}

const STATUS_OPTIONS = BLUEPRINT_STATUSES;

export function AdminChaptersSearch({
  searchQuery,
  onSearchChange,
  books,
  selectedBook,
  onBookChange,
  selectedStatus,
  onStatusChange,
  isMine,
  onIsMineChange,
  isContentFlagged,
  onContentFlaggedChange,
}: AdminChaptersSearchProps) {
  const hasActiveFilters = selectedBook || selectedStatus || isMine || isContentFlagged;

  const clearAll = () => {
    onBookChange('');
    onStatusChange('');
    onIsMineChange(false);
    onContentFlaggedChange(false);
  };

  return (
    <AdminSearchPanel>
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <AdminSearchInput
          value={searchQuery}
          onChange={onSearchChange}
          placeholder="Search blueprints by title..."
        />

        <div className="flex flex-wrap items-center gap-2 lg:shrink-0">
          <select
            value={selectedBook}
            onChange={(e) => onBookChange(e.target.value)}
            className={adminSelectClass}
          >
            <option value="">All series</option>
            {books.map((b) => (
              <option key={b.id} value={b.id}>{b.title}</option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value)}
            className={adminSelectClass}
          >
            <option value="">All statuses</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          <div
            role="button"
            tabIndex={0}
            onClick={() => onIsMineChange(!isMine)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onIsMineChange(!isMine);
              }
            }}
            className="flex h-9 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 transition-colors hover:bg-slate-50 cursor-pointer"
          >
            <Checkbox checked={isMine} tabIndex={-1} className="pointer-events-none" />
            <span className="font-normal">My blueprints</span>
          </div>

          <div
            role="button"
            tabIndex={0}
            onClick={() => onContentFlaggedChange(!isContentFlagged)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onContentFlaggedChange(!isContentFlagged);
              }
            }}
            className="flex h-9 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 transition-colors hover:bg-slate-50 cursor-pointer"
          >
            <Checkbox checked={isContentFlagged} tabIndex={-1} className="pointer-events-none" />
            <span className="font-normal">Flagged content</span>
          </div>

          {hasActiveFilters ? (
            <button
              type="button"
              onClick={clearAll}
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
          {selectedBook ? (
            <span className={adminFilterPillClass}>
              {books.find((b) => b.id === selectedBook)?.title}
              <button type="button" onClick={() => onBookChange('')} className="hover:text-primary/70">
                <X className="h-3 w-3" />
              </button>
            </span>
          ) : null}
          {selectedStatus ? (
            <span className={adminFilterPillClass}>
              {selectedStatus}
              <button type="button" onClick={() => onStatusChange('')} className="hover:text-primary/70">
                <X className="h-3 w-3" />
              </button>
            </span>
          ) : null}
          {isMine ? (
            <span className={adminFilterPillClass}>
              My blueprints
              <button type="button" onClick={() => onIsMineChange(false)} className="hover:text-primary/70">
                <X className="h-3 w-3" />
              </button>
            </span>
          ) : null}
          {isContentFlagged ? (
            <span className={adminFilterPillClass}>
              Flagged content
              <button type="button" onClick={() => onContentFlaggedChange(false)} className="hover:text-primary/70">
                <X className="h-3 w-3" />
              </button>
            </span>
          ) : null}
        </div>
      ) : null}
    </AdminSearchPanel>
  );
}
