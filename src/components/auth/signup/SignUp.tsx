'use client'
import React, { useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@heroui/react'
import { Input } from '@/components/ui/input';
import Button from '@/components/ui/Button';
import { Camera, Eye, EyeOff, Lock, Mail, User } from 'lucide-react';
import { useFormik } from 'formik';
import { signUpSchema } from '@/utils/formValidation';
import { RootState } from '@/store/store';
import { closeModal, openModal } from '@/store/slices/allModalSlice';

const AVATAR_BORDER_COLOR = '#C8D7EE';

export default function SignUp() {
    const dispatch = useDispatch();
    const { isOpen } = useSelector((state: RootState) => state.allModal);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [profileImage, setProfileImage] = useState<File | null>(null);
    const [profilePreview, setProfilePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleAvatarClick = () => fileInputRef.current?.click();
    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !file.type.startsWith('image/')) return;
        setProfileImage(file);
        const url = URL.createObjectURL(file);
        setProfilePreview(url);
    };
    const clearProfileImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        setProfileImage(null);
        if (profilePreview) URL.revokeObjectURL(profilePreview);
        setProfilePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const { errors, touched, isSubmitting, values, handleSubmit, handleChange, handleBlur } = useFormik({
        initialValues: {
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
        },
        validationSchema: signUpSchema,
        onSubmit: (formValues, { resetForm }) => {
            console.log('Sign up form submitted:', { ...formValues, profileImage: profileImage ?? undefined });
            if (profilePreview) URL.revokeObjectURL(profilePreview);
            setProfileImage(null);
            setProfilePreview(null);
            resetForm();
        },
    });

    return (
        <Modal isOpen={isOpen} onClose={() => dispatch(closeModal())} className="modal_container">
            <ModalContent>
                <ModalHeader className="flex flex-col items-center text-center gap-2">
                    <p className="text-2xl font-semibold text-foreground">
                        Create Account
                    </p>
                    <p className="text-sm text-muted-foreground font-normal">
                        Join TaalumaWorld and unlock tailored learning experiences
                    </p>
                </ModalHeader>
                <ModalBody>
                    <form className="space-y-3" onSubmit={handleSubmit}>
                        {/* Profile Picture Upload */}
                        <div className="flex flex-col items-center gap-2">
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleAvatarChange}
                            />
                            <button
                                type="button"
                                onClick={handleAvatarClick}
                                className="relative w-20 h-20 rounded-full! border-2 border-dashed flex flex-col items-center justify-center gap-2 bg-white hover:opacity-90 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 overflow-hidden"
                                style={{ borderColor: AVATAR_BORDER_COLOR }}
                                disabled={isSubmitting}
                            >
                                {profilePreview ? (
                                    <>
                                        <img
                                            src={profilePreview}
                                            alt="Profile preview"
                                            className="absolute inset-0 w-full h-full rounded-full object-cover"
                                        />
                                        <span
                                            onClick={clearProfileImage}
                                            className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center text-white text-sm font-medium opacity-0 hover:opacity-100 transition-opacity"
                                        >
                                            Change
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        <Camera className="h-6 w-6" style={{ color: AVATAR_BORDER_COLOR }} />
                                        <span className="text-xs font-medium text-[#666666]">Upload</span>
                                    </>
                                )}
                            </button>
                            <span className="text-xs text-muted-foreground">Profile picture (optional)</span>
                        </div>

                        {/* Name Field */}
                        <div className="space-y-2">
                            <label htmlFor="name" className="text-sm font-medium text-foreground">
                                Full Name
                            </label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="John Doe"
                                    className={`pl-12 h-12 rounded-2xl ${errors.name && touched.name ? 'border-red-500' : ''}`}
                                    disabled={isSubmitting}
                                    value={values.name}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                            </div>
                            {errors.name && touched.name && (
                                <p className="text-sm text-red-600">{errors.name}</p>
                            )}
                        </div>

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
                                    placeholder="Create a password"
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
                            Sign Up
                        </Button>
                    </form>
                    <ModalFooter>
                        <div className="w-full text-center text-sm text-muted-foreground">
                            <span>Already have an account? </span>
                            <button
                                type="button"
                                className="font-medium text-primary hover:text-primary/80 transition-colors"
                                onClick={() => dispatch(openModal({ componentName: 'SignIn', data: '' }))}
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
