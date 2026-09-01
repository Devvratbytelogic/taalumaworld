'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useFormik } from 'formik';
import { Avatar } from '@heroui/react';
import {
  ArrowUpCircle,
  BadgeCheck,
  Ban,
  Calendar,
  Camera,
  Check,
  CheckCircle2,
  CircleAlert,
  Clock,
  Copy,
  Facebook,
  FileSignature,
  Info,
  Landmark,
  Linkedin,
  Mail,
  Pencil,
  Phone,
  Receipt,
  Shield,
  ShieldCheck,
  Wallet,
  X,
} from 'lucide-react';
import Button from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { nativeSelectClassName } from '@/components/ui/field-styles';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { AdminEmptyState, AdminPage, AdminPanel, AdminSectionHeader, adminPanelClass, } from '@/components/admin/layout/AdminContent';
import { MentorTierUpgradeModal } from '@/components/admin/mentor/MentorTierUpgradeModal';
import { MentorVerificationHeader } from '@/components/admin/mentor/dashboard/MentorVerificationHeader';
import { AgreementSentenceList } from '@/components/ui/AgreementSentenceList';
import { AgreementDocumentModal } from '@/components/ui/AgreementDocumentModal';
import { useGetAdminProfileQuery, useGetPaystackBanksQuery } from '@/store/rtkQueries/adminGetApi';
import { useUpdateAdminProfileMutation, useUpdateMentorInfoMutation } from '@/store/rtkQueries/adminPostApi';
import { useAcceptAgreementMutation, useAcceptAllAgreementsMutation, useGetUserConsentStatusQuery } from '@/store/rtkQueries/agreementAPIs';
import { AGREEMENT_TOUCHPOINTS } from '@/constants/agreements';
// import { useBlockedTouchpoints } from '@/hooks/useBlockedTouchpoints';
import { useGetMyMentorTierUpgradeApplicationQuery } from '@/store/rtkQueries/mentorApis';
import { VERIFIED_MENTOR_APPLICATION_STATUS } from '@/constants/verifiedMentorApplication';
import { IAdminProfileAPIResponseData, MentorInfo } from '@/types/adminProfile';
import { mentorPayoutDetailsSchema, mentorProfileDetailsSchema } from '@/utils/formValidation';
import toast from '@/utils/toast';
import { cn } from '@/components/ui/utils';
import { ProfileAvatarUpload } from '@/components/admin/profile/ProfileAvatarUpload';
import { refreshAfterMentorChange } from '@/store/server-api/refreshCache';
import moment from 'moment';
import ReactSelect from 'react-select';
import { SELECT_STYLES, type SelectOption } from '@/constants/selectStyle';

const PAYOUT_FREQUENCIES = ["monthly", "quarterly", "annually"] as const;
const PAYSTACK_SETTLEMENT_OPTIONS = ["mpesa", "bank"] as const;

function formatSettlementLabel(value?: string | null) {
  if (value === 'mpesa') return 'M-Pesa';
  if (value === 'bank') return 'Bank';
  return value || '—';
}

/** Required profile fields, mirroring `mentorProfileDetailsSchema`, so the card can flag an incomplete setup. */
function getMissingProfileFields(profile?: IAdminProfileAPIResponseData) {
  const required: { label: string; value?: string | null }[] = [
    { label: 'Full name', value: profile?.name },
    { label: 'Bio', value: profile?.professionalBio },
  ];

  return required.filter((field) => !String(field.value ?? '').trim()).map((field) => field.label);
}

/** Required payout fields, mirroring `mentorPayoutDetailsSchema`, so the card can flag an incomplete setup. */
function getMissingPayoutFields(mentorInfo?: MentorInfo | null) {
  const required: { label: string; value?: string | null }[] = [
    { label: 'Bank name', value: mentorInfo?.bank_name },
    { label: 'Account number', value: mentorInfo?.bank_number },
    { label: 'M-Pesa number', value: mentorInfo?.mpesa_number },
    { label: 'Preferred payout frequency', value: mentorInfo?.preferred_payment_frequency },
    { label: 'Preferred settlement', value: mentorInfo?.paystack_preferred_settlement },
  ];

  if (mentorInfo?.is_vat_registered) {
    required.push({ label: 'VAT number', value: mentorInfo?.vat_number });
  }

  return required.filter((field) => !String(field.value ?? '').trim()).map((field) => field.label);
}

function paystackStatusBadgeClass(status?: string | null) {
  const normalized = (status ?? '').toLowerCase();
  if (['active', 'success', 'synced', 'verified'].includes(normalized)) {
    return 'bg-emerald-50 text-emerald-700';
  }
  if (['pending', 'processing', 'in_progress'].includes(normalized)) {
    return 'bg-amber-50 text-amber-700';
  }
  if (['failed', 'error', 'inactive'].includes(normalized)) {
    return 'bg-red-50 text-red-700';
  }
  return 'bg-slate-100 text-slate-600';
}


/** Label + input + inline error, used by both edit forms below to avoid repeating the same markup. */
function FormField({ id, label, value, onChange, onBlur, error, disabled, placeholder, required = true, }: {
  id: string;
  label: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  onBlur: React.FocusEventHandler<HTMLInputElement>;
  error?: string;
  disabled?: boolean;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>
        {label}
        {required ? <span className="text-red-500"> *</span> : null}
      </Label>
      <Input
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        disabled={disabled}
        placeholder={placeholder}
        className={error ? 'border-red-500' : ''}
      />
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </div>
  );
}

/** Ribbon next to a card title telling the mentor whether that section's required fields are filled in. */
function CompletionBadge({ isComplete }: { isComplete: boolean }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide',
        isComplete ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700',
      )}
    >
      {isComplete ? <CheckCircle2 className="h-3 w-3" /> : <CircleAlert className="h-3 w-3" />}
      {isComplete ? 'Complete' : 'Incomplete'}
    </span>
  );
}

function MissingFieldsNotice({ title, fields }: { title: string; fields: string[] }) {
  return (
    <div className="mb-6 flex items-start gap-2.5 rounded-md border border-amber-100! bg-amber-50 px-3.5 py-3">
      <CircleAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
      <div className="text-sm text-amber-800">
        <p className="font-medium">{title}</p>
        <p className="mt-0.5 text-xs">Add the following to complete this section: {fields.join(', ')}.</p>
      </div>
    </div>
  );
}

function PrivacyBadge({ isPrivate }: { isPrivate?: boolean }) {
  return (
    <span
      className={cn(
        'ml-2 inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide',
        isPrivate ? 'bg-slate-100 text-slate-600' : 'bg-emerald-50 text-emerald-700',
      )}
    >
      {isPrivate ? 'Private' : 'Public'}
    </span>
  );
}

function PrivacyToggle({
  id,
  label,
  description,
  checked,
  onCheckedChange,
  disabled,
}: {
  id: string;
  label: string;
  description: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 px-3.5 py-2.5">
      <div>
        <p className="text-sm font-medium text-slate-900">{label}</p>
        <p className="text-xs text-slate-500">{description}</p>
      </div>
      <Switch id={id} checked={checked} onCheckedChange={onCheckedChange} disabled={disabled} />
    </div>
  );
}

function ProfileSkeleton() {
  return (
    <AdminPage>
      <div className={cn(adminPanelClass, 'animate-pulse p-6 h-28')} />
      <div className={cn(adminPanelClass, 'animate-pulse p-6 h-80')} />
      <div className={cn(adminPanelClass, 'animate-pulse p-6 h-64')} />
      <div className={cn(adminPanelClass, 'animate-pulse p-6 h-40')} />
    </AdminPage>
  );
}

/** Small icon badge used to lead a card header title, e.g. a house-style icon next to "Payout details". */
function SectionIcon({ icon: Icon, tone = 'primary' }: { icon: React.ComponentType<{ className?: string }>; tone?: 'primary' | 'slate' }) {
  return (
    <div
      className={cn(
        'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg',
        tone === 'primary' ? 'bg-primary/10 text-primary' : 'bg-slate-100 text-slate-500',
      )}
    >
      <Icon className="h-4 w-4" />
    </div>
  );
}

/** ── Section 1: Name, bio, photo, and social links — POST /admin/update-profile ── */
function ProfileDetailsCard({ profile }: { profile?: IAdminProfileAPIResponseData }) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempPhoto, setTempPhoto] = useState('');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [isTierModalOpen, setIsTierModalOpen] = useState(false);
  const [updateAdminProfile] = useUpdateAdminProfileMutation();
  const { data: tierUpgradeData } = useGetMyMentorTierUpgradeApplicationQuery();

  const tierUpgradeApplication = tierUpgradeData?.data;
  const isTierUpgradePending = tierUpgradeApplication?.status === VERIFIED_MENTOR_APPLICATION_STATUS.PENDING_REVIEW;
  const isTierUpgradeRejected = tierUpgradeApplication?.status === VERIFIED_MENTOR_APPLICATION_STATUS.REJECTED;

  const { errors, touched, isSubmitting, values, handleSubmit, handleChange, handleBlur, resetForm, setFieldValue } = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: profile?.name ?? '',
      phone: profile?.phone ?? '',
      professionalBio: profile?.professionalBio ?? '',
      facebook: profile?.facebook ?? '',
      linkedin: profile?.linkedin ?? '',
      isEmailPrivate: profile?.isEmailPrivate ?? false,
      isNamePrivate: profile?.isNamePrivate ?? false,
      isPhonePrivate: profile?.isPhonePrivate ?? false,
    },
    validationSchema: mentorProfileDetailsSchema,
    onSubmit: async (formValues) => {
      try {
        const formData = new FormData();
        formData.append('name', formValues.name.trim());
        formData.append('email', profile?.email ?? '');
        formData.append('phone', formValues.phone.trim());
        formData.append('professionalBio', formValues.professionalBio?.trim() ?? '');
        formData.append('facebook', formValues.facebook?.trim() ?? '');
        formData.append('linkedin', formValues.linkedin?.trim() ?? '');
        formData.append('isEmailPrivate', String(formValues.isEmailPrivate));
        formData.append('isNamePrivate', String(formValues.isNamePrivate));
        formData.append('isPhonePrivate', String(formValues.isPhonePrivate));
        if (photoFile) formData.append('profile_pic', photoFile);

        const res = await updateAdminProfile(formData).unwrap();
        if (res?.http_status_code === 200 || res?.http_status_code === 201) {
          setTempPhoto('');
          setPhotoFile(null);
          setIsEditing(false);
          void refreshAfterMentorChange(profile?.short_code);
          toast.success(res.message ?? 'Profile updated successfully!');
        }
      } catch (error) {
        console.error('Failed to update profile. Please try again.', error);
      }
    },
  });

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Photo must be less than 2MB');
      return;
    }
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload a valid image file');
      return;
    }
    setPhotoFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setTempPhoto(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleCancel = () => {
    resetForm();
    setTempPhoto('');
    setPhotoFile(null);
    setIsEditing(false);
  };

  const displayPhoto = tempPhoto || profile?.profile_pic || '';
  const displayName = values.name || profile?.name || 'Mentor';
  const referralCode = profile?.short_code?.trim() || '';

  const missingProfileFields = getMissingProfileFields(profile);
  const isProfileIncomplete = missingProfileFields.length > 0;

  const copyReferralCode = async () => {
    if (!referralCode) return;
    try {
      await navigator.clipboard.writeText(referralCode);
      toast.success('Referral code copied', { description: referralCode });
    } catch {
      toast.error('Failed to copy referral code');
    }
  };

  return (
    <>
      <AdminPanel padding={false} className="overflow-hidden">
        <div className="border-b border-slate-100 bg-linear-to-r from-primary/5 via-slate-50 to-white px-6 py-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <ProfileAvatarUpload
              src={profile?.profile_pic ?? ''}
              name={displayName}
              publicMentorShortCode={profile?.short_code}
            />
            <div className="min-w-0 flex-1">
              <h2 className="text-xl font-semibold text-slate-900">{profile?.name ?? '—'}</h2>
              <p className="mt-1 flex items-center gap-2 text-sm text-slate-500">
                <Mail className="h-4 w-4 shrink-0" />
                {profile?.email ?? '—'}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20! bg-primary/10! px-3 py-1 text-xs font-medium text-primary">
                  <Shield className="h-3.5 w-3.5" />
                  Mentor
                </span>
                {referralCode ? (
                  <button
                    type="button"
                    onClick={copyReferralCode}
                    className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700 hover:border-primary/30 hover:text-primary transition-colors"
                    title="Copy referral code"
                  >
                    <span className="text-slate-500 font-normal">Referral code</span>
                    <span className="font-mono">{referralCode}</span>
                    <Copy className="h-3.5 w-3.5 shrink-0" />
                  </button>
                ) : null}
                {profile?.createdAt ? (
                  <span className="inline-flex items-center gap-1.5 text-xs text-slate-500">
                    <Calendar className="h-3.5 w-3.5" />
                    Joined {moment(profile?.createdAt).format('MMM D, YYYY hh:mm A')}
                  </span>
                ) : null}
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <div className="rounded-md border border-slate-200/80 bg-white/80 px-4 py-3">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Profile completion</p>
              <p className="mt-1 text-lg font-semibold text-slate-900">{profile?.profile_completion_percentage ?? 0}%</p>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${profile?.profile_completion_percentage ?? 0}%` }}
                />
              </div>
            </div>
            <div className="rounded-md border border-slate-200/80 bg-white/80 px-4 py-3">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Email verification</p>
              <p
                className={cn(
                  'mt-1 inline-flex items-center gap-1.5 text-sm font-semibold',
                  profile?.is_verified ? 'text-emerald-700' : 'text-amber-700',
                )}
              >
                {profile?.is_verified ? (
                  <ShieldCheck className="h-4 w-4" />
                ) : (
                  <CircleAlert className="h-4 w-4" />
                )}
                {profile?.is_verified ? 'Verified' : 'Not verified'}
              </p>
            </div>
            <div className="rounded-md border border-slate-200/80 bg-white/80 px-4 py-3">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Mentor Verification</p>
              <p
                className={cn(
                  'mt-1 inline-flex items-center gap-1.5 text-sm font-semibold',
                  profile?.mentor_info?.is_verified_mentor ? 'text-emerald-700' : 'text-amber-700',
                )}
              >
                {profile?.mentor_info?.is_verified_mentor ? (
                  <ShieldCheck className="h-4 w-4" />
                ) : (
                  <CircleAlert className="h-4 w-4" />
                )}
                {profile?.mentor_info?.is_verified_mentor ? 'Verified' : 'Not verified'}
              </p>
            </div>
            <div className="rounded-md border border-slate-200/80 bg-white/80 px-4 py-3">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Account status</p>
              <p
                className={cn(
                  'mt-1 inline-flex items-center gap-1.5 text-sm font-semibold capitalize',
                  profile?.status === 'active' ? 'text-emerald-700' : 'text-red-700',
                )}
              >
                {profile?.status === 'active' ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <Ban className="h-4 w-4" />
                )}
                {profile?.status || '—'}
              </p>
            </div>
            <div className="rounded-md border border-slate-200/80 bg-white/80 px-4 py-3">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Mentor tier</p>
              <p className="mt-1 text-sm font-semibold text-slate-900">{profile?.mentor_economy?.tier?.code ?? '—'}</p>
              {isTierUpgradePending ? (
                <p className="mt-1.5 flex items-center gap-1.5 whitespace-nowrap text-xs font-medium text-amber-700">
                  <Clock className="h-3.5 w-3.5 shrink-0" />
                  Upgrade pending
                </p>
              ) : isTierUpgradeRejected ? (
                <div className="mt-1.5 flex items-center gap-1 whitespace-nowrap text-xs font-medium text-red-600">
                  <button
                    type="button"
                    onClick={() => setIsTierModalOpen(true)}
                    className="inline-flex items-center gap-1.5 hover:underline"
                  >
                    <Ban className="h-3.5 w-3.5 shrink-0" />
                    Rejected · Retry
                  </button>
                  {tierUpgradeApplication?.decision_reason ? (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span
                          tabIndex={0}
                          aria-label="Rejection reason"
                          className="inline-flex shrink-0 cursor-help items-center text-red-400 hover:text-red-600"
                        >
                          <Info className="h-3.5 w-3.5" />
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>{tierUpgradeApplication.decision_reason}</TooltipContent>
                    </Tooltip>
                  ) : null}
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsTierModalOpen(true)}
                  className="mt-1.5 inline-flex items-center gap-1.5 whitespace-nowrap text-xs font-medium text-primary hover:underline"
                >
                  <ArrowUpCircle className="h-3.5 w-3.5 shrink-0" />
                  Request upgrade
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="p-6">
          <AdminSectionHeader
            title="Personal information"
            badge={<CompletionBadge isComplete={!isProfileIncomplete} />}
            action={
              !isEditing ? (
                <Button
                  type="button"
                  className="global_btn rounded_full outline_primary"
                  startContent={<Pencil className="h-4 w-4" />}
                  onPress={() => setIsEditing(true)}
                >
                  Edit
                </Button>
              ) : null
            }
          />
          {!isEditing && isProfileIncomplete ? (
            <MissingFieldsNotice title="Your personal information is incomplete." fields={missingProfileFields} />
          ) : null}
          {!isEditing ? (
            <dl className="grid gap-6 sm:grid-cols-2">
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Full name
                  <PrivacyBadge isPrivate={profile?.isNamePrivate} />
                </dt>
                <dd className="mt-1 text-sm font-medium text-slate-900">{profile?.name ?? '—'}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Email
                  <PrivacyBadge isPrivate={profile?.isEmailPrivate} />
                </dt>
                <dd className="mt-1 text-sm font-medium text-slate-900">{profile?.email ?? '—'}</dd>
                <p className="mt-1 text-xs text-slate-400">Email cannot be changed</p>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Phone number
                  <PrivacyBadge isPrivate={profile?.isPhonePrivate} />
                </dt>
                <dd className="mt-1 flex items-center gap-1.5 text-sm font-medium text-slate-900">
                  <Phone className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                  {profile?.phone || '—'}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">Facebook</dt>
                <dd className="mt-1 flex items-center gap-1.5 text-sm font-medium text-slate-900">
                  {profile?.facebook ? (
                    <Link
                      href={profile.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-primary hover:underline"
                    >
                      <Facebook className="h-3.5 w-3.5 shrink-0" />
                      <span className="truncate">{profile.facebook}</span>
                    </Link>
                  ) : (
                    '—'
                  )}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">LinkedIn</dt>
                <dd className="mt-1 flex items-center gap-1.5 text-sm font-medium text-slate-900">
                  {profile?.linkedin ? (
                    <Link
                      href={profile.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-primary hover:underline"
                    >
                      <Linkedin className="h-3.5 w-3.5 shrink-0" />
                      <span className="truncate">{profile.linkedin}</span>
                    </Link>
                  ) : (
                    '—'
                  )}
                </dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">Bio</dt>
                <dd className="mt-1 text-sm leading-relaxed text-slate-700 whitespace-pre-wrap">
                  {profile?.professionalBio?.trim() || 'No bio added yet'}
                </dd>
              </div>
            </dl>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex flex-col gap-4 border-b border-slate-100 pb-6 sm:flex-row sm:items-center">
                <Avatar src={displayPhoto} name={displayName} className="h-16 w-16 shrink-0 text-xl" />
                <div>
                  <p className="text-sm font-medium text-slate-900">Profile photo</p>
                  <p className="mt-0.5 text-xs text-slate-500">JPG or PNG, max 2 MB</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <label>
                      <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" disabled={isSubmitting} />
                      <span className="inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50">
                        <Camera className="h-4 w-4" />
                        {displayPhoto ? 'Change photo' : 'Upload photo'}
                      </span>
                    </label>
                    {displayPhoto ? (
                      <button
                        type="button"
                        onClick={() => { setTempPhoto(''); setPhotoFile(null); }}
                        disabled={isSubmitting}
                        className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-red-200 px-3 text-sm font-medium text-red-600 hover:bg-red-50"
                      >
                        <X className="h-4 w-4" />
                        Remove
                      </button>
                    ) : null}
                  </div>
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <FormField
                  id="name"
                  label="Full name"
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={isSubmitting}
                  error={touched.name ? errors.name : undefined}
                />
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={profile?.email ?? ''} readOnly disabled className="bg-slate-50 text-slate-600" />
                  <p className="text-xs text-slate-400">Email cannot be changed</p>
                </div>
                <FormField
                  id="phone"
                  label="Phone number"
                  placeholder="e.g. +254712345678"
                  value={values.phone}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={isSubmitting}
                  error={touched.phone ? errors.phone : undefined}
                  required={false}
                />
                <FormField
                  id="facebook"
                  label="Facebook URL"
                  placeholder="https://facebook.com/yourprofile"
                  value={values.facebook}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={isSubmitting}
                  error={touched.facebook ? errors.facebook : undefined}
                  required={false}
                />
                <FormField
                  id="linkedin"
                  label="LinkedIn URL"
                  placeholder="https://linkedin.com/in/yourprofile"
                  value={values.linkedin}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={isSubmitting}
                  error={touched.linkedin ? errors.linkedin : undefined}
                  required={false}
                />
                <div className="space-y-3 sm:col-span-2">
                  <p className="text-sm font-medium text-slate-900">Privacy</p>
                  <p className="text-xs text-slate-500">Control what others can see on your public profile.</p>
                  <div className="grid gap-3 sm:grid-cols-3">
                    <PrivacyToggle
                      id="isNamePrivate"
                      label="Hide name"
                      description="Keep your name private"
                      checked={values.isNamePrivate}
                      onCheckedChange={(checked) => setFieldValue('isNamePrivate', checked)}
                      disabled={isSubmitting}
                    />
                    <PrivacyToggle
                      id="isEmailPrivate"
                      label="Hide email"
                      description="Keep your email private"
                      checked={values.isEmailPrivate}
                      onCheckedChange={(checked) => setFieldValue('isEmailPrivate', checked)}
                      disabled={isSubmitting}
                    />
                    <PrivacyToggle
                      id="isPhonePrivate"
                      label="Hide phone"
                      description="Keep your phone private"
                      checked={values.isPhonePrivate}
                      onCheckedChange={(checked) => setFieldValue('isPhonePrivate', checked)}
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="professionalBio">
                    Bio<span className="text-red-500">*</span>
                  </Label>
                  <textarea
                    id="professionalBio"
                    name="professionalBio"
                    value={values.professionalBio}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    disabled={isSubmitting}
                    rows={4}
                    placeholder="Write a short professional bio..."
                    className={cn(
                      'w-full resize-none rounded-lg border px-3 py-2 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-primary/20',
                      touched.professionalBio && errors.professionalBio ? 'border-red-500' : 'border-slate-200',
                    )}
                  />
                  <div className="flex justify-between text-xs text-slate-400">
                    {touched.professionalBio && errors.professionalBio ? (
                      <span className="text-red-600">{errors.professionalBio}</span>
                    ) : (
                      <span />
                    )}
                    <span>{values.professionalBio?.length ?? 0}/500</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 border-t border-slate-100 pt-5">
                <Button type="submit" className="global_btn rounded_full bg_primary" isLoading={isSubmitting} startContent={<Check className="h-4 w-4" />}>
                  Save changes
                </Button>
                <Button type="button" className="global_btn rounded_full outline_primary" onPress={handleCancel} disabled={isSubmitting}>
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </div>
      </AdminPanel>

      <MentorTierUpgradeModal
        open={isTierModalOpen}
        currentTierId={profile?.mentor_economy?.tier?.id}
        onOpenChange={setIsTierModalOpen}
      />
    </>
  );
}

/** ── Section 2: Bank / M-Pesa / tax details — POST /admin/update-mentor-info ── */
function PayoutDetailsCard({ mentorInfo }: { mentorInfo?: MentorInfo | null }) {
  const [isEditing, setIsEditing] = useState(false);
  const [updateMentorInfo] = useUpdateMentorInfoMutation();
  const requiredAcceptedRef = useRef(false);
  // const { isTouchpointBlocked } = useBlockedTouchpoints();
  // const payoutBlocked = isTouchpointBlocked(AGREEMENT_TOUCHPOINTS.MENTOR_PAYOUT_SETUP);
  const { data: banksResponse, isLoading: isBanksLoading } = useGetPaystackBanksQuery(undefined, {
    skip: !isEditing,
  });

  const banks = banksResponse?.data?.banks ?? [];
  const bankOptions: SelectOption[] = banks && banks?.length > 0
    ? banks.map((bank) => ({
      value: bank.name,
      label: bank.name
    })
    ) : [];

  const { errors, touched, isSubmitting, values, handleSubmit, handleChange, handleBlur, setFieldValue, setFieldTouched, resetForm } = useFormik({
    enableReinitialize: true,
    initialValues: {
      bank_name: mentorInfo?.bank_name ?? '',
      paystack_bank_code: mentorInfo?.paystack_bank_code ?? '',
      bank_number: mentorInfo?.bank_number ?? '',
      bank_branch: mentorInfo?.bank_branch ?? '',
      mpesa_number: mentorInfo?.mpesa_number ?? '',
      tax_id: mentorInfo?.tax_id ?? '',
      preferred_payment_frequency: mentorInfo?.preferred_payment_frequency ?? '',
      paystack_preferred_settlement: mentorInfo?.paystack_preferred_settlement ?? 'mpesa',
      is_vat_registered: mentorInfo?.is_vat_registered ?? false,
      vat_number: mentorInfo?.vat_number ?? '',
      accepted_agreement_ids: [] as string[],
    },
    validationSchema: mentorPayoutDetailsSchema,
    validate: () => {
      if (!isEditing) return {};
      return requiredAcceptedRef.current ? {} : { accepted_agreement_ids: 'Please accept all required agreements before submitting.' };
    },
    onSubmit: async (formValues) => {
      try {
        const res = await updateMentorInfo(formValues).unwrap();
        if (res?.http_status_code === 200 || res?.http_status_code === 201) {
          setIsEditing(false);
          toast.success(res.message ?? 'Payout details updated successfully!');
        }
      } catch (error) {
        console.error('Failed to update payout details. Please try again.', error);
      }
    },
  });

  // Backfill bank code when banks load if we only have a saved bank name.
  useEffect(() => {
    if (!values.bank_name || values.paystack_bank_code || banks.length === 0) return;
    const matchedBank = banks.find((bank) => bank.name === values.bank_name);
    if (matchedBank?.code) {
      setFieldValue('paystack_bank_code', matchedBank.code);
    }
  }, [banks, values.bank_name, values.paystack_bank_code, setFieldValue]);

  const handleCancel = () => {
    resetForm();
    setIsEditing(false);
  };

  const selectedBankOption = bankOptions && bankOptions?.length > 0 ? bankOptions.find((option) => option.value === values.bank_name) : null;

  const missingPayoutFields = getMissingPayoutFields(mentorInfo);
  const isPayoutIncomplete = missingPayoutFields.length > 0;

  return (
    <AdminPanel padding={false} className="overflow-hidden">
      <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
        <div className="flex items-center gap-3">
          <SectionIcon icon={Wallet} />
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-base font-semibold text-slate-900">Payout details</h2>
              <CompletionBadge isComplete={!isPayoutIncomplete} />
            </div>
            <p className="mt-0.5 text-xs text-slate-500">Bank, M-Pesa, and tax details used for your payouts.</p>
          </div>
        </div>
        {!isEditing ? (
          <Button
            type="button"
            className="global_btn rounded_full outline_primary"
            startContent={<Pencil className="h-4 w-4" />}
            onPress={() => setIsEditing(true)}
          >
            Edit
          </Button>
        ) : null}
      </div>

      <div className="p-6">
        {/* {payoutBlocked ? (
          <p className="mb-4 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
            Please accept the latest agreements before updating payout details.
          </p>
        ) : null} */}

        {!isEditing && isPayoutIncomplete ? (
          <MissingFieldsNotice title="Your payout details are incomplete." fields={missingPayoutFields} />
        ) : null}

        {!isEditing ? (
          <dl className="grid gap-6 sm:grid-cols-2">
            <div>
              <dt className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-slate-500">
                <Landmark className="h-3.5 w-3.5" />
                Bank name
              </dt>
              <dd className="mt-1 text-sm font-medium text-slate-900">{mentorInfo?.bank_name || '—'}</dd>
            </div>
            <div>
              <dt className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-slate-500">
                <Landmark className="h-3.5 w-3.5" />
                Account number
              </dt>
              <dd className="mt-1 text-sm font-medium text-slate-900">{mentorInfo?.bank_number || '—'}</dd>
            </div>
            <div>
              <dt className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-slate-500">
                <Landmark className="h-3.5 w-3.5" />
                Bank branch
              </dt>
              <dd className="mt-1 text-sm font-medium text-slate-900">{mentorInfo?.bank_branch || '—'}</dd>
            </div>
            <div>
              <dt className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-slate-500">
                <Wallet className="h-3.5 w-3.5" />
                M-Pesa number
              </dt>
              <dd className="mt-1 text-sm font-medium text-slate-900">{mentorInfo?.mpesa_number || '—'}</dd>
            </div>
            <div>
              <dt className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-slate-500">
                <Receipt className="h-3.5 w-3.5" />
                Tax ID (KRA PIN)
              </dt>
              <dd className="mt-1 text-sm font-medium text-slate-900">{mentorInfo?.tax_id || '—'}</dd>
            </div>
            <div>
              <dt className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-slate-500">
                <Calendar className="h-3.5 w-3.5" />
                Preferred payout frequency
              </dt>
              <dd className="mt-1 text-sm font-medium text-slate-900">{mentorInfo?.preferred_payment_frequency || '—'}</dd>
            </div>
            <div>
              <dt className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-slate-500">
                <Wallet className="h-3.5 w-3.5" />
                Preferred settlement
              </dt>
              <dd className="mt-1 text-sm font-medium text-slate-900">
                {formatSettlementLabel(mentorInfo?.paystack_preferred_settlement)}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">VAT registered</dt>
              <dd className="mt-1.5">
                <span
                  className={cn(
                    'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
                    mentorInfo?.is_vat_registered ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600',
                  )}
                >
                  {mentorInfo?.is_vat_registered ? 'Yes' : 'No'}
                </span>
              </dd>
            </div>
            {mentorInfo?.is_vat_registered ? (
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">VAT number</dt>
                <dd className="mt-1 text-sm font-medium text-slate-900">{mentorInfo?.vat_number || '—'}</dd>
              </div>
            ) : null}

            <div className="sm:col-span-2 border-t border-slate-100 pt-6">
              <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-slate-500">Paystack account</p>
              <dl className="grid gap-6 sm:grid-cols-2">
                <div>
                  <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">Subaccount status</dt>
                  <dd className="mt-1.5">
                    <span
                      className={cn(
                        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize',
                        paystackStatusBadgeClass(mentorInfo?.paystack_subaccount_status),
                      )}
                    >
                      {mentorInfo?.paystack_subaccount_status || '—'}
                    </span>
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">Settlement country</dt>
                  <dd className="mt-1 text-sm font-medium text-slate-900">{mentorInfo?.settlement_country || '—'}</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">Bank code</dt>
                  <dd className="mt-1 text-sm font-medium font-mono text-slate-900">{mentorInfo?.paystack_bank_code || '—'}</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">Last synced</dt>
                  <dd className="mt-1 text-sm font-medium text-slate-900">
                    {mentorInfo?.paystack_subaccount_synced_at
                      ? moment(mentorInfo.paystack_subaccount_synced_at).format('MMM D, YYYY hh:mm A')
                      : '—'}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">Bank subaccount code</dt>
                  <dd className="mt-1 text-sm font-medium font-mono text-slate-900">
                    {mentorInfo?.paystack_bank_subaccount_code || '—'}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">M-Pesa subaccount code</dt>
                  <dd className="mt-1 text-sm font-medium font-mono text-slate-900">
                    {mentorInfo?.paystack_mpesa_subaccount_code || '—'}
                  </dd>
                </div>
                {mentorInfo?.paystack_subaccount_error ? (
                  <div className="sm:col-span-2">
                    <dt className="text-xs font-medium uppercase tracking-wide text-red-600">Sync error</dt>
                    <dd className="mt-1.5 rounded-md border border-red-100! bg-red-50 px-3 py-2 text-sm text-red-700">
                      {mentorInfo.paystack_subaccount_error}
                    </dd>
                  </div>
                ) : null}
              </dl>
            </div>
          </dl>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="bank_name">
                  Bank name
                  <span className="text-red-500"> *</span>
                </Label>
                <ReactSelect
                  inputId="bank_name"
                  name="bank_name"
                  classNamePrefix="react-select"
                  options={bankOptions}
                  value={selectedBankOption}
                  onChange={(option) => {
                    const bankName = option?.value ?? '';
                    const bankCode = banks.find((bank) => bank.name === bankName)?.code ?? '';
                    setFieldValue('bank_name', bankName);
                    setFieldValue('paystack_bank_code', bankCode);
                    setFieldTouched('bank_name', true);
                    setFieldTouched('paystack_bank_code', true);
                  }}
                  onBlur={() => setFieldTouched('bank_name', true)}
                  placeholder={isBanksLoading ? 'Loading banks...' : 'Select bank'}
                  isLoading={isBanksLoading}
                  isDisabled={isSubmitting || isBanksLoading}
                  isClearable
                  isSearchable
                  menuPortalTarget={typeof document !== 'undefined' ? document.body : null}
                  menuPosition="fixed"
                  styles={SELECT_STYLES}
                />
                {(touched.bank_name && errors.bank_name) || (touched.paystack_bank_code && errors.paystack_bank_code) ? (
                  <p className="text-sm text-red-600">{errors.bank_name || errors.paystack_bank_code}</p>
                ) : null}
              </div>
              <FormField
                id="bank_number"
                label="Account number"
                value={values.bank_number}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={isSubmitting}
                error={touched.bank_number ? errors.bank_number : undefined}
              />
              <FormField
                id="bank_branch"
                label="Bank branch"
                value={values.bank_branch}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={isSubmitting}
                required={false}
                error={touched.bank_branch ? errors.bank_branch : undefined}
              />
              <FormField
                id="mpesa_number"
                label="M-Pesa number"
                value={values.mpesa_number}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={isSubmitting}
                error={touched.mpesa_number ? errors.mpesa_number : undefined}
              />
              <FormField
                id="tax_id"
                label="Tax ID (KRA PIN)"
                value={values.tax_id}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={isSubmitting}
                required={false}
                error={touched.tax_id ? errors.tax_id : undefined}
              />
              <div className="space-y-2">
                <Label htmlFor="preferred_payment_frequency">
                  Preferred payout frequency
                  <span className="text-red-500"> *</span>
                </Label>
                <select
                  id="preferred_payment_frequency"
                  name="preferred_payment_frequency"
                  value={values.preferred_payment_frequency}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={isSubmitting}
                  className={cn(
                    nativeSelectClassName,
                    touched.preferred_payment_frequency && errors.preferred_payment_frequency ? 'border-red-500' : '',
                  )}
                >
                  <option value="">Select frequency</option>
                  {PAYOUT_FREQUENCIES.map((frequency) => (
                    <option key={frequency} value={frequency}>
                      {frequency}
                    </option>
                  ))}
                </select>
                {touched.preferred_payment_frequency && errors.preferred_payment_frequency ? (
                  <p className="text-sm text-red-600">{errors.preferred_payment_frequency}</p>
                ) : null}
              </div>

              <div className="space-y-2">
                <Label htmlFor="paystack_preferred_settlement">
                  Preferred settlement
                  <span className="text-red-500"> *</span>
                </Label>
                <select
                  id="paystack_preferred_settlement"
                  name="paystack_preferred_settlement"
                  value={values.paystack_preferred_settlement}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={isSubmitting}
                  className={cn(
                    nativeSelectClassName,
                    touched.paystack_preferred_settlement && errors.paystack_preferred_settlement ? 'border-red-500' : '',
                  )}
                >
                  <option value="">Select settlement method</option>
                  {PAYSTACK_SETTLEMENT_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option === 'mpesa' ? 'M-Pesa' : 'Bank'}
                    </option>
                  ))}
                </select>
                {touched.paystack_preferred_settlement && errors.paystack_preferred_settlement ? (
                  <p className="text-sm text-red-600">{errors.paystack_preferred_settlement}</p>
                ) : null}
              </div>

              <div className="flex items-center justify-between gap-3 rounded-md border border-slate-200 px-3.5 py-2.5 sm:col-span-2">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                    <Receipt className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-sm font-medium text-slate-900">VAT registered</p>
                    <p className="text-xs text-slate-500">Turn this on if you&apos;re registered for VAT.</p>
                  </div>
                </div>
                <Switch
                  checked={values.is_vat_registered}
                  onCheckedChange={(checked) => {
                    setFieldValue('is_vat_registered', checked);
                    if (!checked) {
                      setFieldValue('vat_number', '');
                      setFieldTouched('vat_number', false);
                    }
                  }}
                  disabled={isSubmitting}
                />
              </div>

              {values.is_vat_registered ? (
                <FormField
                  id="vat_number"
                  label="VAT number"
                  value={values.vat_number}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={isSubmitting}
                  error={touched.vat_number ? errors.vat_number : undefined}
                />
              ) : null}
            </div>

            <AgreementSentenceList
              touchpoint={AGREEMENT_TOUCHPOINTS.MENTOR_PAYOUT_SETUP}
              onAcceptedAgreementIdsChange={(ids) => setFieldValue('accepted_agreement_ids', ids)}
              onRequiredAcceptedChange={(accepted) => { requiredAcceptedRef.current = accepted; }}
              error={typeof errors.accepted_agreement_ids === 'string' ? errors.accepted_agreement_ids : undefined}
              touched={touched.accepted_agreement_ids}
              onBlur={() => setFieldTouched('accepted_agreement_ids', true)}
              disabled={isSubmitting}
            />

            <div className="flex flex-wrap gap-3 border-t border-slate-100 pt-5">
              <Button type="submit" className="global_btn rounded_full bg_primary" isLoading={isSubmitting} startContent={<Check className="h-4 w-4" />}>
                Save changes
              </Button>
              <Button type="button" className="global_btn rounded_full outline_primary" onPress={handleCancel} disabled={isSubmitting}>
                Cancel
              </Button>
            </div>
          </form>
        )}
      </div>
    </AdminPanel>
  );
}

/** ── Section 3: Required agreements — GET consent-status + POST agreements/accept ── */
function AgreementsCard() {
  const [acceptingId, setAcceptingId] = useState<string | null>(null);
  const [acceptingAll, setAcceptingAll] = useState(false);
  const [viewingIdOrSlug, setViewingIdOrSlug] = useState<string | null>(null);
  const { data: consentData, isLoading } = useGetUserConsentStatusQuery({ userType: 'Mentor' });
  const [acceptAgreement] = useAcceptAgreementMutation();
  const [acceptAllAgreements] = useAcceptAllAgreementsMutation();
  const agreements = consentData?.data?.agreements ?? [];
  const acceptedCount = consentData?.data?.accepted_count ?? agreements.filter((agreement) => agreement.is_accepted).length;
  const pendingCount = consentData?.data?.pending_count ?? agreements.filter((agreement) => !agreement.is_accepted).length;

  const handleAccept = async (agreementId: string) => {
    setAcceptingId(agreementId);
    try {
      await acceptAgreement({ accepted_agreement_ids: [agreementId] }).unwrap();
      toast.success('Agreement accepted successfully!');
    } catch {
      toast.error('Failed to accept agreement. Please try again.');
    } finally {
      setAcceptingId(null);
    }
  };

  const handleAcceptAll = async () => {
    setAcceptingAll(true);
    try {
      await acceptAllAgreements(undefined).unwrap();
      toast.success('All agreements accepted successfully!');
    } catch {
      toast.error('Failed to accept agreements. Please try again.');
    } finally {
      setAcceptingAll(false);
    }
  };

  return (
    <AdminPanel padding={false} className="overflow-hidden">
      <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
        <div className="flex items-center gap-3">
          <SectionIcon icon={FileSignature} />
          <div>
            <h2 className="text-base font-semibold text-slate-900">Agreements</h2>
            <p className="mt-0.5 text-xs text-slate-500">Review and accept the agreements required for your mentor account.</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!isLoading && agreements.length > 0 ? (
            <span
              className={cn(
                'inline-flex shrink-0 items-center rounded-full px-2.5 py-1 text-xs font-medium',
                acceptedCount === agreements.length ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700',
              )}
            >
              {acceptedCount} of {agreements.length} accepted
            </span>
          ) : null}
          {pendingCount > 0 ? (
            <Button type="button" className="global_btn rounded_full outline_primary shrink-0" isLoading={acceptingAll} onPress={handleAcceptAll}>
              Accept all
            </Button>
          ) : null}
        </div>
      </div>

      <div className={agreements.length === 0 && !isLoading ? '' : 'p-6'}>
        {isLoading ? (
          <div className="space-y-3 p-6">
            <div className="h-14 animate-pulse rounded-lg bg-slate-100" />
            <div className="h-14 animate-pulse rounded-lg bg-slate-100" />
          </div>
        ) : agreements.length === 0 ? (
          <AdminEmptyState
            icon={FileSignature}
            title="No agreements found"
            description="There are no agreements required for your account type right now."
          />
        ) : (
          <ul className="divide-y divide-slate-100">
            {agreements.map((agreement) => (
              <li key={agreement._id} className="flex flex-wrap items-center justify-between gap-3 py-3.5">
                <div className="flex min-w-0 items-start gap-3">
                  <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100">
                    <FileSignature className="h-4 w-4 text-slate-500" />
                  </span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-slate-900">{agreement.title} {agreement?.is_required ? <span className="text-xs text-red-500">*</span> : null}</p>
                      <button
                        type="button"
                        className="text-xs font-medium text-primary hover:underline"
                        onClick={() => setViewingIdOrSlug(agreement.slug || agreement._id)}
                      >
                        View
                      </button>
                    </div>
                    <p className="mt-0.5 text-xs text-slate-500">
                      {agreement.agreement_type?.name ?? 'Agreement'} · v{agreement.current_version}
                      {agreement.is_accepted && agreement.accepted_at ? ` · Accepted ${moment(agreement.accepted_at).format('MMM D, YYYY HH:mm A')}` : ''}
                    </p>
                  </div>
                </div>
                {agreement.is_accepted ? (
                  <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-green-50 px-3 py-1.5 text-xs font-medium text-green-700">
                    <BadgeCheck className="h-3.5 w-3.5" />
                    Accepted
                  </span>
                ) : (
                  <Button
                    type="button"
                    size="sm"
                    className="global_btn rounded_full bg_primary shrink-0"
                    isLoading={acceptingId === agreement._id}
                    onPress={() => handleAccept(agreement._id)}
                  >
                    Accept
                  </Button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
      <AgreementDocumentModal
        open={!!viewingIdOrSlug}
        idOrSlug={viewingIdOrSlug}
        onOpenChange={(open) => {
          if (!open) setViewingIdOrSlug(null);
        }}
      />
    </AdminPanel>
  );
}

export function MentorProfileTab() {
  const { data: profileData, isLoading } = useGetAdminProfileQuery();

  if (isLoading) return <ProfileSkeleton />;

  const profile = profileData?.data;

  return (
    <AdminPage>
      <MentorVerificationHeader
        eyebrow="Account"
        title="My Profile"
        description="Manage your mentor profile, bio, and public information."
        showAccountStatus={false}
      />
      <ProfileDetailsCard profile={profile} />
      <div className="grid gap-6 lg:grid-cols-2">
        <PayoutDetailsCard mentorInfo={profile?.mentor_info} />
        <AgreementsCard />
      </div>
    </AdminPage>
  );
}
