'use client'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Modal, ModalBody, ModalContent, ModalHeader } from '@heroui/react'
import { Input } from '@/components/ui/input'
import Button from '@/components/ui/Button'
import { Eye, EyeOff, Lock } from 'lucide-react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { RootState } from '@/store/store'
import { closeModal } from '@/store/slices/allModalSlice'
import { useAuthorChangePasswordMutation } from '@/store/rtkQueries/adminAuth'
import toast from '@/utils/toast'

const changePasswordSchema = Yup.object({
    currentPassword: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .required('Current password is required'),
    newPassword: Yup.string()
        .min(8, 'Password must be at least 8 characters')
        .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .matches(/[0-9]/, 'Password must contain at least one number')
        .matches(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/, 'Password must contain at least one special character')
        .required('New password is required'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('newPassword')], 'Passwords must match')
        .required('Please confirm your new password'),
})

export default function AuthorChangePassword() {
    const dispatch = useDispatch()
    const { isOpen } = useSelector((state: RootState) => state.allModal)
    const [showCurrent, setShowCurrent] = useState(false)
    const [showNew, setShowNew] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)
    const [authorChangePassword, { isLoading: isChanging }] = useAuthorChangePasswordMutation()

    const { errors, touched, isSubmitting, values, handleSubmit, handleChange, handleBlur } = useFormik({
        initialValues: {
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
        },
        validationSchema: changePasswordSchema,
        onSubmit: async (formValues, { resetForm }) => {
            try {
                const res = await authorChangePassword({
                    current_password: formValues.currentPassword,
                    password: formValues.newPassword,
                    confirm_password: formValues.confirmPassword,
                }).unwrap()
                toast.success((res as { message?: string }).message ?? 'Password changed successfully!')
                resetForm()
                dispatch(closeModal())
            } catch (error) {
                const errMsg = (error as { data?: { message?: string } })?.data?.message ?? ''
                toast.error(errMsg || 'Failed to change password. Please try again.')
            }
        },
    })

    return (
        <Modal isOpen={isOpen} onClose={() => dispatch(closeModal())} className="modal_container">
            <ModalContent>
                <ModalHeader className="flex flex-col items-center text-center gap-2">
                    <p className="text-2xl font-semibold text-foreground">
                        Change Password
                    </p>
                    <p className="text-sm text-muted-foreground font-normal">
                        Update your account password
                    </p>
                </ModalHeader>
                <ModalBody className="pb-6">
                    <form className="space-y-3" onSubmit={handleSubmit}>
                        <div className="space-y-2">
                            <label htmlFor="currentPassword" className="text-sm font-medium text-foreground">
                                Current Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                <Input
                                    id="currentPassword"
                                    type={showCurrent ? 'text' : 'password'}
                                    placeholder="Enter your current password"
                                    className={`pl-12 pr-12 h-12 rounded-2xl ${errors.currentPassword && touched.currentPassword ? 'border-red-500' : ''}`}
                                    disabled={isSubmitting}
                                    value={values.currentPassword}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowCurrent(!showCurrent)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                    disabled={isSubmitting}
                                >
                                    {showCurrent ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                            {errors.currentPassword && touched.currentPassword && (
                                <p className="text-sm text-red-600">{errors.currentPassword}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="newPassword" className="text-sm font-medium text-foreground">
                                New Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                <Input
                                    id="newPassword"
                                    type={showNew ? 'text' : 'password'}
                                    placeholder="Enter a new password"
                                    className={`pl-12 pr-12 h-12 rounded-2xl ${errors.newPassword && touched.newPassword ? 'border-red-500' : ''}`}
                                    disabled={isSubmitting}
                                    value={values.newPassword}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowNew(!showNew)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                    disabled={isSubmitting}
                                >
                                    {showNew ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                            {errors.newPassword && touched.newPassword && (
                                <p className="text-sm text-red-600">{errors.newPassword}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
                                Confirm New Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                <Input
                                    id="confirmPassword"
                                    type={showConfirm ? 'text' : 'password'}
                                    placeholder="Re-enter your new password"
                                    className={`pl-12 pr-12 h-12 rounded-2xl ${errors.confirmPassword && touched.confirmPassword ? 'border-red-500' : ''}`}
                                    disabled={isSubmitting}
                                    value={values.confirmPassword}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirm(!showConfirm)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                    disabled={isSubmitting}
                                >
                                    {showConfirm ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                            {errors.confirmPassword && touched.confirmPassword && (
                                <p className="text-sm text-red-600">{errors.confirmPassword}</p>
                            )}
                        </div>

                        <Button
                            type="submit"
                            className="global_btn bg_primary w-full"
                            disabled={isSubmitting || isChanging}
                            isLoading={isSubmitting || isChanging}
                        >
                            Change Password
                        </Button>
                    </form>
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}
