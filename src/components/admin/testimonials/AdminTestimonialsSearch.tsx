import { Search } from 'lucide-react';
import { Input } from '../../ui/input';

interface AdminTestimonialsSearchProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export function AdminTestimonialsSearch({ searchQuery, onSearchChange }: AdminTestimonialsSearchProps) {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search testimonials by name, title, or message…"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
    </div>
  );
}
