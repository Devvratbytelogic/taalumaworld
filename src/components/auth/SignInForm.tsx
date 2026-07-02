'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { useFormik } from 'formik';
import { Mail, Lock, Eye, EyeOff, Shield } from 'lucide-react';
import Button from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { signInSchema } from '@/utils/formValidation';
import { useAdminLoginMutation } from '@/store/rtkQueries/adminAuth';
import { setAuthCookies } from '@/utils/authCookies';
import { rtkQuerieSetup } from '@/store/services/rtkQuerieSetup';
import toast from '@/utils/toast';
import { AuthPageShell } from '@/components/auth/AuthPageShell';
import {
    getAdminDashboardRoutePath,
    getHomeRoutePath,
    getMentorForgotPasswordRoutePath,
    getMentorSignupRoutePath,
    getMentorVerifyRoutePath,
} from '@/routes/routes';

type StaffSignInVariant = 'mentor' | 'admin';

type SignInFormProps = {
    variant: StaffSignInVariant;
};

export function SignInForm({ variant }: SignInFormProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const dispatch = useDispatch();
    const redirectTo = searchParams.get('redirect') ?? undefined;
    const [showPassword, setShowPassword] = useState(false);
    const [adminLogin, { isLoading }] = useAdminLoginMutation();

    const isMentor = variant === 'mentor';
    const isAdmin = variant === 'admin';

    const { errors, touched, isSubmitting, values, handleSubmit, handleChange, handleBlur } = useFormik({
        initialValues: { email: '', password: '' },
        validationSchema: signInSchema,
        onSubmit: async (vals, { resetForm }) => {
            try {
                const res = await adminLogin({ email: vals.email, password: vals.password }).unwrap();
                if (!res.success || !res.data) return;

                const { token, userRole } = res.data as {
                    token: string;
                    userRole: {
                        name: string;
                        id?: number;
                        _id?: string;
                        user_id?: string | number;
                    };
                };

                setAuthCookies({
                    token,
                    user: { id: String(userRole.user_id), _id: userRole._id },
                    role: {
                        name: userRole.name,
                        id: userRole.id !== undefined ? String(userRole.id) : undefined,
                        _id: userRole._id,
                    },
                });

                dispatch(rtkQuerieSetup.util.invalidateTags([
                    'AllChapters', 'Cart', 'UserProfile', 'MyChapters', 'ReadingHistory', 'AdminProfile',
                ]));

                resetForm();
                toast.success(res.message ?? 'Sign in successful!');
                router.push(redirectTo ?? getAdminDashboardRoutePath());
            } catch (error) {
                const errMsg = (error as { data?: { message?: string } })?.data?.message ?? '';
                if (errMsg.toLowerCase().includes('verify your account')) {
                    toast.info(errMsg);
                    router.push(getMentorVerifyRoutePath({ email: vals.email, type: 'account' }));
                }
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
                isAdmin ? (
                    <p className="text-xs">This page is not linked on the public website.</p>
                ) : (
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
                )
            }
        >
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
                            className={`pl-12 h-12 rounded-2xl ${errors.email && touched.email ? 'border-red-500' : ''}`}
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

                <div className="text-right">
                    <Link href={getMentorForgotPasswordRoutePath()} className="text-sm text-primary hover:text-primary/80 font-medium">
                        Forgot Password?
                    </Link>
                </div>

                <Button
                    type="submit"
                    className="global_btn bg_primary w-full"
                    disabled={isSubmitting || isLoading}
                    isLoading={isSubmitting || isLoading}
                >
                    Sign In
                </Button>
            </form>
        </AuthPageShell>
    );
}
