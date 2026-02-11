'use client'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Modal, ModalBody, ModalContent, ModalHeader } from '@heroui/react'
import { Input } from '@/components/ui/input';
import Button from '@/components/ui/Button';
import { useFormik } from 'formik';
import { otpVerificationSchema } from '@/utils/formValidation';
import { RootState } from '@/store/store';
import { openModal } from '@/store/slices/allModalSlice';

export default function OtpVerification() {
    const dispatch = useDispatch();
    const { isOpen } = useSelector((state: RootState) => state.allModal);

    const { errors, touched, isSubmitting, values, handleSubmit, handleChange, handleBlur, setFieldValue } = useFormik({
        initialValues: {
            code: '',
        },
        validationSchema: otpVerificationSchema,
        onSubmit: (formValues, { resetForm }) => {
            console.log('OTP verification submitted:', formValues);
            resetForm();
            dispatch(openModal({ componentName: 'ResetPassword', data: '' }));
        },
    });

    const handleCodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const sanitizedValue = event.target.value.replace(/[^0-9]/g, '').slice(0, 6);
        setFieldValue('code', sanitizedValue);
    };

    return (
        <Modal isOpen={isOpen} className="modal_container">
            <ModalContent>
                <ModalHeader className="flex flex-col items-center text-center gap-2">
                    <p className="text-2xl font-semibold text-foreground">
                        Verify Your Email
                    </p>
                    <p className="text-sm text-muted-foreground font-normal">
                        Enter the 6-digit code we sent to your inbox
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
                                placeholder="••••••"
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
                            disabled={isSubmitting}
                            isLoading={isSubmitting}
                        >
                            Verify Code
                        </Button>
                    </form>
                    <div className="pt-4 text-center text-sm text-muted-foreground space-y-2">
                        <button
                            type="button"
                            className="font-medium text-primary hover:text-primary/80 transition-colors"
                            onClick={() => console.log('Resend verification code')}
                            disabled={isSubmitting}
                        >
                            Resend code
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
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}
