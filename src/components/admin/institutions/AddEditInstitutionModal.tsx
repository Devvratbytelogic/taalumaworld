'use client';

import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { closeModal } from '@/store/slices/allModalSlice';
import { RootState } from '@/store/store';
import {
  useAddInstitutionMutation,
  useUpdateInstitutionMutation,
} from '@/store/rtkQueries/institutionApi';
import type { IInstitution, ReAccessPricingType } from '@/types/institution';
import toast from '@/utils/toast';
import { institutionSchema } from '@/utils/formValidation';

export function AddEditInstitutionModal() {
  const dispatch = useDispatch();
  const { isOpen, data } = useSelector((state: RootState) => state.allModal);
  const institution: IInstitution | null = data?.institution ?? null;
  const isEdit = !!institution;

  const [addInstitution, { isLoading: isAdding }] = useAddInstitutionMutation();
  const [updateInstitution, { isLoading: isUpdating }] = useUpdateInstitutionMutation();

  const onClose = () => dispatch(closeModal());

  const { values, errors, touched, isSubmitting, handleChange, handleBlur, handleSubmit, setFieldValue } = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: institution?.name ?? '',
      country: institution?.country ?? 'Kenya',
      contact_email: institution?.contact_email ?? '',
      email_domains: institution?.email_domains?.map((d) => d.domain).join(', ') ?? '',
      promotional_start_date: institution?.promotional_access?.start_date?.substring(0, 10) ?? '',
      promotional_end_date: institution?.promotional_access?.end_date?.substring(0, 10) ?? '',
      re_access_type: institution?.re_access_pricing?.type ?? 'market',
      re_access_discount: institution?.re_access_pricing?.discount_percentage ?? 0,
    },
    validationSchema: institutionSchema,
    onSubmit: async (formValues) => {

      try {
        if (isEdit) {
          await updateInstitution({ id: institution!._id, values: formValues }).unwrap();
          toast.success('Institution updated');
        } else {
          await addInstitution(formValues).unwrap();
          toast.success('Institution added');
        }
        onClose();
      } catch {
        // handled by RTK layer
      }
    },
  });

  const isLoading = isAdding || isUpdating || isSubmitting;

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
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  name="country"
                  value={values.country}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="e.g. Kenya"
                />
                {touched.country && errors.country ? <p className="text-sm text-red-600">{errors.country}</p> : null}
              </div>
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
                placeholder="partnerships@university.ac.ke"
              />
              {touched.contact_email && errors.contact_email ? (
                <p className="text-sm text-red-600">{errors.contact_email}</p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email_domains">
                Institutional Email Domains <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email_domains"
                name="email_domains"
                value={values.email_domains}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="students.uonbi.ac.ke, uonbi.ac.ke"
              />
              {touched.email_domains && errors.email_domains ? (
                <p className="text-sm text-red-600">{errors.email_domains}</p>
              ) : null}
              <p className="text-xs text-slate-500">Comma-separated. Domain matching is case-insensitive.</p>
            </div>

            <div className="space-y-3">
              <Label>
                Promotional Access Period <span className="text-red-500">*</span>
              </Label>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="promotional_start_date" className="text-xs text-slate-500">
                    Start Date <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="promotional_start_date"
                    name="promotional_start_date"
                    type="date"
                    value={values.promotional_start_date}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {touched.promotional_start_date && errors.promotional_start_date ? (
                    <p className="text-sm text-red-600">{errors.promotional_start_date}</p>
                  ) : null}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="promotional_end_date" className="text-xs text-slate-500">
                    End Date <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="promotional_end_date"
                    name="promotional_end_date"
                    type="date"
                    value={values.promotional_end_date}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    min={values.promotional_start_date}
                  />
                  {touched.promotional_end_date && errors.promotional_end_date ? (
                    <p className="text-sm text-red-600">{errors.promotional_end_date}</p>
                  ) : null}
                </div>
              </div>
              <p className="text-xs text-slate-500">
                Automated reminder emails are sent 30, 7, and 1 day before expiry.
              </p>
            </div>

            <div className="space-y-3">
              <Label>Re-Access Pricing (after expiry)</Label>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="re_access_type" className="text-xs text-slate-500">
                    Pricing Type
                  </Label>
                  <Select
                    value={values.re_access_type}
                    onValueChange={(v) => setFieldValue('re_access_type', v as ReAccessPricingType)}
                  >
                    <SelectTrigger id="re_access_type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="market">Market Price</SelectItem>
                      <SelectItem value="discounted">Discounted Price</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {values.re_access_type === 'discounted' ? (
                  <div className="space-y-2">
                    <Label htmlFor="re_access_discount" className="text-xs text-slate-500">
                      Discount Percentage
                    </Label>
                    <Input
                      id="re_access_discount"
                      name="re_access_discount"
                      type="number"
                      min={1}
                      max={100}
                      value={values.re_access_discount}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="e.g. 30"
                    />
                    {touched.re_access_discount && errors.re_access_discount ? (
                      <p className="text-sm text-red-600">{errors.re_access_discount}</p>
                    ) : null}
                  </div>
                ) : null}
              </div>
              <p className="text-xs text-slate-500">
                Upon expiry, users lose free access but can re-access content at this price.
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
