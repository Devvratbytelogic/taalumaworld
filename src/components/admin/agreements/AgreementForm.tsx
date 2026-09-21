'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useFormik } from 'formik';
import { Save, X } from 'lucide-react';
import Button from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RichTextEditor } from '@/components/editor/RichTextEditor';
import { agreementSchema } from '@/utils/formValidation';
import { AGREEMENT_STATUS_OPTIONS } from '@/constants/agreements';
import { useAddAgreementMutation, useGetAllAgreementTypesQuery } from '@/store/rtkQueries/agreementAPIs';
import { refreshAfterPolicyChange } from '@/store/server-api/refreshCache';
import { getAdminSectionRoutePath } from '@/routes/routes';
import { slugify } from '@/utils/slugify';
import toast from '@/utils/toast';

export type AgreementFormValues = {
  title: string;
  slug: string;
  content: string;
  agreementType: string;
  status: 'active' | 'inactive';
  can_block: boolean;
};

const initialValues: AgreementFormValues = {
  title: '',
  slug: '',
  content: '',
  agreementType: '',
  status: 'active',
  can_block: false,
};

export function AgreementForm() {
  const router = useRouter();
  const [addAgreement] = useAddAgreementMutation();

  const { data: agreementTypesResponse } = useGetAllAgreementTypesQuery({ limit: 100, status: 'active' });
  const agreementTypeOptions = useMemo(
    () => (agreementTypesResponse?.data?.data ?? []).map((type) => ({ value: type._id, label: type.name })),
    [agreementTypesResponse],
  );

  const agreementsListPath = getAdminSectionRoutePath('agreements');

  const { values, errors, touched, isSubmitting, handleChange, handleBlur, handleSubmit, setFieldValue } = useFormik({
    initialValues,
    validationSchema: agreementSchema,
    onSubmit: async (formValues) => {
      const payload = { ...formValues, slug: slugify(formValues.slug) };
      try {
        const res = await addAgreement(payload).unwrap();
        if (res?.http_status_code === 200 || res?.http_status_code === 201) {
          void refreshAfterPolicyChange(payload.slug);
          toast.success(res.message ?? 'Agreement created successfully');
          router.push(agreementsListPath);
        }
      } catch (error) {
        console.error('Error saving agreement', error);
      }
    },
  });

  return (
    <form noValidate onSubmit={handleSubmit} className="space-y-5">
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
              if (!values.slug || values.slug === slugify(values.title)) {
                setFieldValue('slug', slugify(e.target.value));
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
            onChange={(e) => {
              setFieldValue('slug', slugify(e.target.value, { allowTrailingHyphen: true }));
            }}
            onBlur={(e) => {
              if (e.target.value.endsWith('-')) {
                setFieldValue('slug', slugify(e.target.value));
              }
              handleBlur(e);
            }}
            disabled={isSubmitting}
            className={errors.slug && touched.slug ? 'border-red-500' : ''}
          />
          {errors.slug && touched.slug ? <p className="text-sm text-red-600">{errors.slug}</p> : null}
        </div>
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
            className="admin-form-trigger w-full disabled:cursor-not-allowed disabled:opacity-60"
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
          minHeight="320px"
        />
        {errors.content && touched.content ? <p className="text-sm text-red-600">{errors.content}</p> : null}
      </div>

      <label className="flex items-center gap-2 text-sm text-slate-700">
        <Checkbox
          checked={values.can_block}
          onCheckedChange={(checked) => setFieldValue('can_block', !!checked)}
          disabled={isSubmitting}
          className="mr-2"
        />
        Can block — users who have not accepted the latest version cannot complete linked touchpoints
      </label>

      <div className="form-footer">
        <Button
          type="submit"
          className="global_btn rounded_full bg_primary"
          startContent={<Save className="h-4 w-4" />}
          isDisabled={isSubmitting}
          isLoading={isSubmitting}
        >
          Create agreement
        </Button>
        <Button
          type="button"
          className="global_btn rounded_full outline_primary"
          startContent={<X className="h-4 w-4" />}
          isDisabled={isSubmitting}
          onPress={() => router.push(agreementsListPath)}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
