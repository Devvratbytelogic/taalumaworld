'use client';

import { useEffect } from 'react';
import { useFormik } from 'formik';
import { Save, X } from 'lucide-react';
import Button from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { agreementTypeSchema } from '@/utils/formValidation';
import type { IAllAgreementTypesDataEntity } from '@/types/agreementTypes';

export type AgreementTypeFormValues = {
  name: string;
  description: string;
  status: 'active' | 'inactive';
};

const emptyValues: AgreementTypeFormValues = {
  name: '',
  description: '',
  status: 'active',
};

interface AgreementTypeModalProps {
  open: boolean;
  agreementType?: IAllAgreementTypesDataEntity | null;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: AgreementTypeFormValues, id?: string) => Promise<void>;
}

export function AgreementTypeModal({ open, agreementType, onOpenChange, onSubmit }: AgreementTypeModalProps) {
  const isEditing = !!agreementType;

  const { values, errors, touched, isSubmitting, handleChange, handleBlur, handleSubmit, setFieldValue, resetForm } = useFormik({
    initialValues: emptyValues,
    validationSchema: agreementTypeSchema,
    enableReinitialize: true,
    onSubmit: async (formValues) => {
      await onSubmit(formValues, agreementType?._id);
      onOpenChange(false);
    },
  });

  useEffect(() => {
    if (!open) return;
    resetForm({
      values: agreementType
        ? {
            name: agreementType.name,
            description: agreementType.description,
            status: (agreementType.status as 'active' | 'inactive') ?? 'active',
          }
        : emptyValues,
    });
  }, [open, agreementType, resetForm]);

  const closeModal = () => {
    resetForm({ values: emptyValues });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit agreement type' : 'Add agreement type'}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Update the name, description, and status for this agreement type.'
              : 'Create a new agreement type used when drafting agreements.'}
          </DialogDescription>
        </DialogHeader>

        <form noValidate onSubmit={handleSubmit} className="flex min-h-0 flex-col admin_panel">
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="agreement-type-name">
                Name<span className="text-red-500">*</span>
              </Label>
              <Input
                id="agreement-type-name"
                name="name"
                placeholder="e.g., Mentor Agreement"
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={isSubmitting}
                className={errors.name && touched.name ? 'border-red-500' : ''}
              />
              {errors.name && touched.name ? <p className="text-sm text-red-600">{errors.name}</p> : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="agreement-type-description">
                Description<span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="agreement-type-description"
                name="description"
                placeholder="Describe what this agreement type covers..."
                value={values.description}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={isSubmitting}
                rows={3}
                className={errors.description && touched.description ? 'border-red-500' : ''}
              />
              {errors.description && touched.description ? (
                <p className="text-sm text-red-600">{errors.description}</p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="agreement-type-status">
                Status<span className="text-red-500">*</span>
              </Label>
              <select
                id="agreement-type-status"
                name="status"
                value={values.status}
                onChange={(e) => setFieldValue('status', e.target.value as 'active' | 'inactive')}
                onBlur={handleBlur}
                disabled={isSubmitting}
                className="admin-form-trigger w-full"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
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
              {isEditing ? 'Save changes' : 'Create type'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
