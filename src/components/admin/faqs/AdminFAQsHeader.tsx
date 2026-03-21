import { Plus } from 'lucide-react';
import Button from '../../ui/Button';

interface AdminFAQsHeaderProps {
  totalCount: number;
  onAddFAQ: () => void;
}

export function AdminFAQsHeader({ totalCount, onAddFAQ }: AdminFAQsHeaderProps) {
  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">FAQs Management</h1>
          <p className="text-muted-foreground">
            {totalCount} question{totalCount !== 1 ? 's' : ''} total
          </p>
        </div>
        <Button onPress={onAddFAQ} className="global_btn rounded_full bg_primary">
          <Plus className="h-4 w-4" />
          Add FAQ
        </Button>
      </div>
    </div>
  );
}
