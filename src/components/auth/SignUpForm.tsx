'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useFormik } from 'formik';
import { Camera, Eye, EyeOff, Lock, Mail, User } from 'lucide-react';
import Button from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { AgreementCheckbox } from '@/components/ui/AgreementCheckbox';
import { mentorSignUpSchema } from '@/utils/formValidation';
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

export function SignUpForm() {
    const router = useRouter();
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

    const { errors, touched, isSubmitting, values, handleSubmit, handleChange, handleBlur, resetForm, setFieldValue, setFieldTouched } = useFormik({
        initialValues: {
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
            agreeMentorAgreement: false,
            agreeRevenueShare: false,
            agreeContentAndCommunity: false,
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
                toast.success((res as { message?: string }).message ?? 'Account created! Please verify your email.');
                router.push(getMentorVerifyRoutePath({ email: formValues.email, type: 'account' }));
            } catch {
                console.error('Registration failed. Please try again.');
            }
        },
    });

    return (
        <AuthPageShell
            title="Create Account"
            subtitle="Create your Mentor account on TaalumaWorld"
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
            <form className="space-y-3" onSubmit={handleSubmit}>
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
                        <Input id="signup-name" name="name" type="text" placeholder="John Doe" className={`pl-12 h-12 rounded-2xl ${errors.name && touched.name ? 'border-red-500' : ''}`} disabled={isSubmitting} value={values.name} onChange={handleChange} onBlur={handleBlur} />
                    </div>
                    {errors.name && touched.name && <p className="text-sm text-red-600">{errors.name}</p>}
                </div>

                <div className="space-y-2">
                    <label htmlFor="signup-email" className="text-sm font-medium text-foreground">Email Address</label>
                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input id="signup-email" name="email" type="email" placeholder="you@example.com" className={`pl-12 h-12 rounded-2xl ${errors.email && touched.email ? 'border-red-500' : ''}`} disabled={isSubmitting} value={values.email} onChange={handleChange} onBlur={handleBlur} />
                    </div>
                    {errors.email && touched.email && <p className="text-sm text-red-600">{errors.email}</p>}
                </div>

                <div className="space-y-2">
                    <label htmlFor="signup-password" className="text-sm font-medium text-foreground">Password</label>
                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input id="signup-password" name="password" type={showPassword ? 'text' : 'password'} placeholder="Create a password" className={`pl-12 pr-12 h-12 rounded-2xl ${errors.password && touched.password ? 'border-red-500' : ''}`} disabled={isSubmitting} value={values.password} onChange={handleChange} onBlur={handleBlur} />
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
                        <Input id="signup-confirmPassword" name="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} placeholder="Re-enter your password" className={`pl-12 pr-12 h-12 rounded-2xl ${errors.confirmPassword && touched.confirmPassword ? 'border-red-500' : ''}`} disabled={isSubmitting} value={values.confirmPassword} onChange={handleChange} onBlur={handleBlur} />
                        <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" disabled={isSubmitting}>
                            {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                    </div>
                    {errors.confirmPassword && touched.confirmPassword && <p className="text-sm text-red-600">{errors.confirmPassword}</p>}
                </div>

                <div className="space-y-3 pt-1">
                    <AgreementCheckbox id="agreeMentorAgreement" checked={values.agreeMentorAgreement} error={errors.agreeMentorAgreement} touched={touched.agreeMentorAgreement} onCheckedChange={(checked) => setFieldValue('agreeMentorAgreement', checked)} onBlur={() => setFieldTouched('agreeMentorAgreement', true)} disabled={isSubmitting}>
                        I agree to the{' '}
                        <Link href={getMentorAgreementRoutePath()} target="_blank" className="font-semibold text-primary hover:text-primary/80" onClick={(e) => e.stopPropagation()}>Mentor Agreement</Link>
                    </AgreementCheckbox>
                    <AgreementCheckbox id="agreeRevenueShare" checked={values.agreeRevenueShare} error={errors.agreeRevenueShare} touched={touched.agreeRevenueShare} onCheckedChange={(checked) => setFieldValue('agreeRevenueShare', checked)} onBlur={() => setFieldTouched('agreeRevenueShare', true)} disabled={isSubmitting}>
                        I agree to the{' '}
                        <Link href={getRevenueShareAgreementRoutePath()} target="_blank" className="font-semibold text-primary hover:text-primary/80" onClick={(e) => e.stopPropagation()}>Revenue Share Agreement</Link>
                    </AgreementCheckbox>
                    <AgreementCheckbox id="agreeContentAndCommunity" checked={values.agreeContentAndCommunity} error={errors.agreeContentAndCommunity} touched={touched.agreeContentAndCommunity} onCheckedChange={(checked) => setFieldValue('agreeContentAndCommunity', checked)} onBlur={() => setFieldTouched('agreeContentAndCommunity', true)} disabled={isSubmitting}>
                        I agree to the{' '}
                        <Link href={getContentOwnershipLicensingRoutePath()} target="_blank" className="font-semibold text-primary hover:text-primary/80" onClick={(e) => e.stopPropagation()}>Content Ownership &amp; Licensing Policy</Link>
                        {' '}and{' '}
                        <Link href={getCommunityStandardsRoutePath()} target="_blank" className="font-semibold text-primary hover:text-primary/80" onClick={(e) => e.stopPropagation()}>Community Standards Policy</Link>
                    </AgreementCheckbox>
                </div>

                <Button type="submit" className="global_btn bg_primary w-full" disabled={isSubmitting || isRegistering} isLoading={isSubmitting || isRegistering}>
                    Register as Mentor
                </Button>
            </form>
        </AuthPageShell>
    );
}
