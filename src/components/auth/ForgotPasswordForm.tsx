'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useFormik } from 'formik';
import Cookies from 'js-cookie';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import Button from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { forgotPasswordSchema, resetPasswordSchema } from '@/utils/formValidation';
import { useAdminForgotPasswordMutation, useAdminResetPasswordMutation } from '@/store/rtkQueries/adminAuth';
import toast from '@/utils/toast';
import { AuthPageShell } from '@/components/auth/AuthPageShell';
import CommonOTPVerification from '@/components/auth/CommonOTPVerification';
import { getMentorLoginRoutePath } from '@/routes/routes';

type ForgotPasswordStep = 'email' | 'otp' | 'reset';

export function ForgotPasswordForm() {
    const router = useRouter();
    const [step, setStep] = useState<ForgotPasswordStep>('email');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [adminForgotPassword, { isLoading: isSending }] = useAdminForgotPasswordMutation();
    const [authorResetPassword, { isLoading: isResetting }] = useAdminResetPasswordMutation();

    const emailForm = useFormik({
        initialValues: { email: '' },
        validationSchema: forgotPasswordSchema,
        onSubmit: async (formValues) => {
            try {
                const res = await adminForgotPassword({ user_id: formValues.email }).unwrap();
                if (res?.http_status_code === 200 || res?.http_status_code === 201) {
                    toast.success(res.message ?? 'Verification code sent to your email.');
                    setStep('otp');
                }
            } catch {
                console.log('Failed to send reset code. Please check your email and try again.');
            }
        },
    });

    const resetForm = useFormik({
        initialValues: { password: '', confirmPassword: '' },
        validationSchema: resetPasswordSchema,
        onSubmit: async (formValues, { resetForm: clearResetForm }) => {
            const token = Cookies.get('author_reset_password_token') ?? '';
            try {
                const res = await authorResetPassword({
                    token,
                    payload: {
                        password: formValues.password,
                        confirm_password: formValues.confirmPassword,
                    },
                }).unwrap();

                if (res?.http_status_code === 200 || res?.http_status_code === 201) {
                    toast.success(res.message ?? 'Password updated successfully!');
                    Cookies.remove('author_reset_password_token');
                    clearResetForm();
                    router.push(getMentorLoginRoutePath());
                }
            } catch {
                console.log('Failed to reset password. Please try again.');
            }
        },
    });

    const shellContent: Record<ForgotPasswordStep, { title: string; subtitle: string }> = {
        email: { title: 'Forgot Password?', subtitle: 'Enter your email to receive a verification code' },
        otp: { title: 'Verify Your Email', subtitle: 'Enter the 4-digit code we sent to your inbox' },
        reset: { title: 'Set a New Password', subtitle: 'Choose a strong password to secure your account' },
    };

    return (
        <AuthPageShell
            title={shellContent[step].title}
            subtitle={shellContent[step].subtitle}
            footer={
                <p>
                    Remember your password?{' '}
                    <Link href={getMentorLoginRoutePath()} className="font-medium text-primary hover:text-primary/80">
                        Sign In
                    </Link>
                </p>
            }
        >
            {step === 'email' && (
                <form className="space-y-4" onSubmit={emailForm.handleSubmit}>
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
                                className={`user_input_style ${emailForm.errors.email && emailForm.touched.email ? 'border-red-500' : ''}`}
                                disabled={emailForm.isSubmitting}
                                value={emailForm.values.email}
                                onChange={emailForm.handleChange}
                                onBlur={emailForm.handleBlur}
                            />
                        </div>
                        {emailForm.errors.email && emailForm.touched.email && (
                            <p className="text-sm text-red-600">{emailForm.errors.email}</p>
                        )}
                    </div>

                    <Button
                        type="submit"
                        className="global_btn bg_primary w-full"
                        disabled={emailForm.isSubmitting || isSending}
                        isLoading={emailForm.isSubmitting || isSending}
                    >
                        Send Code
                    </Button>
                </form>
            )}

            {step === 'otp' && (
                <CommonOTPVerification
                    email={emailForm.values.email}
                    type="forgot_password"
                    isAdmin={false}
                    onVerified={() => setStep('reset')}
                />
            )}

            {step === 'reset' && (
                <form className="space-y-4" onSubmit={resetForm.handleSubmit}>
                    <div className="space-y-2">
                        <label htmlFor="reset-password" className="text-sm font-medium text-foreground">
                            New Password
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Input
                                id="reset-password"
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Enter a new password"
                                className={`pl-12 pr-12 h-12 rounded-md ${resetForm.errors.password && resetForm.touched.password ? 'border-red-500' : ''}`}
                                disabled={resetForm.isSubmitting}
                                value={resetForm.values.password}
                                onChange={resetForm.handleChange}
                                onBlur={resetForm.handleBlur}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                disabled={resetForm.isSubmitting}
                            >
                                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                        </div>
                        {resetForm.errors.password && resetForm.touched.password && (
                            <p className="text-sm text-red-600">{resetForm.errors.password}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="reset-confirmPassword" className="text-sm font-medium text-foreground">
                            Confirm Password
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Input
                                id="reset-confirmPassword"
                                name="confirmPassword"
                                type={showConfirmPassword ? 'text' : 'password'}
                                placeholder="Re-enter your password"
                                className={`pl-12 pr-12 h-12 rounded-md ${resetForm.errors.confirmPassword && resetForm.touched.confirmPassword ? 'border-red-500' : ''}`}
                                disabled={resetForm.isSubmitting}
                                value={resetForm.values.confirmPassword}
                                onChange={resetForm.handleChange}
                                onBlur={resetForm.handleBlur}
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                disabled={resetForm.isSubmitting}
                            >
                                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                        </div>
                        {resetForm.errors.confirmPassword && resetForm.touched.confirmPassword && (
                            <p className="text-sm text-red-600">{resetForm.errors.confirmPassword}</p>
                        )}
                    </div>

                    <Button
                        type="submit"
                        className="global_btn bg_primary w-full"
                        disabled={resetForm.isSubmitting || isResetting}
                        isLoading={resetForm.isSubmitting || isResetting}
                    >
                        Update Password
                    </Button>
                </form>
            )}
        </AuthPageShell>
    );
}
