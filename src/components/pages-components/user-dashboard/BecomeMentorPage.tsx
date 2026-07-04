'use client';

import type { ComponentType } from 'react';
import Link from 'next/link';
import { useFormik } from 'formik';
import { Briefcase, CreditCard, FileCheck, Send, Share2 } from 'lucide-react';
import Button from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { AgreementCheckbox } from '@/components/ui/AgreementCheckbox';
import { cn } from '@/components/ui/utils';
import { fieldInvalidClassName, nativeSelectClassName } from '@/components/ui/field-styles';
import { mentorConversionApplicationSchema } from '@/utils/formValidation';
import { getMentorAgreementRoutePath, getRevenueShareAgreementRoutePath } from '@/routes/routes';
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
  const { values, errors, touched, isSubmitting, handleChange, handleBlur, handleSubmit, setFieldValue, setFieldTouched } =
    useFormik({
      initialValues: {
        linkedinUrl: '',
        facebookUrl: '',
        xUrl: '',
        personalWebsite: '',
        careerSummary: '',
        yearsOfExperience: '',
        paymentFrequency: '',
        bankName: '',
        accountName: '',
        accountNumber: '',
        mpesaNumber: '',
        taxId: '',
        agreeMentorAgreement: false,
        agreeRevenueShare: false,
      },
      validationSchema: mentorConversionApplicationSchema,
      onSubmit: () => {
        toast.success('Application submitted for review.');
      },
    });

  const wordCount = values.careerSummary.trim() ? values.careerSummary.trim().split(/\s+/).length : 0;

  const fieldError = (name: keyof typeof errors) =>
    touched[name] && errors[name] ? fieldInvalidClassName : '';

  return (
    <div className="space-y-6">
      <UserDashboardPageHeader
        title="Apply to Become a Mentor"
        description="Share your experience with Career Architects. An administrator will review your application."
      />

      <form noValidate onSubmit={handleSubmit} className="overflow-hidden rounded-lg border border-gray-200 bg-white">
        <section className="border-b border-gray-100 px-4 py-5 sm:px-8 sm:py-6">
          <SectionHeader
            icon={Share2}
            title="Social profiles"
            description="At least one of LinkedIn, Facebook, or X is required."
          />

          <div className="mt-5 rounded-lg border border-gray-200 bg-gray-50/60 p-4 sm:p-5">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label htmlFor="linkedinUrl" className={labelClassName}>
                  LinkedIn
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
                  Facebook
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

              <div>
                <label htmlFor="xUrl" className={labelClassName}>
                  X
                </label>
                <Input
                  id="xUrl"
                  name="xUrl"
                  value={values.xUrl}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="https://x.com/you"
                  className={fieldError('xUrl')}
                />
                {touched.xUrl && errors.xUrl ? (
                  <p className="mt-1 text-sm text-red-600">{errors.xUrl}</p>
                ) : null}
              </div>

              <div>
                <label htmlFor="personalWebsite" className={labelClassName}>
                  Personal website <span className="text-gray-400">(optional)</span>
                </label>
                <Input
                  id="personalWebsite"
                  name="personalWebsite"
                  value={values.personalWebsite}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="https://yoursite.com"
                />
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
                Career summary
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

            <div className="max-w-xs">
              <label htmlFor="yearsOfExperience" className={labelClassName}>
                Years of experience since high school
              </label>
              <Input
                id="yearsOfExperience"
                name="yearsOfExperience"
                type="number"
                min={0}
                value={values.yearsOfExperience}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="e.g. 10"
                className={fieldError('yearsOfExperience')}
              />
              {touched.yearsOfExperience && errors.yearsOfExperience ? (
                <p className="mt-1 text-sm text-red-600">{errors.yearsOfExperience}</p>
              ) : null}
            </div>
          </div>
        </section>

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
                  Bank name
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
                <label htmlFor="accountName" className={labelClassName}>
                  Account name
                </label>
                <Input
                  id="accountName"
                  name="accountName"
                  value={values.accountName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Name on account"
                  className={fieldError('accountName')}
                />
                {touched.accountName && errors.accountName ? (
                  <p className="mt-1 text-sm text-red-600">{errors.accountName}</p>
                ) : null}
              </div>

              <div>
                <label htmlFor="accountNumber" className={labelClassName}>
                  Account number
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
                  M-Pesa phone number
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
                <label htmlFor="taxId" className={labelClassName}>
                  Tax ID / KRA PIN <span className="text-gray-400">(optional)</span>
                </label>
                <Input
                  id="taxId"
                  name="taxId"
                  value={values.taxId}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Optional"
                />
              </div>

              <div>
                <label htmlFor="paymentFrequency" className={labelClassName}>
                  Preferred payment frequency
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

        <section className="px-4 py-5 sm:px-8 sm:py-6">
          <SectionHeader
            icon={FileCheck}
            title="Agreements"
            description="Review and accept the required mentor agreements."
          />

          <div className="mt-5 space-y-3 rounded-lg border border-gray-200 bg-gray-50/60 p-4 sm:p-5">
            <AgreementCheckbox
              id="agreeMentorAgreement"
              checked={values.agreeMentorAgreement}
              onCheckedChange={(checked) => setFieldValue('agreeMentorAgreement', checked)}
              onBlur={() => setFieldTouched('agreeMentorAgreement', true)}
              error={errors.agreeMentorAgreement}
              touched={touched.agreeMentorAgreement}
            >
              I accept the{' '}
              <Link
                href={getMentorAgreementRoutePath()}
                className="font-medium text-primary hover:underline"
                target="_blank"
              >
                Mentor Agreement
              </Link>
            </AgreementCheckbox>

            <AgreementCheckbox
              id="agreeRevenueShare"
              checked={values.agreeRevenueShare}
              onCheckedChange={(checked) => setFieldValue('agreeRevenueShare', checked)}
              onBlur={() => setFieldTouched('agreeRevenueShare', true)}
              error={errors.agreeRevenueShare}
              touched={touched.agreeRevenueShare}
            >
              I accept the{' '}
              <Link
                href={getRevenueShareAgreementRoutePath()}
                className="font-medium text-primary hover:underline"
                target="_blank"
              >
                Revenue Share Agreement
              </Link>
            </AgreementCheckbox>
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
