'use client';
import { useState } from 'react';
import { Button } from '@heroui/react';
import type { IAllFaqsDataEntity } from '@/types/faqs';

export interface FAQFormValues {
  question: string;
  answer: string;
}

interface FAQFormProps {
  initial?: Partial<IAllFaqsDataEntity>;
  onSubmit: (values: FAQFormValues) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}

const inputCls =
  'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary';

export function FAQForm({ initial = {}, onSubmit, onCancel, isLoading }: FAQFormProps) {
  const [values, setValues] = useState<FAQFormValues>({
    question: initial.question ?? '',
    answer: initial.answer ?? '',
  });

  const handleSubmit = async () => {
    if (!values.question.trim() || !values.answer.trim()) return;
    await onSubmit(values);
  };

  const isDisabled = !values.question.trim() || !values.answer.trim();

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Question <span className="text-red-500">*</span>
        </label>
        <input
          className={inputCls}
          value={values.question}
          onChange={(e) => setValues((p) => ({ ...p, question: e.target.value }))}
          placeholder="Enter the question…"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Answer <span className="text-red-500">*</span>
        </label>
        <textarea
          rows={5}
          className={`${inputCls} resize-none`}
          value={values.answer}
          onChange={(e) => setValues((p) => ({ ...p, answer: e.target.value }))}
          placeholder="Enter the answer…"
        />
      </div>
      <div className="flex gap-3 justify-end">
        <Button variant="bordered" onPress={onCancel} size="sm" isDisabled={isLoading}>
          Cancel
        </Button>
        <Button
          color="primary"
          isLoading={isLoading}
          onPress={handleSubmit}
          size="sm"
          isDisabled={isDisabled}
        >
          Save
        </Button>
      </div>
    </div>
  );
}
