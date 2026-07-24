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
import { updateProfileSchema } from '@/utils/formValidation';
import moment from 'moment';
import {
  getUserDashboardBecomeMentorRoutePath,
  getUserDashboardHistoryRoutePath,
  getUserDashboardMyBooksRoutePath,
  getUserDashboardMyChaptersRoutePath,
} from '@/routes/routes';
import { UserDashboardPageHeader } from './UserDashboardPageHeader';
import { ProfileAvatarUpload } from '@/components/admin/profile/ProfileAvatarUpload';

export function ProfilePage() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);

  const { data: profileData, isLoading } = useGetUserProfileQuery();
  const { data: seriesData, isLoading: isSeriesLoading } = useGetMySeriesQuery();
  const { data: chaptersData, isLoading: isChaptersLoading } = useGetMyChaptersQuery();
  const { data: historyData, isLoading: isHistoryLoading } = useGetReadingHistoryQuery();
  const { data: mentorApplicationsData } = useGetMentorApplicationsQuery();
  const [updateProfile] = useUserUpdateProfileMutation();
  const profile = profileData?.data;
  const mentorApplication = mentorApplicationsData?.data;
  const latestMentorApplication = mentorApplication?.latest_application ?? null;
  const mentorApplicationStatus = latestMentorApplication?.status;
  const canApplyForMentor = mentorApplication?.can_apply ?? true;
  const displayName = profile?.name || 'User';
  const displayPhoto = profile?.profile_pic || '';
  
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
      <div className="animate-pulse space-y-6">
        <div className="flex justify-between">
          <div className="space-y-2">
            <div className="h-7 w-28 rounded bg-gray-200" />
            <div className="h-4 w-52 rounded bg-gray-100" />
          </div>
          <div className="h-10 w-28 rounded-full bg-gray-200" />
        </div>
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
          <div className="h-32 bg-gray-100" />
          <div className="space-y-4 px-6 py-8">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-16 rounded-lg bg-gray-50" />
              ))}
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 rounded-lg bg-gray-50" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <UserDashboardPageHeader title="Profile" description="View and update your account details">
        {!isEditing ? (
          <div className="flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:items-start sm:justify-end">
            {mentorApplicationStatus === 'pending_review' ? (
              <span className="inline-flex items-center justify-center gap-1.5 rounded-full border border-amber-200! bg-amber-50 px-4 py-2 text-center text-sm font-medium text-amber-700">
                <Clock className="h-4 w-4 shrink-0" />
                Mentor Application Pending Review
              </span>
            ) : mentorApplicationStatus === 'approved' ? (
              <span className="inline-flex items-center justify-center gap-1.5 rounded-full border border-emerald-200! bg-emerald-50 px-4 py-2 text-center text-sm font-medium text-emerald-700">
                <ShieldCheck className="h-4 w-4 shrink-0" />
                Mentor Application Approved
              </span>
            ) : mentorApplicationStatus === 'rejected' ? (
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
            ) : (
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
            )}
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

      {latestMentorApplication?.decision_reason ? (
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
        {/* Mobile profile banner — stacked, no overlap */}
        <div className="sm:hidden">
          <div className="h-16 bg-linear-to-br from-primary/10 via-primary/5 to-gray-50/90" />
          <div className="relative px-4 pb-1 pt-0">
            <div className="-mt-8 rounded-lg border border-primary/20 bg-white p-4 shadow-none">
              <div className="flex items-start gap-3">
                <ProfileAvatarUpload
                  src={displayPhoto}
                  name={values.fullName || displayName}
                  size="md"
                  ringClassName="ring-2 ring-white"
                />
                <div className="min-w-0 flex-1">
                  <h2 className="text-base font-medium text-gray-900">{profile?.name ?? '—'}</h2>
                  <p className="mt-1 flex items-center gap-1.5 text-sm text-gray-500">
                    <Mail className="h-3.5 w-3.5 shrink-0 text-gray-400" aria-hidden />
                    <span className="break-all">{profile?.email ?? '—'}</span>
                  </p>
                </div>
              </div>
              <span className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-[11px] font-medium uppercase tracking-wide text-primary">
                <ShieldCheck className="h-3.5 w-3.5 shrink-0" aria-hidden />
                {profile?.role?.name ?? 'User'}
              </span>
            </div>
          </div>
        </div>

        {/* Desktop profile banner — original placement */}
        <div className="relative hidden h-24 bg-linear-to-br from-primary/10 via-primary/5 to-gray-50/90 sm:block">
          <span className="absolute right-6 bottom-0 inline-flex translate-y-1/2 items-center gap-1.5 rounded-full border border-primary/20 bg-white/95 px-3.5 py-1.5 text-[11px] font-medium uppercase tracking-wide text-primary backdrop-blur-sm sm:right-8">
            <ShieldCheck className="h-3.5 w-3.5 shrink-0" aria-hidden />
            {profile?.role?.name ?? 'User'}
          </span>

          <div className="absolute left-6 bottom-0 z-10 flex max-w-[calc(100%-10rem)] translate-y-1/2 items-end gap-4 rounded-2xl border border-primary/20 bg-white/75 py-2.5 pl-2.5 pr-4 ring-1 ring-white/80 ring-inset backdrop-blur-sm sm:left-8 sm:max-w-[calc(100%-12rem)] sm:gap-5 sm:pr-5">
            <ProfileAvatarUpload
              src={displayPhoto}
              name={values.fullName || displayName}
              size="md"
              ringClassName="ring-4 ring-white"
            />

            <div className="min-w-0 pb-0.5">
              <h2 className="truncate text-lg font-medium tracking-tight text-gray-900 sm:text-xl">
                {profile?.name ?? '—'}
              </h2>
              <p className="mt-1 flex items-center gap-1.5 truncate text-sm text-gray-500">
                <Mail className="h-3.5 w-3.5 shrink-0 text-gray-400" aria-hidden />
                {profile?.email ?? '—'}
              </p>
            </div>
          </div>
        </div>

        <div className="relative px-4 pb-6 pt-4 sm:px-8 sm:pb-8 sm:pt-12">
          <div className="mt-2 grid grid-cols-1 gap-3 min-[480px]:grid-cols-2 sm:mt-6 lg:grid-cols-4">
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
                    <dd className="sm:text-right">
                      <p className="text-base font-medium text-gray-900">{profile?.email ?? '—'}</p>
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
    </div>
  );
}
