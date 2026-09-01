'use client';

import { useEffect } from 'react';
import { useFormik } from 'formik';
import { Plus, Save, Trash2, X } from 'lucide-react';
import Button from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { AgreementLinkedText } from '@/components/ui/AgreementLinkedText';
import { agreementSentenceSchema } from '@/utils/formValidation';
import { AGREEMENT_STATUS_OPTIONS, AGREEMENT_TOUCHPOINT_OPTIONS } from '@/constants/agreements';
import type { IAgreementSentenceEntity, IAgreementSentenceLink } from '@/types/agreements';

export type SentenceFormValues = {
  text: string;
  touchpoint: string;
  is_required: boolean;
  sort_order: number;
  status: 'active' | 'inactive';
  links: { phrase: string; agreementType: string }[];
};

const emptyLink = { phrase: '', agreementType: '' };

const emptyValues: SentenceFormValues = {
  text: '',
  touchpoint: '',
  is_required: true,
  sort_order: 0,
  status: 'active',
  links: [{ ...emptyLink }],
};

function getLinkAgreementTypeId(link: IAgreementSentenceLink): string {
  if (typeof link.agreementType === 'string') return link.agreementType;
  return link.agreementType?._id ?? link.agreement_type_id ?? link.agreement?.agreement_type?._id ?? '';
}

function toFormLinks(sentence?: IAgreementSentenceEntity | null) {
  const links = (sentence?.links ?? []).map((link) => ({
    phrase: link.phrase ?? '',
    agreementType: getLinkAgreementTypeId(link),
  }));
  return links.length > 0 ? links : [{ ...emptyLink }];
}

interface SentenceModalProps {
  open: boolean;
  sentence?: IAgreementSentenceEntity | null;
  agreementTypeOptions: { value: string; label: string }[];
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: SentenceFormValues, id?: string) => Promise<void>;
}

export function SentenceModal({ open, sentence, agreementTypeOptions, onOpenChange, onSubmit }: SentenceModalProps) {
  const isEditing = !!sentence;

  const { values, errors, touched, isSubmitting, handleChange, handleBlur, handleSubmit, setFieldValue, resetForm } = useFormik({
    initialValues: emptyValues,
    validationSchema: agreementSentenceSchema,
    enableReinitialize: true,
    onSubmit: async (formValues) => {
      await onSubmit(formValues, sentence?._id);
    },
  });

  useEffect(() => {
    if (!open) return;
    resetForm({
      values: sentence
        ? {
            text: sentence.text,
            touchpoint: sentence.touchpoint,
            is_required: sentence.is_required ?? true,
            sort_order: sentence.sort_order ?? 0,
            status: (sentence.status as 'active' | 'inactive') ?? 'active',
            links: toFormLinks(sentence),
          }
        : emptyValues,
    });
  }, [open, sentence, resetForm]);

  const closeModal = () => {
    resetForm({ values: emptyValues });
    onOpenChange(false);
  };

  const previewLinks = values.links
    .filter((link) => link.phrase && values.text.includes(link.phrase))
    .map((link) => ({ phrase: link.phrase }));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="admin_panel flex max-h-[90vh] flex-col gap-0 overflow-hidden p-0 sm:max-w-2xl">
        <DialogHeader className="shrink-0 border-b border-slate-100 px-6 pb-4 pt-6 pr-12">
          <DialogTitle>{isEditing ? 'Edit sentence' : 'Add sentence'}</DialogTitle>
          <DialogDescription>
            Write the checkbox line and mark which words open which legal document.
          </DialogDescription>
        </DialogHeader>

        <form noValidate onSubmit={handleSubmit} className="admin_panel flex min-h-0 flex-1 flex-col">
            <div className="custom_scrollbar flex-1 space-y-5 overflow-y-auto p-6!">
              <div className="space-y-2">
                <Label htmlFor="sentence-text">
                  Sentence text<span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="sentence-text"
                  name="text"
                  rows={3}
                  placeholder="e.g., I agree to the Terms of Service"
                  value={values.text}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={isSubmitting}
                  className={errors.text && touched.text ? 'border-red-500' : ''}
                />
                {errors.text && touched.text ? <p className="text-sm text-red-600">{errors.text}</p> : null}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="sentence-touchpoint">
                    Touchpoint<span className="text-red-500">*</span>
                  </Label>
                  <select
                    id="sentence-touchpoint"
                    name="touchpoint"
                    value={values.touchpoint}
                    onChange={(e) => setFieldValue('touchpoint', e.target.value)}
                    onBlur={handleBlur}
                    disabled={isSubmitting}
                    className="admin-form-trigger w-full"
                  >
                    <option value="">Select touchpoint</option>
                    {AGREEMENT_TOUCHPOINT_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  {errors.touchpoint && touched.touchpoint ? (
                    <p className="text-sm text-red-600">{errors.touchpoint}</p>
                  ) : null}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sentence-sort">Sort order</Label>
                  <Input
                    id="sentence-sort"
                    name="sort_order"
                    type="number"
                    min={0}
                    value={values.sort_order}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              {isEditing ? (
                <div className="space-y-2">
                  <Label htmlFor="sentence-status">
                    Status<span className="text-red-500">*</span>
                  </Label>
                  <select
                    id="sentence-status"
                    name="status"
                    value={values.status}
                    onChange={(e) => setFieldValue('status', e.target.value as 'active' | 'inactive')}
                    onBlur={handleBlur}
                    disabled={isSubmitting}
                    className="admin-form-trigger w-full"
                  >
                    {AGREEMENT_STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>
                        {s.charAt(0).toUpperCase() + s.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              ) : null}

              <label className="flex items-center gap-2 text-sm text-slate-700">
                <Checkbox
                  checked={values.is_required}
                  onCheckedChange={(checked) => setFieldValue('is_required', !!checked)}
                  disabled={isSubmitting}
                />
                Required — user must check this sentence to proceed
              </label>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>
                    Linked phrases<span className="text-red-500">*</span>
                  </Label>
                  <Button
                    type="button"
                    className="global_btn rounded_full outline_primary"
                    startContent={<Plus className="h-4 w-4" />}
                    onPress={() => setFieldValue('links', [...values.links, { ...emptyLink }])}
                    isDisabled={isSubmitting}
                  >
                    Add phrase
                  </Button>
                </div>

                {values.links.map((link, index) => (
                  <div key={index} className="grid gap-3 rounded-lg border border-slate-200 p-3 sm:grid-cols-[1fr_1fr_auto]">
                    <div className="space-y-2">
                      <Label htmlFor={`sentence-phrase-${index}`}>Phrase</Label>
                      <Input
                        id={`sentence-phrase-${index}`}
                        name={`links.${index}.phrase`}
                        placeholder="e.g., Terms of Service"
                        value={link.phrase}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled={isSubmitting}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`sentence-type-${index}`}>Agreement type</Label>
                      <select
                        id={`sentence-type-${index}`}
                        name={`links.${index}.agreementType`}
                        value={link.agreementType}
                        onChange={(e) => setFieldValue(`links.${index}.agreementType`, e.target.value)}
                        onBlur={handleBlur}
                        disabled={isSubmitting}
                        className="admin-form-trigger w-full"
                      >
                        <option value="">Select type</option>
                        {agreementTypeOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="flex items-end">
                      <button
                        type="button"
                        className="delete_button"
                        title="Remove phrase"
                        disabled={isSubmitting || values.links.length === 1}
                        onClick={() => {
                          if (values.links.length === 1) return;
                          setFieldValue(
                            'links',
                            values.links.filter((_, linkIndex) => linkIndex !== index),
                          );
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
                {typeof errors.links === 'string' && touched.links ? (
                  <p className="text-sm text-red-600">{errors.links}</p>
                ) : null}
              </div>

              <div className="space-y-2 rounded-lg border border-slate-200 bg-slate-50/60 p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Live preview</p>
                <label className="flex items-start gap-3 text-sm text-slate-700">
                  <Checkbox checked disabled className="mt-0.5" />
                  <span>
                    {values.text ? (
                      <AgreementLinkedText text={values.text} links={previewLinks} />
                    ) : (
                      <span className="text-slate-400">Sentence preview will appear here</span>
                    )}
                    {values.is_required ? <span className="font-medium text-red-500"> *</span> : null}
                  </span>
                </label>
              </div>
            </div>

            <DialogFooter className="shrink-0 gap-3 border-t border-slate-100 px-6 py-4">
              <Button
                type="button"
                className="global_btn rounded_full outline_primary"
                onPress={closeModal}
                startContent={<X className="h-4 w-4" />}
                isDisabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="global_btn rounded_full bg_primary"
                startContent={<Save className="h-4 w-4" />}
                isDisabled={isSubmitting}
                isLoading={isSubmitting}
              >
                {isEditing ? 'Save changes' : 'Create sentence'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
    </Dialog>
  );
}
