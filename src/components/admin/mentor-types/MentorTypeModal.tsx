'use client';

import { useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
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
import type { MentorType } from '@/components/admin/mentor-types/data/mentorTypesData';

export type MentorTypeFormValues = {
  name: string;
  mentorSharePercent: number;
  taalumaSharePercent: number;
  badgeLabel: string;
  eligibilityCriteria: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  maxActiveMentors?: number;
  agreementVersion: string;
};

const schema = Yup.object({
  name: Yup.string().trim().min(2, 'Name is required').required('Name is required'),
  mentorSharePercent: Yup.number().min(0).max(100).required('Required'),
  badgeLabel: Yup.string().trim().min(2, 'Badge label is required').required('Badge label is required'),
  agreementVersion: Yup.string().trim().required('Agreement version is required'),
});

const emptyValues: MentorTypeFormValues = {
  name: '',
  mentorSharePercent: 80,
  taalumaSharePercent: 20,
  badgeLabel: '',
  eligibilityCriteria: '',
  startDate: '',
  endDate: '',
  isActive: true,
  agreementVersion: 'v1.0',
};

interface MentorTypeModalProps {
  open: boolean;
  mentorType?: MentorType | null;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: MentorTypeFormValues, id?: string) => void;
}

export function MentorTypeModal({ open, mentorType, onOpenChange, onSubmit }: MentorTypeModalProps) {
  const isEditing = !!mentorType;

  const { values, errors, touched, isSubmitting, handleChange, handleBlur, handleSubmit, resetForm, setFieldValue } = useFormik({
    initialValues: emptyValues,
    validationSchema: schema,
    onSubmit: (formValues) => {
      onSubmit(formValues, mentorType?.id);
      onOpenChange(false);
    },
  });

  useEffect(() => {
    if (!open) return;
    resetForm({
      values: mentorType
        ? {
            name: mentorType.name,
            mentorSharePercent: mentorType.mentorSharePercent,
            taalumaSharePercent: mentorType.taalumaSharePercent,
            badgeLabel: mentorType.badgeLabel,
            eligibilityCriteria: mentorType.eligibilityCriteria,
            startDate: mentorType.startDate ?? '',
            endDate: mentorType.endDate ?? '',
            isActive: mentorType.isActive,
            maxActiveMentors: mentorType.maxActiveMentors,
            agreementVersion: mentorType.agreementVersion,
          }
        : emptyValues,
    });
  }, [open, mentorType, resetForm]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="admin_panel flex max-h-[90vh] flex-col gap-0 overflow-hidden p-0 sm:max-w-lg">
        <DialogHeader className="shrink-0 border-b border-slate-100 px-6 pb-4 pt-6 pr-12">
          <DialogTitle>{isEditing ? 'Edit mentor type' : 'Add mentor type'}</DialogTitle>
          <DialogDescription>
            Configure revenue share, badge, eligibility, and agreement version.
          </DialogDescription>
        </DialogHeader>

        <form noValidate onSubmit={handleSubmit} className="admin_panel flex min-h-0 flex-1 flex-col">
          <div className="custom_scrollbar flex-1 space-y-4 overflow-y-auto p-6!">
            <div className="space-y-2">
              <Label htmlFor="name">Mentor type name</Label>
              <Input
                id="name"
                name="name"
                value={values.name}
                onChange={(e) => {
                  handleChange(e);
                  if (!isEditing && !values.badgeLabel) setFieldValue('badgeLabel', e.target.value);
                }}
                onBlur={handleBlur}
                placeholder="e.g. Standard Mentor"
              />
              {errors.name && touched.name ? <p className="text-sm text-red-600">{errors.name}</p> : null}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="mentorSharePercent">Mentor share (%)</Label>
                <Input
                  id="mentorSharePercent"
                  type="text"
                  inputMode="numeric"
                  value={values.mentorSharePercent}
                  onChange={(e) => {
                    const share = Math.min(100, Math.max(0, Number(e.target.value.replace(/[^\d]/g, '')) || 0));
                    setFieldValue('mentorSharePercent', share);
                    setFieldValue('taalumaSharePercent', 100 - share);
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="taalumaSharePercent">Taaluma share (%)</Label>
                <Input id="taalumaSharePercent" value={values.taalumaSharePercent} readOnly className="bg-slate-50" />
              </div>
            </div>
            <p className="text-xs text-slate-400">Taaluma share updates automatically to total 100%.</p>

            <div className="space-y-2">
              <Label htmlFor="badgeLabel">Badge label</Label>
              <Input id="badgeLabel" name="badgeLabel" value={values.badgeLabel} onChange={handleChange} onBlur={handleBlur} placeholder="e.g. Founding Mentor" />
              {errors.badgeLabel && touched.badgeLabel ? <p className="text-sm text-red-600">{errors.badgeLabel}</p> : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="eligibilityCriteria">Eligibility criteria</Label>
              <textarea
                id="eligibilityCriteria"
                name="eligibilityCriteria"
                value={values.eligibilityCriteria}
                onChange={handleChange}
                rows={3}
                placeholder="Describe who qualifies for this mentor type..."
                className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start date</Label>
                <Input id="startDate" name="startDate" type="date" value={values.startDate} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">End date</Label>
                <Input id="endDate" name="endDate" type="date" value={values.endDate} onChange={handleChange} />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="agreementVersion">Agreement version</Label>
                <Input id="agreementVersion" name="agreementVersion" value={values.agreementVersion} onChange={handleChange} onBlur={handleBlur} placeholder="v1.0" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxActiveMentors">Max active mentors</Label>
                <Input
                  id="maxActiveMentors"
                  type="text"
                  inputMode="numeric"
                  value={values.maxActiveMentors ?? ''}
                  onChange={(e) => {
                    const digits = e.target.value.replace(/[^\d]/g, '');
                    setFieldValue('maxActiveMentors', digits ? Number(digits) : undefined);
                  }}
                  placeholder="Optional"
                />
              </div>
            </div>

            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input type="checkbox" checked={values.isActive} onChange={(e) => setFieldValue('isActive', e.target.checked)} className="rounded border-slate-300" />
              Active
            </label>
          </div>

          <DialogFooter className="shrink-0 gap-3 border-t border-slate-100 px-6 py-4">
            <Button type="button" className="global_btn outline_primary rounded_full" onPress={() => onOpenChange(false)}>
              <X className="h-4 w-4" />
              Cancel
            </Button>
            <Button type="submit" className="global_btn bg_primary rounded_full" isLoading={isSubmitting}>
              <Save className="h-4 w-4" />
              {isEditing ? 'Save changes' : 'Create type'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
