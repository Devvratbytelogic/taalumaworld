'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useFormik } from 'formik';
import {
  Mail,
  Check,
  Pencil,
  Calendar,
  UserRound,
  ShieldCheck,
  ShieldX,
  Clock,
  GraduationCap,
  BookOpen,
  BookMarked,
  TrendingUp,
  CheckCircle,
  Phone,
  Hash,
  Copy,
} from 'lucide-react';
import Button from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { fieldInvalidClassName } from '@/components/ui/field-styles';
import { cn } from '@/components/ui/utils';
import toast from '@/utils/toast';
import {
  useGetMySeriesQuery,
  useGetMyChaptersQuery,
  useGetReadingHistoryQuery,
  useGetUserProfileQuery,
  useGetMentorApplicationsQuery,
} from '@/store/rtkQueries/userGetAPI';
import { useUserUpdateProfileMutation } from '@/store/rtkQueries/userAuthApi';
import { AGREEMENT_VISIBLE_USER_TYPES } from '@/constants/agreements';
import { isMentorRole } from '@/constants/common';
import { getUserRole } from '@/utils/authCookies';
import { updateProfileSchema } from '@/utils/formValidation';
import moment from 'moment';
import {
  getUserDashboardBecomeMentorRoutePath,
  getUserDashboardHistoryRoutePath,
  getUserDashboardMyBooksRoutePath,
  getUserDashboardMyChaptersRoutePath,
} from '@/routes/routes';
import { UserDashboardPageHeader } from './UserDashboardPageHeader';
import { DashboardProfileSkeleton } from '@/components/skeleton-loader/userDashboardSkeletons';
import { ProfileAvatarUpload } from '@/components/admin/profile/ProfileAvatarUpload';
import { ProfileAgreementsCard } from './ProfileAgreementsCard';

export function ProfilePage() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);

  const { data: profileData, isLoading } = useGetUserProfileQuery();
  const { data: seriesData, isLoading: isSeriesLoading } = useGetMySeriesQuery();
  const { data: chaptersData, isLoading: isChaptersLoading } = useGetMyChaptersQuery();
  const { data: historyData, isLoading: isHistoryLoading } = useGetReadingHistoryQuery();
  const { data: mentorApplicationsData } = useGetMentorApplicationsQuery(undefined, {
    skip: isMentorRole(getUserRole()),
  });
  const [updateProfile] = useUserUpdateProfileMutation();
  const profile = profileData?.data;
  const isMentor = isMentorRole(profile?.role?.name) || isMentorRole(getUserRole());
  const mentorApplication = mentorApplicationsData?.data;
  const latestMentorApplication = mentorApplication?.latest_application ?? null;
  const mentorApplicationStatus = latestMentorApplication?.status;
  const canApplyForMentor = mentorApplication?.can_apply ?? true;
  const displayName = profile?.name || 'User';
  const displayPhoto = profile?.profile_pic || '';
  const shortCode = profile?.short_code?.trim() || '';
  const lastUpdatedLabel =
    profile?.updatedAt && moment(profile.updatedAt).isValid()
      ? moment(profile.updatedAt).format('MMM D, YYYY · h:mm A')
      : null;
  const agreementUserType = isMentor
    ? AGREEMENT_VISIBLE_USER_TYPES.MENTOR
    : profile?.institution_id
      ? AGREEMENT_VISIBLE_USER_TYPES.INSTITUTIONAL_CA
      : AGREEMENT_VISIBLE_USER_TYPES.CAREER_ARCHITECT;

  const copyShortCode = async () => {
    if (!shortCode) return;
    try {
      await navigator.clipboard.writeText(shortCode);
      toast.success('Referral code copied', { description: shortCode });
    } catch {
      toast.error('Failed to copy referral code');
    }
  };

  const isKpisLoading = isSeriesLoading || isChaptersLoading || isHistoryLoading;

  const mentorDecisionBanner =
    mentorApplicationStatus === 'approved'
      ? {
          label: 'Approval note',
          Icon: ShieldCheck,
          border: 'border-emerald-200/80!',
          bg: 'bg-emerald-50/50',
          iconBg: 'bg-emerald-100',
          iconColor: 'text-emerald-600',
          titleColor: 'text-emerald-900',
          textColor: 'text-emerald-700',
        }
      : {
          label: 'Reason for rejection',
          Icon: ShieldX,
          border: 'border-red-200/80!',
          bg: 'bg-red-50/50',
          iconBg: 'bg-red-100',
          iconColor: 'text-red-600',
          titleColor: 'text-red-900',
          textColor: 'text-red-700',
        };

  const kpiItems = useMemo(
    () => [
      {
        label: 'Series owned',
        value: seriesData?.data?.summary?.totalBooks ?? 0,
        icon: BookOpen,
        iconClass: 'text-primary',
        href: getUserDashboardMyBooksRoutePath(),
      },
      {
        label: 'Blueprints',
        value: chaptersData?.data?.summary?.totalChapters ?? 0,
        icon: BookMarked,
        iconClass: 'text-primary',
        href: getUserDashboardMyChaptersRoutePath(),
      },
      {
        label: 'In progress',
        value:
          historyData?.data?.summary?.inProgress ??
          (seriesData?.data?.summary?.inProgress ?? 0) + (chaptersData?.data?.summary?.inProgress ?? 0),
        icon: TrendingUp,
        iconClass: 'text-primary',
        href: getUserDashboardHistoryRoutePath(),
      },
      {
        label: 'Completed',
        value:
          historyData?.data?.summary?.completed ??
          (seriesData?.data?.summary?.completed ?? 0) + (chaptersData?.data?.summary?.completed ?? 0),
        icon: CheckCircle,
        iconClass: 'text-green-600',
        href: getUserDashboardHistoryRoutePath(),
      },
    ],
    [seriesData, chaptersData, historyData]
  );

  const { errors, touched, isSubmitting, values, handleSubmit, handleChange, handleBlur, resetForm } =
    useFormik({
      enableReinitialize: true,
      initialValues: {
        fullName: profile?.name ?? '',
        phone: profile?.phone ?? '',
      },
      validationSchema: updateProfileSchema,
      onSubmit: async (formValues) => {
        try {
          const formData = new FormData();
          formData.append('name', formValues.fullName.trim());
          formData.append('phone', formValues.phone.trim());
          const res = await updateProfile(formData).unwrap();
          if (res?.http_status_code === 200 || res?.http_status_code === 201) {
            setIsEditing(false);
            toast.success(res.message ?? 'Profile updated successfully!');
          }
        } catch (error) {
          console.error('Failed to update profile. Please try again.', error);
        }
      },
    });

  const handleCancel = () => {
    resetForm();
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <UserDashboardPageHeader title="Profile" description="View and update your account details">
          <Button
            type="button"
            className="global_btn w-full rounded_full outline_primary sm:w-auto"
            isDisabled
          >
            <Pencil className="h-4 w-4" />
            Edit profile
          </Button>
        </UserDashboardPageHeader>
        <DashboardProfileSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <UserDashboardPageHeader title="Profile" description="View and update your account details">
        {!isEditing ? (
          <div className="flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:items-start sm:justify-end">
            {!isMentor && mentorApplicationStatus === 'pending_review' ? (
              <span className="inline-flex items-center justify-center gap-1.5 rounded-full border border-amber-200! bg-amber-50 px-4 py-2 text-center text-sm font-medium text-amber-700">
                <Clock className="h-4 w-4 shrink-0" />
                Mentor Application Pending Review
              </span>
            ) : null}
            {!isMentor && mentorApplicationStatus === 'approved' ? (
              <span className="inline-flex items-center justify-center gap-1.5 rounded-full border border-emerald-200! bg-emerald-50 px-4 py-2 text-center text-sm font-medium text-emerald-700">
                <ShieldCheck className="h-4 w-4 shrink-0" />
                Mentor Application Approved
              </span>
            ) : null}
            {!isMentor && mentorApplicationStatus === 'rejected' ? (
              <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center">
                <span className="inline-flex items-center justify-center gap-1.5 rounded-full border border-red-200! bg-red-50 px-4 py-2 text-center text-sm font-medium text-red-700">
                  <ShieldX className="h-4 w-4 shrink-0" />
                  Mentor Application Rejected
                </span>
                <Button
                  type="button"
                  className="global_btn w-full rounded_full bg_primary sm:w-auto"
                  startContent={<GraduationCap className="h-4 w-4" />}
                  onPress={() => router.push(getUserDashboardBecomeMentorRoutePath())}
                >
                  Re-apply
                </Button>
              </div>
            ) : null}
            {!isMentor && !mentorApplicationStatus ? (
              <div className="flex flex-col items-stretch gap-1 sm:items-end">
                {/* the title tooltip is put on this wrapping span, not the button itself,
                    because a disabled button never receives hover events so its own title never shows */}
                <span
                  title={!canApplyForMentor ? mentorApplication?.eligibility_reason : undefined}
                  className="inline-block w-full sm:w-auto"
                >
                  <Button
                    type="button"
                    className="global_btn w-full rounded_full bg_primary sm:w-auto"
                    startContent={<GraduationCap className="h-4 w-4" />}
                    onPress={() => router.push(getUserDashboardBecomeMentorRoutePath())}
                    isDisabled={!canApplyForMentor}
                  >
                    Become a Mentor
                  </Button>
                </span>
                {!canApplyForMentor && mentorApplication?.eligibility_reason ? (
                  <p className="max-w-full text-xs text-gray-500 sm:max-w-56 sm:text-right">
                    {mentorApplication.eligibility_reason}
                  </p>
                ) : null}
              </div>
            ) : null}
            <Button
              type="button"
              className="global_btn w-full rounded_full outline_primary sm:w-auto"
              onPress={() => queueMicrotask(() => setIsEditing(true))}
            >
              <Pencil className="h-4 w-4" />
              Edit profile
            </Button>
          </div>
        ) : (
          <div className="flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row">
            <Button
              type="button"
              className="global_btn w-full rounded_full bg_primary sm:w-auto"
              disabled={isSubmitting}
              isLoading={isSubmitting}
              onPress={() => handleSubmit()}
            >
              {!isSubmitting && (
                <>
                  <Check className="h-4 w-4" />
                  Save
                </>
              )}
            </Button>
            <Button
              type="button"
              className="global_btn w-full rounded_full outline_primary sm:w-auto"
              onPress={handleCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          </div>
        )}
      </UserDashboardPageHeader>

      {!isMentor && latestMentorApplication?.decision_reason ? (
        <div
          className={cn(
            'flex items-start gap-3.5 rounded-md border p-4',
            mentorDecisionBanner.border,
            mentorDecisionBanner.bg
          )}
        >
          <div className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-lg', mentorDecisionBanner.iconBg)}>
            <mentorDecisionBanner.Icon className={cn('h-5 w-5', mentorDecisionBanner.iconColor)} />
          </div>
          <div className="min-w-0 flex-1 pt-0.5">
            <p className={cn('text-sm font-semibold', mentorDecisionBanner.titleColor)}>{mentorDecisionBanner.label}</p>
            <p className={cn('mt-0.5 text-sm leading-relaxed', mentorDecisionBanner.textColor)}>
              {latestMentorApplication.decision_reason}
            </p>
          </div>
        </div>
      ) : null}

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
        <div className="bg-linear-to-br from-primary/10 via-primary/5 to-gray-50/90 px-4 py-5 sm:px-8 sm:py-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-5">
            <ProfileAvatarUpload
              src={displayPhoto}
              name={values.fullName || displayName}
              size="lg"
              showHint={false}
              ringClassName="ring-2 ring-white sm:ring-4"
            />
            <div className="min-w-0 flex-1">
              <h2 className="text-lg font-medium tracking-tight wrap-break-word text-gray-900 sm:truncate sm:text-xl">
                {profile?.name ?? '—'}
              </h2>
              <p className="mt-1 flex min-w-0 items-start gap-1.5 text-sm text-gray-500">
                <Mail className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gray-400" aria-hidden />
                <span className="min-w-0 break-all">{profile?.email ?? '—'}</span>
              </p>
              {lastUpdatedLabel ? (
                <p className="mt-1 flex min-w-0 items-start gap-1.5 text-sm text-gray-500">
                  <Clock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gray-400" aria-hidden />
                  <span>Updated {lastUpdatedLabel}</span>
                </p>
              ) : null}
            </div>
            <span className="inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full border border-primary/20 bg-white/95 px-3 py-1 text-[11px] font-medium uppercase tracking-wide text-primary sm:px-3.5 sm:py-1.5">
              <ShieldCheck className="h-3.5 w-3.5 shrink-0" aria-hidden />
              {profile?.role?.name ?? 'User'}
            </span>
          </div>
        </div>

        <div className="px-4 pb-6 pt-4 sm:px-8 sm:pb-8 sm:pt-6">
          <div className="grid grid-cols-1 gap-3 min-[480px]:grid-cols-2 lg:grid-cols-4">
            {kpiItems.map(({ label, value, icon: Icon, iconClass, href }) => (
              <Link
                key={label}
                href={href}
                className="rounded-lg border border-gray-200 bg-gray-50/60 p-4 transition-colors hover:border-gray-300 hover:bg-gray-50"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-gray-200 bg-white">
                    <Icon className={cn('h-4 w-4', iconClass)} aria-hidden />
                  </span>
                  <div className="min-w-0 flex-1">
                    {isKpisLoading ? (
                      <div className="space-y-1.5 animate-pulse">
                        <div className="h-5 w-8 rounded bg-gray-200" />
                        <div className="h-3 w-16 rounded bg-gray-100" />
                      </div>
                    ) : (
                      <>
                        <p className="text-xl font-semibold tracking-tight text-gray-900">{value}</p>
                        <p className="text-sm text-gray-500">{label}</p>
                      </>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-6 border-t border-gray-100 pt-6 sm:mt-8 sm:pt-8">
            {!isEditing ? (
              <div className="overflow-hidden rounded-lg border border-gray-200 bg-gray-50/60">
                <dl className="divide-y divide-gray-200/70">
                  <div className="flex flex-col gap-2 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-8 sm:px-5">
                    <dt className="flex items-center gap-3 text-sm font-normal text-gray-600">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-gray-200 bg-white">
                        <UserRound className="h-4 w-4 text-primary" aria-hidden />
                      </span>
                      Full name
                    </dt>
                    <dd className="text-base font-medium text-gray-900 sm:text-right">
                      {profile?.name ?? '—'}
                    </dd>
                  </div>

                  <div className="flex flex-col gap-2 px-5 py-4 sm:flex-row sm:items-start sm:justify-between sm:gap-8">
                    <dt className="flex items-center gap-3 text-sm font-normal text-gray-600">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-gray-200 bg-white">
                        <Mail className="h-4 w-4 text-primary" aria-hidden />
                      </span>
                      Email address
                    </dt>
                    <dd className="min-w-0 sm:text-right">
                      <p className="break-all text-base font-medium text-gray-900">{profile?.email ?? '—'}</p>
                      <p className="mt-1 text-xs text-gray-500">Email cannot be changed</p>
                    </dd>
                  </div>

                  <div className="flex flex-col gap-2 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-8 sm:px-5">
                    <dt className="flex items-center gap-3 text-sm font-normal text-gray-600">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-gray-200 bg-white">
                        <Phone className="h-4 w-4 text-primary" aria-hidden />
                      </span>
                      Phone number
                    </dt>
                    <dd className="text-base font-medium text-gray-900 sm:text-right">
                      {profile?.phone || '—'}
                    </dd>
                  </div>

                  <div className="flex flex-col gap-2 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-8 sm:px-5">
                    <dt className="flex items-center gap-3 text-sm font-normal text-gray-600">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-gray-200 bg-white">
                        <Hash className="h-4 w-4 text-primary" aria-hidden />
                      </span>
                      Referral code
                    </dt>
                    <dd className="sm:text-right">
                      {shortCode ? (
                        <button
                          type="button"
                          onClick={copyShortCode}
                          className="inline-flex items-center gap-2 text-base font-medium text-gray-900 transition-colors hover:text-primary"
                          title="Copy referral code"
                        >
                          <span className="font-mono">{shortCode}</span>
                          <Copy className="h-4 w-4 shrink-0 text-gray-500" />
                        </button>
                      ) : (
                        <span className="text-base font-medium text-gray-900">—</span>
                      )}
                    </dd>
                  </div>

                  <div className="flex flex-col gap-2 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-8 sm:px-5">
                    <dt className="flex items-center gap-3 text-sm font-normal text-gray-600">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-gray-200 bg-white">
                        <Calendar className="h-4 w-4 text-primary" aria-hidden />
                      </span>
                      Member since
                    </dt>
                    <dd className="text-base font-medium text-gray-900 sm:text-right">
                      {profile?.createdAt && moment(profile.createdAt).isValid()
                        ? moment(profile.createdAt).format('MMMM D, YYYY')
                        : '—'}
                    </dd>
                  </div>
                </dl>
              </div>
            ) : (
              <div className="overflow-hidden rounded-lg border border-gray-200 bg-gray-50/60">
                <form id="profile-form" onSubmit={handleSubmit} className="divide-y divide-gray-200/70">
                  <div className="px-5 py-4">
                    <label
                      htmlFor="fullName"
                      className="mb-2 flex items-center gap-3 text-sm font-normal text-gray-600"
                    >
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-gray-200 bg-white">
                        <UserRound className="h-4 w-4 text-primary" aria-hidden />
                      </span>
                      Full name
                    </label>
                    <div className="sm:max-w-md">
                      <Input
                        id="fullName"
                        name="fullName"
                        value={values.fullName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="Enter your full name"
                        disabled={isSubmitting}
                        className={errors.fullName && touched.fullName ? fieldInvalidClassName : undefined}
                      />
                      {errors.fullName && touched.fullName ? (
                        <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
                      ) : null}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 px-5 py-4 sm:flex-row sm:items-start sm:justify-between sm:gap-8">
                    <p className="flex items-center gap-3 text-sm font-normal text-gray-600">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-gray-200 bg-white">
                        <Mail className="h-4 w-4 text-primary" aria-hidden />
                      </span>
                      Email address
                    </p>
                    <div className="sm:text-right">
                      <p className="text-base font-normal text-gray-900">{profile?.email ?? '—'}</p>
                      <p className="mt-1 text-xs text-gray-500">Email cannot be changed</p>
                    </div>
                  </div>

                  <div className="px-5 py-4">
                    <label
                      htmlFor="phone"
                      className="mb-2 flex items-center gap-3 text-sm font-normal text-gray-600"
                    >
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-gray-200 bg-white">
                        <Phone className="h-4 w-4 text-primary" aria-hidden />
                      </span>
                      Phone number
                    </label>
                    <div className="sm:max-w-md">
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={values.phone}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="e.g. +254 712 345 678"
                        disabled={isSubmitting}
                        className={errors.phone && touched.phone ? fieldInvalidClassName : undefined}
                      />
                      {errors.phone && touched.phone ? (
                        <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                      ) : null}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-8 sm:px-5">
                    <p className="flex items-center gap-3 text-sm font-normal text-gray-600">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-gray-200 bg-white">
                        <Hash className="h-4 w-4 text-primary" aria-hidden />
                      </span>
                      Referral code
                    </p>
                    <div className="sm:text-right">
                      {shortCode ? (
                        <button
                          type="button"
                          onClick={copyShortCode}
                          className="inline-flex items-center gap-2 text-base font-normal text-gray-900 transition-colors hover:text-primary"
                          title="Copy referral code"
                        >
                          <span className="font-mono">{shortCode}</span>
                          <Copy className="h-4 w-4 shrink-0 text-gray-500" />
                        </button>
                      ) : (
                        <span className="text-base font-normal text-gray-900">—</span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-8 sm:px-5">
                    <p className="flex items-center gap-3 text-sm font-normal text-gray-600">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-gray-200 bg-white">
                        <Calendar className="h-4 w-4 text-primary" aria-hidden />
                      </span>
                      Member since
                    </p>
                    <p className="text-base font-normal text-gray-900 sm:text-right">
                      {profile?.createdAt && moment(profile.createdAt).isValid()
                        ? moment(profile.createdAt).format('MMMM D, YYYY')
                        : '—'}
                    </p>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>

      <ProfileAgreementsCard userType={agreementUserType} />
    </div>
  );
}
