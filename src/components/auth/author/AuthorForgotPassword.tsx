'use client'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@heroui/react'
import { Input } from '@/components/ui/input'
import Button from '@/components/ui/Button'
import { Mail } from 'lucide-react'
import { useFormik } from 'formik'
import { forgotPasswordSchema } from '@/utils/formValidation'
import { RootState } from '@/store/store'
import { closeModal, openModal } from '@/store/slices/allModalSlice'
import { useAuthorForgotPasswordMutation } from '@/store/rtkQueries/adminAuth'
import toast from '@/utils/toast'

export default function AuthorForgotPassword() {
    const dispatch = useDispatch()
    const { isOpen } = useSelector((state: RootState) => state.allModal)
    const [authorForgotPassword, { isLoading: isSending }] = useAuthorForgotPasswordMutation()

    const { errors, touched, isSubmitting, values, handleSubmit, handleChange, handleBlur } = useFormik({
        initialValues: {
            email: '',
        },
        validationSchema: forgotPasswordSchema,
        onSubmit: async (formValues, { resetForm }) => {
            try {
                const res = await authorForgotPassword({ user_id: formValues.email }).unwrap()
                toast.success((res as { message?: string }).message ?? 'Verification code sent to your email.')
                resetForm()
                dispatch(openModal({ componentName: 'AuthorOtpVerification', data: { email: formValues.email, type: 'verify' } }))
            } catch {
                console.log('Failed to send reset code. Please check your email and try again.')
            }
        },
    })

    return (
        <Modal isOpen={isOpen} onClose={() => dispatch(closeModal())} className="modal_container">
            <ModalContent>
                <ModalHeader className="flex flex-col items-center text-center gap-2">
                    <p className="text-2xl font-semibold text-foreground">
                        Forgot Password?
                    </p>
                    <p className="text-sm text-muted-foreground font-normal">
                        Enter your email to receive a verification code
                    </p>
                </ModalHeader>
                <ModalBody>
                    <form className="space-y-3" onSubmit={handleSubmit}>
                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-medium text-foreground">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="you@example.com"
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

                        <Button
                            type="submit"
                            className="global_btn bg_primary w-full"
                            disabled={isSubmitting || isSending}
                            isLoading={isSubmitting || isSending}
                        >
                            Send Code
                        </Button>
                    </form>
                    <ModalFooter>
                        <div className="w-full text-center text-sm text-muted-foreground">
                            <span>Remember your password? </span>
                            <button
                                type="button"
                                className="font-medium text-primary hover:text-primary/80 transition-colors"
                                onClick={() => dispatch(openModal({ componentName: 'AuthorSignIn', data: '' }))}
                                disabled={isSubmitting}
                            >
                                Sign In
                            </button>
                        </div>
                    </ModalFooter>
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}
