import { Star } from 'lucide-react';
import type { ITestimonialsDataEntity } from '@/types/testimonial';
import { TestimonialCard } from './TestimonialCard';

interface TestimonialListingProps {
  testimonials: ITestimonialsDataEntity[];
  editingId: string | null;
  isUpdating: boolean;
  onEdit: (id: string) => void;
  onCancelEdit: () => void;
  onUpdate: (id: string, formData: FormData) => Promise<void>;
  onDelete: (testimonial: ITestimonialsDataEntity) => void;
}

export function TestimonialListing({
  testimonials,
  editingId,
  isUpdating,
  onEdit,
  onCancelEdit,
  onUpdate,
  onDelete,
}: TestimonialListingProps) {
  if (testimonials.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400">
        <Star className="h-10 w-10 mx-auto mb-3 opacity-30" />
        <p className="text-sm">No testimonials found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {testimonials.map((t) => (
        <TestimonialCard
          key={t._id}
          testimonial={t}
          isEditing={editingId === t._id}
          isUpdating={isUpdating}
          onEdit={() => onEdit(t._id)}
          onCancelEdit={onCancelEdit}
          onUpdate={(fd) => onUpdate(t._id, fd)}
          onDelete={() => onDelete(t)}
        />
      ))}
    </div>
  );
}
