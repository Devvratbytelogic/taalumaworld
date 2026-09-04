'use client';

import { useEffect, useRef, useState } from 'react';
import { useFormik } from 'formik';
import { Award, Save, Upload, X } from 'lucide-react';
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
import toast from '@/utils/toast';
import { mentorTierSchema } from '@/utils/formValidation';
import { useAddMentorTierMutation, useUpdateMentorTierMutation } from '@/store/rtkQueries/mentorApis';
import type { IAllMentorTiersEntity } from '@/types/mentorTier';
import { FileUploadLimitHint } from '@/components/ui/FileUploadLimitHint';
import { ALLOWED_IMAGE_ACCEPT, IMAGE_UPLOAD_MAX_BYTES, getImageSizeLimitMessage, getImageTypeErrorMessage, isAllowedImageFile } from '@/constants/fileUpload';



interface MentorTypeModalProps {
  open: boolean;
  mentorTier?: IAllMentorTiersEntity | null;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function MentorTypeModal({ open, mentorTier, onOpenChange, onSuccess }: MentorTypeModalProps) {
  const isEditing = !!mentorTier;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [badgeFile, setBadgeFile] = useState<File | null>(null);
  const [badgePreview, setBadgePreview] = useState<string | null>(null);

  const [addMentorTier, { isLoading: isAdding }] = useAddMentorTierMutation();
  const [updateMentorTier, { isLoading: isUpdating }] = useUpdateMentorTierMutation();
  const isSaving = isAdding || isUpdating;

  const initialValues = {
    code: mentorTier?.code || '',
    mentor_share_percent: mentorTier?.mentor_share_percent || 0,
    platform_share_percent: mentorTier?.platform_share_percent || 0,
    rank: mentorTier?.rank || 0,
    status: mentorTier?.status || 'active',
    max_mentors: mentorTier?.max_mentors || 0,
    min_confirmed_sales: mentorTier?.min_confirmed_sales || 0,
    min_days_since_published: mentorTier?.min_days_since_published || 0,
    min_words_per_blueprint: mentorTier?.min_words_per_blueprint || 0,
    badge: mentorTier?.badge || null,
  };
  const { values, errors, touched, handleChange, handleBlur, handleSubmit, resetForm, setFieldValue } = useFormik({
    initialValues,
    validationSchema: mentorTierSchema,
    enableReinitialize: true,
    onSubmit: async (formValues) => {
      const fd = new FormData();
      fd.append('code', formValues.code);
      fd.append('mentor_share_percent', String(formValues.mentor_share_percent));
      fd.append('platform_share_percent', String(formValues.platform_share_percent));
      fd.append('rank', String(formValues.rank));
      fd.append('status', formValues.status);
      fd.append('max_mentors', String(formValues.max_mentors));
      fd.append('min_confirmed_sales', String(formValues.min_confirmed_sales));
      fd.append('min_days_since_published', String(formValues.min_days_since_published));
      fd.append('min_words_per_blueprint', String(formValues.min_words_per_blueprint));
      if (badgeFile) fd.append('badge', badgeFile);

      try {
        const res = isEditing && mentorTier
          ? await updateMentorTier({ id: mentorTier._id, values: fd }).unwrap()
          : await addMentorTier(fd).unwrap();
        if (res?.http_status_code === 200 || res?.http_status_code === 201) {
          toast.success(res.message ?? (isEditing ? 'Mentor tier updated' : 'Mentor tier created'));
          onOpenChange(false);
          onSuccess?.();
        }
      } catch(error) {
        console.error(isEditing ? 'Failed to update mentor tier' : 'Failed to create mentor tier', error);
      }
    },
  });

  useEffect(() => {
    if (!open) return;
    setBadgeFile(null);
    setBadgePreview(mentorTier?.badge ?? null);
  }, [open, mentorTier, resetForm]);

  useEffect(() => {
    if (badgeFile) {
      const url = URL.createObjectURL(badgeFile);
      setBadgePreview(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [badgeFile]);

  const handleBadgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!isAllowedImageFile(file)) {
      toast.error(getImageTypeErrorMessage());
      return;
    }
    if (file.size > IMAGE_UPLOAD_MAX_BYTES) {
      toast.error(getImageSizeLimitMessage('Badge image'));
      return;
    }
    setBadgeFile(file);
    setFieldValue('badge', file);
    e.target.value = '';
  };

  const clearBadge = () => {
    setBadgeFile(null);
    setBadgePreview(null);
    setFieldValue('badge', null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="admin_panel flex max-h-[90vh] flex-col gap-0 overflow-hidden p-0 sm:max-w-lg">
        <DialogHeader className="shrink-0 border-b border-slate-100 px-6 pb-4 pt-6 pr-12">
          <DialogTitle>{isEditing ? 'Edit mentor tier' : 'Add mentor tier'}</DialogTitle>
          <DialogDescription>Configure the tier code, revenue share, rank, eligibility, and badge.</DialogDescription>
        </DialogHeader>

        <form noValidate onSubmit={handleSubmit} className="admin_panel flex min-h-0 flex-1 flex-col">
          <div className="custom_scrollbar flex-1 space-y-4 overflow-y-auto p-6!">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                {badgePreview ? (
                  <img src={badgePreview} alt="Badge preview" className="h-full w-full object-cover" onError={() => setBadgePreview(null)} />
                ) : (
                  <Award className="h-7 w-7 text-slate-300" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <Label className="mb-1">
                  Badge <span className="font-normal text-muted-foreground">(optional)</span>
                  <FileUploadLimitHint kind="image" />
                </Label>
                <input ref={fileInputRef} type="file" accept={ALLOWED_IMAGE_ACCEPT} className="hidden" onChange={handleBadgeChange} />
                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    type="button"
                    className="global_btn outline_primary rounded_full shrink-0"
                    startContent={<Upload className="h-4 w-4" />}
                    onPress={() => fileInputRef.current?.click()}
                  >
                    {badgePreview ? 'Change image' : 'Choose image'}
                  </Button>
                  {badgePreview ? (
                    <button type="button" onClick={clearBadge} className="shrink-0 text-xs text-red-600 hover:underline">
                      Remove
                    </button>
                  ) : null}
                </div>
                {badgeFile ? (
                  <p className="mt-1 max-w-full truncate text-xs text-slate-500" title={badgeFile.name}>
                    {badgeFile.name}
                  </p>
                ) : null}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="code">
                Tier code<span className="text-red-500">*</span>
              </Label>
              <Input
                id="code"
                name="code"
                value={values.code}
                onChange={(e) => setFieldValue('code', e.target.value.toUpperCase())}
                onBlur={handleBlur}
                placeholder="e.g. STANDARD"
              />
              {errors.code && touched.code ? <p className="text-sm text-red-600">{errors.code}</p> : null}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="mentor_share_percent">
                  Mentor share (%)<span className="text-red-500">*</span>
                </Label>
                <Input
                  id="mentor_share_percent"
                  type="text"
                  inputMode="numeric"
                  value={values.mentor_share_percent}
                  onChange={(e) => {
                    const share = Math.min(100, Math.max(0, Number(e.target.value.replace(/[^\d]/g, '')) || 0));
                    setFieldValue('mentor_share_percent', share);
                    setFieldValue('platform_share_percent', 100 - share);
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="platform_share_percent">Platform share (%)</Label>
                <Input id="platform_share_percent" value={values.platform_share_percent} readOnly className="bg-slate-50" />
              </div>
            </div>
            <p className="text-xs text-slate-400">Platform share updates automatically to total 100%.</p>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="rank">
                  Rank<span className="text-red-500">*</span>
                </Label>
                <Input
                  id="rank"
                  type="text"
                  inputMode="numeric"
                  value={values.rank}
                  onChange={(e) => {
                    const digits = e.target.value.replace(/[^\d]/g, '');
                    setFieldValue('rank', digits ? Number(digits) : 0);
                  }}
                  placeholder="e.g. 1"
                />
                {errors.rank && touched.rank ? <p className="text-sm text-red-600">{errors.rank}</p> : null}
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">
                  Status<span className="text-red-500">*</span>
                </Label>
                <select
                  id="status"
                  name="status"
                  value={values.status}
                  onChange={handleChange}
                  className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Eligibility criteria (optional)</p>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="max_mentors">Max mentors</Label>
                <Input
                  id="max_mentors"
                  name="max_mentors"
                  type="text"
                  inputMode="numeric"
                  value={values.max_mentors}
                  onChange={(e) => setFieldValue('max_mentors', e.target.value.replace(/[^\d]/g, ''))}
                  placeholder="e.g. 10"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="min_confirmed_sales">Min confirmed sales</Label>
                <Input
                  id="min_confirmed_sales"
                  name="min_confirmed_sales"
                  type="text"
                  inputMode="numeric"
                  value={values.min_confirmed_sales}
                  onChange={(e) => setFieldValue('min_confirmed_sales', e.target.value.replace(/[^\d]/g, ''))}
                  placeholder="e.g. 5"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="min_days_since_published">Min days since published</Label>
                <Input
                  id="min_days_since_published"
                  name="min_days_since_published"
                  type="text"
                  inputMode="numeric"
                  value={values.min_days_since_published}
                  onChange={(e) => setFieldValue('min_days_since_published', e.target.value.replace(/[^\d]/g, ''))}
                  placeholder="e.g. 30"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="min_words_per_blueprint">Min words per blueprint</Label>
                <Input
                  id="min_words_per_blueprint"
                  name="min_words_per_blueprint"
                  type="text"
                  inputMode="numeric"
                  value={values.min_words_per_blueprint}
                  onChange={(e) => setFieldValue('min_words_per_blueprint', e.target.value.replace(/[^\d]/g, ''))}
                  placeholder="e.g. 500"
                />
              </div>
            </div>
          </div>

          <DialogFooter className="shrink-0 gap-3 border-t border-slate-100 px-6 py-4">
            <Button type="button" className="global_btn outline_primary rounded_full" onPress={() => onOpenChange(false)}>
              <X className="h-4 w-4" />
              Cancel
            </Button>
            <Button type="submit" className="global_btn bg_primary rounded_full" isLoading={isSaving}>
              <Save className="h-4 w-4" />
              {isEditing ? 'Save changes' : 'Create tier'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
