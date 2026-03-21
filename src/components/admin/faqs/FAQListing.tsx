import { HelpCircle } from 'lucide-react';
import type { IAllFaqsDataEntity } from '@/types/faqs';
import type { FAQFormValues } from './FAQForm';
import { FAQCard } from './FAQCard';

interface FAQListingProps {
  faqs: IAllFaqsDataEntity[];
  editingId: string | null;
  isUpdating: boolean;
  onEdit: (id: string) => void;
  onCancelEdit: () => void;
  onUpdate: (id: string, values: FAQFormValues) => Promise<void>;
  onDelete: (faq: IAllFaqsDataEntity) => void;
}

export function FAQListing({
  faqs,
  editingId,
  isUpdating,
  onEdit,
  onCancelEdit,
  onUpdate,
  onDelete,
}: FAQListingProps) {
  if (faqs.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400">
        <HelpCircle className="h-10 w-10 mx-auto mb-3 opacity-30" />
        <p className="text-sm">No FAQs found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {faqs.map((faq) => (
        <FAQCard
          key={faq._id}
          faq={faq}
          isEditing={editingId === faq._id}
          isUpdating={isUpdating}
          onEdit={() => onEdit(faq._id)}
          onCancelEdit={onCancelEdit}
          onUpdate={(values) => onUpdate(faq._id, values)}
          onDelete={() => onDelete(faq)}
        />
      ))}
    </div>
  );
}
