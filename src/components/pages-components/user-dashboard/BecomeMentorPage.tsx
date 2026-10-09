'use client';

import type { ComponentType } from 'react';
import { useRef, useState } from 'react';
import { useFormik } from 'formik';
import { Briefcase, Clock, FileCheck, Send, Share2, ShieldCheck } from 'lucide-react';
// import { CreditCard } from 'lucide-react';
import Button from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { AgreementSentenceList } from '@/components/ui/AgreementSentenceList';
import { cn } from '@/components/ui/utils';
import { fieldInvalidClassName } from '@/components/ui/field-styles';
// import { nativeSelectClassName } from '@/components/ui/field-styles';
import { mentorConversionApplicationSchema } from '@/utils/formValidation';
import { useGetMentorApplicationsQuery } from '@/store/rtkQueries/userGetAPI';
import { useSubmitMentorApplicationMutation } from '@/store/rtkQueries/userPostAPI';
import { AGREEMENT_TOUCHPOINTS } from '@/constants/agreements';
import toast from '@/utils/toast';
import { UserDashboardPageHeader } from './UserDashboardPageHeader';

const labelClassName = 'mb-2 block text-sm font-normal text-gray-600';

type SectionHeaderProps = {
  icon: ComponentType<{ className?: string }>;
  title: string;
  description: string;
};

function SectionHeader({ icon: Icon, title, description }: SectionHeaderProps) {
  return (
    <div className="flex items-start gap-3">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-gray-200 bg-gray-50/60">
        <Icon className="h-4 w-4 text-primary" aria-hidden />
      </span>
      <div className="min-w-0">
        <h2 className="text-base font-semibold text-gray-900">{title}</h2>
        <p className="mt-0.5 text-sm text-gray-500">{description}</p>
      </div>
    </div>
  );
}

export function BecomeMentorPage() {
  const { data: mentorApplicationsData, isLoading: isApplicationLoading } = useGetMentorApplicationsQuery();
  const [submitMentorApplication] = useSubmitMentorApplicationMutation();
  const [justSubmitted, setJustSubmitted] = useState(false);
  const requiredAcceptedRef = useRef(false);
  const mentorApplication = mentorApplicationsData?.data;
  const applicationStatus = mentorApplication?.latest_application?.status;
  const isPendingReview = justSubmitted || applicationStatus === 'pending_review';
  const isApproved = applicationStatus === 'approved';
  const isRejected = applicationStatus === 'rejected';
  const canApply = isRejected || (mentorApplication?.can_apply ?? !applicationStatus);

  const { values, errors, touched, isSubmitting, handleChange, handleBlur, handleSubmit, setFieldValue, setFieldTouched } =
    useFormik({
      initialValues: {
        linkedinUrl: '',
        facebookUrl: '',
        careerSummary: '',
        // paymentFrequency: '',
        // bankName: '',
        // accountNumber: '',
        // mpesaNumber: '',
        accepted_agreement_ids: [] as string[],
      },
      validationSchema: mentorConversionApplicationSchema,
      validate: () => {
        return requiredAcceptedRef.current ? {} : { accepted_agreement_ids: 'Please accept all required agreements before submitting.' };
      },
      onSubmit: async (formValues, { resetForm: rf }) => {
        try {
          const res = await submitMentorApplication({
            ...(formValues.linkedinUrl.trim() ? { linkedin_url: formValues.linkedinUrl.trim() } : {}),
            ...(formValues.facebookUrl.trim() ? { facebook_url: formValues.facebookUrl.trim() } : {}),
            professional_summary: formValues.careerSummary.trim(),
            // bank_name: formValues.bankName.trim(),
            // bank_number: formValues.accountNumber.trim(),
            // mpesa_number: formValues.mpesaNumber.trim(),
            // preferred_payment_frequency: formValues.paymentFrequency,
            accepted_agreement_ids: formValues.accepted_agreement_ids,
          }).unwrap();
          rf();
          setJustSubmitted(true);
          toast.success(res?.message ?? 'Application submitted for review.');
        } catch(error) {
          console.error('Failed to submit application. Please try again.', error);
        }
      },
    });

  const wordCount = values.careerSummary.trim() ? values.careerSummary.trim().split(/\s+/).length : 0;

  const fieldError = (name: keyof typeof errors) =>
    touched[name] && errors[name] ? fieldInvalidClassName : '';

  const agreementsError = typeof errors.accepted_agreement_ids === 'string' ? errors.accepted_agreement_ids : undefined;

  if (isApplicationLoading) {
    return (
      <div className="space-y-6">
        <UserDashboardPageHeader
          title="Apply to Become a Mentor"
          description="Share your experience with Mentees. An administrator will review your application."
        />
        <div className="h-40 animate-pulse rounded-lg border border-gray-200 bg-gray-50" />
      </div>
    );
  }

  if (isPendingReview || isApproved || !canApply) {
    const isBlockedPending = isPendingReview;
    const StatusIcon = isApproved ? ShieldCheck : Clock;
    const title = isApproved
      ? 'Mentor Application Approved'
      : isBlockedPending
        ? 'Mentor Application Pending Review'
        : 'You cannot apply yet';
    const description = isApproved
      ? 'Your application has already been approved. You do not need to apply again.'
      : isBlockedPending
        ? 'You already have an application under review. You can apply again after an administrator decides on this one.'
        : mentorApplication?.eligibility_reason || 'You are not eligible to submit a mentor application right now.';

    return (
      <div className="space-y-6">
        <UserDashboardPageHeader
          title="Apply to Become a Mentor"
          description="Share your experience with Mentees. An administrator will review your application."
        />
        <div
          className={
            isApproved
              ? 'rounded-lg border border-emerald-200 bg-emerald-50 px-5 py-6 sm:px-8'
              : isBlockedPending
                ? 'rounded-lg border border-amber-200 bg-amber-50 px-5 py-6 sm:px-8'
                : 'rounded-lg border border-gray-200 bg-white px-5 py-6 sm:px-8'
          }
        >
          <div className="flex items-start gap-3">
            <span
              className={
                isApproved
                  ? 'flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700'
                  : isBlockedPending
                    ? 'flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-700'
                    : 'flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-600'
              }
            >
              <StatusIcon className="h-4 w-4" aria-hidden />
            </span>
            <div>
              <h2 className="text-base font-semibold text-gray-900">{title}</h2>
              <p className="mt-1 text-sm text-gray-600">{description}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <UserDashboardPageHeader
        title="Apply to Become a Mentor"
        description="Share your experience with Mentees. An administrator will review your application."
      />

      <form noValidate onSubmit={handleSubmit} className="overflow-hidden rounded-lg border border-gray-200 bg-white">
        <section className="border-b border-gray-100 px-4 py-5 sm:px-8 sm:py-6">
          <SectionHeader
            icon={Share2}
            title="Social profiles"
            description="Optional links to help verify your professional background."
          />

          <div className="mt-5 rounded-lg border border-gray-200 bg-gray-50/60 p-4 sm:p-5">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label htmlFor="linkedinUrl" className={labelClassName}>
                  LinkedIn <span className="text-gray-400">(optional)</span>
                </label>
                <Input
                  id="linkedinUrl"
                  name="linkedinUrl"
                  value={values.linkedinUrl}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="https://linkedin.com/in/you"
                  className={fieldError('linkedinUrl')}
                />
                {touched.linkedinUrl && errors.linkedinUrl ? (
                  <p className="mt-1 text-sm text-red-600">{errors.linkedinUrl}</p>
                ) : null}
              </div>

              <div>
                <label htmlFor="facebookUrl" className={labelClassName}>
                  Facebook <span className="text-gray-400">(optional)</span>
                </label>
                <Input
                  id="facebookUrl"
                  name="facebookUrl"
                  value={values.facebookUrl}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="https://facebook.com/you"
                  className={fieldError('facebookUrl')}
                />
                {touched.facebookUrl && errors.facebookUrl ? (
                  <p className="mt-1 text-sm text-red-600">{errors.facebookUrl}</p>
                ) : null}
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-gray-100 px-4 py-5 sm:px-8 sm:py-6">
          <SectionHeader
            icon={Briefcase}
            title="Experience"
            description="Tell us about your background and expertise."
          />

          <div className="mt-5 space-y-4 rounded-lg border border-gray-200 bg-gray-50/60 p-4 sm:p-5">
            <div>
              <label htmlFor="careerSummary" className={labelClassName}>
                Career summary<span className="text-red-500">*</span>
              </label>
              <Textarea
                id="careerSummary"
                name="careerSummary"
                rows={5}
                value={values.careerSummary}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Describe your career path, expertise, and what you can offer as a mentor..."
                className={fieldError('careerSummary')}
              />
              <div className="mt-1.5 flex items-center justify-between gap-3">
                {touched.careerSummary && errors.careerSummary ? (
                  <p className="text-sm text-red-600">{errors.careerSummary}</p>
                ) : (
                  <span />
                )}
                <p className={cn('text-xs text-gray-500', wordCount > 300 && 'text-red-600')}>
                  {wordCount} / 300 words
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Payment information — temporarily hidden
        <section className="border-b border-gray-100 px-4 py-5 sm:px-8 sm:py-6">
          <SectionHeader
            icon={CreditCard}
            title="Payment information"
            description="Used for mentor payouts. Keep this information accurate."
          />

          <div className="mt-5 rounded-lg border border-gray-200 bg-gray-50/60 p-4 sm:p-5">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label htmlFor="bankName" className={labelClassName}>
                  Bank name<span className="text-red-500">*</span>
                </label>
                <Input
                  id="bankName"
                  name="bankName"
                  value={values.bankName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="e.g. Equity Bank"
                  className={fieldError('bankName')}
                />
                {touched.bankName && errors.bankName ? (
                  <p className="mt-1 text-sm text-red-600">{errors.bankName}</p>
                ) : null}
              </div>

              <div>
                <label htmlFor="accountNumber" className={labelClassName}>
                  Account number<span className="text-red-500">*</span>
                </label>
                <Input
                  id="accountNumber"
                  name="accountNumber"
                  value={values.accountNumber}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Account number"
                  className={fieldError('accountNumber')}
                />
                {touched.accountNumber && errors.accountNumber ? (
                  <p className="mt-1 text-sm text-red-600">{errors.accountNumber}</p>
                ) : null}
              </div>

              <div>
                <label htmlFor="mpesaNumber" className={labelClassName}>
                  M-Pesa phone number<span className="text-red-500">*</span>
                </label>
                <Input
                  id="mpesaNumber"
                  name="mpesaNumber"
                  value={values.mpesaNumber}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="e.g. 0712345678"
                  className={fieldError('mpesaNumber')}
                />
                {touched.mpesaNumber && errors.mpesaNumber ? (
                  <p className="mt-1 text-sm text-red-600">{errors.mpesaNumber}</p>
                ) : null}
              </div>

              <div>
                <label htmlFor="paymentFrequency" className={labelClassName}>
                  Preferred payment frequency<span className="text-red-500">*</span>
                </label>
                <select
                  id="paymentFrequency"
                  name="paymentFrequency"
                  value={values.paymentFrequency}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={cn(nativeSelectClassName, fieldError('paymentFrequency'))}
                >
                  <option value="">Select frequency</option>
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="annually">Annually</option>
                </select>
                {touched.paymentFrequency && errors.paymentFrequency ? (
                  <p className="mt-1 text-sm text-red-600">{errors.paymentFrequency}</p>
                ) : null}
              </div>
            </div>
          </div>
        </section>
        */}

        <section className="px-4 py-5 sm:px-8 sm:py-6">
          <SectionHeader
            icon={FileCheck}
            title="Agreements"
            description="Review and accept the required mentor agreements."
          />

          <div className="mt-5 rounded-lg border border-gray-200 bg-gray-50/60 p-4 sm:p-5">
            <AgreementSentenceList
              touchpoint={AGREEMENT_TOUCHPOINTS.VERIFIED_MENTOR_APPLICATION}
              onAcceptedAgreementIdsChange={(ids) => setFieldValue('accepted_agreement_ids', ids)}
              onRequiredAcceptedChange={(accepted) => { requiredAcceptedRef.current = accepted; }}
              error={agreementsError}
              touched={touched.accepted_agreement_ids as boolean | undefined}
              onBlur={() => setFieldTouched('accepted_agreement_ids', true)}
              disabled={isSubmitting}
            />
          </div>

          <div className="mt-6 flex justify-end border-t border-gray-100 pt-5">
            <Button
              type="submit"
              className="global_btn rounded_full bg_primary w-full sm:w-auto"
              isLoading={isSubmitting}
              startContent={<Send className="h-4 w-4" />}
            >
              Submit application
            </Button>
          </div>
        </section>
      </form>
    </div>
  );
}
