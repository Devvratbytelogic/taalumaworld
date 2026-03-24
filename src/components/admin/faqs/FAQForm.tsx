'use client';
import { useState } from 'react';
import { Button } from '@heroui/react';
import type { IAllFaqsDataEntity, FAQType } from '@/types/faqs';

export interface FAQFormValues {
  question: string;
  answer: string;
  type: FAQType;
}

interface FAQFormProps {
  initial?: Partial<IAllFaqsDataEntity>;
  onSubmit: (values: FAQFormValues) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}

const FAQ_TYPE_OPTIONS: { value: FAQType; label: string }[] = [
  { value: 'reading', label: 'Reading' },
  { value: 'payment', label: 'Payment' },
  { value: 'account', label: 'Account' },
];

const inputCls =
  'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary';

export function FAQForm({ initial = {}, onSubmit, onCancel, isLoading }: FAQFormProps) {
  const [values, setValues] = useState<FAQFormValues>({
    question: initial.question ?? '',
    answer: initial.answer ?? '',
    type: initial.type ?? 'reading',
  });

  const handleSubmit = async () => {
    if (!values.question.trim() || !values.answer.trim()) return;
    await onSubmit(values);
  };

  const isDisabled = !values.question.trim() || !values.answer.trim();

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
      <div className="flex gap-4">
        <div className="flex-1">
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
        <div className="w-40 shrink-0">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Type <span className="text-red-500">*</span>
          </label>
          <select
            className={inputCls}
            value={values.type}
            onChange={(e) => setValues((p) => ({ ...p, type: e.target.value as FAQType }))}
          >
            {FAQ_TYPE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
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
