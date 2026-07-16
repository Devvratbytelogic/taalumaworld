'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useFormik } from 'formik';
import Cookies from 'js-cookie';
import { Eye, EyeOff, Lock } from 'lucide-react';
import Button from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { resetPasswordSchema } from '@/utils/formValidation';
import { useAuthorResetPasswordMutation } from '@/store/rtkQueries/adminAuth';
import toast from '@/utils/toast';
import { AuthPageShell } from '@/components/auth/AuthPageShell';
import { getMentorLoginRoutePath } from '@/routes/routes';

export function ResetPasswordForm() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [authorResetPassword, { isLoading: isResetting }] = useAuthorResetPasswordMutation();

    const { errors, touched, isSubmitting, values, handleSubmit, handleChange, handleBlur } = useFormik({
        initialValues: { password: '', confirmPassword: '' },
        validationSchema: resetPasswordSchema,
        onSubmit: async (formValues, { resetForm }) => {
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
                    resetForm();
                    router.push(getMentorLoginRoutePath());
                }
            } catch {
                console.log('Failed to reset password. Please try again.');
            }
        },
    });

    return (
        <AuthPageShell
            title="Set a New Password"
            subtitle="Choose a strong password to secure your account"
            footer={
                <p>
                    Remembered your password?{' '}
                    <Link href={getMentorLoginRoutePath()} className="font-medium text-primary hover:text-primary/80">
                        Sign In
                    </Link>
                </p>
            }
        >
            <form className="space-y-4" onSubmit={handleSubmit}>
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
                            className={`pl-12 pr-12 h-12 rounded-2xl ${errors.password && touched.password ? 'border-red-500' : ''}`}
                            disabled={isSubmitting}
                            value={values.password}
                            onChange={handleChange}
                            onBlur={handleBlur}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            disabled={isSubmitting}
                        >
                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                    </div>
                    {errors.password && touched.password && (
                        <p className="text-sm text-red-600">{errors.password}</p>
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
                            className={`pl-12 pr-12 h-12 rounded-2xl ${errors.confirmPassword && touched.confirmPassword ? 'border-red-500' : ''}`}
                            disabled={isSubmitting}
                            value={values.confirmPassword}
                            onChange={handleChange}
                            onBlur={handleBlur}
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            disabled={isSubmitting}
                        >
                            {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                    </div>
                    {errors.confirmPassword && touched.confirmPassword && (
                        <p className="text-sm text-red-600">{errors.confirmPassword}</p>
                    )}
                </div>

                <Button
                    type="submit"
                    className="global_btn bg_primary w-full"
                    disabled={isSubmitting || isResetting}
                    isLoading={isSubmitting || isResetting}
                >
                    Update Password
                </Button>
            </form>
        </AuthPageShell>
    );
}
