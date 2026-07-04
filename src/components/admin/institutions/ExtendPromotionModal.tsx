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
import { closeModal } from '@/store/slices/allModalSlice';
import { RootState } from '@/store/store';
import { useExtendPromotionalPeriodMutation } from '@/store/rtkQueries/institutionApi';
import type { IInstitution } from '@/types/institution';
import toast from '@/utils/toast';
import { extendPromotionSchema } from '@/utils/formValidation';

export function ExtendPromotionModal() {
  const dispatch = useDispatch();
  const { isOpen, data } = useSelector((state: RootState) => state.allModal);
  const institution: IInstitution | null = data?.institution ?? null;
  const currentEnd = new Date().toISOString().split('T')[0] ?? '';

  const [extendPeriod, { isLoading }] = useExtendPromotionalPeriodMutation();
  const onClose = () => dispatch(closeModal());

  const { values, errors, touched, isSubmitting, handleChange, handleBlur, handleSubmit } = useFormik({
    enableReinitialize: true,
    initialValues: { new_end_date: currentEnd },
    validationSchema: extendPromotionSchema,
    onSubmit: async (formValues) => {
      if (!institution) return;
      try {
        await extendPeriod({ id: institution._id, end_date: formValues.new_end_date }).unwrap();
        toast.success('Promotional period extended');
        onClose();
      } catch(error) {
        console.error('Error extending promotional period', error);
      }
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="admin_panel flex max-h-[90vh] flex-col gap-0 overflow-hidden p-0 sm:max-w-md">
        <DialogHeader className="shrink-0 border-b border-slate-100 px-6 pb-4 pt-6 pr-12">
          <DialogTitle>Extend Promotional Period</DialogTitle>
          {institution ? <DialogDescription>{institution.name}</DialogDescription> : null}
        </DialogHeader>
        <form noValidate onSubmit={handleSubmit} className="admin_panel flex min-h-0 flex-1 flex-col">
          <div className="custom_scrollbar flex-1 space-y-4 overflow-y-auto p-6!">
            <div>
              <p className="text-xs text-slate-500">Current End Date</p>
              <p className="text-sm font-medium text-slate-900">{currentEnd || '—'}</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="new_end_date">
                New End Date <span className="text-red-500">*</span>
              </Label>
              <Input
                id="new_end_date"
                name="new_end_date"
                type="date"
                min={new Date(currentEnd).toISOString().split('T')[0] ?? ''}
                value={values.new_end_date}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {touched.new_end_date && errors.new_end_date ? (
                <p className="text-sm text-red-600">{errors.new_end_date}</p>
              ) : null}
            </div>
          </div>

          <DialogFooter className="shrink-0 gap-3 border-t border-slate-100 px-6 py-4">
            <Button
              type="button"
              className="global_btn outline_primary rounded_full"
              onPress={onClose}
              isDisabled={isLoading || isSubmitting}
            >
              <X className="h-4 w-4" />
              Cancel
            </Button>
            <Button type="submit" className="global_btn bg_primary rounded_full" isLoading={isLoading || isSubmitting}>
              <Save className="h-4 w-4" />
              Extend Period
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
