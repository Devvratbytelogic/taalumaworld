'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
    Building2,
    Camera,
    Check,
    ChevronLeft,
    CreditCard,
    Eye,
    EyeOff,
    Globe,
    Landmark,
    Lock,
    Mail,
    Phone,
    ShieldCheck,
    User,
} from 'lucide-react';
import Button from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { AgreementCheckbox } from '@/components/ui/AgreementCheckbox';
import {
    mentorSignUpAccountSchema,
    mentorSignUpAgreementsSchema,
    mentorSignUpPaymentSchema,
    mentorSignUpProfileSchema,
    mentorSignUpSchema,
} from '@/utils/formValidation';
import { useAuthorRegisterMutation } from '@/store/rtkQueries/adminAuth';
import toast from '@/utils/toast';
import { AuthPageShell } from '@/components/auth/AuthPageShell';
import {
    getCommunityStandardsRoutePath,
    getContentOwnershipLicensingRoutePath,
    getHomeRoutePath,
    getMentorAgreementRoutePath,
    getMentorLoginRoutePath,
    getMentorVerifyRoutePath,
    getRevenueShareAgreementRoutePath,
} from '@/routes/routes';

const AVATAR_BORDER_COLOR = '#C8D7EE';
const BIO_MAX = 500;

const STEPS = [
    { id: 1, label: 'Account', icon: User },
    { id: 2, label: 'Profile', icon: Globe },
    { id: 3, label: 'Agreements', icon: ShieldCheck },
    { id: 4, label: 'Payment', icon: CreditCard },
] as const;

const STEP_TITLES: Record<number, { title: string; subtitle: string }> = {
    1: { title: 'Create Account', subtitle: 'Set up your mentor login credentials' },
    2: { title: 'Professional Profile', subtitle: 'Tell Career Architects about your expertise' },
    3: { title: 'Mentor Agreements', subtitle: 'Accept terms and revenue-sharing agreements' },
    4: { title: 'Payment Details', subtitle: 'Add payout information for revenue sharing' },
};

const STEP_SCHEMAS: Record<number, Yup.AnyObjectSchema> = {
    1: mentorSignUpAccountSchema,
    2: mentorSignUpProfileSchema,
    3: mentorSignUpAgreementsSchema,
    4: mentorSignUpPaymentSchema,
};

const PAYMENT_FREQUENCIES = [
    { value: 'monthly', label: 'Monthly' },
    { value: 'quarterly', label: 'Quarterly' },
    { value: 'annually', label: 'Annually' },
] as const;

function fieldClass(hasError: boolean) {
    return hasError ? 'border-red-500 focus-visible:ring-red-500/20' : '';
}

async function validateStep(
    currentStep: number,
    formValues: Record<string, unknown>,
    setErrors: (errors: Record<string, string>) => void,
    setTouched: (touched: Record<string, boolean>) => void,
) {
    const schema = STEP_SCHEMAS[currentStep];
    const fields = Object.keys(schema.fields);
    setTouched(fields.reduce<Record<string, boolean>>((acc, field) => ({ ...acc, [field]: true }), {}));

    try {
        await schema.validate(formValues, { abortEarly: false });
        return true;
    } catch (error) {
        if (error instanceof Yup.ValidationError) {
            const fieldErrors: Record<string, string> = {};
            error.inner.forEach((item) => {
                if (item.path && !fieldErrors[item.path]) {
                    fieldErrors[item.path] = item.message;
                }
            });
            setErrors(fieldErrors);
        }
        return false;
    }
}

function StepIndicator({ step }: { step: number }) {
    const progress = ((step - 1) / (STEPS.length - 1)) * 100;

    return (
        <div className="mb-8 rounded-2xl border border-gray-100 bg-gray-50/60 px-3 py-4 sm:px-5">
            <div className="mb-4 flex items-center justify-between gap-2">
                <p className="text-sm font-medium text-foreground">
                    Step {step} of {STEPS.length}
                    <span className="ml-2 hidden font-normal text-muted-foreground sm:inline">
                        — {STEPS[step - 1].label}
                    </span>
                </p>
                <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                    {Math.round((step / STEPS.length) * 100)}%
                </span>
            </div>

            <div className="relative flex items-start justify-between">
                <div className="absolute left-[10%] right-[10%] top-[18px] h-0.5 bg-gray-200" />
                <div
                    className="absolute left-[10%] top-[18px] h-0.5 bg-primary transition-all duration-300"
                    style={{ width: `${progress * 0.8}%` }}
                />

                {STEPS.map(({ id, label, icon: Icon }) => {
                    const isDone = step > id;
                    const isActive = step === id;

                    return (
                        <div key={id} className="relative z-10 flex w-[22%] flex-col items-center">
                            <div
                                className={`flex h-9 w-9 items-center justify-center rounded-full border-2 transition-all ${
                                    isActive
                                        ? 'border-primary bg-primary text-white shadow-md ring-4 ring-primary/15'
                                        : isDone
                                          ? 'border-primary bg-primary text-white'
                                          : 'border-gray-200 bg-white text-gray-400'
                                }`}
                            >
                                {isDone ? <Check className="h-4 w-4" strokeWidth={2.5} /> : <Icon className="h-4 w-4" />}
                            </div>
                            <p
                                className={`mt-2 hidden text-center text-[11px] leading-tight sm:block ${
                                    isActive
                                        ? 'font-semibold text-primary'
                                        : isDone
                                          ? 'font-medium text-primary/70'
                                          : 'text-muted-foreground'
                                }`}
                            >
                                {label}
                            </p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

function FormActions({
    showBack = true,
    onBack,
    submitLabel,
    isSubmitting = false,
    isLoading = false,
}: {
    showBack?: boolean;
    onBack?: () => void;
    submitLabel: string;
    isSubmitting?: boolean;
    isLoading?: boolean;
}) {
    return (
        <div className="mt-6 border-t border-gray-100 pt-6">
            <div className={`flex gap-3 ${showBack ? '' : ''}`}>
                {showBack && onBack && (
                    <Button
                        type="button"
                        className="global_btn outline_primary min-w-[112px] shrink-0 px-4"
                        onPress={onBack}
                        startContent={<ChevronLeft className="h-4 w-4" />}
                    >
                        Back
                    </Button>
                )}
                <Button
                    type="submit"
                    className={`global_btn bg_primary ${showBack ? 'min-w-0 flex-1' : 'w-full'}`}
                    disabled={isSubmitting || isLoading}
                    isLoading={isSubmitting || isLoading}
                >
                    {submitLabel}
                </Button>
            </div>
        </div>
    );
}

function FormField({
    label,
    htmlFor,
    error,
    touched,
    optional,
    children,
}: {
    label: string;
    htmlFor?: string;
    error?: string;
    touched?: boolean;
    optional?: boolean;
    children: React.ReactNode;
}) {
    const showError = Boolean(error && touched);
    return (
        <div className="space-y-1.5">
            <label htmlFor={htmlFor} className="text-sm font-medium text-foreground">
                {label}
                {optional && <span className="ml-1 font-normal text-muted-foreground">(optional)</span>}
            </label>
            {children}
            {showError && <p className="text-sm text-red-600">{error}</p>}
        </div>
    );
}

export function SignUpForm() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [profileImage, setProfileImage] = useState<File | null>(null);
    const [profilePreview, setProfilePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [authorRegister, { isLoading: isRegistering }] = useAuthorRegisterMutation();

    const handleAvatarClick = () => fileInputRef.current?.click();
    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!file.type.startsWith('image/')) {
            toast.error('Please select an image file (e.g. JPG, PNG)');
            return;
        }
        if (file.size > 2 * 1024 * 1024) {
            toast.error('Image must be less than 2MB');
            return;
        }
        setProfileImage(file);
        setProfilePreview(URL.createObjectURL(file));
    };
    const clearProfileImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        setProfileImage(null);
        if (profilePreview) URL.revokeObjectURL(profilePreview);
        setProfilePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const { errors, touched, isSubmitting, values, handleSubmit, handleChange, handleBlur, resetForm, setFieldValue, setFieldTouched, setErrors, setTouched } = useFormik({
        initialValues: {
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
            professionalBio: '',
            linkedInUrl: '',
            websiteUrl: '',
            agreeMentorAgreement: false,
            agreeRevenueShare: false,
            agreeContentAndCommunity: false,
            bankName: '',
            bankAccountName: '',
            bankAccountNumber: '',
            bankBranch: '',
            mpesaNumber: '',
            taxId: '',
            paymentFrequency: 'monthly',
        },
        validationSchema: mentorSignUpSchema,
        onSubmit: async (formValues, { resetForm: rf }) => {
            try {
                const formData = new FormData();
                formData.append('name', formValues.name);
                formData.append('email', formValues.email);
                formData.append('password', formValues.password);
                formData.append('password_confirmation', formValues.confirmPassword);
                if (profileImage) formData.append('profile_pic', profileImage);
                formData.append('mentor_agreement_accepted', String(formValues.agreeMentorAgreement));
                formData.append('revenue_share_accepted', String(formValues.agreeRevenueShare));
                formData.append('content_policy_accepted', String(formValues.agreeContentAndCommunity));

                const res = await authorRegister(formData).unwrap();
                if (profilePreview) URL.revokeObjectURL(profilePreview);
                setProfileImage(null);
                setProfilePreview(null);
                rf();
                setStep(1);
                toast.success((res as { message?: string }).message ?? 'Account created! Please verify your email.');
                router.push(getMentorVerifyRoutePath({ email: formValues.email, type: 'account' }));
            } catch {
                console.error('Registration failed. Please try again.');
            }
        },
    });

    const goToNextStep = async (nextStep: number) => {
        const isValid = await validateStep(step, values, setErrors, setTouched);
        if (isValid) setStep(nextStep);
    };

    const stepInfo = STEP_TITLES[step];

    return (
        <AuthPageShell
            wide
            title={stepInfo.title}
            subtitle={stepInfo.subtitle}
            footer={
                <div className="space-y-3">
                    <p>
                        Already have an account?{' '}
                        <Link href={getMentorLoginRoutePath()} className="font-semibold text-primary hover:text-primary/80">
                            Sign in
                        </Link>
                    </p>
                    <Link href={getHomeRoutePath()} className="inline-block text-xs text-muted-foreground transition-colors hover:text-primary">
                        ← Back to home
                    </Link>
                </div>
            }
        >
            <StepIndicator step={step} />

            {step === 1 && (
                <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); void goToNextStep(2); }}>
                    <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-primary/20 bg-primary/5 py-5">
                        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                        <button
                            type="button"
                            onClick={handleAvatarClick}
                            className="relative flex h-20 w-20 flex-col items-center justify-center gap-2 overflow-hidden rounded-full! border-2 border-dashed bg-white transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                            style={{ borderColor: AVATAR_BORDER_COLOR }}
                        >
                            {profilePreview ? (
                                <>
                                    <img src={profilePreview} alt="Profile preview" className="absolute inset-0 h-full w-full rounded-full object-cover" />
                                    <span onClick={clearProfileImage} className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 text-sm font-medium text-white opacity-0 transition-opacity hover:opacity-100">
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

                    <FormField label="Full Name" htmlFor="signup-name" error={errors.name} touched={touched.name}>
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                            <Input id="signup-name" name="name" type="text" placeholder="John Doe" className={`h-12 rounded-2xl pl-12 ${fieldClass(Boolean(errors.name && touched.name))}`} value={values.name} onChange={handleChange} onBlur={handleBlur} />
                        </div>
                    </FormField>

                    <FormField label="Email Address" htmlFor="signup-email" error={errors.email} touched={touched.email}>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                            <Input id="signup-email" name="email" type="email" placeholder="you@example.com" className={`h-12 rounded-2xl pl-12 ${fieldClass(Boolean(errors.email && touched.email))}`} value={values.email} onChange={handleChange} onBlur={handleBlur} />
                        </div>
                    </FormField>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <FormField label="Password" htmlFor="signup-password" error={errors.password} touched={touched.password}>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                                <Input id="signup-password" name="password" type={showPassword ? 'text' : 'password'} placeholder="Create a password" className={`h-12 rounded-2xl pl-12 pr-12 ${fieldClass(Boolean(errors.password && touched.password))}`} value={values.password} onChange={handleChange} onBlur={handleBlur} />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                        </FormField>

                        <FormField label="Confirm Password" htmlFor="signup-confirmPassword" error={errors.confirmPassword} touched={touched.confirmPassword}>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                                <Input id="signup-confirmPassword" name="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} placeholder="Re-enter password" className={`h-12 rounded-2xl pl-12 pr-12 ${fieldClass(Boolean(errors.confirmPassword && touched.confirmPassword))}`} value={values.confirmPassword} onChange={handleChange} onBlur={handleBlur} />
                                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                        </FormField>
                    </div>

                    <FormActions showBack={false} submitLabel="Continue" />
                </form>
            )}

            {step === 2 && (
                <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); void goToNextStep(3); }}>
                    <FormField label="Professional Bio" htmlFor="professionalBio" error={errors.professionalBio} touched={touched.professionalBio}>
                        <Textarea
                            id="professionalBio"
                            name="professionalBio"
                            rows={5}
                            placeholder="Share your background, areas of expertise, and what Career Architects can learn from you..."
                            className={`rounded-2xl resize-none ${fieldClass(Boolean(errors.professionalBio && touched.professionalBio))}`}
                            value={values.professionalBio}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            maxLength={BIO_MAX}
                        />
                        <p className="text-right text-xs text-muted-foreground">{values.professionalBio.length}/{BIO_MAX}</p>
                    </FormField>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <FormField label="LinkedIn" htmlFor="linkedInUrl" error={errors.linkedInUrl} touched={touched.linkedInUrl} optional>
                            <Input id="linkedInUrl" name="linkedInUrl" placeholder="linkedin.com/in/you" className={`h-12 rounded-2xl ${fieldClass(Boolean(errors.linkedInUrl && touched.linkedInUrl))}`} value={values.linkedInUrl} onChange={handleChange} onBlur={handleBlur} />
                        </FormField>
                        <FormField label="Website" htmlFor="websiteUrl" error={errors.websiteUrl} touched={touched.websiteUrl} optional>
                            <Input id="websiteUrl" name="websiteUrl" placeholder="yourwebsite.com" className={`h-12 rounded-2xl ${fieldClass(Boolean(errors.websiteUrl && touched.websiteUrl))}`} value={values.websiteUrl} onChange={handleChange} onBlur={handleBlur} />
                        </FormField>
                    </div>

                    <FormActions onBack={() => setStep(1)} submitLabel="Continue" />
                </form>
            )}

            {step === 3 && (
                <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); void goToNextStep(4); }}>
                    <div className="space-y-3 rounded-2xl border border-gray-100 bg-gray-50/80 p-4">
                        <p className="text-sm text-muted-foreground">
                            Please review and accept all agreements to continue with mentor registration.
                        </p>
                        <AgreementCheckbox id="agreeMentorAgreement" checked={values.agreeMentorAgreement} error={errors.agreeMentorAgreement} touched={touched.agreeMentorAgreement} onCheckedChange={(checked) => setFieldValue('agreeMentorAgreement', checked)} onBlur={() => setFieldTouched('agreeMentorAgreement', true)}>
                            I agree to the{' '}
                            <Link href={getMentorAgreementRoutePath()} target="_blank" className="font-semibold text-primary hover:text-primary/80" onClick={(e) => e.stopPropagation()}>Mentor Agreement</Link>
                        </AgreementCheckbox>
                        <AgreementCheckbox id="agreeRevenueShare" checked={values.agreeRevenueShare} error={errors.agreeRevenueShare} touched={touched.agreeRevenueShare} onCheckedChange={(checked) => setFieldValue('agreeRevenueShare', checked)} onBlur={() => setFieldTouched('agreeRevenueShare', true)}>
                            I agree to the{' '}
                            <Link href={getRevenueShareAgreementRoutePath()} target="_blank" className="font-semibold text-primary hover:text-primary/80" onClick={(e) => e.stopPropagation()}>Revenue Share Agreement</Link>
                        </AgreementCheckbox>
                        <AgreementCheckbox id="agreeContentAndCommunity" checked={values.agreeContentAndCommunity} error={errors.agreeContentAndCommunity} touched={touched.agreeContentAndCommunity} onCheckedChange={(checked) => setFieldValue('agreeContentAndCommunity', checked)} onBlur={() => setFieldTouched('agreeContentAndCommunity', true)}>
                            I agree to the{' '}
                            <Link href={getContentOwnershipLicensingRoutePath()} target="_blank" className="font-semibold text-primary hover:text-primary/80" onClick={(e) => e.stopPropagation()}>Content Ownership &amp; Licensing Policy</Link>
                            {' '}and{' '}
                            <Link href={getCommunityStandardsRoutePath()} target="_blank" className="font-semibold text-primary hover:text-primary/80" onClick={(e) => e.stopPropagation()}>Community Standards Policy</Link>
                        </AgreementCheckbox>
                    </div>

                    <FormActions onBack={() => setStep(2)} submitLabel="Continue" />
                </form>
            )}

            {step === 4 && (
                <form className="space-y-5" onSubmit={handleSubmit}>
                    <div className="flex gap-3 rounded-2xl border border-primary/20 bg-primary/5 p-4 text-sm text-muted-foreground">
                        <Building2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                        <p>Secure payout details for revenue sharing. Built to support Kenya today and expand to more regions over time.</p>
                    </div>

                    <div className="space-y-4 rounded-2xl border border-gray-100 p-4">
                        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                            <Landmark className="h-4 w-4 text-primary" />
                            Bank Account
                        </div>
                        <FormField label="Bank Name" error={errors.bankName} touched={touched.bankName}>
                            <Input name="bankName" value={values.bankName} onChange={handleChange} onBlur={handleBlur} className={`h-12 rounded-2xl ${fieldClass(Boolean(errors.bankName && touched.bankName))}`} placeholder="e.g., KCB Bank, Equity Bank" />
                        </FormField>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <FormField label="Account Holder Name" error={errors.bankAccountName} touched={touched.bankAccountName}>
                                <Input name="bankAccountName" value={values.bankAccountName} onChange={handleChange} onBlur={handleBlur} className={`h-12 rounded-2xl ${fieldClass(Boolean(errors.bankAccountName && touched.bankAccountName))}`} placeholder="Name on account" />
                            </FormField>
                            <FormField label="Account Number" error={errors.bankAccountNumber} touched={touched.bankAccountNumber}>
                                <Input name="bankAccountNumber" value={values.bankAccountNumber} onChange={handleChange} onBlur={handleBlur} className={`h-12 rounded-2xl ${fieldClass(Boolean(errors.bankAccountNumber && touched.bankAccountNumber))}`} placeholder="Account number" />
                            </FormField>
                        </div>
                        <FormField label="Branch" optional>
                            <Input name="bankBranch" value={values.bankBranch} onChange={handleChange} className="h-12 rounded-2xl" placeholder="Branch name or code" />
                        </FormField>
                    </div>

                    <div className="space-y-4 rounded-2xl border border-gray-100 p-4">
                        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                            <Phone className="h-4 w-4 text-primary" />
                            M-Pesa
                        </div>
                        <FormField label="M-Pesa Number" error={errors.mpesaNumber} touched={touched.mpesaNumber}>
                            <div className="relative">
                                <Phone className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                                <Input name="mpesaNumber" value={values.mpesaNumber} onChange={handleChange} onBlur={handleBlur} className={`h-12 rounded-2xl pl-12 ${fieldClass(Boolean(errors.mpesaNumber && touched.mpesaNumber))}`} placeholder="0724409796 or 254724409796" />
                            </div>
                            <p className="text-xs text-muted-foreground">Format: 0724409796 or 254724409796</p>
                        </FormField>
                        <FormField label="Tax ID / KRA PIN" optional>
                            <Input name="taxId" value={values.taxId} onChange={handleChange} className="h-12 rounded-2xl" placeholder="For tax reporting where applicable" />
                        </FormField>
                    </div>

                    <FormField label="Preferred Payment Frequency" error={errors.paymentFrequency} touched={touched.paymentFrequency}>
                        <div className="grid grid-cols-3 gap-2">
                            {PAYMENT_FREQUENCIES.map(({ value, label }) => (
                                <button
                                    key={value}
                                    type="button"
                                    onClick={() => setFieldValue('paymentFrequency', value)}
                                    className={`rounded-2xl border px-3 py-3 text-sm font-medium transition-colors ${
                                        values.paymentFrequency === value
                                            ? 'border-primary bg-primary/10 text-primary'
                                            : 'border-gray-200 bg-white text-muted-foreground hover:border-primary/40'
                                    }`}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>
                    </FormField>

                    <FormActions
                        onBack={() => setStep(3)}
                        submitLabel="Register as Mentor"
                        isSubmitting={isSubmitting}
                        isLoading={isRegistering}
                    />
                </form>
            )}
        </AuthPageShell>
    );
}
