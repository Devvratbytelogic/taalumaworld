'use client'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Modal, ModalBody, ModalContent, ModalHeader } from '@heroui/react'
import { Input } from '@/components/ui/input';
import Button from '@/components/ui/Button';
import { Eye, EyeOff, Lock } from 'lucide-react';
import { useFormik } from 'formik';
import { resetPasswordSchema } from '@/utils/formValidation';
import { RootState } from '@/store/store';
import { openModal } from '@/store/slices/allModalSlice';

export default function ResetPassword() {
    const dispatch = useDispatch();
    const { isOpen } = useSelector((state: RootState) => state.allModal);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const { errors, touched, isSubmitting, values, handleSubmit, handleChange, handleBlur } = useFormik({
        initialValues: {
            password: '',
            confirmPassword: '',
        },
        validationSchema: resetPasswordSchema,
        onSubmit: (formValues, { resetForm }) => {
            console.log('Reset password form submitted:', formValues);
            resetForm();
            dispatch(openModal({ componentName: 'SignIn', data: '' }));
        },
    });

    return (
        <Modal isOpen={isOpen} className="modal_container">
            <ModalContent>
                <ModalHeader className="flex flex-col items-center text-center gap-2">
                    <p className="text-2xl font-semibold text-foreground">
                        Set a New Password
                    </p>
                    <p className="text-sm text-muted-foreground font-normal">
                        Choose a strong password to secure your account
                    </p>
                </ModalHeader>
                <ModalBody>
                    <form className="space-y-3" onSubmit={handleSubmit}>
                        {/* Password Field */}
                        <div className="space-y-2">
                            <label htmlFor="password" className="text-sm font-medium text-foreground">
                                New Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                <Input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Enter a new password"
                                    className={`pl-12 pr-12 h-12 rounded-2xl ${errors.password && touched.password ? 'border-red-500' : ''}`}
                                    disabled={isSubmitting}
                                    value={values.password}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                    disabled={isSubmitting}
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                            {errors.password && touched.password && (
                                <p className="text-sm text-red-600">{errors.password}</p>
                            )}
                        </div>

                        {/* Confirm Password Field */}
                        <div className="space-y-2">
                            <label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                <Input
                                    id="confirmPassword"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    placeholder="Re-enter your password"
                                    className={`pl-12 pr-12 h-12 rounded-2xl ${errors.confirmPassword && touched.confirmPassword ? 'border-red-500' : ''}`}
                                    disabled={isSubmitting}
                                    value={values.confirmPassword}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                    disabled={isSubmitting}
                                >
                                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                            {errors.confirmPassword && touched.confirmPassword && (
                                <p className="text-sm text-red-600">{errors.confirmPassword}</p>
                            )}
                        </div>

                        <Button
                            type="submit"
                            className="global_btn bg_primary w-full"
                            disabled={isSubmitting}
                            isLoading={isSubmitting}
                        >
                            Update Password
                        </Button>
                    </form>
                    <div className="pt-4 text-center text-sm text-muted-foreground">
                        <span>Remembered your password? </span>
                        <button
                            type="button"
                            className="font-medium text-primary hover:text-primary/80 transition-colors"
                            onClick={() => dispatch(openModal({ componentName: 'SignIn', data: '' }))}
                            disabled={isSubmitting}
                        >
                            Sign In
                        </button>
                    </div>
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}
