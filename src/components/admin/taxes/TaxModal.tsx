'use client';

import { useEffect, useMemo } from 'react';
import { useFormik } from 'formik';
import ReactSelect from 'react-select';
import { Country } from 'country-state-city';
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
import { SELECT_STYLES, type SelectOption } from '@/constants/selectStyle';
import { taxSchema } from '@/utils/formValidation';
import type { IAllTaxesDataEntity } from '@/types/taxes';

export type TaxFormValues = {
  country: string;
  country_code: string;
  tax_name: string;
  tax_percent: number | '';
  status: 'Active' | 'Inactive';
};

const emptyValues: TaxFormValues = {
  country: '',
  country_code: '',
  tax_name: '',
  tax_percent: '',
  status: 'Active',
};

interface TaxModalProps {
  open: boolean;
  tax?: IAllTaxesDataEntity | null;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: TaxFormValues, id?: string) => Promise<void>;
}

export function TaxModal({ open, tax, onOpenChange, onSubmit }: TaxModalProps) {
  const isEditing = !!tax;

  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
    setFieldTouched,
    resetForm,
  } = useFormik({
    initialValues: emptyValues,
    validationSchema: taxSchema,
    enableReinitialize: true,
    onSubmit: async (formValues) => {
      await onSubmit(formValues, tax?._id);
    },
  });

  const countryOptions: SelectOption[] = useMemo(
    () => Country.getAllCountries().map((c) => ({ value: c.isoCode, label: c.name })),
    [],
  );

  const selectedCountryOption =
    countryOptions.find(
      (option) =>
        option.value === values.country_code ||
        option.label.toLowerCase() === values.country.toLowerCase(),
    ) ?? null;

  const handleCountryChange = (option: SelectOption | null) => {
    setFieldValue('country', option?.label ?? '');
    setFieldValue('country_code', option?.value ?? '');
    setFieldTouched('country', true, false);
    setFieldTouched('country_code', true, false);
  };

  useEffect(() => {
    if (!open) return;
    resetForm({
      values: tax
        ? {
            country: tax.country,
            country_code: tax.country_code,
            tax_name: tax.tax_name,
            tax_percent: tax.tax_percent,
            status: (tax.status as 'Active' | 'Inactive') ?? 'Active',
          }
        : emptyValues,
    });
  }, [open, tax, resetForm]);

  const closeModal = () => {
    resetForm({ values: emptyValues });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit tax' : 'Add tax'}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Update the country tax rate and status.'
              : 'Create a new country tax rate for checkout and invoicing.'}
          </DialogDescription>
        </DialogHeader>

        <form noValidate onSubmit={handleSubmit} className="flex min-h-0 flex-col admin_panel">
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="tax-country">
                Country<span className="text-red-500">*</span>
              </Label>
              <ReactSelect
                inputId="tax-country"
                name="country"
                classNamePrefix="react-select"
                options={countryOptions}
                value={selectedCountryOption}
                onChange={(option) => handleCountryChange(option as SelectOption | null)}
                onBlur={() => setFieldTouched('country', true)}
                placeholder="Select a country"
                isClearable
                isDisabled={isSubmitting}
                menuPortalTarget={typeof document !== 'undefined' ? document.body : null}
                menuPosition="fixed"
                styles={SELECT_STYLES}
              />
              {errors.country && touched.country ? <p className="text-sm text-red-600">{errors.country}</p> : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="tax-name">
                Tax name<span className="text-red-500">*</span>
              </Label>
              <Input
                id="tax-name"
                name="tax_name"
                placeholder="e.g., GST"
                value={values.tax_name}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={isSubmitting}
                className={errors.tax_name && touched.tax_name ? 'border-red-500' : ''}
              />
              {errors.tax_name && touched.tax_name ? <p className="text-sm text-red-600">{errors.tax_name}</p> : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="tax-percent">
                Tax percent<span className="text-red-500">*</span>
              </Label>
              <Input
                id="tax-percent"
                name="tax_percent"
                type="number"
                min={0}
                max={100}
                step="0.01"
                placeholder="e.g., 18"
                value={values.tax_percent}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={isSubmitting}
                className={errors.tax_percent && touched.tax_percent ? 'border-red-500' : ''}
              />
              {errors.tax_percent && touched.tax_percent ? (
                <p className="text-sm text-red-600">{errors.tax_percent}</p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="tax-status">
                Status<span className="text-red-500">*</span>
              </Label>
              <select
                id="tax-status"
                name="status"
                value={values.status}
                onChange={(e) => setFieldValue('status', e.target.value as 'Active' | 'Inactive')}
                onBlur={handleBlur}
                disabled={isSubmitting}
                className="admin-form-trigger w-full"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
              {errors.status && touched.status ? <p className="text-sm text-red-600">{errors.status}</p> : null}
            </div>
          </div>

          <DialogFooter>
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
              {isEditing ? 'Save changes' : 'Create tax'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
