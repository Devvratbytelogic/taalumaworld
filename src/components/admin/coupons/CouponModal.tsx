'use client';

import { useEffect, useMemo } from 'react';
import { useFormik } from 'formik';
import ReactSelect, { type StylesConfig } from 'react-select';
import { Save, X } from 'lucide-react';
import Button from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { SELECT_STYLES, type SelectOption } from '@/constants/selectStyle';
import { COUPON_SCOPE_LABELS, COUPON_SCOPES, COUPON_TYPE_LABELS, COUPON_TYPES } from '@/constants/coupon';
import { couponSchema } from '@/utils/formValidation';
import { useGetAllBooksQuery, useGetBlueprintsByBookIdsQuery } from '@/store/rtkQueries/adminGetApi';
import { useAddCouponMutation, useUpdateCouponMutation } from '@/store/rtkQueries/couponApis';
import toast from '@/utils/toast';
import type { IAdminCouponEntity } from '@/types/coupon';

const MULTI_SELECT_STYLES: StylesConfig<SelectOption, true> = {
  ...(SELECT_STYLES as unknown as StylesConfig<SelectOption, true>),
  multiValue: (base) => ({
    ...base,
    borderRadius: 'var(--radius-sm)',
    backgroundColor: 'color-mix(in srgb, var(--primary) 10%, transparent)',
  }),
  multiValueLabel: (base) => ({
    ...base,
    color: 'var(--primary)',
  }),
};

function toIdArray(items?: (string | { _id: string })[] | null): string[] {
  if (!items) return [];
  return items.map((item) => (typeof item === 'string' ? item : item._id)).filter(Boolean);
}

interface CouponModalProps {
  open: boolean;
  coupon?: IAdminCouponEntity | null;
  onOpenChange: (open: boolean) => void;
}

export function CouponModal({ open, coupon, onOpenChange }: CouponModalProps) {
  const isEditing = !!coupon;

  const [addCoupon] = useAddCouponMutation();
  const [updateCoupon] = useUpdateCouponMutation();

  const { values, errors, touched, isSubmitting, handleChange, handleBlur, handleSubmit, setFieldValue, setFieldTouched, resetForm, } = useFormik({
    initialValues: {
      coupon_code: coupon?.coupon_code ?? '',
      coupon_type: coupon?.coupon_type ?? 'Percentage',
      coupon_for: coupon?.coupon_for ?? 'normal',
      institutions: toIdArray(coupon?.institutions ?? []),
      books: toIdArray(coupon?.series ?? []),
      chapters: toIdArray(coupon?.blueprints ?? []),
      value: coupon?.value ?? '',
      expiry_date: coupon?.expiry_date?.substring(0, 10) ?? '',
      minimum_cart_value: coupon?.minimum_cart_value ?? 0,
      usage_limit: coupon?.usage_limit ?? 0,
      status: coupon?.status ?? 'active',
    },
    validationSchema: couponSchema,
    enableReinitialize: true,
    onSubmit: async (formValues) => {
      const id = coupon?._id;
      const isUniversityScope = formValues.coupon_for === 'university';
      const payload = isUniversityScope
        ? {
            ...formValues,
            coupon_type: 'Percentage',
            expiry_date: '',
            minimum_cart_value: 0,
            usage_limit: 0,
            institutions: [],
            books: [],
            chapters: [],
          }
        : formValues;
      try {
        const res = id
          ? await updateCoupon({ id, values: payload }).unwrap()
          : await addCoupon(payload).unwrap();
        if (res?.http_status_code === 200 || res?.http_status_code === 201) {
          toast.success(res.message ?? (id ? 'Coupon updated successfully' : 'Coupon created successfully'));
          resetForm();
          onOpenChange(false);
        }
      } catch (error) {
        console.error('Error saving coupon', error);
      }
    },
  });

  const isUniversity = values.coupon_for === 'university';
  const needsBooksAndChapters = values.coupon_for === 'event' || values.coupon_for === 'campaign';

  const bookIds = values.books.join(',');

  const { data: booksRes } = useGetAllBooksQuery(undefined, { skip: !open || !needsBooksAndChapters });
  const { data: blueprintsRes } = useGetBlueprintsByBookIdsQuery(
    { bookids: bookIds },
    { skip: !open || !needsBooksAndChapters || !bookIds },
  );

  const bookOptions: SelectOption[] = useMemo(
    () => (booksRes?.data?.data ?? []).map((book) => ({ value: book._id, label: book.title })),
    [booksRes],
  );
  const chapterOptions: SelectOption[] = useMemo(
    () => (blueprintsRes?.data ?? []).map((blueprint) => ({ value: blueprint._id, label: blueprint.title })),
    [blueprintsRes],
  );

  useEffect(() => {
    if (!needsBooksAndChapters || values.chapters.length === 0) return;
    const validIds = new Set(chapterOptions.map((option) => option.value));
    const filtered = values.chapters.filter((id) => validIds.has(id));
    if (filtered.length !== values.chapters.length) setFieldValue('chapters', filtered);
  }, [bookIds]);

  useEffect(() => {
    if (!isUniversity) return;
    if (values.coupon_type !== 'Percentage') setFieldValue('coupon_type', 'Percentage');
    if (values.institutions.length > 0) setFieldValue('institutions', []);
  }, [isUniversity, values.coupon_type, values.institutions.length, setFieldValue]);

  const closeModal = () => {
    resetForm();
    onOpenChange(false);
  };

  const isFree = values.coupon_type === 'Free';
  const isPercentage = values.coupon_type === 'Percentage';

  const showApplicability = needsBooksAndChapters;

  const handleScopeChange = (nextScope: string) => {
    setFieldValue('coupon_for', nextScope);
    setFieldValue('institutions', []);
    if (nextScope === 'university') {
      setFieldValue('coupon_type', 'Percentage');
      setFieldValue('expiry_date', '');
      setFieldValue('minimum_cart_value', 0);
      setFieldValue('usage_limit', 0);
    }
    if (nextScope !== 'event' && nextScope !== 'campaign') {
      setFieldValue('books', []);
      setFieldValue('chapters', []);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="admin_panel flex max-h-[90vh] flex-col gap-0 overflow-hidden p-0 sm:max-w-2xl">
        <DialogHeader className="shrink-0 border-b border-slate-100 px-6 pb-4 pt-6 pr-12">
          <DialogTitle>{isEditing ? 'Edit Coupon' : 'Add Coupon'}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Update this coupon’s discount value, scope, and validity.'
              : 'Create a new discount coupon for events, campaigns, universities, or general use.'}
          </DialogDescription>
        </DialogHeader>

        <form noValidate onSubmit={handleSubmit} className="admin_panel flex min-h-0 flex-1 flex-col">
          <div className="custom_scrollbar flex-1 space-y-5 overflow-y-auto p-6!">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="coupon_code">
                  Coupon Code <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="coupon_code"
                  name="coupon_code"
                  value={values.coupon_code}
                  onChange={(e) => setFieldValue('coupon_code', e.target.value.toUpperCase())}
                  onBlur={handleBlur}
                  disabled={isSubmitting}
                  placeholder="e.g. CAREERDAY2026"
                  className={touched.coupon_code && errors.coupon_code ? 'border-red-500' : ''}
                />
                {touched.coupon_code && errors.coupon_code ? (
                  <p className="text-sm text-red-600">{errors.coupon_code}</p>
                ) : null}
              </div>

              <div className="space-y-2">
                <Label htmlFor="coupon_for">
                  Scope <span className="text-red-500">*</span>
                </Label>
                <select
                  id="coupon_for"
                  name="coupon_for"
                  value={values.coupon_for}
                  onChange={(e) => handleScopeChange(e.target.value)}
                  onBlur={handleBlur}
                  disabled={isSubmitting}
                  className="admin-form-trigger w-full"
                >
                  {COUPON_SCOPES.map((scope) => (
                    <option key={scope} value={scope}>
                      {COUPON_SCOPE_LABELS[scope as keyof typeof COUPON_SCOPE_LABELS]}
                    </option>
                  ))}
                </select>
                {touched.coupon_for && errors.coupon_for ? (
                  <p className="text-sm text-red-600">{errors.coupon_for}</p>
                ) : null}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="coupon_type">
                  Coupon Type <span className="text-red-500">*</span>
                </Label>
                <select
                  id="coupon_type"
                  name="coupon_type"
                  value={values.coupon_type}
                  onChange={(e) => {
                    const nextType = e.target.value;
                    setFieldValue('coupon_type', nextType);
                    if (nextType === 'Free') setFieldValue('value', 0);
                  }}
                  onBlur={handleBlur}
                  disabled={isSubmitting || isUniversity}
                  className="admin-form-trigger w-full"
                >
                  {COUPON_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {COUPON_TYPE_LABELS[type as keyof typeof COUPON_TYPE_LABELS]}
                    </option>
                  ))}
                </select>
                {touched.coupon_type && errors.coupon_type ? (
                  <p className="text-sm text-red-600">{errors.coupon_type}</p>
                ) : null}
              </div>

              <div className="space-y-2">
                <Label htmlFor="value">
                  {isPercentage ? 'Discount Value (%)' : 'Discount Value (KES)'}
                  {!isFree ? <span className="text-red-500"> *</span> : null}
                </Label>
                <Input
                  id="value"
                  name="value"
                  type="number"
                  min={0}
                  max={isPercentage ? 100 : undefined}
                  value={values.value}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={isSubmitting || isFree}
                  placeholder={isPercentage ? 'e.g. 20' : 'e.g. 500'}
                  className={touched.value && errors.value ? 'border-red-500' : ''}
                />
                {touched.value && errors.value ? <p className="text-sm text-red-600">{errors.value}</p> : null}
              </div>
            </div>

            {!isUniversity ? (
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="expiry_date">
                    Expiry Date <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="expiry_date"
                    name="expiry_date"
                    type="date"
                    value={values.expiry_date}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    disabled={isSubmitting}
                    min={new Date().toISOString().substring(0, 10)}
                    className={touched.expiry_date && errors.expiry_date ? 'border-red-500' : ''}
                  />
                  {touched.expiry_date && errors.expiry_date ? (
                    <p className="text-sm text-red-600">{errors.expiry_date}</p>
                  ) : null}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">
                    Status <span className="text-red-500">*</span>
                  </Label>
                  <select
                    id="status"
                    name="status"
                    value={values.status}
                    onChange={(e) => setFieldValue('status', e.target.value)}
                    onBlur={handleBlur}
                    disabled={isSubmitting}
                    className="admin-form-trigger w-full"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                  {touched.status && errors.status ? <p className="text-sm text-red-600">{errors.status}</p> : null}
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="status">
                  Status <span className="text-red-500">*</span>
                </Label>
                <select
                  id="status"
                  name="status"
                  value={values.status}
                  onChange={(e) => setFieldValue('status', e.target.value)}
                  onBlur={handleBlur}
                  disabled={isSubmitting}
                  className="admin-form-trigger w-full"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
                {touched.status && errors.status ? <p className="text-sm text-red-600">{errors.status}</p> : null}
              </div>
            )}

            {!isUniversity ? (
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="minimum_cart_value">Minimum Cart Value (KES)</Label>
                  <Input
                    id="minimum_cart_value"
                    name="minimum_cart_value"
                    type="number"
                    min={0}
                    value={values.minimum_cart_value}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    disabled={isSubmitting}
                    placeholder="0"
                    className={touched.minimum_cart_value && errors.minimum_cart_value ? 'border-red-500' : ''}
                  />
                  {touched.minimum_cart_value && errors.minimum_cart_value ? (
                    <p className="text-sm text-red-600">{errors.minimum_cart_value}</p>
                  ) : null}
                  <p className="text-xs text-slate-500">Minimum order total for this coupon to apply.</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="usage_limit">Usage Limit</Label>
                  <Input
                    id="usage_limit"
                    name="usage_limit"
                    type="number"
                    min={0}
                    value={values.usage_limit}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    disabled={isSubmitting}
                    placeholder="e.g. 500"
                    className={touched.usage_limit && errors.usage_limit ? 'border-red-500' : ''}
                  />
                  {touched.usage_limit && errors.usage_limit ? (
                    <p className="text-sm text-red-600">{errors.usage_limit}</p>
                  ) : null}
                  <p className="text-xs text-slate-500">Total number of times this coupon can be redeemed. 0 = unlimited.</p>
                </div>
              </div>
            ) : null}

            {showApplicability ? (
              <div className="space-y-3 rounded-lg border border-slate-100 bg-slate-50/60 p-4">
                <div>
                  <Label>Applicability (optional)</Label>
                  <p className="text-xs text-slate-500">
                    Restrict this coupon to specific series or blueprints. Leave empty to apply to all.
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="books" className="text-xs text-slate-500">
                      Series
                    </Label>
                    <ReactSelect
                      inputId="books"
                      name="books"
                      isMulti
                      classNamePrefix="react-select"
                      options={bookOptions}
                      value={bookOptions.filter((option) => values.books.includes(option.value))}
                      onChange={(selected) => setFieldValue('books', selected.map((option) => option.value))}
                      onBlur={() => setFieldTouched('books', true)}
                      placeholder="All series"
                      isDisabled={isSubmitting}
                      menuPortalTarget={typeof document !== 'undefined' ? document.body : null}
                      menuPosition="fixed"
                      styles={MULTI_SELECT_STYLES}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="chapters" className="text-xs text-slate-500">
                      Blueprints
                    </Label>
                    <ReactSelect
                      inputId="chapters"
                      name="chapters"
                      isMulti
                      classNamePrefix="react-select"
                      options={chapterOptions}
                      value={chapterOptions.filter((option) => values.chapters.includes(option.value))}
                      onChange={(selected) => setFieldValue('chapters', selected.map((option) => option.value))}
                      onBlur={() => setFieldTouched('chapters', true)}
                      placeholder={values.books.length ? 'All blueprints in selected series' : 'Select series first'}
                      isDisabled={isSubmitting || values.books.length === 0}
                      menuPortalTarget={typeof document !== 'undefined' ? document.body : null}
                      menuPosition="fixed"
                      styles={MULTI_SELECT_STYLES}
                    />
                  </div>
                </div>
              </div>
            ) : null}
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
              {isEditing ? 'Save changes' : 'Create coupon'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
