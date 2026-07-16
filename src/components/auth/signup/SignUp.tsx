'use client'
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@heroui/react'
import { Input } from '@/components/ui/input'
import Button from '@/components/ui/Button'
import { Camera, Eye, EyeOff, Gift, GraduationCap, Lock, Mail, User } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import Select, { type StylesConfig } from 'react-select'
import { useFormik } from 'formik'
import { careerArchitectSignUpSchema } from '@/utils/formValidation'
import { RootState } from '@/store/store'
import { closeModal, openModal } from '@/store/slices/allModalSlice'
import { useUserRegisterMutation } from '@/store/rtkQueries/userAuthApi'
import toast from '@/utils/toast'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { getMentorSignupRoutePath, getPolicyBySlugRoutePath, } from '@/routes/routes'
import { AgreementCheckbox } from '@/components/ui/AgreementCheckbox'
import { useGetAgreementByTouchpointAndUserTypeQuery } from '@/store/rtkQueries/agreementAPIs'
import { AGREEMENT_TOUCHPOINTS, AGREEMENT_VISIBLE_USER_TYPES } from '@/constants/agreements'
import { useGetPartnerInstitutionsQuery } from '@/store/rtkQueries/userGetAPI'


const AVATAR_BORDER_COLOR = '#C8D7EE'

interface UniversityOption {
    value: string
    label: string
    domains: string[]
}

const UNIVERSITY_SELECT_STYLES: StylesConfig<UniversityOption, false> = {
    control: (base, state) => ({
        ...base,
        minHeight: 48,
        height: 48,
        borderRadius: 'var(--radius-md)',
        borderColor: state.isFocused
            ? 'color-mix(in srgb, var(--primary) 30%, transparent)'
            : '#e5e7eb',
        backgroundColor: '#ffffff',
        boxShadow: state.isFocused
            ? '0 0 0 2px color-mix(in srgb, var(--primary) 10%, transparent)'
            : 'none',
        fontSize: '0.875rem',
        cursor: state.isDisabled ? 'not-allowed' : 'pointer',
        opacity: state.isDisabled ? 0.5 : 1,
        '&:hover': {
            borderColor: state.isFocused
                ? 'color-mix(in srgb, var(--primary) 30%, transparent)'
                : '#e5e7eb',
        },
    }),
    valueContainer: (base) => ({
        ...base,
        height: 48,
        padding: '0 16px',
    }),
    input: (base) => ({
        ...base,
        margin: 0,
        padding: 0,
    }),
    indicatorsContainer: (base) => ({
        ...base,
        height: 48,
    }),
    placeholder: (base) => ({
        ...base,
        color: '#9ca3af',
    }),
    singleValue: (base) => ({
        ...base,
        color: '#111827',
    }),
    indicatorSeparator: (base) => ({
        ...base,
        backgroundColor: '#e5e7eb',
    }),
    dropdownIndicator: (base) => ({
        ...base,
        color: '#9ca3af',
        padding: '0 8px',
    }),
    menuPortal: (base) => ({
        ...base,
        zIndex: 9999,
    }),
}


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

    const { errors, touched, isSubmitting, values, handleSubmit, handleChange, handleBlur, setFieldValue, setFieldTouched } = useFormik({
        initialValues: {
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
            isPartnerStudent: false,
            university: '',
            referralCode: '',
            accepted_agreement_ids: [] as string[],
        },
        validationSchema: careerArchitectSignUpSchema,
        validate: (vals) => {
            const allRequiredAccepted = requiredAgreementIds.every((id: string) => vals.accepted_agreement_ids.includes(id))
            return allRequiredAccepted ? {} : { accepted_agreement_ids: 'Please accept all required agreements before submitting.' }
        },
        onSubmit: async (formValues, { resetForm: rf }) => {
            try {
                const formData = new FormData()
                formData.append('name', formValues.name)
                formData.append('email', formValues.email)
                formData.append('password', formValues.password)
                formData.append('password_confirmation', formValues.confirmPassword)
                if (profileImage) formData.append('profile_pic', profileImage)
                if (formValues.referralCode.trim()) formData.append('referral_code', formValues.referralCode.trim())
                if (formValues.isPartnerStudent && formValues.university) formData.append('institution_id', formValues.university)
                formValues.accepted_agreement_ids.forEach((id: string, index: number) => formData.append(`accepted_agreement_ids[${index}]`, id))

                const res = await userRegister(formData).unwrap()
                if (res?.http_status_code === 200 || res?.http_status_code === 201) {
                    if (profilePreview) URL.revokeObjectURL(profilePreview)
                    setProfileImage(null)
                    setProfilePreview(null)
                    rf()
                    toast.success(res.message ?? 'Account created! Please verify your email.')
                    dispatch(openModal({ componentName: 'OtpVerification', data: { email: formValues.email, type: 'account' } }))
                }
            } catch {
                console.error('Registration failed. Please try again.')
            }
        },
    })

    const { data: agreementsResponse } = useGetAgreementByTouchpointAndUserTypeQuery({
        touchPoint: values.isPartnerStudent ? AGREEMENT_TOUCHPOINTS.INSTITUTIONAL_CAREER_ARCHITECT_REGISTRATION : AGREEMENT_TOUCHPOINTS.CAREER_ARCHITECT_REGISTRATION,
        userType: values.isPartnerStudent ? AGREEMENT_VISIBLE_USER_TYPES.INSTITUTIONAL_CA : AGREEMENT_VISIBLE_USER_TYPES.CAREER_ARCHITECT,
    });

    const agreements = agreementsResponse?.data ?? []
    const requiredAgreementIds: string[] = agreements.filter((agreement) => agreement.is_required).map((agreement) => agreement._id)
    const agreementsError = typeof errors.accepted_agreement_ids === 'string' ? errors.accepted_agreement_ids : undefined

    const { data: partnerInstitutionsResponse, isFetching: isLoadingPartnerInstitutions } = useGetPartnerInstitutionsQuery(undefined, { skip: !values.isPartnerStudent })
    const partnerInstitutions = partnerInstitutionsResponse?.data ?? []
    const universityOptions = partnerInstitutions?.map((institution) => ({ value: institution.id, label: institution.name, domains: institution.domains ?? [] })) ?? []
    const selectedUniversity = partnerInstitutions?.find((institution) => institution.id === values.university)

    return (
        <Modal
            isOpen={isOpen}
            onClose={() => dispatch(closeModal())}
            size="2xl"
            className="modal_container"
            scrollBehavior="inside"
            classNames={{ body: 'py-4' }}
        >
            <ModalContent>
                <ModalHeader className="flex flex-col items-center text-center gap-1 pb-2">
                    <p className="text-2xl font-semibold text-foreground">Create Account</p>
                    <p className="text-sm text-muted-foreground font-normal">
                        Join TaalumaWorld and start your learning journey
                    </p>
                </ModalHeader>
                <ModalBody className="gap-0">
                    <form className="space-y-5" onSubmit={handleSubmit}>
                        <div className="flex items-center gap-4">
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
                                className="relative w-16 h-16 shrink-0 rounded-full border-2 border-dashed flex items-center justify-center bg-white hover:border-primary/40 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 overflow-hidden group"
                                style={{ borderColor: profilePreview ? 'transparent' : AVATAR_BORDER_COLOR }}
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
                                            className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            Change
                                        </span>
                                    </>
                                ) : (
                                    <Camera className="h-5 w-5" style={{ color: AVATAR_BORDER_COLOR }} />
                                )}
                            </button>
                            <div className="min-w-0">
                                <p className="text-sm font-medium text-foreground">Profile photo</p>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                    Optional · JPG or PNG, max 2 MB
                                </p>
                                {!profilePreview && (
                                    <button
                                        type="button"
                                        onClick={handleAvatarClick}
                                        className="text-xs font-medium text-primary hover:text-primary/80 mt-1 transition-colors"
                                        disabled={isSubmitting}
                                    >
                                        Upload photo
                                    </button>
                                )}
                            </div>
                        </div>

                        <div
                            className={`rounded-2xl border transition-all duration-200 overflow-hidden ${values.isPartnerStudent
                                ? 'border-primary/30 bg-linear-to-br from-primary/5 to-primary/2'
                                : 'border-gray-200 bg-muted/30 hover:border-primary/20'
                                }`}
                        >
                            <label className="flex items-start gap-3 p-4 cursor-pointer">
                                <Checkbox
                                    id="isPartnerStudent"
                                    name="isPartnerStudent"
                                    checked={values.isPartnerStudent}
                                    onCheckedChange={(checked) => {
                                        setFieldValue('isPartnerStudent', checked === true)
                                        if (!checked) {
                                            setFieldValue('university', '')
                                            setFieldTouched('university', false)
                                        }
                                    }}
                                    onBlur={handleBlur}
                                    className="mt-0.5"
                                    disabled={isSubmitting}
                                />
                                <div className="flex-1 min-w-0 space-y-1">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <GraduationCap className="h-4 w-4 text-primary shrink-0" />
                                        <span className="text-sm font-semibold text-foreground">
                                            Partner university student
                                        </span>
                                        <span className="text-[10px] font-semibold uppercase tracking-wide text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                                            Free access
                                        </span>
                                    </div>
                                    <p className="text-xs text-muted-foreground leading-relaxed">
                                        Use your official university email to access selected content free during our promotional period.
                                    </p>
                                </div>
                            </label>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap">
                                    Account details
                                </span>
                                <div className="flex-1 h-px bg-border" />
                            </div>


                            <div className="grid gap-3 sm:grid-cols-2">
                                {values.isPartnerStudent && (
                                    <div className="space-y-1.5">
                                        <label htmlFor="signup-university" className="text-sm font-medium text-foreground">
                                            Select University
                                        </label>
                                        <Select
                                            inputId="signup-university"
                                            name="university"
                                            options={universityOptions}
                                            value={universityOptions.find((o) => o.value === values.university) ?? null}
                                            onChange={(option) => setFieldValue('university', option?.value ?? '')}
                                            onBlur={() => setFieldTouched('university', true)}
                                            placeholder={isLoadingPartnerInstitutions ? 'Loading universities...' : 'Choose your university'}
                                            isLoading={isLoadingPartnerInstitutions}
                                            isDisabled={isSubmitting}
                                            menuPosition="fixed"
                                            // formatOptionLabel={(option, { context }) => (
                                            //     <span className="flex flex-col">
                                            //         <span>{option.label}</span>
                                            //         {context === 'menu' && option.domains.length > 0 && (
                                            //             <span className="text-xs text-muted-foreground">
                                            //                 {option.domains.join(', ')}
                                            //             </span>
                                            //         )}
                                            //     </span>
                                            // )}
                                            noOptionsMessage={() => (
                                                <span className="text-xs text-muted-foreground">
                                                    University not listed?{' '}
                                                    <Link
                                                        href="mailto:teamtaaluma@taaluma.world"
                                                        className="text-primary font-medium hover:text-primary/80"
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        teamtaaluma@taaluma.world
                                                    </Link>
                                                </span>
                                            )}
                                            styles={{
                                                ...UNIVERSITY_SELECT_STYLES,
                                                control: (base, state) => ({
                                                    ...(UNIVERSITY_SELECT_STYLES.control?.(base, state) ?? base),
                                                    borderColor:
                                                        errors.university && touched.university
                                                            ? '#ef4444'
                                                            : state.isFocused
                                                                ? 'color-mix(in srgb, var(--primary) 30%, transparent)'
                                                                : '#e5e7eb',
                                                }),
                                            }}
                                        />
                                        {errors.university && touched.university && (
                                            <p className="text-sm text-red-600">{errors.university}</p>
                                        )}
                                    </div>
                                )}

                                <div className="space-y-1.5">
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
                                            className={`user_input_style ${errors.name && touched.name && 'border-red-500'}`}
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

                                <div className="space-y-1.5">
                                    <label htmlFor="signup-email" className="text-sm font-medium text-foreground">
                                        {values.isPartnerStudent ? 'University Email Address' : 'Email Address'}
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                        <Input
                                            id="signup-email"
                                            name="email"
                                            type="email"
                                            placeholder={
                                                values.isPartnerStudent
                                                    ? `you@${selectedUniversity?.domains?.[0] ?? 'example.com'}`
                                                    : 'you@example.com'
                                            }
                                            className={`user_input_style ${errors.email && touched.email && 'border-red-500'}`}
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
                            </div>

                            <div className="grid gap-3 sm:grid-cols-2">
                                <div className="space-y-1.5">
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
                                            className={`user_input_style ${errors.password && touched.password && 'border-red-500'}`}
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
                                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                                        >
                                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                        </button>
                                    </div>
                                    {errors.password && touched.password && (
                                        <p className="text-sm text-red-600">{errors.password}</p>
                                    )}
                                </div>

                                <div className="space-y-1.5">
                                    <label htmlFor="signup-confirmPassword" className="text-sm font-medium text-foreground">
                                        Confirm Password
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                        <Input
                                            id="signup-confirmPassword"
                                            name="confirmPassword"
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            placeholder="Re-enter password"
                                            className={`user_input_style ${errors.confirmPassword && touched.confirmPassword && 'border-red-500'}`}
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
                                            aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                                        >
                                            {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                        </button>
                                    </div>
                                    {errors.confirmPassword && touched.confirmPassword && (
                                        <p className="text-sm text-red-600">{errors.confirmPassword}</p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label htmlFor="signup-referralCode" className="text-sm font-medium text-foreground">
                                    Referral Code <span className="font-normal text-muted-foreground">(optional)</span>
                                </label>
                                <div className="relative">
                                    <Gift className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                    <Input
                                        id="signup-referralCode"
                                        name="referralCode"
                                        type="text"
                                        placeholder="Enter referral code"
                                        className={`user_input_style ${errors.referralCode && touched.referralCode && 'border-red-500'}`}
                                        disabled={isSubmitting}
                                        value={values.referralCode}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                </div>
                                {errors.referralCode && touched.referralCode && (
                                    <p className="text-sm text-red-600">{errors.referralCode}</p>
                                )}
                            </div>
                        </div>

                        <div className="rounded-2xl border border-gray-100 bg-muted/20 p-4 space-y-3">
                            {agreements.map((agreement) => (
                                <AgreementCheckbox
                                    key={agreement._id}
                                    id={agreement._id}
                                    checked={values.accepted_agreement_ids.includes(agreement._id)}
                                    error={agreementsError}
                                    touched={touched.accepted_agreement_ids}
                                    onCheckedChange={(checked) => {
                                        const ids = checked
                                            ? [...values.accepted_agreement_ids, agreement._id]
                                            : values.accepted_agreement_ids.filter((id: string) => id !== agreement._id)
                                        setFieldValue('accepted_agreement_ids', ids)
                                    }}
                                    onBlur={() => setFieldTouched('accepted_agreement_ids', true)}
                                    disabled={isSubmitting}
                                >
                                    I agree to the{' '}
                                    <Link
                                        href={getPolicyBySlugRoutePath(agreement.slug)}
                                        target="_blank"
                                        className="font-semibold text-primary hover:text-primary/80 transition-colors"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        {agreement.title}
                                    </Link>
                                    {agreement.is_required && <span className="font-medium text-red-500"> *</span>}
                                </AgreementCheckbox>
                            ))}
                        </div>

                        <Button
                            type="submit"
                            className="global_btn bg_primary w-full"
                            disabled={isSubmitting || isRegistering}
                            isLoading={isSubmitting || isRegistering}
                        >
                            Create Account
                        </Button>
                    </form>
                </ModalBody>
                <ModalFooter className="flex flex-col gap-3 pt-2">
                    <div className="w-full h-px bg-border" />
                    <div className="w-full text-center text-sm text-muted-foreground">
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
                    <div className="w-full text-center text-sm">
                        <Link
                            href={getMentorSignupRoutePath()}
                            className="font-medium text-primary hover:text-primary/80 transition-colors"
                            onClick={() => dispatch(closeModal())}
                        >
                            Register as Mentor →
                        </Link>
                    </div>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}
