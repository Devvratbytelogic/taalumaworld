import { Search, X } from 'lucide-react';
import { Input } from '../../ui/input';

interface FilterOption {
  id: string;
  name: string;
}

interface AdminBooksSearchProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  categories: FilterOption[];
  leaders: FilterOption[];
  selectedCategory: string;
  selectedLeader: string;
  onCategoryChange: (value: string) => void;
  onLeaderChange: (value: string) => void;
}

export function AdminBooksSearch({
  searchQuery,
  onSearchChange,
  categories,
  leaders,
  selectedCategory,
  selectedLeader,
  onCategoryChange,
  onLeaderChange,
}: AdminBooksSearchProps) {
  const hasActiveFilters = selectedCategory || selectedLeader;

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm space-y-4">
      <div className="flex flex-col md:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search series by title or description..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Category filter */}
        <select
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="h-10 rounded-xl border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 min-w-44"
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

        {/* Thought Leader filter */}
        <select
          value={selectedLeader}
          onChange={(e) => onLeaderChange(e.target.value)}
          className="h-10 rounded-xl border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 min-w-48"
        >
          <option value="">All Mentors</option>
          {leaders.map((l) => (
            <option key={l.id} value={l.id}>{l.name}</option>
          ))}
        </select>

        {/* Clear filters */}
        {hasActiveFilters && (
          <button
            onClick={() => { onCategoryChange(''); onLeaderChange(''); }}
            className="inline-flex items-center gap-1.5 px-3 h-10 rounded-xl border border-red-200 text-red-600 text-sm hover:bg-red-50 transition-colors whitespace-nowrap"
          >
            <X className="h-3.5 w-3.5" />
            Clear filters
          </button>
        )}
      </div>

      {/* Active filter pills */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {selectedCategory && (
            <span className="inline-flex items-center gap-1.5 bg-primary/10 text-primary text-xs font-medium px-3 py-1 rounded-full">
              {categories.find((c) => c.id === selectedCategory)?.name}
              <button onClick={() => onCategoryChange('')} className="hover:text-primary/70">
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          {selectedLeader && (
            <span className="inline-flex items-center gap-1.5 bg-primary/10 text-primary text-xs font-medium px-3 py-1 rounded-full">
              {leaders.find((l) => l.id === selectedLeader)?.name}
              <button onClick={() => onLeaderChange('')} className="hover:text-primary/70">
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
}
