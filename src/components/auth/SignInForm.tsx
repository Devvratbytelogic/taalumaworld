'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useFormik } from 'formik';
import { Mail, Lock, Eye, EyeOff, Shield } from 'lucide-react';
import Button from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { signInSchema } from '@/utils/formValidation';
import { useAdminLoginMutation } from '@/store/rtkQueries/adminAuth';
import toast from '@/utils/toast';
import { AuthPageShell } from '@/components/auth/AuthPageShell';
import CommonOTPVerification from '@/components/auth/CommonOTPVerification';
import { getAdminDashboardRoutePath, getHomeRoutePath, getMentorDashboardRoutePath, getMentorForgotPasswordRoutePath, getMentorSignupRoutePath } from '@/routes/routes';
import usePreventRefresh from '@/hooks/preventRefresh';
import { setAuthCookies } from '@/utils/authCookies';

type StaffSignInVariant = 'mentor' | 'admin';

type SignInFormProps = {
    variant: StaffSignInVariant;
};

const LOGIN_OTP_MESSAGE = 'Verification code sent to your email. Complete login with verify OTP.';

export function SignInForm({ variant }: SignInFormProps) {
    usePreventRefresh();
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [showOtp, setShowOtp] = useState(false);
    const [adminLogin, { isLoading }] = useAdminLoginMutation();

    const isMentor = variant === 'mentor';
    const isAdmin = variant === 'admin';

    const { errors, touched, isSubmitting, values, handleSubmit, handleChange, handleBlur } = useFormik({
        initialValues: { email: '', password: '' },
        validationSchema: signInSchema,
        onSubmit: async (vals) => {
            try {
                const res = await adminLogin({ email: vals.email, password: vals.password }).unwrap();
                if (res?.http_status_code === 200 || res?.http_status_code === 201) {
                    if (res?.message === LOGIN_OTP_MESSAGE) {
                        setShowOtp(true);
                        toast.success(res.message);
                        return;
                    } else {
                        toast.success(res.message ?? 'Verification successful!');
                        setAuthCookies({
                            token: res?.data?.token ?? '',
                            user: { id: res?.data?.id, email: res?.data?.email },
                            role: res?.data?.userRole?.name ?? '',
                        })
                        router.push(isAdmin ? getAdminDashboardRoutePath() : getMentorDashboardRoutePath());
                    }
                }
            } catch (error) {
                console.error('Failed to login. Please try again.', error);
            }
        },
    });

    const title = isMentor ? 'Mentor Sign In' : 'Administrator Sign In';
    const subtitle = isMentor
        ? 'Sign in to publish and manage your content'
        : 'Restricted access for authorized staff only';

    return (
        <AuthPageShell
            title={title}
            subtitle={subtitle}
            icon={isAdmin ? <Shield className="h-6 w-6 text-primary" /> : undefined}
            footer={
                isMentor ?
                    <>
                        <p>
                            Don&apos;t have an account?{' '}
                            <Link href={getMentorSignupRoutePath()} className="font-medium text-primary hover:text-primary/80">
                                Register as Mentor
                            </Link>
                        </p>
                        <Link href={getHomeRoutePath()} className="inline-block text-primary hover:text-primary/80">
                            Back to home
                        </Link>
                    </>
                    : null
            }
        >
            {showOtp ? (
                <CommonOTPVerification email={values.email} type="login_2fa" isAdmin={isAdmin} />
            ) : (
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div className="space-y-2">
                        <label htmlFor="signin-email" className="text-sm font-medium text-foreground">
                            Email Address
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Input
                                id="signin-email"
                                name="email"
                                type="email"
                                placeholder={isAdmin ? 'you@taaluma.world' : 'you@example.com'}
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

                    <div className="space-y-2">
                        <label htmlFor="signin-password" className="text-sm font-medium text-foreground">
                            Password
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Input
                                id="signin-password"
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Enter your password"
                                className={`user_input_style ${errors.password && touched.password && 'border-red-500'}`}
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

                    {isMentor && <div className="text-right">
                        <Link href={getMentorForgotPasswordRoutePath()} className="text-sm text-primary hover:text-primary/80 font-medium">
                            Forgot Password?
                        </Link>
                    </div>}

                    <Button
                        type="submit"
                        className="global_btn bg_primary w-full"
                        disabled={isSubmitting || isLoading}
                        isLoading={isSubmitting || isLoading}
                    >
                        Sign In
                    </Button>
                </form>
            )}
        </AuthPageShell>
    );
}
