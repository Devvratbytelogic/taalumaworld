import { useAdminResendOtpMutation, useAdminVerifyOtpMutation } from '@/store/rtkQueries/adminAuth';
import OtpInput from './OtpInput';
import { otpVerificationSchema } from '@/utils/formValidation';
import { useFormik } from 'formik';
import toast from '@/utils/toast';
import { Button } from '@heroui/react';
import Cookies from 'js-cookie';
import { setAuthCookies } from '@/utils/authCookies';
import { useRouter } from 'next/navigation';
import { getAdminDashboardRoutePath, getMentorDashboardRoutePath } from '@/routes/routes';

interface CommonOTPVerificationProps {
    email: string;
    type: 'email_verification' | 'login_2fa' | 'forgot_password';
    isAdmin: boolean;
    /** Called on successful verification instead of the default cookie-set + dashboard redirect. */
    onVerified?: () => void;
}
export default function CommonOTPVerification({ email, type, isAdmin, onVerified }: CommonOTPVerificationProps) {
    const router = useRouter();
    const [adminVerifyOtp, { isLoading: isVerifying }] = useAdminVerifyOtpMutation();
    const [adminResendOtp, { isLoading: isResending }] = useAdminResendOtpMutation();

    const { errors, touched, isSubmitting, values, handleSubmit, setFieldValue, submitForm } = useFormik({
        initialValues: { code: '' },
        validationSchema: otpVerificationSchema,
        onSubmit: async (value, { resetForm }) => {
            try {
                const res = await adminVerifyOtp({ email, code: value.code, type }).unwrap();

                if (res?.http_status_code === 200 || res?.http_status_code === 201) {
                    toast.success(res.message ?? 'Verification successful!');
                    if (type === 'forgot_password') {
                        onVerified?.();
                    } else if (onVerified) {
                        onVerified();
                    } else {
                        setAuthCookies({
                            token: res?.data?.token ?? '',
                            user: { id: res?.data?.id, email: res?.data?.email },
                            role: res?.data?.userRole?.name ?? '',
                        })
                        router.push(isAdmin ? getAdminDashboardRoutePath() : getMentorDashboardRoutePath());
                    }
                }
            } catch (error) {
                console.error('Invalid or expired code. Please try again.', error);
            }
        },
    });

    const handleOtpComplete = async (code: string) => {
        await setFieldValue('code', code);
        submitForm();
    };

    const handleResend = async () => {
        try {
            const res = await adminResendOtp({ email, type }).unwrap();
            toast.success((res as { message?: string }).message ?? 'Code resent successfully!');
        } catch (error) {
            console.error('Failed to resend code. Please try again.', error);
        }
    };
    return (
        <>
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
                        onComplete={handleOtpComplete}
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
            <div className="mt-4 text-center">
                <button
                    type="button"
                    className="text-sm font-medium text-primary hover:text-primary/80 disabled:opacity-50"
                    onClick={handleResend}
                    disabled={isSubmitting || isResending}
                >
                    {isResending ? 'Sending...' : 'Resend code'}
                </button>
            </div>
        </>
    )
}
