import { Search } from 'lucide-react';
import { Input } from '../../ui/input';

interface AdminTransactionsSearchProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export function AdminTransactionsSearch({
  searchQuery,
  onSearchChange,
}: AdminTransactionsSearchProps) {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by transaction ID, user, or item..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
    </div>
  );
}
