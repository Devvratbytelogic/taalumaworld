import { Search } from 'lucide-react';
import { Input } from '../../ui/input';

interface AdminPaymentsSearchProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export function AdminPaymentsSearch({
  searchQuery,
  onSearchChange,
}: AdminPaymentsSearchProps) {
  return (
    <div className="admin-surface p-5">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search payments by user, item, or transaction ID..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
    </div>
  );
}
