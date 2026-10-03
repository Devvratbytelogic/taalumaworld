import { X } from 'lucide-react';
import ReactSelect, { type StylesConfig } from 'react-select';
import {
  AdminSearchInput,
  AdminSearchPanel,
  adminFilterPillClass,
  adminSelectClass,
} from '@/components/admin/layout/AdminContent';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/components/ui/utils';
import { BLUEPRINT_STATUSES } from '@/constants/blueprint';
import { filterSelectStyles, type FilterOption } from '@/constants/filterSelectStyle';

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
  mentors: FilterOption[];
  selectedMentor: string;
  onMentorChange: (value: string) => void;
  /** Mentor picker is only for Super Administrators. */
  showMentorFilter?: boolean;
  selectedStatus: string;
  onStatusChange: (value: string) => void;
  isMine: boolean;
  onIsMineChange: (value: boolean) => void;
  isContentFlagged: boolean;
  onContentFlaggedChange: (value: boolean) => void;
  reviewBlueprint: boolean;
  onReviewBlueprintChange: (value: boolean) => void;
  /** "My books" filter is only relevant/visible for Super Administrators. */
  showMineFilter?: boolean;
}

const STATUS_OPTIONS = BLUEPRINT_STATUSES;

const filterSelectClass = cn(adminSelectClass, 'w-full min-w-0');

const mentorSelectStyles: StylesConfig<FilterOption, false> = {
  ...filterSelectStyles,
  container: (base, state) => ({
    ...(filterSelectStyles.container?.(base, state) ?? base),
    width: '100%',
    minWidth: 0,
  }),
};

const filterToggleClass =
  'flex h-9 w-full min-w-0 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 transition-colors hover:bg-slate-50 cursor-pointer sm:w-auto';

export function AdminChaptersSearch({
  searchQuery,
  onSearchChange,
  books,
  selectedBook,
  onBookChange,
  mentors,
  selectedMentor,
  onMentorChange,
  showMentorFilter = false,
  selectedStatus,
  onStatusChange,
  isMine,
  onIsMineChange,
  isContentFlagged,
  onContentFlaggedChange,
  reviewBlueprint,
  onReviewBlueprintChange,
  showMineFilter = false,
}: AdminChaptersSearchProps) {
  const hasActiveFilters = selectedBook || (showMentorFilter && selectedMentor) || selectedStatus || (showMineFilter && isMine) || isContentFlagged || reviewBlueprint;

  const menuPortalTarget = typeof document !== 'undefined' ? document.body : null;

  const clearAll = () => {
    onBookChange('');
    onMentorChange('');
    onStatusChange('');
    onIsMineChange(false);
    onContentFlaggedChange(false);
    onReviewBlueprintChange(false);
  };

  return (
    <AdminSearchPanel className="p-3 sm:p-5">
      <div className="flex min-w-0 flex-col gap-3">
        <AdminSearchInput
          value={searchQuery}
          onChange={onSearchChange}
          placeholder="Search books by title..."
          className="w-full min-w-0 flex-none"
        />

        <div
          className={cn(
            'grid min-w-0 grid-cols-1 gap-2 sm:grid-cols-2',
            showMentorFilter ? 'md:grid-cols-3' : 'md:grid-cols-2',
            'sm:[&>*:last-child:nth-child(odd)]:col-span-2',
            showMentorFilter && 'md:[&>*:last-child:nth-child(odd)]:col-span-1',
          )}
        >
          <select
            value={selectedBook}
            onChange={(e) => onBookChange(e.target.value)}
            className={filterSelectClass}
          >
            <option value="">All series</option>
            {books.map((b) => (
              <option key={b.id} value={b.id}>{b.title}</option>
            ))}
          </select>

          {showMentorFilter ? (
            <ReactSelect<FilterOption, false>
              inputId="chapters-filter-mentor"
              classNamePrefix="react-select"
              options={mentors}
              value={mentors.find((mentor) => mentor.value === selectedMentor) ?? null}
              onChange={(option) => onMentorChange(option?.value ?? '')}
              placeholder="All mentors"
              isClearable
              isSearchable
              menuPortalTarget={menuPortalTarget}
              menuPosition="fixed"
              styles={mentorSelectStyles}
            />
          ) : null}

          <select
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value)}
            className={filterSelectClass}
          >
            <option value="">All statuses</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div className="flex min-w-0 flex-wrap items-center gap-2">
          {showMineFilter ? (
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
              className={filterToggleClass}
            >
              <Checkbox checked={isMine} tabIndex={-1} className="pointer-events-none" />
              <span className="font-normal">My books</span>
            </div>
          ) : null}

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
            className={filterToggleClass}
          >
            <Checkbox checked={isContentFlagged} tabIndex={-1} className="pointer-events-none" />
            <span className="font-normal">Flagged content</span>
          </div>

          <div
            role="button"
            tabIndex={0}
            onClick={() => onReviewBlueprintChange(!reviewBlueprint)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onReviewBlueprintChange(!reviewBlueprint);
              }
            }}
            className={filterToggleClass}
          >
            <Checkbox checked={reviewBlueprint} tabIndex={-1} className="pointer-events-none" />
            <span className="font-normal">Books to review</span>
          </div>

          {hasActiveFilters ? (
            <button
              type="button"
              onClick={clearAll}
              className="inline-flex h-9 w-full items-center justify-center gap-1.5 whitespace-nowrap rounded-lg border border-red-200! px-3 text-sm text-red-600 transition-colors hover:bg-red-50 sm:w-auto sm:justify-start"
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
          {showMentorFilter && selectedMentor ? (
            <span className={adminFilterPillClass}>
              {mentors.find((mentor) => mentor.value === selectedMentor)?.label}
              <button type="button" onClick={() => onMentorChange('')} className="hover:text-primary/70">
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
          {showMineFilter && isMine ? (
            <span className={adminFilterPillClass}>
              My books
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
          {reviewBlueprint ? (
            <span className={adminFilterPillClass}>
              Books to review
              <button type="button" onClick={() => onReviewBlueprintChange(false)} className="hover:text-primary/70">
                <X className="h-3 w-3" />
              </button>
            </span>
          ) : null}
        </div>
      ) : null}
    </AdminSearchPanel>
  );
}
