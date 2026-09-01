'use client';

import { useMemo } from 'react';
import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import ReactSelect from 'react-select';
import { Save, X } from 'lucide-react';
import Button from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { closeModal } from '@/store/slices/allModalSlice';
import { RootState } from '@/store/store';
import {
  useAddInstitutionMutation,
  useUpdateInstitutionMutation,
} from '@/store/rtkQueries/institutionApi';
import { useGetAdminAllCouponsQuery } from '@/store/rtkQueries/couponApis';
import { SELECT_STYLES, type SelectOption } from '@/constants/selectStyle';
import type { IAllInstitutionsDataEntity } from '@/types/institution';
import toast from '@/utils/toast';
import { institutionSchema } from '@/utils/formValidation';
import { COUPON_SCOPE_LABELS } from '@/constants/coupon';

function getCouponId(coupon?: string | { _id: string } | null): string {
  if (!coupon) return '';
  return typeof coupon === 'string' ? coupon : coupon._id;
}

export function AddEditInstitutionModal() {
  const dispatch = useDispatch();
  const { isOpen, data } = useSelector((state: RootState) => state.allModal);
  const institution: IAllInstitutionsDataEntity | null = data?.institution ?? null;
  const isEdit = !!institution;

  const [addInstitution, { isLoading: isAdding }] = useAddInstitutionMutation();
  const [updateInstitution, { isLoading: isUpdating }] = useUpdateInstitutionMutation();
  const { data: couponsResponse, isLoading: isCouponsLoading } = useGetAdminAllCouponsQuery(
    { type: COUPON_SCOPE_LABELS?.university?.toLowerCase() },
    { skip: !isOpen },
  );

  const couponOptions: SelectOption[] = useMemo(
    () =>
      (couponsResponse?.data?.data ?? []).map((coupon) => ({
        value: coupon._id,
        label:
          coupon.coupon_type === 'Percentage'
            ? `${coupon.coupon_code} (${coupon.value}%)`
            : coupon.coupon_type === 'Free'
              ? `${coupon.coupon_code} (Free)`
              : `${coupon.coupon_code} (KES ${coupon.value})`,
      })),
    [couponsResponse],
  );

  const onClose = () => dispatch(closeModal());

  const { values, errors, touched, isSubmitting, handleChange, handleBlur, handleSubmit, setFieldValue, setFieldTouched } = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: institution?.name ?? '',
      contact_email: institution?.contact_email ?? '',
      domains: institution?.domains?.join(', ') ?? '',
      promo_start: institution?.promo_start?.substring(0, 10) ?? '',
      promo_end: institution?.promo_end?.substring(0, 10) ?? '',
      status: institution?.status ?? 'Active',
      books_pricing_type: institution?.books_pricing_type ?? 'Market Price',
      coupon: getCouponId(institution?.coupon),
    },
    validationSchema: institutionSchema,
    onSubmit: async (formValues) => {
      const payload = {
        name: formValues.name.trim(),
        domains: formValues.domains
          .split(',')
          .map((domain) => domain.trim())
          .filter(Boolean),
        promo_start: formValues.promo_start,
        promo_end: formValues.promo_end,
        status: formValues.status,
        contact_email: formValues.contact_email.trim(),
        books_pricing_type: formValues.books_pricing_type,
        coupon: formValues.books_pricing_type === 'Discount' ? formValues.coupon : '',
      };

      try {
        const res = isEdit
          ? await updateInstitution({ id: institution!._id, values: payload }).unwrap()
          : await addInstitution(payload).unwrap();
        if (res?.http_status_code === 200 || res?.http_status_code === 201) {
          toast.success(res.message ?? (isEdit ? 'Institution updated' : 'Institution added'));
          onClose();
        }
      } catch (error) {
        console.error('Failed to add/update institution', error);
      }
    },
  });

  const isLoading = isAdding || isUpdating || isSubmitting;
  const selectedCouponOption = couponOptions.find((option) => option.value === values.coupon) ?? null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="admin_panel flex max-h-[90vh] flex-col gap-0 overflow-hidden p-0 max-w-2xl">
        <DialogHeader className="shrink-0 border-b border-slate-100 px-6 pb-4 pt-6 pr-12">
          <DialogTitle>{isEdit ? 'Edit Institution' : 'Add Partner Institution'}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Update the details for this partner university.'
              : 'Register a new partner university for institutional access.'}
          </DialogDescription>
        </DialogHeader>

        <form noValidate onSubmit={handleSubmit} className="admin_panel flex min-h-0 flex-1 flex-col">
          <div className="custom_scrollbar flex-1 space-y-5 overflow-y-auto p-6!">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">
                  Institution Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="e.g. University of Nairobi"
                />
                {touched.name && errors.name ? <p className="text-sm text-red-600">{errors.name}</p> : null}
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact_email">
                  Contact Email <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="contact_email"
                  name="contact_email"
                  type="email"
                  value={values.contact_email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="teamtaaluma@taaluma.world"
                />
                {touched.contact_email && errors.contact_email ? (
                  <p className="text-sm text-red-600">{errors.contact_email}</p>
                ) : null}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="domains">
                Email Domains <span className="text-red-500">*</span>
              </Label>
              <Input
                id="domains"
                name="domains"
                value={values.domains}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="students.uonbi.ac.ke, uonbi.ac.ke"
              />
              {touched.domains && errors.domains ? (
                <p className="text-sm text-red-600">{errors.domains}</p>
              ) : null}
              <p className="text-xs text-slate-500">Comma-separated. Domain matching is case-insensitive.</p>
            </div>

            <div className="space-y-3">
              <Label>
                Promotional Access Period <span className="text-red-500">*</span>
              </Label>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="promo_start" className="text-xs text-slate-500">
                    Start Date <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="promo_start"
                    name="promo_start"
                    type="date"
                    value={values.promo_start}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    min={new Date().toISOString().substring(0, 10)}
                  />
                  {touched.promo_start && errors.promo_start ? (
                    <p className="text-sm text-red-600">{errors.promo_start}</p>
                  ) : null}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="promo_end" className="text-xs text-slate-500">
                    End Date <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="promo_end"
                    name="promo_end"
                    type="date"
                    value={values.promo_end}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    min={values.promo_start}
                  />
                  {touched.promo_end && errors.promo_end ? (
                    <p className="text-sm text-red-600">{errors.promo_end}</p>
                  ) : null}
                </div>
              </div>
              <p className="text-xs text-slate-500">
                Automated reminder emails are sent 30, 7, and 1 day before expiry.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                name="status"
                value={values.status}
                onChange={(e) => setFieldValue('status', e.target.value)}
                onBlur={handleBlur}
                className="w-full"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            <div className="space-y-3">
              <Label>Pricing (after promo expiry)</Label>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="books_pricing_type" className="text-xs text-slate-500">
                    Pricing Type
                  </Label>
                  <select
                    id="books_pricing_type"
                    name="books_pricing_type"
                    value={values.books_pricing_type}
                    onChange={(e) => {
                      setFieldValue('books_pricing_type', e.target.value);
                      if (e.target.value !== 'Discount') setFieldValue('coupon', '');
                    }}
                    onBlur={handleBlur}
                    className="w-full"
                  >
                    <option value="Market Price">Market Price</option>
                    <option value="Discount">Discounted Price</option>
                  </select>
                </div>
                {values.books_pricing_type === 'Discount' ? (
                  <div className="space-y-2">
                    <Label htmlFor="coupon" className="text-xs text-slate-500">
                      Coupon <span className="text-red-500">*</span>
                    </Label>
                    <ReactSelect
                      inputId="coupon"
                      name="coupon"
                      classNamePrefix="react-select"
                      options={couponOptions}
                      value={selectedCouponOption}
                      onChange={(option) => setFieldValue('coupon', option?.value ?? '')}
                      onBlur={() => setFieldTouched('coupon', true)}
                      placeholder={isCouponsLoading ? 'Loading coupons...' : 'Select a university coupon'}
                      isClearable
                      isLoading={isCouponsLoading}
                      isDisabled={isLoading || isCouponsLoading}
                      menuPortalTarget={typeof document !== 'undefined' ? document.body : null}
                      menuPosition="fixed"
                      styles={SELECT_STYLES}
                    />
                    {touched.coupon && errors.coupon ? (
                      <p className="text-sm text-red-600">{errors.coupon}</p>
                    ) : null}
                  </div>
                ) : null}
              </div>
              <p className="text-xs text-slate-500">
                Upon promo expiry, users lose free access but can re-access books at this price.
              </p>
            </div>
          </div>

          <DialogFooter className="shrink-0 gap-3 border-t border-slate-100 px-6 py-4">
            <Button type="button" className="global_btn outline_primary rounded_full" onPress={onClose} isDisabled={isLoading}>
              <X className="h-4 w-4" />
              Cancel
            </Button>
            <Button type="submit" className="global_btn bg_primary rounded_full" isLoading={isLoading}>
              <Save className="h-4 w-4" />
              {isEdit ? 'Save Changes' : 'Add Institution'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
