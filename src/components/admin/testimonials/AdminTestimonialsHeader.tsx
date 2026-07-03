import { Plus } from 'lucide-react';
import Button from '../../ui/Button';
import { AdminPageHeader } from '@/components/admin/layout/AdminContent';

interface AdminTestimonialsHeaderProps {
  totalCount: number;
  onAddTestimonial: () => void;
}

export function AdminTestimonialsHeader({ totalCount, onAddTestimonial }: AdminTestimonialsHeaderProps) {
  return (
    <AdminPageHeader
      title="Testimonials management"
      description={`${totalCount} testimonial${totalCount !== 1 ? 's' : ''} total`}
    >
      <Button onPress={onAddTestimonial} className="global_btn rounded_full bg_primary">
        <Plus className="h-4 w-4" />
        Add testimonial
      </Button>
    </AdminPageHeader>
  );
}
