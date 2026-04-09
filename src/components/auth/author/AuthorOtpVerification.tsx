'use client'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@heroui/react'
import OtpInput from '@/components/auth/OtpInput'
import Button from '@/components/ui/Button'
import { useFormik } from 'formik'
import { otpVerificationSchema } from '@/utils/formValidation'
import { RootState } from '@/store/store'
import { closeModal, openModal } from '@/store/slices/allModalSlice'
import { useAuthorVerifyOtpMutation, useAuthorResendOtpMutation } from '@/store/rtkQueries/adminAuth'
import toast from '@/utils/toast'
import Cookies from 'js-cookie'

export default function AuthorOtpVerification() {
    const dispatch = useDispatch()
    const { isOpen, data } = useSelector((state: RootState) => state.allModal)
    const modalData = data as { email: string; type: 'account' | 'verify' } | null

    const [authorVerifyOtp, { isLoading: isVerifying }] = useAuthorVerifyOtpMutation()
    const [authorResendOtp, { isLoading: isResending }] = useAuthorResendOtpMutation()

    const { errors, touched, isSubmitting, values, handleSubmit, setFieldValue } = useFormik({
        initialValues: {
            code: '',
        },
        validationSchema: otpVerificationSchema,
        onSubmit: async (formValues, { resetForm }) => {
            if (!modalData?.email) return
            try {
                const res = await authorVerifyOtp({
                    email: modalData.email,
                    code: formValues.code,
                    type: modalData.type,
                }).unwrap()

                toast.success((res as { message?: string }).message ?? 'Verification successful!')
                resetForm()

                if (modalData.type === 'account') {
                    dispatch(openModal({ componentName: 'AuthorSignIn', data: '' }))
                } else {
                    const tempToken = (res as { data?: string }).data ?? ''
                    Cookies.set('author_reset_password_token', tempToken, { expires: 1 / 24, sameSite: 'strict' })
                    dispatch(openModal({ componentName: 'AuthorResetPassword', data: { email: modalData.email, code: formValues.code } }))
                }
            } catch {
                toast.error('Invalid or expired code. Please try again.')
            }
        },
    })

    const handleResend = async () => {
        if (!modalData?.email) return
        try {
            const res = await authorResendOtp({ email: modalData.email }).unwrap()
            toast.success((res as { message?: string }).message ?? 'Code resent successfully!')
        } catch {
            toast.error('Failed to resend code. Please try again.')
        }
    }

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
                                    inputWrapper: `w-12 h-12 shrink-0 flex items-center justify-center border rounded-[10px] bg-white transition-colors ${errors.code && touched.code ? 'border-red-500' : 'border-muted-color focus-within:border-body-color/40'}`,
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
                                    onClick={() => dispatch(openModal({ componentName: 'AuthorForgotPassword', data: '' }))}
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
