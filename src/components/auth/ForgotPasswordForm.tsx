'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useFormik } from 'formik';
import { Mail } from 'lucide-react';
import Button from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { forgotPasswordSchema } from '@/utils/formValidation';
import { useAdminForgotPasswordMutation } from '@/store/rtkQueries/adminAuth';
import toast from '@/utils/toast';
import { AuthPageShell } from '@/components/auth/AuthPageShell';
import {
    getMentorLoginRoutePath,
} from '@/routes/routes';

export function ForgotPasswordForm() {
    const router = useRouter();
    const [adminForgotPassword, { isLoading: isSending }] = useAdminForgotPasswordMutation();

    const { errors, touched, isSubmitting, values, handleSubmit, handleChange, handleBlur } = useFormik({
        initialValues: { email: '' },
        validationSchema: forgotPasswordSchema,
        onSubmit: async (formValues, { resetForm }) => {
            try {
                const res = await adminForgotPassword({ user_id: formValues.email }).unwrap();
                toast.success((res as { message?: string }).message ?? 'Verification code sent to your email.');
                resetForm();
                router.push(getMentorVerifyRoutePath({ email: formValues.email, type: 'verify' }));
            } catch {
                console.log('Failed to send reset code. Please check your email and try again.');
            }
        },
    });

    return (
        <AuthPageShell
            title="Forgot Password?"
            subtitle="Enter your email to receive a verification code"
            footer={
                <p>
                    Remember your password?{' '}
                    <Link href={getMentorLoginRoutePath()} className="font-medium text-primary hover:text-primary/80">
                        Sign In
                    </Link>
                </p>
            }
        >
            <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="space-y-2">
                    <label htmlFor="forgot-email" className="text-sm font-medium text-foreground">
                        Email Address
                    </label>
                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input
                            id="forgot-email"
                            name="email"
                            type="email"
                            placeholder="you@example.com"
                            className={`user_input_style ${errors.email && touched.email ? 'border-red-500' : ''}`}
                            disabled={isSubmitting}
                            value={values.email}
                            onChange={handleChange}
                            onBlur={handleBlur}
                        />
                    </div>
                    {errors.email && touched.email && (
                        <p className="text-sm text-red-600">{errors.email}</p>
                    )}
                </div>

                <Button
                    type="submit"
                    className="global_btn bg_primary w-full"
                    disabled={isSubmitting || isSending}
                    isLoading={isSubmitting || isSending}
                >
                    Send Code
                </Button>
            </form>
        </AuthPageShell>
    );
}
