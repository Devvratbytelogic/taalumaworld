'use client'
import React, { useRef, useState } from 'react'
import toast from '@/utils/toast';
import { useFormik } from 'formik';
import { contactFormSchema } from '@/utils/formValidation';
import { Send } from 'lucide-react';
import { Input } from '../ui/input';
import Button from '../ui/Button';
import { usePostContactUsMutation } from '@/store/rtkQueries/userPostAPI';
import { AgreementSentenceList } from '@/components/ui/AgreementSentenceList';
import { AGREEMENT_TOUCHPOINTS } from '@/constants/agreements';

const INQUIRY_OPTIONS = [
    'I want to become a Mentor',
    'I want to start learning',
    'Partnership enquiry',
    'School / University enquiry',
    'Corporate enquiry',
    'Technical support',
    'General enquiry',
]

export default function ContactUsPageForm() {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [postContactUs, { isLoading }] = usePostContactUsMutation();
    const requiredAcceptedRef = useRef(false);
    const formik = useFormik({
        initialValues: {
            name: '',
            email: '',
            inquiryType: '',
            subject: '',
            message: '',
            accepted_agreement_ids: [] as string[],
        },
        validationSchema: contactFormSchema,
        validate: () => {
            return requiredAcceptedRef.current ? {} : { accepted_agreement_ids: 'Please accept all required agreements before submitting.' };
        },
        onSubmit: async (values, { resetForm }) => {
            try {
                const res = await postContactUs({
                    name: values.name,
                    email: values.email,
                    subject: values.subject,
                    inquiryType: values.inquiryType,
                    message: values.message,
                    accepted_agreement_ids: values.accepted_agreement_ids,
                }).unwrap();
                if (res?.http_status_code === 200 || res?.http_status_code === 201) {
                    setIsSubmitted(true);
                    toast.success(res.message ?? 'Message sent successfully!');
                    setTimeout(() => {
                        setIsSubmitted(false);
                        resetForm();
                    }, 3000);
                }
            } catch {
                toast.error('Failed to send message. Please try again.');
            }
        },
    });
    return (
        <>
            {isSubmitted ? (
                <div className="text-center py-12">
                    <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
                        <Send className="w-8 h-8 text-success" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Message Sent!</h3>
                    <p className="text-muted-foreground">
                        Thank you for reaching out. We'll get back to you soon.
                    </p>
                </div>
            ) : (
                <form onSubmit={formik.handleSubmit} className="space-y-6">
                    {/* Name Field */}
                    <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-medium">
                            Your Name
                        </label>
                        <Input
                            id="name"
                            name="name"
                            type="text"
                            placeholder="E.g., Architect John Doe"
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className="rounded-full h-12 px-6"
                        />
                        {formik.touched.name && formik.errors.name && (
                            <p className="text-sm text-red-500">{formik.errors.name}</p>
                        )}
                    </div>

                    {/* Email Field */}
                    <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium">
                            Email Address
                        </label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="Your secure digital channel..."
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className="rounded-full h-12 px-6"
                        />
                        {formik.touched.email && formik.errors.email && (
                            <p className="text-sm text-red-500">{formik.errors.email}</p>
                        )}
                    </div>

                    {/* Inquiry Type */}
                    <div className="space-y-2">
                        <label htmlFor="inquiryType" className="text-sm font-medium">
                            How Can We Help?
                        </label>
                        <select
                            id="inquiryType"
                            name="inquiryType"
                            value={formik.values.inquiryType}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className="w-full rounded-full h-12 px-6 border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-input-focus transition-all"
                        >
                            <option value="">Select an option…</option>
                            {INQUIRY_OPTIONS.map((opt) => (
                                <option key={opt} value={opt}>{opt}</option>
                            ))}
                        </select>
                    </div>

                    {/* Subject Field */}
                    <div className="space-y-2">
                        <label htmlFor="subject" className="text-sm font-medium">
                            Subject
                        </label>
                        <Input
                            id="subject"
                            name="subject"
                            type="text"
                            placeholder="Which blueprint or pain point is this about?"
                            value={formik.values.subject}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className="rounded-full h-12 px-6"
                        />
                        {formik.touched.subject && formik.errors.subject && (
                            <p className="text-sm text-red-500">{formik.errors.subject}</p>
                        )}
                    </div>

                    {/* Message Field */}
                    <div className="space-y-2">
                        <label htmlFor="message" className="text-sm font-medium">
                            Message
                        </label>
                        <textarea
                            id="message"
                            name="message"
                            rows={6}
                            placeholder="Detail the specific gap you are looking to close..."
                            value={formik.values.message}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className="w-full px-6 py-4 rounded-3xl border border-input-border bg-input-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-input-focus transition-all resize-none"
                        />
                        {formik.touched.message && formik.errors.message && (
                            <p className="text-sm text-red-500">{formik.errors.message}</p>
                        )}
                    </div>

                    <AgreementSentenceList
                        touchpoint={AGREEMENT_TOUCHPOINTS.CONTACT_FORM}
                        onAcceptedAgreementIdsChange={(ids) => formik.setFieldValue('accepted_agreement_ids', ids)}
                        onRequiredAcceptedChange={(accepted) => { requiredAcceptedRef.current = accepted; }}
                        error={typeof formik.errors.accepted_agreement_ids === 'string' ? formik.errors.accepted_agreement_ids : undefined}
                        touched={formik.touched.accepted_agreement_ids}
                        onBlur={() => formik.setFieldTouched('accepted_agreement_ids', true)}
                        disabled={formik.isSubmitting || isLoading}
                    />

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        className='global_btn rounded_full bg_primary w-full'
                        disabled={formik.isSubmitting || isLoading}
                    >
                        {isLoading ? 'Sending...' : 'Send Message'}
                    </Button>
                </form>
            )}
        </>
    )
}
