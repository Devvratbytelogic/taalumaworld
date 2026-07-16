'use client';

import { useEffect } from 'react';
import { useFormik } from 'formik';
import { Loader2, Save, X } from 'lucide-react';
import Button from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { RichTextEditor } from '@/components/editor/RichTextEditor';
import { agreementSchema } from '@/utils/formValidation';
import { AGREEMENT_STATUS_OPTIONS, AGREEMENT_TOUCHPOINT_OPTIONS, AGREEMENT_VISIBLE_USER_TYPE_OPTIONS } from '@/constants/agreements';
import { useGetAgreementByIdQuery } from '@/store/rtkQueries/agreementAPIs';

export type AgreementFormValues = {
  title: string;
  slug: string;
  text: string;
  content: string;
  agreementType: string;
  status: 'active' | 'inactive';
  visible_to: string[];
  touchpoints: string[];
  is_required: boolean;
  can_block: boolean;
};

const emptyValues: AgreementFormValues = {
  title: '',
  slug: '',
  text: '',
  content: '',
  agreementType: '',
  status: 'active',
  visible_to: [],
  touchpoints: [],
  is_required: true,
  can_block: false,
};

function toSlug(value: string) {
  return value.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

interface AgreementModalProps {
  open: boolean;
  agreementId?: string | null;
  agreementTypeOptions: { value: string; label: string }[];
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: AgreementFormValues, id?: string) => Promise<void>;
}

export function AgreementModal({ open, agreementId, agreementTypeOptions, onOpenChange, onSubmit }: AgreementModalProps) {
  const isEditing = !!agreementId;

  const { data: agreementResponse, isFetching } = useGetAgreementByIdQuery(agreementId!, {
    skip: !open || !agreementId,
  });
  const agreement = agreementResponse?.data;

  const { values, errors, touched, isSubmitting, handleChange, handleBlur, handleSubmit, setFieldValue, resetForm } = useFormik({
    initialValues: emptyValues,
    validationSchema: agreementSchema,
    enableReinitialize: true,
    onSubmit: async (formValues) => {
      await onSubmit(formValues, agreementId ?? undefined);
    },
  });

  useEffect(() => {
    if (!open) return;
    if (!agreementId) {
      resetForm({ values: emptyValues });
      return;
    }
    if (!agreement) return;
    resetForm({
      values: {
        title: agreement.title,
        slug: agreement.slug,
        text: agreement.text ?? '',
        content: agreement.content ?? '',
        agreementType: agreement.agreementType?._id ?? '',
        status: (agreement.status as 'active' | 'inactive') ?? 'active',
        visible_to: agreement.visible_to ?? [],
        touchpoints: agreement.touchpoints ?? [],
        is_required: agreement.is_required ?? true,
        can_block: agreement.can_block ?? false,
      },
    });
  }, [open, agreementId, agreement, resetForm]);

  const closeModal = () => {
    resetForm({ values: emptyValues });
    onOpenChange(false);
  };

  const toggleListValue = (field: 'visible_to' | 'touchpoints', value: string) => {
    const current = values[field];
    const next = current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
    setFieldValue(field, next);
  };

  const isLoadingDetails = isEditing && isFetching && !agreement;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="admin_panel flex max-h-[90vh] flex-col gap-0 overflow-hidden p-0 sm:max-w-2xl">
        <DialogHeader className="shrink-0 border-b border-slate-100 px-6 pb-4 pt-6 pr-12">
          <DialogTitle>{isEditing ? 'Edit agreement' : 'Add agreement'}</DialogTitle>
          <DialogDescription>
            Configure the agreement content, where it appears, and which user types must accept it.
          </DialogDescription>
        </DialogHeader>

        {isLoadingDetails ? (
          <div className="flex flex-1 items-center justify-center py-16">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : (
          <form noValidate onSubmit={handleSubmit} className="admin_panel flex min-h-0 flex-1 flex-col">
            <div className="custom_scrollbar flex-1 space-y-5 overflow-y-auto p-6!">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="agreement-title">
                    Title<span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="agreement-title"
                    name="title"
                    placeholder="e.g., Privacy Policy"
                    value={values.title}
                    onChange={(e) => {
                      handleChange(e);
                      if (!isEditing && (!values.slug || values.slug === toSlug(values.title))) {
                        setFieldValue('slug', toSlug(e.target.value));
                      }
                    }}
                    onBlur={handleBlur}
                    disabled={isSubmitting}
                    className={errors.title && touched.title ? 'border-red-500' : ''}
                  />
                  {errors.title && touched.title ? <p className="text-sm text-red-600">{errors.title}</p> : null}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="agreement-slug">
                    Slug<span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="agreement-slug"
                    name="slug"
                    placeholder="e.g., privacy-policy"
                    value={values.slug}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    disabled={isSubmitting}
                    className={errors.slug && touched.slug ? 'border-red-500' : ''}
                  />
                  {errors.slug && touched.slug ? <p className="text-sm text-red-600">{errors.slug}</p> : null}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="agreement-text">
                  Text<span className="text-red-500">*</span>
                </Label>
                <Input
                  id="agreement-text"
                  name="text"
                  placeholder="e.g., Short text for this agreement"
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
                  <Label htmlFor="agreement-type">
                    Agreement type<span className="text-red-500">*</span>
                  </Label>
                  <select
                    id="agreement-type"
                    name="agreementType"
                    value={values.agreementType}
                    onChange={(e) => setFieldValue('agreementType', e.target.value)}
                    onBlur={handleBlur}
                    disabled={isSubmitting}
                    className="admin-form-trigger w-full"
                  >
                    <option value="">Select agreement type</option>
                    {agreementTypeOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  {errors.agreementType && touched.agreementType ? (
                    <p className="text-sm text-red-600">{errors.agreementType}</p>
                  ) : null}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="agreement-status">
                    Status<span className="text-red-500">*</span>
                  </Label>
                  <select
                    id="agreement-status"
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
              </div>

              <div className="space-y-2">
                <Label>
                  Agreement content<span className="text-red-500">*</span>
                </Label>
                <RichTextEditor
                  value={values.content}
                  onChange={(md) => setFieldValue('content', md)}
                  placeholder="Write the full agreement text here..."
                  minHeight="220px"
                />
                {errors.content && touched.content ? <p className="text-sm text-red-600">{errors.content}</p> : null}
              </div>

              <div className="space-y-2">
                <Label>
                  Visible to<span className="text-red-500">*</span>
                </Label>
                <div className="flex flex-wrap gap-3">
                  {AGREEMENT_VISIBLE_USER_TYPE_OPTIONS.map((opt) => (
                    <label
                      key={opt.value}
                      className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 transition-colors hover:bg-slate-50"
                    >
                      <Checkbox
                        checked={values.visible_to.includes(opt.value)}
                        onCheckedChange={() => toggleListValue('visible_to', opt.value)}
                        disabled={isSubmitting}
                      />
                      {opt.label}
                    </label>
                  ))}
                </div>
                {errors.visible_to && touched.visible_to ? (
                  <p className="text-sm text-red-600">{errors.visible_to as string}</p>
                ) : null}
              </div>

              <div className="space-y-2">
                <Label>
                  Touchpoints<span className="text-red-500">*</span>
                </Label>
                <div className="grid gap-2 sm:grid-cols-2">
                  {AGREEMENT_TOUCHPOINT_OPTIONS.map((opt) => (
                    <label
                      key={opt.value}
                      className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 transition-colors hover:bg-slate-50"
                    >
                      <Checkbox
                        checked={values.touchpoints.includes(opt.value)}
                        onCheckedChange={() => toggleListValue('touchpoints', opt.value)}
                        disabled={isSubmitting}
                      />
                      {opt.label}
                    </label>
                  ))}
                </div>
                {errors.touchpoints && touched.touchpoints ? (
                  <p className="text-sm text-red-600">{errors.touchpoints as string}</p>
                ) : null}
              </div>

              <div className="flex flex-wrap gap-4">
                <label className="flex items-center gap-2 text-sm text-slate-700">
                  <Checkbox
                    checked={values.is_required}
                    onCheckedChange={(checked) => setFieldValue('is_required', !!checked)}
                    disabled={isSubmitting}
                  />
                  Required — user must accept to proceed
                </label>
                <label className="flex items-center gap-2 text-sm text-slate-700">
                  <Checkbox
                    checked={values.can_block}
                    onCheckedChange={(checked) => setFieldValue('can_block', !!checked)}
                    disabled={isSubmitting}
                  />
                  Can block — prevents the touchpoint action until accepted
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
                {isEditing ? 'Save changes' : 'Create agreement'}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
