'use client';
import { Pencil, Trash2, UserCircle } from 'lucide-react';
import { Button, Chip } from '@heroui/react';
import type { ITestimonialsDataEntity } from '@/types/testimonial';
import { TestimonialForm } from './TestimonialForm';
import { StarRating } from './StarRating';

interface TestimonialCardProps {
  testimonial: ITestimonialsDataEntity;
  isEditing: boolean;
  isUpdating: boolean;
  onEdit: () => void;
  onCancelEdit: () => void;
  onUpdate: (formData: FormData) => Promise<void>;
  onDelete: () => void;
}

export function TestimonialCard({
  testimonial: t,
  isEditing,
  isUpdating,
  onEdit,
  onCancelEdit,
  onUpdate,
  onDelete,
}: TestimonialCardProps) {
  if (isEditing) {
    return (
      <TestimonialForm
        initial={t}
        isLoading={isUpdating}
        onSubmit={onUpdate}
        onCancel={onCancelEdit}
      />
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full overflow-hidden bg-gray-100 border border-gray-200 shrink-0 flex items-center justify-center">
            {t.photo ? (
              <img src={t.photo} alt={t.name} className="w-full h-full object-cover" />
            ) : (
              <UserCircle className="h-7 w-7 text-gray-300" />
            )}
          </div>
          <div>
            <p className="font-semibold text-gray-900 text-sm leading-tight">{t.name}</p>
            <p className="text-sm text-gray-500">{t.title}</p>
          </div>
        </div>
        <Chip
          size="sm"
          color={
            t.status === 'Approved' ? 'success'
            : t.status === 'Rejected' ? 'danger'
            : 'warning'
          }
          variant="flat"
          className="shrink-0 capitalize"
        >
          {t.status}
        </Chip>
      </div>

      <StarRating rating={t.rating} />
      <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">{t.message}</p>

      <div className="flex gap-2 justify-end pt-1">
        <Button
          size="sm"
          variant="light"
          startContent={<Pencil className="h-3.5 w-3.5" />}
          onPress={onEdit}
        >
          Edit
        </Button>
        <Button
          size="sm"
          variant="light"
          color="danger"
          startContent={<Trash2 className="h-3.5 w-3.5" />}
          onPress={onDelete}
        >
          Delete
        </Button>
      </div>
    </div>
  );
}
