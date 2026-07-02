'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useFormik } from 'formik';
import Cookies from 'js-cookie';
import Button from '@/components/ui/Button';
import OtpInput from '@/components/auth/OtpInput';
import { otpVerificationSchema } from '@/utils/formValidation';
import { useAuthorVerifyOtpMutation, useAuthorResendOtpMutation } from '@/store/rtkQueries/adminAuth';
import toast from '@/utils/toast';
import { AuthPageShell } from '@/components/auth/AuthPageShell';
import {
    getMentorForgotPasswordRoutePath,
    getMentorLoginRoutePath,
    getMentorResetPasswordRoutePath,
} from '@/routes/routes';

export function OtpVerificationForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get('email') ?? '';
    const type = (searchParams.get('type') as 'account' | 'verify' | null) ?? 'account';

    const [authorVerifyOtp, { isLoading: isVerifying }] = useAuthorVerifyOtpMutation();
    const [authorResendOtp, { isLoading: isResending }] = useAuthorResendOtpMutation();

    const { errors, touched, isSubmitting, values, handleSubmit, setFieldValue } = useFormik({
        initialValues: { code: '' },
        validationSchema: otpVerificationSchema,
        onSubmit: async (formValues, { resetForm }) => {
            if (!email) {
                toast.error('Email is missing. Please start again.');
                router.push(getMentorForgotPasswordRoutePath());
                return;
            }

            try {
                const res = await authorVerifyOtp({ email, code: formValues.code, type }).unwrap();

                toast.success((res as { message?: string }).message ?? 'Verification successful!');
                resetForm();

                if (type === 'account') {
                    router.push(getMentorLoginRoutePath());
                } else {
                    const tempToken = (res as { data?: string }).data ?? '';
                    Cookies.set('author_reset_password_token', tempToken, { expires: 1 / 24, sameSite: 'strict' });
                    router.push(getMentorResetPasswordRoutePath());
                }
            } catch {
                toast.error('Invalid or expired code. Please try again.');
            }
        },
    });

    const handleResend = async () => {
        if (!email) return;
        try {
            const res = await authorResendOtp({ email }).unwrap();
            toast.success((res as { message?: string }).message ?? 'Code resent successfully!');
        } catch {
            toast.error('Failed to resend code. Please try again.');
        }
    };

    return (
        <AuthPageShell
            title="Verify Your Email"
            subtitle="Enter the 4-digit code we sent to your inbox"
            footer={
                <>
                    <button
                        type="button"
                        className="font-medium text-primary hover:text-primary/80 disabled:opacity-50"
                        onClick={handleResend}
                        disabled={isSubmitting || isResending}
                    >
                        {isResending ? 'Sending...' : 'Resend code'}
                    </button>
                    <p>
                        Entered the wrong email?{' '}
                        <Link href={getMentorForgotPasswordRoutePath()} className="font-medium text-primary hover:text-primary/80">
                            Try again
                        </Link>
                    </p>
                </>
            }
        >
            <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-4">
                    {email && (
                        <p className="text-sm text-center text-muted-foreground">
                            Code sent to <span className="font-medium text-foreground">{email}</span>
                        </p>
                    )}
                    <label className="text-sm font-medium text-foreground block text-center">
                        Verification Code
                    </label>
                    <OtpInput
                        value={values.code}
                        onChange={(val) => setFieldValue('code', val)}
                        length={4}
                        isDisabled={isSubmitting}
                        classNames={{
                            wrapper: 'flex gap-3 justify-center',
                            inputWrapper: `w-12 h-12 shrink-0 flex items-center justify-center border-1 rounded-[10px] bg-white transition-colors ${errors.code && touched.code ? 'border-red-500' : 'border-primary'}`,
                        }}
                    />
                    {errors.code && touched.code && (
                        <p className="text-sm text-red-600 text-center">{errors.code}</p>
                    )}
                </div>

                <Button
                    type="submit"
                    className="global_btn bg_primary w-fit mx-auto flex"
                    disabled={isSubmitting || isVerifying}
                    isLoading={isSubmitting || isVerifying}
                >
                    Verify Code
                </Button>
            </form>
        </AuthPageShell>
    );
}
