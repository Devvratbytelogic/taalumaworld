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
import type { IAllInstitutionsDataEntity } from '@/types/institution';
import toast from '@/utils/toast';
import { institutionSchema } from '@/utils/formValidation';

export function AddEditInstitutionModal() {
  const dispatch = useDispatch();
  const { isOpen, data } = useSelector((state: RootState) => state.allModal);
  const institution: IAllInstitutionsDataEntity | null = data?.institution ?? null;
  const isEdit = !!institution;

  const [addInstitution, { isLoading: isAdding }] = useAddInstitutionMutation();
  const [updateInstitution, { isLoading: isUpdating }] = useUpdateInstitutionMutation();

  const onClose = () => dispatch(closeModal());

  const { values, errors, touched, isSubmitting, handleChange, handleBlur, handleSubmit, setFieldValue } = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: institution?.name ?? '',
      contact_email: institution?.contact_email ?? '',
      domains: institution?.domains?.join(', ') ?? '',
      promo_start: institution?.promo_start?.substring(0, 10) ?? '',
      promo_end: institution?.promo_end?.substring(0, 10) ?? '',
      status: institution?.status ?? 'Active',
      books_pricing_type: institution?.books_pricing_type ?? 'Market Price',
      discount_percentage: institution?.discount_percentage ?? 0,
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
        discount_percentage:
          formValues.books_pricing_type === 'Discounted Price' ? Number(formValues.discount_percentage) : 0,
      };

      try {
        if (isEdit) {
          await updateInstitution({ id: institution!._id, values: payload }).unwrap();
          toast.success('Institution updated');
        } else {
          await addInstitution(payload).unwrap();
          toast.success('Institution added');
        }
        onClose();
      } catch(error) {
        console.error('Failed to add/update institution', error);
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
              <Select
                value={values.status}
                onValueChange={(v) => setFieldValue('status', v)}
              >
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label>Books Pricing (after promo expiry)</Label>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="books_pricing_type" className="text-xs text-slate-500">
                    Pricing Type
                  </Label>
                  <Select
                    value={values.books_pricing_type}
                    onValueChange={(v) => setFieldValue('books_pricing_type', v)}
                  >
                    <SelectTrigger id="books_pricing_type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Market Price">Market Price</SelectItem>
                      <SelectItem value="Discounted Price">Discounted Price</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {values.books_pricing_type === 'Discounted Price' ? (
                  <div className="space-y-2">
                    <Label htmlFor="discount_percentage" className="text-xs text-slate-500">
                      Discount Percentage
                    </Label>
                    <Input
                      id="discount_percentage"
                      name="discount_percentage"
                      type="number"
                      min={1}
                      max={100}
                      value={values.discount_percentage}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="e.g. 30"
                    />
                    {touched.discount_percentage && errors.discount_percentage ? (
                      <p className="text-sm text-red-600">{errors.discount_percentage}</p>
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
