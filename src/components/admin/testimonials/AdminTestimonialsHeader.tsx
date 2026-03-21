import { Plus } from 'lucide-react';
import Button from '../../ui/Button';

interface AdminTestimonialsHeaderProps {
  totalCount: number;
  onAddTestimonial: () => void;
}

export function AdminTestimonialsHeader({ totalCount, onAddTestimonial }: AdminTestimonialsHeaderProps) {
  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Testimonials Management</h1>
          <p className="text-muted-foreground">
            {totalCount} testimonial{totalCount !== 1 ? 's' : ''} total
          </p>
        </div>
        <Button onPress={onAddTestimonial} className="global_btn rounded_full bg_primary">
          <Plus className="h-4 w-4" />
          Add Testimonial
        </Button>
      </div>
    </div>
  );
}
