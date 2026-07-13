import { X } from 'lucide-react';
import {
  AdminSearchInput,
  AdminSearchPanel,
  adminFilterPillClass,
  adminSelectClass,
} from '@/components/admin/layout/AdminContent';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

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
  selectedIsDeleted: string;
  onIsDeletedChange: (value: string) => void;
  isMine: boolean;
  onIsMineChange: (value: boolean) => void;
}

const STATUS_OPTIONS = ['Published', 'Draft'];

export function AdminChaptersSearch({
  searchQuery,
  onSearchChange,
  books,
  selectedBook,
  onBookChange,
  selectedStatus,
  onStatusChange,
  selectedIsDeleted,
  onIsDeletedChange,
  isMine,
  onIsMineChange,
}: AdminChaptersSearchProps) {
  const hasActiveFilters = selectedBook || selectedStatus || selectedIsDeleted || isMine;

  const clearAll = () => {
    onBookChange('');
    onStatusChange('');
    onIsDeletedChange('');
    onIsMineChange(false);
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

          <select
            value={selectedIsDeleted}
            onChange={(e) => onIsDeletedChange(e.target.value)}
            className={adminSelectClass}
          >
            <option value="">All blueprints</option>
            <option value="false">Active only</option>
            <option value="true">Deleted only</option>
          </select>

          <label className="flex h-9 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700">
            <Checkbox
              checked={isMine}
              onCheckedChange={(checked) => onIsMineChange(checked === true)}
            />
            <Label className="cursor-pointer font-normal">My blueprints</Label>
          </label>

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
          {selectedIsDeleted ? (
            <span className={adminFilterPillClass}>
              {selectedIsDeleted === 'true' ? 'Deleted only' : 'Active only'}
              <button type="button" onClick={() => onIsDeletedChange('')} className="hover:text-primary/70">
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
        </div>
      ) : null}
    </AdminSearchPanel>
  );
}
