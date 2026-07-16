'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useFormik } from 'formik';
import { Camera, Eye, EyeOff, Lock, Mail, User } from 'lucide-react';
import Button from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { AgreementCheckbox } from '@/components/ui/AgreementCheckbox';
import { mentorSignUpSchema } from '@/utils/formValidation';
import { useRegisterMentorMutation } from '@/store/rtkQueries/adminAuth';
import toast from '@/utils/toast';
import { AuthPageShell } from '@/components/auth/AuthPageShell';
import { getHomeRoutePath, getMentorDashboardRoutePath, getMentorLoginRoutePath, getPolicyBySlugRoutePath, } from '@/routes/routes';
import { useGetAgreementByTouchpointAndUserTypeQuery } from '@/store/rtkQueries/agreementAPIs';
import { AGREEMENT_TOUCHPOINTS, AGREEMENT_VISIBLE_USER_TYPES } from '@/constants/agreements';
import { setAuthCookies } from '@/utils/authCookies';

const AVATAR_BORDER_COLOR = '#C8D7EE';

export function SignUpForm() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [profileImage, setProfileImage] = useState<File | null>(null);
    const [profilePreview, setProfilePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [registerMentor, { isLoading: isRegistering }] = useRegisterMentorMutation();
    const { data: agreementsResponse } = useGetAgreementByTouchpointAndUserTypeQuery({
        touchPoint: AGREEMENT_TOUCHPOINTS.MENTOR_REGISTRATION,
        userType: AGREEMENT_VISIBLE_USER_TYPES.MENTOR,
    });

    const agreements = agreementsResponse?.data ?? [];
    const requiredAgreementIds = agreements.filter((agreement) => agreement.is_required).map((agreement) => agreement._id);

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

    const { errors, touched, isSubmitting, values, handleSubmit, handleChange, handleBlur, resetForm, setFieldValue, setFieldTouched } = useFormik({
        initialValues: {
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
            professionalBio: '',
            accepted_agreement_ids: [] as string[],
        },
        validationSchema: mentorSignUpSchema,
        validate: (vals) => {
            const allRequiredAccepted = requiredAgreementIds.every((id) => vals.accepted_agreement_ids.includes(id));
            return allRequiredAccepted ? {} : { accepted_agreement_ids: 'Please accept all required agreements before submitting.' };
        },
        onSubmit: async (formValues, { resetForm: rf }) => {
            try {
                const formData = new FormData();
                formData.append('name', formValues.name);
                formData.append('email', formValues.email);
                formData.append('password', formValues.password);
                formData.append('confirm_password', formValues.confirmPassword);
                if (profileImage) formData.append('profile_pic', profileImage);
                if (formValues.professionalBio.trim()) {
                    formData.append('professionalBio', formValues.professionalBio.trim());
                }
                formValues.accepted_agreement_ids.forEach((id, index) => formData.append(`accepted_agreement_ids[${index}]`, id));

                const res = await registerMentor(formData).unwrap();
                if (res?.http_status_code === 200 || res?.http_status_code === 201) {
                    if (profilePreview) URL.revokeObjectURL(profilePreview);
                    setProfileImage(null);
                    setProfilePreview(null);
                    rf();
                    toast.success(res.message ?? 'Account created! Please verify your email.');
                    setAuthCookies({
                        token: res?.data?.token ?? '',
                        user: { id: res?.data?.id, email: res?.data?.email },
                        role: res?.data?.userRole?.name ?? '',
                    });
                    router.push(getMentorDashboardRoutePath());
                }
            } catch {
                console.error('Registration failed. Please try again.');
            }
        },
    });

    const agreementsError = typeof errors.accepted_agreement_ids === 'string' ? errors.accepted_agreement_ids : undefined;

    return (
        <AuthPageShell
            wide
            title="Create Account"
            subtitle="Register as a mentor on TaalumaWorld"
            footer={
                <>
                    <p>
                        Already have an account?{' '}
                        <Link href={getMentorLoginRoutePath()} className="font-medium text-primary hover:text-primary/80">
                            Sign In
                        </Link>
                    </p>
                    <Link href={getHomeRoutePath()} className="inline-block text-primary hover:text-primary/80">
                        Back to home
                    </Link>
                </>
            }
        >
            <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="flex flex-col items-center gap-2">
                    <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                    <button
                        type="button"
                        onClick={handleAvatarClick}
                        className="relative w-20 h-20 rounded-full! border-2 border-dashed flex flex-col items-center justify-center gap-2 bg-white hover:opacity-90 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 overflow-hidden"
                        style={{ borderColor: AVATAR_BORDER_COLOR }}
                        disabled={isSubmitting}
                    >
                        {profilePreview ? (
                            <>
                                <img src={profilePreview} alt="Profile preview" className="absolute inset-0 w-full h-full rounded-full object-cover" />
                                <span onClick={clearProfileImage} className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center text-white text-sm font-medium opacity-0 hover:opacity-100 transition-opacity">
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

                <div className="space-y-2">
                    <label htmlFor="signup-name" className="text-sm font-medium text-foreground">Full Name</label>
                    <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input id="signup-name" name="name" type="text" placeholder="John Doe" className={`user_input_style ${errors.name && touched.name ? 'border-red-500' : ''}`} disabled={isSubmitting} value={values.name} onChange={handleChange} onBlur={handleBlur} />
                    </div>
                    {errors.name && touched.name && <p className="text-sm text-red-600">{errors.name}</p>}
                </div>

                <div className="space-y-2">
                    <label htmlFor="signup-email" className="text-sm font-medium text-foreground">Email Address</label>
                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input id="signup-email" name="email" type="email" placeholder="you@example.com" className={`user_input_style ${errors.email && touched.email ? 'border-red-500' : ''}`} disabled={isSubmitting} value={values.email} onChange={handleChange} onBlur={handleBlur} />
                    </div>
                    {errors.email && touched.email && <p className="text-sm text-red-600">{errors.email}</p>}
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                        <label htmlFor="signup-password" className="text-sm font-medium text-foreground">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Input id="signup-password" name="password" type={showPassword ? 'text' : 'password'} placeholder="Create a password" className={`pl-12 pr-12 h-12 rounded-md ${errors.password && touched.password ? 'border-red-500' : ''}`} disabled={isSubmitting} value={values.password} onChange={handleChange} onBlur={handleBlur} />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" disabled={isSubmitting}>
                                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                        </div>
                        {errors.password && touched.password && <p className="text-sm text-red-600">{errors.password}</p>}
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="signup-confirmPassword" className="text-sm font-medium text-foreground">Confirm Password</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Input id="signup-confirmPassword" name="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} placeholder="Re-enter your password" className={`pl-12 pr-12 h-12 rounded-md ${errors.confirmPassword && touched.confirmPassword ? 'border-red-500' : ''}`} disabled={isSubmitting} value={values.confirmPassword} onChange={handleChange} onBlur={handleBlur} />
                            <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" disabled={isSubmitting}>
                                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                        </div>
                        {errors.confirmPassword && touched.confirmPassword && <p className="text-sm text-red-600">{errors.confirmPassword}</p>}
                    </div>
                </div>

                <div className="space-y-2">
                    <label htmlFor="professionalBio" className="text-sm font-medium text-foreground">
                        Professional Bio <span className="font-normal text-muted-foreground">(optional)</span>
                    </label>
                    <Textarea
                        id="professionalBio"
                        name="professionalBio"
                        rows={4}
                        placeholder="Tell Career Architects about your expertise..."
                        className={`rounded-md ${errors.professionalBio && touched.professionalBio ? 'border-red-500' : ''}`}
                        disabled={isSubmitting}
                        value={values.professionalBio}
                        onChange={handleChange}
                        onBlur={handleBlur}
                    />
                    {errors.professionalBio && touched.professionalBio && <p className="text-sm text-red-600">{errors.professionalBio}</p>}
                </div>

                <div className="space-y-3 pt-1">
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
                                    : values.accepted_agreement_ids.filter((id) => id !== agreement._id);
                                setFieldValue('accepted_agreement_ids', ids);
                            }}
                            onBlur={() => setFieldTouched('accepted_agreement_ids', true)}
                            disabled={isSubmitting}
                        >
                            I agree to the{' '}
                            <Link
                                href={getPolicyBySlugRoutePath(agreement.slug)}
                                target="_blank"
                                className="font-semibold text-primary hover:text-primary/80"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {agreement.title}
                            </Link>
                            {agreement.is_required && <span className="font-medium text-red-500"> *</span>}
                        </AgreementCheckbox>
                    ))}
                </div>

                <Button type="submit" className="global_btn bg_primary w-full" disabled={isSubmitting || isRegistering} isLoading={isSubmitting || isRegistering}>
                    Register as Mentor
                </Button>
            </form>
        </AuthPageShell>
    );
}
