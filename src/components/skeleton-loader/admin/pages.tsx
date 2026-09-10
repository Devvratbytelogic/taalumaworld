import { cn } from '@/components/ui/utils';
import {
  AdminBackLinkSkeleton,
  AdminChartPanelSkeleton,
  AdminDetailPageSkeleton,
  AdminDetailPanelsSkeleton,
  AdminFormPanelSkeleton,
  AdminListPageSkeleton,
  AdminPageHeaderSkeleton,
  AdminPageSkeleton,
  AdminPreviewSectionSkeleton,
  AdminSearchPanelSkeleton,
  AdminStatCardsSkeleton,
  AdminTabBarSkeleton,
  AdminTableSkeleton,
  Bone,
  adminSkeletonPanelClass,
} from './primitives';

export {
  AdminListPageSkeleton,
  AdminTableSkeleton,
  AdminSearchPanelSkeleton,
  AdminStatCardsSkeleton,
  AdminFormPanelSkeleton,
} from './primitives';

/** Categories list body — used while the list refetches */
export function AdminCategoriesListSkeleton() {
  return (
    <div className={cn(adminSkeletonPanelClass, 'animate-pulse overflow-hidden')}>
      <div className="border-b border-slate-200 px-4 py-3">
        <Bone className="h-4 w-32" />
      </div>
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-4 border-b border-slate-100 px-4 py-4 last:border-0"
        >
          <Bone className="h-4 w-6 bg-slate-100" />
          <div className="flex items-center gap-3">
            <Bone className="h-9 w-9 rounded-lg" />
            <div className="space-y-2">
              <Bone className="h-4 w-28" />
              <Bone className="h-3 w-20 bg-slate-100" />
            </div>
          </div>
          <div className="ml-auto flex gap-2">
            <Bone className="h-6 w-16 rounded-full bg-slate-100" />
            <Bone className="h-6 w-16 rounded-full bg-slate-100" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function AdminDashboardSkeleton() {
  return (
    <AdminPageSkeleton>
      <AdminStatCardsSkeleton count={8} />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className={cn(adminSkeletonPanelClass, 'p-5')}>
            <div className="mb-4 flex items-center gap-3">
              <Bone className="h-10 w-10 rounded-lg" />
              <div className="space-y-2">
                <Bone className="h-4 w-40" />
                <Bone className="h-3 w-52 bg-slate-100" />
              </div>
            </div>
            {Array.from({ length: 3 }).map((_, j) => (
              <div key={j} className="flex items-center gap-3 border-t border-slate-100 py-3">
                <Bone className="h-8 w-8 rounded-full" />
                <div className="flex-1 space-y-1.5">
                  <Bone className="h-3.5 w-32" />
                  <Bone className="h-3 w-24 bg-slate-100" />
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <AdminChartPanelSkeleton />
        <AdminChartPanelSkeleton />
      </div>
      <AdminPreviewSectionSkeleton />
      <AdminPreviewSectionSkeleton />
    </AdminPageSkeleton>
  );
}

export function MentorDashboardSkeleton() {
  return (
    <AdminPageSkeleton>
      <div className="flex justify-end gap-3">
        <Bone className="h-9 w-40 rounded-lg bg-slate-100" />
        <Bone className="h-9 w-40 rounded-lg bg-slate-100" />
      </div>
      <AdminPreviewSectionSkeleton statCount={3} />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <AdminPreviewSectionSkeleton statCount={2} rows={4} />
        <AdminPreviewSectionSkeleton statCount={2} rows={4} />
      </div>
    </AdminPageSkeleton>
  );
}

export function AdminAnalyticsSkeleton() {
  return (
    <AdminPageSkeleton>
      {Array.from({ length: 4 }).map((_, i) => (
        <AdminChartPanelSkeleton key={i} />
      ))}
    </AdminPageSkeleton>
  );
}

export function AdminRolesPermissionsSkeleton() {
  return (
    <AdminPageSkeleton>
      <AdminTabBarSkeleton count={3} />
      <AdminTableSkeleton />
    </AdminPageSkeleton>
  );
}

export function AdminPermissionsMatrixSkeleton() {
  return (
    <div className="grid animate-pulse grid-cols-1 gap-6 lg:grid-cols-4">
      <div className={cn(adminSkeletonPanelClass, 'space-y-3 p-4')}>
        <Bone className="h-4 w-24" />
        <Bone className="h-10 w-full rounded-md bg-slate-100" />
        {Array.from({ length: 5 }).map((_, i) => (
          <Bone key={i} className="h-14 w-full rounded-lg bg-slate-100" />
        ))}
      </div>
      <div className={cn(adminSkeletonPanelClass, 'h-96 lg:col-span-3')} />
    </div>
  );
}

export function AdminStaffSkeleton() {
  return <AdminListPageSkeleton />;
}

export function AdminOrdersSkeleton() {
  return <AdminListPageSkeleton tabs={3} statCount={4} filters={3} />;
}

export function AdminOrderDetailSkeleton() {
  return <AdminDetailPageSkeleton panels={3} fields={6} />;
}

export function AdminTransactionsSkeleton() {
  return <AdminListPageSkeleton statCount={4} filters={3} />;
}

export function AdminCouponsSkeleton() {
  return <AdminListPageSkeleton tabs={2} statCount={4} filters={2} />;
}

export function AdminTaxesSkeleton() {
  return (
    <AdminListPageSkeleton
      extra={
        <div className={cn(adminSkeletonPanelClass, 'p-5')}>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-2">
              <Bone className="h-4 w-40" />
              <Bone className="h-3 w-64 bg-slate-100" />
            </div>
            <Bone className="h-10 w-28 rounded-lg" />
          </div>
        </div>
      }
      filters={1}
    />
  );
}

export function AdminWithdrawalsSkeleton() {
  return <AdminListPageSkeleton statCount={3} filters={3} />;
}

export function AdminPaymentsSkeleton() {
  return <AdminListPageSkeleton />;
}

export function AdminUsersSkeleton() {
  return <AdminListPageSkeleton />;
}

export function AdminUserDetailSkeleton() {
  return <AdminDetailPageSkeleton panels={2} fields={6} showTable />;
}

export function AdminCampaignUsersSkeleton() {
  return <AdminListPageSkeleton filters={2} />;
}

export function AdminInstitutionsSkeleton() {
  return (
    <AdminPageSkeleton>
      <AdminTabBarSkeleton count={4} />
      <AdminSearchPanelSkeleton />
      <AdminTableSkeleton />
    </AdminPageSkeleton>
  );
}

export function AdminBlueprintAccessSkeleton() {
  return (
    <AdminPageSkeleton>
      <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
        <Bone className="h-3 w-full max-w-2xl bg-blue-200/70" />
        <Bone className="mt-2 h-3 w-2/3 max-w-xl bg-blue-200/70" />
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className={cn(adminSkeletonPanelClass, 'space-y-3 p-4')}>
          <Bone className="h-4 w-32" />
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="space-y-2 rounded-xl border border-gray-200 px-4 py-3">
              <Bone className="h-4 w-2/3" />
              <Bone className="h-3 w-1/3 bg-slate-100" />
            </div>
          ))}
        </div>
        <div className={cn(adminSkeletonPanelClass, 'space-y-4 p-4 lg:col-span-2')}>
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Bone className="h-4 w-40" />
              <Bone className="h-3 w-32 bg-slate-100" />
            </div>
            <Bone className="h-8 w-20 rounded-full" />
          </div>
          <Bone className="h-10 w-full rounded-lg bg-slate-100" />
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 rounded-xl border border-gray-200 p-3">
              <Bone className="h-5 w-5 rounded-full" />
              <div className="min-w-0 flex-1 space-y-1.5">
                <Bone className="h-4 w-1/2" />
                <Bone className="h-3 w-1/3 bg-slate-100" />
              </div>
              <Bone className="h-3 w-14 bg-slate-100" />
            </div>
          ))}
        </div>
      </div>
    </AdminPageSkeleton>
  );
}

export function AdminInstitutionUsageSkeleton() {
  return (
    <AdminPageSkeleton>
      <AdminStatCardsSkeleton count={4} />
      <AdminSearchPanelSkeleton filters={1} />
      <AdminTableSkeleton />
    </AdminPageSkeleton>
  );
}

export function AdminRegistrationPromptSkeleton() {
  return <AdminFormPanelSkeleton fields={4} columns={1} />;
}

export function AdminAuthorsSkeleton() {
  return <AdminListPageSkeleton />;
}

export function AdminMentorProfileViewSkeleton() {
  return (
    <AdminPageSkeleton>
      <AdminBackLinkSkeleton />
      <AdminPageHeaderSkeleton showAction titleWidth="w-48" />
      <div className="grid gap-6 xl:grid-cols-3">
        <div className={cn(adminSkeletonPanelClass, 'p-6 xl:col-span-1')}>
          <div className="flex flex-col items-center text-center">
            <Bone className="h-24 w-24 rounded-full" />
            <Bone className="mt-4 h-5 w-36" />
            <Bone className="mt-2 h-3 w-48 bg-slate-100" />
          </div>
          <div className="mt-6 grid grid-cols-2 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-1.5 rounded-lg border border-slate-100 p-3">
                <Bone className="h-3 w-16 bg-slate-100" />
                <Bone className="h-5 w-12" />
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-6 xl:col-span-2">
          <AdminDetailPanelsSkeleton panels={2} fields={6} />
        </div>
      </div>
    </AdminPageSkeleton>
  );
}

export function AdminMentorPerformanceSkeleton() {
  return <AdminListPageSkeleton filters={1} />;
}

export function AdminMentorRevenueSkeleton() {
  return <AdminListPageSkeleton filters={2} />;
}

export function AdminMentorApplicationsSkeleton() {
  return <AdminListPageSkeleton filters={2} />;
}

export function AdminMentorTypesSkeleton() {
  return <AdminListPageSkeleton />;
}

export function AdminMentorVerificationSkeleton() {
  return <AdminListPageSkeleton filters={2} />;
}

export function AdminMentorTierUpgradesSkeleton() {
  return <AdminListPageSkeleton filters={2} />;
}

export function AdminMentorEquitySkeleton() {
  return <AdminListPageSkeleton />;
}

export function AdminAffiliateApplicationsSkeleton() {
  return <AdminListPageSkeleton />;
}

export function AdminSeriesSkeleton() {
  return <AdminListPageSkeleton filters={2} />;
}

export function AdminBlueprintsSkeleton() {
  return <AdminListPageSkeleton filters={3} tableColumns={7} />;
}

export function AdminBlueprintFormSkeleton() {
  return <AdminFormPanelSkeleton fields={8} showHeading={false} />;
}

export function AdminBlueprintFormFieldsSkeleton() {
  return <AdminFormPanelSkeleton fields={8} showHeading={false} />;
}

export function AdminBlueprintDetailSkeleton() {
  return <AdminDetailPageSkeleton panels={3} fields={6} showImage />;
}

export function AdminCategoriesPageSkeleton() {
  return (
    <AdminPageSkeleton>
      <AdminStatCardsSkeleton count={3} />
      <AdminSearchPanelSkeleton />
      <AdminCategoriesListSkeleton />
    </AdminPageSkeleton>
  );
}

export function AdminReviewsSkeleton() {
  return <AdminListPageSkeleton filters={2} />;
}

export function AdminReviewReportsSkeleton() {
  return <AdminListPageSkeleton filters={2} />;
}

export function AdminReviewReportDetailSkeleton() {
  return <AdminDetailPageSkeleton panels={3} fields={5} />;
}

export function AdminAgreementsSkeleton() {
  return <AdminListPageSkeleton />;
}

export function AdminAgreementTypesSkeleton() {
  return <AdminListPageSkeleton />;
}

export function AdminSentencesSkeleton() {
  return <AdminListPageSkeleton />;
}

export function AdminConsentRecordsSkeleton() {
  return <AdminListPageSkeleton statCount={3} />;
}

export function AdminTestimonialsSkeleton() {
  return <AdminListPageSkeleton />;
}

export function AdminFaqsSkeleton() {
  return <AdminListPageSkeleton />;
}

export function AdminInboxSkeleton() {
  return <AdminListPageSkeleton />;
}

export function AdminContactUsSkeleton() {
  return (
    <AdminPageSkeleton>
      <AdminSearchPanelSkeleton />
      <AdminTableSkeleton />
    </AdminPageSkeleton>
  );
}

export function AdminSubscribersSkeleton() {
  return <AdminListPageSkeleton />;
}

export function AdminSettingsFormSkeleton() {
  return <AdminFormPanelSkeleton fields={6} />;
}

export function AdminSettingsPageSkeleton() {
  return <AdminSettingsFormSkeleton />;
}

export function AdminReferralSettingSkeleton() {
  return <AdminFormPanelSkeleton fields={2} columns={2} />;
}

export function AdminReferralPerformanceSkeleton() {
  return <AdminListPageSkeleton filters={2} />;
}

export function AdminAuditLogsSkeleton() {
  return <AdminListPageSkeleton />;
}

export function AdminAuditLogDetailSkeleton() {
  return <AdminDetailPageSkeleton panels={2} fields={6} />;
}

export function AdminProfileSkeleton() {
  return (
    <AdminPageSkeleton>
      <div className={cn(adminSkeletonPanelClass, 'p-6')}>
        <div className="flex items-start gap-4">
          <Bone className="h-20 w-20 rounded-full" />
          <div className="flex-1 space-y-3">
            <Bone className="h-5 w-40" />
            <Bone className="h-4 w-56 bg-slate-100" />
            <Bone className="h-4 w-40 bg-slate-100" />
          </div>
        </div>
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Bone className="h-3 w-24" />
              <Bone className="h-10 w-full rounded-lg bg-slate-100" />
            </div>
          ))}
        </div>
      </div>
    </AdminPageSkeleton>
  );
}

export function MentorProfileSkeleton() {
  return (
    <AdminPageSkeleton>
      <AdminFormPanelSkeleton fields={8} />
      <div className="grid gap-6 lg:grid-cols-2">
        <AdminFormPanelSkeleton fields={4} columns={1} />
        <div className={cn(adminSkeletonPanelClass, 'p-6')}>
          <Bone className="mb-4 h-5 w-32" />
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between border-t border-slate-100 py-4">
              <div className="space-y-1.5">
                <Bone className="h-4 w-48" />
                <Bone className="h-3 w-32 bg-slate-100" />
              </div>
              <Bone className="h-8 w-24 rounded-full bg-slate-100" />
            </div>
          ))}
        </div>
      </div>
    </AdminPageSkeleton>
  );
}

export function AdminPagesSkeleton() {
  return (
    <AdminPageSkeleton>
      <AdminTabBarSkeleton count={5} />
      <AdminFormPanelSkeleton fields={6} />
    </AdminPageSkeleton>
  );
}

export function AdminReportsSkeleton() {
  return (
    <AdminPageSkeleton>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className={cn(adminSkeletonPanelClass, 'p-6')}>
            <div className="flex items-start gap-3">
              <Bone className="h-12 w-12 rounded-2xl" />
              <div className="space-y-2">
                <Bone className="h-5 w-40" />
                <Bone className="h-4 w-56 bg-slate-100" />
              </div>
            </div>
            <Bone className="mt-6 h-4 w-48 bg-slate-100" />
            <Bone className="mt-4 h-10 w-32 rounded-lg" />
          </div>
        ))}
      </div>
      <AdminFormPanelSkeleton fields={4} />
    </AdminPageSkeleton>
  );
}

export function AdminModerationSkeleton() {
  return (
    <AdminPageSkeleton>
      <AdminSearchPanelSkeleton />
      <Bone className="h-14 w-full rounded-xl bg-amber-100" />
      <AdminTableSkeleton rows={5} />
    </AdminPageSkeleton>
  );
}

export function AdminActivityLogsSkeleton() {
  return <AdminListPageSkeleton />;
}

export function MentorBlueprintPerformanceSkeleton() {
  return (
    <AdminListPageSkeleton statCount={4} />
  );
}

export function MentorCouponPerformanceSkeleton() {
  return <AdminListPageSkeleton statCount={4} />;
}

export function MentorSalesVolumeSkeleton() {
  return <AdminListPageSkeleton statCount={3} />;
}

export function MentorRevenueEarnedSkeleton() {
  return <AdminListPageSkeleton statCount={4} />;
}

export function MentorRevenueByBlueprintSkeleton() {
  return <AdminListPageSkeleton statCount={3} />;
}

export function MentorWalletSkeleton() {
  return (
    <AdminPageSkeleton>
      <AdminStatCardsSkeleton count={4} />
      <div className={cn(adminSkeletonPanelClass, 'p-5')}>
        <Bone className="mb-4 h-5 w-32" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Bone className="h-3 w-24 bg-slate-100" />
              <Bone className="h-4 w-32" />
            </div>
          ))}
        </div>
      </div>
      <AdminSearchPanelSkeleton filters={3} />
      <AdminTableSkeleton />
    </AdminPageSkeleton>
  );
}

export function MentorReferralsSkeleton() {
  return <AdminListPageSkeleton statCount={4} />;
}

export function MentorReferralWalletSkeleton() {
  return (
    <AdminListPageSkeleton statCount={4} filters={1} />
  );
}

export function MentorFollowersSkeleton() {
  return <AdminListPageSkeleton filters={2} />;
}
