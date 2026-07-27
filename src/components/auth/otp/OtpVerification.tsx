'use client'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@heroui/react'
import OtpInput from '@/components/auth/OtpInput';
import Button from '@/components/ui/Button';
import { useFormik } from 'formik';
import { otpVerificationSchema } from '@/utils/formValidation';
import { RootState } from '@/store/store';
import { closeModal, openModal } from '@/store/slices/allModalSlice';
import { useUserVerifyOtpMutation, useUserResendOtpMutation } from '@/store/rtkQueries/userAuthApi';
import { setAuthCookies } from '@/utils/authCookies';
import { rtkQuerieSetup } from '@/store/services/rtkQuerieSetup';
import toast from '@/utils/toast';

export default function OtpVerification() {
    const dispatch = useDispatch();
    const router = useRouter();
    const { isOpen, data } = useSelector((state: RootState) => state.allModal);
    const modalData = data 

    const [userVerifyOtp, { isLoading: isVerifying }] = useUserVerifyOtpMutation();
    const [userResendOtp, { isLoading: isResending }] = useUserResendOtpMutation();

    const { errors, touched, isSubmitting, values, handleSubmit, setFieldValue, submitForm } = useFormik({
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
                    through: modalData.through,
                }).unwrap();
                if (res?.http_status_code === 200 || res?.http_status_code === 201) {
                    toast.success(res?.message ?? 'Verification successful!');
                    resetForm();

                    if (modalData.type === 'email_verification') {
                        setAuthCookies({
                            token: res?.data?.token ?? '',
                            user: { id: res?.data?.id, email: res?.data?.email },
                            role: res?.data?.userRole?.name ?? '',
                        });

                        router.refresh()
                        dispatch(closeModal())
                    } else {
                        dispatch(openModal({ componentName: 'ResetPassword', data: { email: modalData.email, code: formValues.code } }));
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
        if (!modalData?.email) return;
        try {
            const res = await userResendOtp({ email: modalData.email, type: modalData.type }).unwrap();
            if (res?.http_status_code === 200 || res?.http_status_code === 201) {
                toast.success(res?.message ?? 'Code resent successfully!');
            }
        } catch (error) {
            console.error('Failed to resend code. Please try again.', error);
        }
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
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-4">
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
