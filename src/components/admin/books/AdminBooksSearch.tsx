import { X } from 'lucide-react';
import ReactSelect from 'react-select';
import {
  AdminSearchInput,
  AdminSearchPanel,
  adminFilterPillClass,
} from '@/components/admin/layout/AdminContent';
import { Checkbox } from '@/components/ui/checkbox';
import { filterSelectStyles, type FilterOption } from '@/constants/filterSelectStyle';

interface AdminBooksSearchProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  leaders: FilterOption[];
  selectedLeader: string;
  onLeaderChange: (value: string) => void;
  selectedStatus: string;
  onStatusChange: (value: string) => void;
  selectedIsDeleted: string;
  onIsDeletedChange: (value: string) => void;
  isMine: boolean;
  onIsMineChange: (value: boolean) => void;
}

const STATUS_OPTIONS: FilterOption[] = [
  { value: 'Published', label: 'Published' },
  { value: 'Draft', label: 'Draft' },
];

const IS_DELETED_OPTIONS: FilterOption[] = [
  { value: 'false', label: 'Active only' },
  { value: 'true', label: 'Deleted only' },
];

export function AdminBooksSearch({
  searchQuery,
  onSearchChange,
  leaders,
  selectedLeader,
  onLeaderChange,
  selectedStatus,
  onStatusChange,
  selectedIsDeleted,
  onIsDeletedChange,
  isMine,
  onIsMineChange,
}: AdminBooksSearchProps) {
  const hasActiveFilters = Boolean(
    selectedLeader || selectedStatus || selectedIsDeleted || isMine
  );

  const menuPortalTarget = typeof document !== 'undefined' ? document.body : null;

  const clearAll = () => {
    onLeaderChange('');
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
          placeholder="Search series by title or description..."
        />

        <div className="flex flex-wrap items-center gap-2 lg:shrink-0">
          <ReactSelect<FilterOption, false>
            inputId="books-filter-mentor"
            classNamePrefix="react-select"
            options={leaders}
            value={leaders.find((l) => l.value === selectedLeader) ?? null}
            onChange={(option) => onLeaderChange(option?.value ?? '')}
            placeholder="All mentors"
            isClearable
            isSearchable
            menuPortalTarget={menuPortalTarget}
            menuPosition="fixed"
            styles={filterSelectStyles}
          />

          <ReactSelect<FilterOption, false>
            inputId="books-filter-status"
            classNamePrefix="react-select"
            options={STATUS_OPTIONS}
            value={STATUS_OPTIONS.find((s) => s.value === selectedStatus) ?? null}
            onChange={(option) => onStatusChange(option?.value ?? '')}
            placeholder="All statuses"
            isClearable
            isSearchable={false}
            menuPortalTarget={menuPortalTarget}
            menuPosition="fixed"
            styles={filterSelectStyles}
          />

          <ReactSelect<FilterOption, false>
            inputId="books-filter-deleted"
            classNamePrefix="react-select"
            options={IS_DELETED_OPTIONS}
            value={IS_DELETED_OPTIONS.find((o) => o.value === selectedIsDeleted) ?? null}
            onChange={(option) => onIsDeletedChange(option?.value ?? '')}
            placeholder="All series"
            isClearable
            isSearchable={false}
            menuPortalTarget={menuPortalTarget}
            menuPosition="fixed"
            styles={filterSelectStyles}
          />

          <button
            type="button"
            onClick={() => onIsMineChange(!isMine)}
            className="flex h-9 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 transition-colors hover:bg-slate-50"
          >
            <Checkbox checked={isMine} tabIndex={-1} className="pointer-events-none" />
            <span className="font-normal">My series</span>
          </button>

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
          {selectedLeader ? (
            <span className={adminFilterPillClass}>
              {leaders.find((l) => l.value === selectedLeader)?.label}
              <button type="button" onClick={() => onLeaderChange('')} className="hover:text-primary/70">
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
              My series
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
