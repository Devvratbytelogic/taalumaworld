'use client';

import Link from 'next/link';
import { useFormik } from 'formik';
import { Send } from 'lucide-react';
import Button from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { AgreementCheckbox } from '@/components/ui/AgreementCheckbox';
import { mentorConversionApplicationSchema } from '@/utils/formValidation';
import { getMentorAgreementRoutePath, getRevenueShareAgreementRoutePath } from '@/routes/routes';
import toast from '@/utils/toast';
import { UserDashboardPageHeader } from './UserDashboardPageHeader';

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

  return (
    <div className="space-y-6">
      <UserDashboardPageHeader
        title="Apply to Become a Mentor"
        description="Share your experience with Career Architects. An administrator will review your application."
      />

      <form
        noValidate
        onSubmit={handleSubmit}
        className="space-y-8 rounded-lg border border-gray-200 bg-white p-6 sm:p-8"
      >
        <div className="space-y-4 border-b border-gray-100 pb-8">
          <h2 className="text-base font-semibold text-gray-900">Social profiles</h2>
          <p className="text-sm text-muted-foreground">At least one of LinkedIn, Facebook, or X is required.</p>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="linkedinUrl">LinkedIn</Label>
              <Input id="linkedinUrl" name="linkedinUrl" value={values.linkedinUrl} onChange={handleChange} onBlur={handleBlur} placeholder="https://linkedin.com/in/you" />
              {touched.linkedinUrl && errors.linkedinUrl ? <p className="text-sm text-red-600">{errors.linkedinUrl}</p> : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="facebookUrl">Facebook</Label>
              <Input id="facebookUrl" name="facebookUrl" value={values.facebookUrl} onChange={handleChange} onBlur={handleBlur} placeholder="https://facebook.com/you" />
              {touched.facebookUrl && errors.facebookUrl ? <p className="text-sm text-red-600">{errors.facebookUrl}</p> : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="xUrl">X</Label>
              <Input id="xUrl" name="xUrl" value={values.xUrl} onChange={handleChange} onBlur={handleBlur} placeholder="https://x.com/you" />
              {touched.xUrl && errors.xUrl ? <p className="text-sm text-red-600">{errors.xUrl}</p> : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="personalWebsite">Personal website (optional)</Label>
              <Input id="personalWebsite" name="personalWebsite" value={values.personalWebsite} onChange={handleChange} onBlur={handleBlur} />
            </div>
          </div>
        </div>

        <div className="space-y-4 border-b border-gray-100 pb-8">
          <h2 className="text-base font-semibold text-gray-900">Experience</h2>
          <div className="space-y-2">
            <Label htmlFor="careerSummary">Career summary</Label>
            <Textarea id="careerSummary" name="careerSummary" rows={5} value={values.careerSummary} onChange={handleChange} onBlur={handleBlur} />
            <p className={`text-xs text-muted-foreground ${wordCount > 300 ? 'text-red-600' : ''}`}>{wordCount} / 300 words</p>
            {touched.careerSummary && errors.careerSummary ? <p className="text-sm text-red-600">{errors.careerSummary}</p> : null}
          </div>
          <div className="space-y-2 max-w-xs">
            <Label htmlFor="yearsOfExperience">Years of experience since high school</Label>
            <Input id="yearsOfExperience" name="yearsOfExperience" type="number" min={0} value={values.yearsOfExperience} onChange={handleChange} onBlur={handleBlur} />
            {touched.yearsOfExperience && errors.yearsOfExperience ? <p className="text-sm text-red-600">{errors.yearsOfExperience}</p> : null}
          </div>
        </div>

        <div className="space-y-4 border-b border-gray-100 pb-8">
          <h2 className="text-base font-semibold text-gray-900">Payment information</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="bankName">Bank name</Label>
              <Input id="bankName" name="bankName" value={values.bankName} onChange={handleChange} onBlur={handleBlur} placeholder="e.g. Equity Bank" />
              {touched.bankName && errors.bankName ? <p className="text-sm text-red-600">{errors.bankName}</p> : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="accountName">Account name</Label>
              <Input id="accountName" name="accountName" value={values.accountName} onChange={handleChange} onBlur={handleBlur} />
              {touched.accountName && errors.accountName ? <p className="text-sm text-red-600">{errors.accountName}</p> : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="accountNumber">Account number</Label>
              <Input id="accountNumber" name="accountNumber" value={values.accountNumber} onChange={handleChange} onBlur={handleBlur} />
              {touched.accountNumber && errors.accountNumber ? <p className="text-sm text-red-600">{errors.accountNumber}</p> : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="mpesaNumber">M-Pesa phone number</Label>
              <Input id="mpesaNumber" name="mpesaNumber" value={values.mpesaNumber} onChange={handleChange} onBlur={handleBlur} placeholder="e.g. 0712345678" />
              {touched.mpesaNumber && errors.mpesaNumber ? <p className="text-sm text-red-600">{errors.mpesaNumber}</p> : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="taxId">Tax ID / KRA PIN (optional)</Label>
              <Input id="taxId" name="taxId" value={values.taxId} onChange={handleChange} onBlur={handleBlur} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="paymentFrequency">Preferred payment frequency</Label>
              <select
                id="paymentFrequency"
                name="paymentFrequency"
                value={values.paymentFrequency}
                onChange={handleChange}
                onBlur={handleBlur}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="">Select frequency</option>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="annually">Annually</option>
              </select>
              {touched.paymentFrequency && errors.paymentFrequency ? (
                <p className="text-sm text-red-600">{errors.paymentFrequency}</p>
              ) : null}
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <AgreementCheckbox
            id="agreeMentorAgreement"
            checked={values.agreeMentorAgreement}
            onCheckedChange={(checked) => setFieldValue('agreeMentorAgreement', checked)}
            onBlur={() => setFieldTouched('agreeMentorAgreement', true)}
            error={errors.agreeMentorAgreement}
            touched={touched.agreeMentorAgreement}
          >
            I accept the{' '}
            <Link href={getMentorAgreementRoutePath()} className="font-medium text-primary hover:underline" target="_blank">
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
            <Link href={getRevenueShareAgreementRoutePath()} className="font-medium text-primary hover:underline" target="_blank">
              Revenue Share Agreement
            </Link>
          </AgreementCheckbox>
        </div>

        <Button type="submit" className="global_btn rounded_full bg_primary" isLoading={isSubmitting} startContent={<Send className="h-4 w-4" />}>
          Submit application
        </Button>
      </form>
    </div>
  );
}
