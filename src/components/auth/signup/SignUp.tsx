'use client'
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@heroui/react'
import { Input } from '@/components/ui/input'
import Button from '@/components/ui/Button'
import { Camera, Eye, EyeOff, GraduationCap, Lock, Mail, User } from 'lucide-react'
import { useFormik } from 'formik'
import { careerArchitectSignUpSchema } from '@/utils/formValidation'
import { RootState } from '@/store/store'
import { closeModal, openModal } from '@/store/slices/allModalSlice'
import { useUserRegisterMutation } from '@/store/rtkQueries/userAuthApi'
import toast from '@/utils/toast'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
    getMentorSignupRoutePath,
    getPrivacyPolicyRoutePath,
    getTermsOfServiceRoutePath,
} from '@/routes/routes'
import { AgreementCheckbox } from '@/components/ui/AgreementCheckbox'

type SignModalData = { redirectTo?: string }

const AVATAR_BORDER_COLOR = '#C8D7EE'

const PARTNER_UNIVERSITIES = [
    { id: 'uon', name: 'University of Nairobi', emailHint: 'you@students.uonbi.ac.ke' },
    { id: 'strathmore', name: 'Strathmore University', emailHint: 'you@strathmore.edu' },
]

export default function SignUp() {
    const dispatch = useDispatch()
    const router = useRouter()
    const { isOpen, componentName, data } = useSelector((state: RootState) => state.allModal)
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [profileImage, setProfileImage] = useState<File | null>(null)
    const [profilePreview, setProfilePreview] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const [userRegister, { isLoading: isRegistering }] = useUserRegisterMutation()

    useEffect(() => {
        if (!isOpen) return
        if (componentName === 'AuthorRegister') {
            dispatch(closeModal())
            router.push(getMentorSignupRoutePath())
        }
    }, [isOpen, componentName, dispatch, router])

    const handleAvatarClick = () => fileInputRef.current?.click()
    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        if (!file.type.startsWith('image/')) {
            toast.error('Please select an image file (e.g. JPG, PNG)')
            return
        }
        if (file.size > 2 * 1024 * 1024) {
            toast.error('Image must be less than 2MB')
            return
        }
        setProfileImage(file)
        setProfilePreview(URL.createObjectURL(file))
    }
    const clearProfileImage = (e: React.MouseEvent) => {
        e.stopPropagation()
        setProfileImage(null)
        if (profilePreview) URL.revokeObjectURL(profilePreview)
        setProfilePreview(null)
        if (fileInputRef.current) fileInputRef.current.value = ''
    }

    const { errors, touched, isSubmitting, values, handleSubmit, handleChange, handleBlur, resetForm, setFieldValue, setFieldTouched } = useFormik({
        initialValues: {
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
            isPartnerStudent: false,
            university: '',
            universityEmail: '',
            agreeTerms: false,
            agreePrivacy: false,
            sendUpdates: false,
            agreeMentorAgreement: false,
            agreeRevenueShare: false,
            agreeContentAndCommunity: false,
        },
        validationSchema: careerArchitectSignUpSchema,
        onSubmit: async (formValues, { resetForm: rf }) => {
            try {
                const formData = new FormData()
                formData.append('name', formValues.name)
                formData.append('email', formValues.email)
                formData.append('password', formValues.password)
                formData.append('password_confirmation', formValues.confirmPassword)
                if (profileImage) formData.append('profile_pic', profileImage)
                formData.append('terms_accepted', String(formValues.agreeTerms))
                formData.append('privacy_accepted', String(formValues.agreePrivacy))
                formData.append('send_updates', String(formValues.sendUpdates))

                const res = await userRegister(formData).unwrap()
                if (profilePreview) URL.revokeObjectURL(profilePreview)
                setProfileImage(null)
                setProfilePreview(null)
                rf()
                toast.success((res as { message?: string }).message ?? 'Account created! Please verify your email.')
                dispatch(openModal({ componentName: 'OtpVerification', data: { email: formValues.email, type: 'account' } }))
            } catch {
                console.error('Registration failed. Please try again.')
            }
        },
    })

    const selectedUniversity = PARTNER_UNIVERSITIES.find((u) => u.id === values.university)

    return (
        <Modal isOpen={isOpen} onClose={() => dispatch(closeModal())} className="modal_container" scrollBehavior="outside">
            <ModalContent>
                <ModalHeader className="flex flex-col items-center text-center gap-2">
                    <p className="text-2xl font-semibold text-foreground">Create Account</p>
                    <p className="text-sm text-muted-foreground font-normal">
                        Join TaalumaWorld and start your learning journey!
                    </p>
                </ModalHeader>
                <ModalBody>
                    <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 mb-3">
                            <div className="flex gap-3">
                                <GraduationCap className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                                <div className="space-y-1 text-sm text-left">
                                    <p className="font-semibold text-foreground">
                                        Are you a student from a partner university?
                                    </p>
                                    <p className="text-muted-foreground">
                                        Register using your university email address to access selected Taaluma.World
                                        content free of charge for a promotional period.
                                    </p>
                                    <p className="text-xs text-muted-foreground pt-1">
                                        Not listed? Contact{' '}
                                        <Link href="mailto:teamtaaluma@taaluma.world" className="text-primary">
                                            teamtaaluma@taaluma.world
                                        </Link>
                                    </p>
                                </div>
                            </div>
                        </div>

                    <form className="space-y-3" onSubmit={handleSubmit}>
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
                                        <span className="text-sm font-medium text-[#666666]">Upload</span>
                                    </>
                                )}
                            </button>
                            <span className="text-sm text-muted-foreground">Profile picture (optional)</span>
                        </div>

                        <div className="space-y-3 rounded-2xl border border-gray-200 p-4">
                                <label className="flex items-start gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="isPartnerStudent"
                                        checked={values.isPartnerStudent}
                                        onChange={(e) => {
                                            handleChange(e)
                                            if (!e.target.checked) {
                                                setFieldValue('university', '')
                                                setFieldValue('universityEmail', '')
                                            }
                                        }}
                                        onBlur={handleBlur}
                                        className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                    />
                                    <span className="text-sm font-medium text-foreground">
                                        I am a student from a partner university
                                    </span>
                                </label>

                                {values.isPartnerStudent && (
                                    <>
                                        <div className="space-y-2">
                                            <label htmlFor="signup-university" className="text-sm font-medium text-foreground">
                                                Select University
                                            </label>
                                            <select
                                                id="signup-university"
                                                name="university"
                                                value={values.university}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                className="w-full h-12 rounded-2xl border border-input bg-white px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                                            >
                                                <option value="">Choose your university</option>
                                                {PARTNER_UNIVERSITIES.map((u) => (
                                                    <option key={u.id} value={u.id}>
                                                        {u.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="space-y-2">
                                            <label htmlFor="signup-university-email" className="text-sm font-medium text-foreground">
                                                University Email Address
                                            </label>
                                            <div className="relative">
                                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                                <Input
                                                    id="signup-university-email"
                                                    name="universityEmail"
                                                    type="email"
                                                    placeholder={selectedUniversity?.emailHint ?? 'you@university.ac.ke'}
                                                    className="pl-12 h-12 rounded-2xl"
                                                    value={values.universityEmail}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                />
                                            </div>
                                            <p className="text-xs text-muted-foreground">
                                                Use your official university email for promotional access.
                                            </p>
                                        </div>
                                    </>
                                )}
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="signup-name" className="text-sm font-medium text-foreground">
                                Full Name
                            </label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                <Input
                                    id="signup-name"
                                    name="name"
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

                        <div className="space-y-2">
                            <label htmlFor="signup-email" className="text-sm font-medium text-foreground">
                                {values.isPartnerStudent ? 'Personal Email Address' : 'Email Address'}
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                <Input
                                    id="signup-email"
                                    name="email"
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

                        <div className="space-y-2">
                            <label htmlFor="signup-password" className="text-sm font-medium text-foreground">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                <Input
                                    id="signup-password"
                                    name="password"
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

                        <div className="space-y-2">
                            <label htmlFor="signup-confirmPassword" className="text-sm font-medium text-foreground">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                <Input
                                    id="signup-confirmPassword"
                                    name="confirmPassword"
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

                        <div className="space-y-3 pt-1">
                            <AgreementCheckbox
                                        id="agreeTerms"
                                        checked={values.agreeTerms}
                                        error={errors.agreeTerms}
                                        touched={touched.agreeTerms}
                                        onCheckedChange={(checked) => setFieldValue('agreeTerms', checked)}
                                        onBlur={() => setFieldTouched('agreeTerms', true)}
                                        disabled={isSubmitting}
                                    >
                                        I agree to the{' '}
                                        <Link
                                            href={getTermsOfServiceRoutePath()}
                                            target="_blank"
                                            className="font-semibold text-primary hover:text-primary/80 transition-colors"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            Terms of Service
                                        </Link>
                                    </AgreementCheckbox>
                                    <AgreementCheckbox
                                        id="agreePrivacy"
                                        checked={values.agreePrivacy}
                                        error={errors.agreePrivacy}
                                        touched={touched.agreePrivacy}
                                        onCheckedChange={(checked) => setFieldValue('agreePrivacy', checked)}
                                        onBlur={() => setFieldTouched('agreePrivacy', true)}
                                        disabled={isSubmitting}
                                    >
                                        I have read the{' '}
                                        <Link
                                            href={getPrivacyPolicyRoutePath()}
                                            target="_blank"
                                            className="font-semibold text-primary hover:text-primary/80 transition-colors"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            Privacy Policy
                                        </Link>
                                    </AgreementCheckbox>
                                    <AgreementCheckbox
                                        id="sendUpdates"
                                        checked={values.sendUpdates}
                                        onCheckedChange={(checked) => setFieldValue('sendUpdates', checked)}
                                        disabled={isSubmitting}
                                    >
                                        Send me updates <span className="text-muted-foreground">(optional)</span>
                                </AgreementCheckbox>
                        </div>

                        <Button
                            type="submit"
                            className="global_btn bg_primary w-full"
                            disabled={isSubmitting || isRegistering}
                            isLoading={isSubmitting || isRegistering}
                        >
                            Sign Up
                        </Button>
                    </form>

                    <ModalFooter className="px-0!">
                        <div className="w-full space-y-2 text-center text-sm text-muted-foreground">
                            <div>
                                <span>Already have an account? </span>
                                <button
                                    type="button"
                                    className="font-medium text-primary hover:text-primary/80 transition-colors"
                                    onClick={() => dispatch(openModal({ componentName: 'SignIn', data: data ?? '' }))}
                                    disabled={isSubmitting}
                                >
                                    Sign In
                                </button>
                            </div>
                            <div>
                                <Link
                                    href={getMentorSignupRoutePath()}
                                    className="font-medium text-primary hover:text-primary/80 transition-colors"
                                    onClick={() => dispatch(closeModal())}
                                >
                                    Register as Mentor
                                </Link>
                            </div>
                        </div>
                    </ModalFooter>
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}
