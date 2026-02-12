'use client'
import React, { useState } from 'react'
import toast from '@/utils/toast';
import { useFormik } from 'formik';
import { contactFormSchema } from '@/utils/formValidation';
import { Send } from 'lucide-react';
import { Input } from '../ui/input';
import Button from '../ui/Button';

export default function ContactUsPageForm() {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const formik = useFormik({
        initialValues: {
            name: '',
            email: '',
            subject: '',
            message: ''
        },
        validationSchema: contactFormSchema,
        onSubmit: (values, { resetForm }) => {
            console.log('Contact form submitted:', values);
            setIsSubmitted(true);
            toast.success('Message sent successfully!');
            setTimeout(() => {
                setIsSubmitted(false);
                resetForm();
            }, 3000);
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
                            placeholder="Enter your name"
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
                            placeholder="your.email@example.com"
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className="rounded-full h-12 px-6"
                        />
                        {formik.touched.email && formik.errors.email && (
                            <p className="text-sm text-red-500">{formik.errors.email}</p>
                        )}
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
                            placeholder="What's this about?"
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
                            placeholder="Tell us more about your inquiry..."
                            value={formik.values.message}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className="w-full px-6 py-4 rounded-3xl border border-input-border bg-input-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-input-focus transition-all resize-none"
                        />
                        {formik.touched.message && formik.errors.message && (
                            <p className="text-sm text-red-500">{formik.errors.message}</p>
                        )}
                    </div>

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        className='global_btn rounded_full bg_primary w-full'
                        disabled={formik.isSubmitting}
                    >
                        Send Message
                    </Button>
                </form>
            )}
        </>
    )
}
