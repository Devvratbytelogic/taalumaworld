'use client'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@heroui/react'
import { Input } from '@/components/ui/input';
import Button from '@/components/ui/Button';
import { useFormik } from 'formik';
import { otpVerificationSchema } from '@/utils/formValidation';
import { RootState } from '@/store/store';
import { closeModal, openModal } from '@/store/slices/allModalSlice';
import { useUserVerifyOtpMutation, useUserResendOtpMutation } from '@/store/rtkQueries/userAuthApi';
import toast from '@/utils/toast';

export default function OtpVerification() {
    const dispatch = useDispatch();
    const { isOpen, data } = useSelector((state: RootState) => state.allModal);
    const modalData = data as { email: string; type: 'account' | 'verify' } | null;

    const [userVerifyOtp, { isLoading: isVerifying }] = useUserVerifyOtpMutation();
    const [userResendOtp, { isLoading: isResending }] = useUserResendOtpMutation();

    const { errors, touched, isSubmitting, values, handleSubmit, handleChange, handleBlur, setFieldValue } = useFormik({
        initialValues: {
            code: '',
        },
        validationSchema: otpVerificationSchema,
        onSubmit: async (formValues, { resetForm }) => {
            if (!modalData?.email) return;
            try {
                const res = await userVerifyOtp({
                    email: modalData.email,
                    code: formValues.code,
                    type: modalData.type,
                }).unwrap();

                toast.success((res as { message?: string }).message ?? 'Verification successful!');
                resetForm();

                if (modalData.type === 'account') {
                    dispatch(openModal({ componentName: 'SignIn', data: '' }));
                } else {
                    const tempToken = (res as { data?: string }).data ?? '';
                    dispatch(openModal({ componentName: 'ResetPassword', data: { email: modalData.email, code: formValues.code, token: tempToken } }));
                }
            } catch {
                toast.error('Invalid or expired code. Please try again.');
            }
        },
    });

    const handleResend = async () => {
        if (!modalData?.email) return;
        try {
            const res = await userResendOtp({ email: modalData.email }).unwrap();
            toast.success((res as { message?: string }).message ?? 'Code resent successfully!');
        } catch {
            toast.error('Failed to resend code. Please try again.');
        }
    };

    const handleCodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const sanitizedValue = event.target.value.replace(/[^0-9]/g, '').slice(0, 6);
        setFieldValue('code', sanitizedValue);
    };

    return (
        <Modal isOpen={isOpen} onClose={() => dispatch(closeModal())} className="modal_container">
            <ModalContent>
                <ModalHeader className="flex flex-col items-center text-center gap-2">
                    <p className="text-2xl font-semibold text-foreground">
                        Verify Your Email
                    </p>
                    <p className="text-sm text-muted-foreground font-normal">
                        Enter the 4-digit code we sent to your inbox
                    </p>
                </ModalHeader>
                <ModalBody>
                    <form className="space-y-3" onSubmit={handleSubmit}>
                        <div className="space-y-2">
                            <label htmlFor="code" className="text-sm font-medium text-foreground">
                                Verification Code
                            </label>
                            <Input
                                id="code"
                                type="text"
                                inputMode="numeric"
                                placeholder="••••"
                                className={`h-12 text-center text-lg tracking-[0.7rem] rounded-2xl ${errors.code && touched.code ? 'border-red-500' : ''}`}
                                disabled={isSubmitting}
                                value={values.code}
                                onChange={handleCodeChange}
                                onBlur={handleBlur}
                            />
                            {errors.code && touched.code && (
                                <p className="text-sm text-red-600">{errors.code}</p>
                            )}
                        </div>

                        <Button
                            type="submit"
                            className="global_btn bg_primary w-full"
                            disabled={isSubmitting || isVerifying}
                            isLoading={isSubmitting || isVerifying}
                        >
                            Verify Code
                        </Button>
                    </form>
                    <ModalFooter>
                        <div className="w-full text-center text-sm text-muted-foreground space-y-2">
                            <button
                                type="button"
                                className="font-medium text-primary hover:text-primary/80 transition-colors disabled:opacity-50"
                                onClick={handleResend}
                                disabled={isSubmitting || isResending}
                            >
                                {isResending ? 'Sending...' : 'Resend code'}
                            </button>
                            <div>
                                <span>Entered the wrong email? </span>
                                <button
                                    type="button"
                                    className="font-medium text-primary hover:text-primary/80 transition-colors"
                                    onClick={() => dispatch(openModal({ componentName: 'ForgotPassword', data: '' }))}
                                    disabled={isSubmitting}
                                >
                                    Try again
                                </button>
                            </div>
                        </div>
                    </ModalFooter>
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}
