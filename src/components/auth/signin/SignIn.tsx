import React, { useState } from 'react'
import { RootState } from '@/store/store'
import { useDispatch, useSelector } from 'react-redux'
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@heroui/react'
import { Input } from '@/components/ui/input';
import Button from '@/components/ui/Button';
import toast from '@/utils/toast';
import { Mail, Lock } from 'lucide-react';
import { Eye, EyeOff } from 'lucide-react';
import { closeModal, openModal } from '@/store/slices/allModalSlice';
import { setAuthenticated } from '@/store/slices/authSlice';
import { useFormik } from 'formik';
import { signInSchema } from '@/utils/formValidation';
import { setAuthCookie } from '@/utils/auth';

export default function SignIn() {
    const [showPassword, setShowPassword] = useState(false);
    const dispatch = useDispatch()
    const { isOpen, data } = useSelector((state: RootState) => state.allModal)
    const { errors, touched, isSubmitting, values, handleSubmit, handleChange, handleBlur } = useFormik({
        initialValues: {
            email: '',
            password: ''
        },
        validationSchema: signInSchema,
        onSubmit: (values, { resetForm }) => {
            console.log('Sign in form submitted:', values);
            setAuthCookie();
            dispatch(setAuthenticated({ fullName: 'User', email: values.email }));
            dispatch(closeModal());
            resetForm();
            toast.success('Sign in successful!');
        },
    });
    return (
        <>
            <Modal isOpen={isOpen} onClose={() => dispatch(closeModal())} className="modal_container">
                <ModalContent>
                    <ModalHeader className="flex flex-col items-center text-center gap-2">
                        <p className="text-2xl font-semibold text-foreground">
                            Sign In
                        </p>
                        <p className="text-sm text-muted-foreground font-normal">
                            Continue your learning journey with TaalumaWorld
                        </p>
                    </ModalHeader>
                    <ModalBody>
                        <form className="space-y-3" onSubmit={handleSubmit}>
                            {/* Email Field */}
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

                            {/* Password Field */}
                            <div className="space-y-2">
                                <label htmlFor="password" className="text-sm font-medium text-foreground">
                                    Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                    <Input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Enter your password"
                                        className={`pl-12 pr-12 h-12 rounded-2xl ${errors.password && touched.password ? 'border-red-500' : ''
                                            }`}
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
                                        {showPassword ? (
                                            <EyeOff className="h-5 w-5" />
                                        ) : (
                                            <Eye className="h-5 w-5" />
                                        )}
                                    </button>
                                </div>
                                {errors.password && touched.password && (
                                    <p className="text-sm text-red-600">{errors.password}</p>
                                )}
                            </div>

                            {/* Forgot Password Link */}
                            <div className="text-right">
                                <button
                                    type="button"
                                    onClick={() => dispatch(openModal({ componentName: 'ForgotPassword', data: '' }))}
                                    className="text-sm text-primary hover:text-primary/80 transition-colors font-medium"
                                    disabled={isSubmitting}
                                >
                                    Forgot Password?
                                </button>
                            </div>

                            {/* Sign In Button */}
                            <Button
                                type="submit"
                                className='global_btn bg_primary w-full'
                                disabled={isSubmitting}
                                isLoading={isSubmitting}
                            >
                                Sign In
                            </Button>
                        </form>
                        <ModalFooter>
                            <div className="w-full text-center text-sm text-muted-foreground">
                                <span>Don't have an account? </span>
                                <button
                                    type="button"
                                    className="font-medium text-primary hover:text-primary/80 transition-colors"
                                    onClick={() => dispatch(openModal({ componentName: 'SignUp', data: '' }))}
                                    disabled={isSubmitting}
                                >
                                    Sign Up
                                </button>
                            </div>
                        </ModalFooter>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    )
}
