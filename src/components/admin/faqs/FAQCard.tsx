'use client';
import { useState } from 'react';
import { ChevronDown, ChevronUp, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@heroui/react';
import type { IAllFaqsDataEntity } from '@/types/faqs';
import { FAQForm, type FAQFormValues } from './FAQForm';

interface FAQCardProps {
  faq: IAllFaqsDataEntity;
  isEditing: boolean;
  isUpdating: boolean;
  onEdit: () => void;
  onCancelEdit: () => void;
  onUpdate: (values: FAQFormValues) => Promise<void>;
  onDelete: () => void;
}

export function FAQCard({
  faq,
  isEditing,
  isUpdating,
  onEdit,
  onCancelEdit,
  onUpdate,
  onDelete,
}: FAQCardProps) {
  const [expanded, setExpanded] = useState(false);

  if (isEditing) {
    return (
      <FAQForm
        initial={faq}
        isLoading={isUpdating}
        onSubmit={onUpdate}
        onCancel={onCancelEdit}
      />
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      <button
        className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left hover:bg-gray-50 transition-colors"
        onClick={() => setExpanded((prev) => !prev)}
      >
        <span className="font-medium text-gray-900 text-sm">{faq.question}</span>
        {expanded ? (
          <ChevronUp className="h-4 w-4 text-gray-400 shrink-0" />
        ) : (
          <ChevronDown className="h-4 w-4 text-gray-400 shrink-0" />
        )}
      </button>

      {expanded && (
        <div className="px-5 pb-4 space-y-3 border-t border-gray-100">
          <p className="text-sm text-gray-600 leading-relaxed pt-3">{faq.answer}</p>
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
      )}
    </div>
  );
}
