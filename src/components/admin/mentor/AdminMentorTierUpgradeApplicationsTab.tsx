'use client';

import { useState } from 'react';
import { type GridColDef } from '@mui/x-data-grid';
import { ArrowUpCircle, CheckCircle2, Circle, Eye, ExternalLink, Save, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import UiButton from '@/components/ui/Button';
import { cn } from '@/components/ui/utils';
import toast from '@/utils/toast';
import { refreshAfterMentorChange } from '@/store/server-api/refreshCache';
import {
  AdminPage,
  AdminPageHeader,
  AdminSearchInput,
  AdminSearchPanel,
  adminFilterPillClass,
  adminSelectClass,
} from '@/components/admin/layout/AdminContent';
import CommonDataTable from '@/components/admin/CommonDataTable';
import { useDebounce } from '@/hooks/useDebounce';
import {
  useGetAllMentorTierUpgradeApplicationsQuery,
  useReviewMentorTierUpgradeApplicationMutation,
} from '@/store/rtkQueries/mentorApis';
import type {
  CurrentTierIdOrRequestedTierId,
  IAllMentorTierUpgradeApplicationsEntity,
  IMentorTierUpgradeEligibility,
} from '@/types/mentorTierUpgradeApplication';
import {
  MENTOR_TIER_UPGRADE_APPLICATION_ACTION,
  MENTOR_TIER_UPGRADE_APPLICATION_STATUS,
} from '@/constants/mentorTierUpgradeApplication';
import { useAdminPermissions } from '@/hooks/useAdminPermissions';
import { AdminMentorTierUpgradesSkeleton } from '@/components/skeleton-loader/admin';

const MODEL = 'Mentor Tier Upgrade';

const STATUS_OPTIONS = Object.values(MENTOR_TIER_UPGRADE_APPLICATION_STATUS);

const STATUS_BADGE_CLASS: Record<string, string> = {
  [MENTOR_TIER_UPGRADE_APPLICATION_STATUS.PENDING_REVIEW]: 'bg-sky-50 text-sky-700 border-sky-200!',
  [MENTOR_TIER_UPGRADE_APPLICATION_STATUS.APPROVED]: 'bg-emerald-50 text-emerald-700 border-emerald-200!',
  [MENTOR_TIER_UPGRADE_APPLICATION_STATUS.REJECTED]: 'bg-red-50 text-red-700 border-red-200!',
  [MENTOR_TIER_UPGRADE_APPLICATION_STATUS.WITHDRAWN]: 'bg-slate-100 text-slate-600 border-slate-200!',
};

const DECISION_OPTIONS = [
  { value: MENTOR_TIER_UPGRADE_APPLICATION_ACTION.APPROVE, label: 'Approve' },
  { value: MENTOR_TIER_UPGRADE_APPLICATION_ACTION.REJECT, label: 'Reject' },
];

function hasGate(value?: number | null) {
  return value != null && Number(value) !== 0;
}

function formatRating(value?: number | null) {
  if (value == null) return '—';
  return String(value);
}

function formatGate(value?: number | null) {
  return hasGate(value) ? String(value) : '—';
}

function getApplicantName(app: IAllMentorTierUpgradeApplicationsEntity) {
  return app.user_id?.name ?? '—';
}

function getApplicantEmail(app: IAllMentorTierUpgradeApplicationsEntity) {
  return app.user_id?.email ?? '—';
}

function getReviewerName(reviewedBy: IAllMentorTierUpgradeApplicationsEntity['reviewed_by']) {
  if (!reviewedBy) return null;
  return typeof reviewedBy === 'string' ? reviewedBy : reviewedBy.name;
}

function formatStatusLabel(status?: string) {
  if (!status) return '—';
  return status
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function formatDate(value?: string) {
  if (!value) return '—';
  return new Date(value).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

function EligibilityCheckRow({ passed, label }: { passed: boolean; label: string }) {
  return (
    <li className="flex items-start gap-2 text-sm">
      {passed ? (
        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
      ) : (
        <Circle className="mt-0.5 h-4 w-4 shrink-0 text-slate-300" />
      )}
      <span className={passed ? 'text-slate-700' : 'text-slate-500'}>{label}</span>
    </li>
  );
}

function EligibilitySnapshot({
  eligibility,
  requestedTier,
}: {
  eligibility?: IMentorTierUpgradeEligibility | null;
  requestedTier?: CurrentTierIdOrRequestedTierId | null;
}) {
  if (!eligibility && !requestedTier) return null;

  const required = eligibility?.required ?? {};
  const checks = eligibility?.checks ?? {};
  const minWords = requestedTier?.min_words_per_blueprint ?? required.min_words_per_blueprint;
  const minSales = requestedTier?.min_confirmed_sales ?? required.min_confirmed_sales;
  const minDays = requestedTier?.min_days_since_published ?? required.min_days_since_published;
  const ratingGate = hasGate(required.min_rating ?? requestedTier?.min_rating);
  const blueprintParts = [
    hasGate(minWords) ? `${minWords} words` : null,
    hasGate(minSales) ? `${minSales} confirmed sales` : null,
    hasGate(minDays) ? `published ${minDays}+ days ago` : null,
  ].filter(Boolean);
  const hasBlueprintGate = blueprintParts.length > 0;

  return (
    <div className="space-y-3 rounded-lg border border-slate-100 bg-slate-50/60 p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Live eligibility</p>
        {eligibility ? (
          <Badge
            variant="outline"
            className={
              eligibility.is_eligible
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200!'
                : 'bg-red-50 text-red-700 border-red-200!'
            }
          >
            {eligibility.is_eligible ? 'Eligible' : 'Not eligible'}
          </Badge>
        ) : null}
      </div>
      {eligibility ? (
        <p className="text-xs text-slate-400">
          Computed live and may have changed since apply. Approving does not re-run these checks.
        </p>
      ) : null}
      {eligibility ? (
        <div className="grid gap-2 sm:grid-cols-2">
          <p>
            <span className="text-slate-500">Overall rating:</span> {formatRating(eligibility.overall_rating)}
            {eligibility.total_reviews != null ? ` (${eligibility.total_reviews} reviews)` : ''}
          </p>
          <p>
            <span className="text-slate-500">Required min rating:</span>{' '}
            {ratingGate ? formatRating(required.min_rating ?? requestedTier?.min_rating) : '—'}
          </p>
          <p>
            <span className="text-slate-500">Qualifying Blueprints:</span>{' '}
            {eligibility.qualifying_blueprint_count ?? '—'}
          </p>
        </div>
      ) : null}
      {requestedTier ? (
        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Requested tier eligibility</p>
          <div className="grid gap-2 sm:grid-cols-2">
            <p>
              <span className="text-slate-500">Min confirmed sales:</span> {formatGate(minSales)}
            </p>
            <p>
              <span className="text-slate-500">Min days since published:</span> {formatGate(minDays)}
            </p>
            <p>
              <span className="text-slate-500">Min words per blueprint:</span> {formatGate(minWords)}
            </p>
          </div>
        </div>
      ) : null}
      {ratingGate || hasBlueprintGate ? (
        <ul className="space-y-2">
          {ratingGate ? (
            <EligibilityCheckRow
              passed={Boolean(checks.min_rating)}
              label={`Overall rating of at least ${required.min_rating ?? requestedTier?.min_rating}`}
            />
          ) : null}
          {hasBlueprintGate ? (
            <EligibilityCheckRow
              passed={Boolean(checks.qualifying_blueprint)}
              label={`At least one Blueprint meeting ${blueprintParts.join(', ')}`}
            />
          ) : null}
        </ul>
      ) : null}
    </div>
  );
}

export function AdminMentorTierUpgradeApplicationsTab() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
  const [reviewApplication, setReviewApplication] = useState<IAllMentorTierUpgradeApplicationsEntity | null>(null);
  const [action, setAction] = useState<string>(MENTOR_TIER_UPGRADE_APPLICATION_ACTION.APPROVE);
  const [reviewNotes, setReviewNotes] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const { hasPermission } = useAdminPermissions();

  const canView = hasPermission(MODEL, 'view');
  const canEdit = hasPermission(MODEL, 'edit');

  const debouncedSearch = useDebounce(searchQuery, 400);

  const { data, isLoading } = useGetAllMentorTierUpgradeApplicationsQuery({
    page: paginationModel.page + 1,
    limit: paginationModel.pageSize,
    ...(statusFilter ? { status: statusFilter } : {}),
    ...(debouncedSearch.trim() ? { search: debouncedSearch.trim() } : {}),
  });

  const [reviewMentorTierUpgradeApplication, { isLoading: isReviewing }] = useReviewMentorTierUpgradeApplicationMutation();

  const applications = data?.data?.applications ?? [];
  const total = data?.data?.pagination?.total ?? 0;
  const isPendingReview =
    reviewApplication?.status === MENTOR_TIER_UPGRADE_APPLICATION_STATUS.PENDING_REVIEW;
  const canReview = canEdit && isPendingReview;

  const resetToFirstPage = () => setPaginationModel((prev) => ({ ...prev, page: 0 }));

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    resetToFirstPage();
  };

  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
    resetToFirstPage();
  };

  const openReview = (app: IAllMentorTierUpgradeApplicationsEntity) => {
    setReviewApplication(app);
    setAction(MENTOR_TIER_UPGRADE_APPLICATION_ACTION.APPROVE);
    setReviewNotes(app.decision_reason ?? '');
    setAdminNotes(app.admin_notes ?? '');
  };

  const closeReview = () => {
    setReviewApplication(null);
    setReviewNotes('');
    setAdminNotes('');
  };

  const handleSubmitReview = async () => {
    if (!reviewApplication) return;
    try {
      const res = await reviewMentorTierUpgradeApplication({
        id: reviewApplication._id,
        values: {
          action,
          ...(action === MENTOR_TIER_UPGRADE_APPLICATION_ACTION.REJECT && reviewNotes.trim()
            ? { decision_reason: reviewNotes.trim() }
            : {}),
          ...(adminNotes.trim() ? { admin_notes: adminNotes.trim() } : {}),
        },
      }).unwrap();
      void refreshAfterMentorChange();
      toast.success(res?.message ?? 'Application reviewed successfully');
      closeReview();
    } catch (error) {
      console.error('Failed to review tier upgrade application', error);
    }
  };

  const hasActiveFilters = !!statusFilter;

  const columns: GridColDef<IAllMentorTierUpgradeApplicationsEntity>[] = [
    {
      field: 'index',
      headerName: '#',
      width: 60,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        const rowIndex = params.api.getRowIndexRelativeToVisibleRows(params.id);
        return (
          <span className="text-sm text-muted-foreground">
            {paginationModel.page * paginationModel.pageSize + rowIndex + 1}
          </span>
        );
      },
    },
    {
      field: 'applicant',
      headerName: 'Mentor',
      minWidth: 200,
      flex: 1,
      sortable: false,
      renderCell: (params) => (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <ArrowUpCircle className="h-4 w-4 text-primary" />
          </div>
          <div className="min-w-0">
            <p className="truncate font-medium text-sm text-slate-900">{getApplicantName(params.row)}</p>
            <p className="truncate text-xs text-muted-foreground">{getApplicantEmail(params.row)}</p>
          </div>
        </div>
      ),
    },
    {
      field: 'current_tier',
      headerName: 'Current tier',
      width: 130,
      sortable: false,
      renderCell: (params) => (
        <span className="text-sm text-slate-700">{params.row.current_tier_id?.code ?? '—'}</span>
      ),
    },
    {
      field: 'requested_tier',
      headerName: 'Requested tier',
      width: 140,
      sortable: false,
      renderCell: (params) => (
        <span className="text-sm font-medium text-slate-900">{params.row.requested_tier_id?.code ?? '—'}</span>
      ),
    },
    {
      field: 'overall_rating',
      headerName: 'Overall rating',
      width: 140,
      sortable: false,
      renderCell: (params) => {
        const rating = params.row.eligibility?.overall_rating;
        const reviews = params.row.eligibility?.total_reviews;
        if (rating == null) return <span className="text-sm text-slate-400">—</span>;
        return (
          <span className="text-sm text-slate-700">
            {rating}
            {reviews != null ? <span className="text-slate-400"> ({reviews})</span> : null}
          </span>
        );
      },
    },
    {
      field: 'min_rating',
      headerName: 'Min rating',
      width: 110,
      sortable: false,
      renderCell: (params) => {
        const required = params.row.eligibility?.required?.min_rating ?? params.row.requested_tier_id?.min_rating;
        return (
          <span className="text-sm text-slate-700">{hasGate(required) ? required : '—'}</span>
        );
      },
    },
    {
      field: 'qualifying',
      headerName: 'Qualifying Blueprints',
      minWidth: 160,
      sortable: false,
      renderCell: (params) => (
        <span className="text-sm text-slate-700">
          {params.row.eligibility?.qualifying_blueprint_count ?? '—'}
        </span>
      ),
    },
    {
      field: 'eligible',
      headerName: 'Eligible',
      width: 120,
      sortable: false,
      renderCell: (params) => {
        const isEligible = params.row.eligibility?.is_eligible;
        if (isEligible == null) return <span className="text-sm text-slate-400">—</span>;
        return (
          <Badge
            variant="outline"
            className={
              isEligible
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200!'
                : 'bg-red-50 text-red-700 border-red-200!'
            }
          >
            {isEligible ? 'Eligible' : 'Not eligible'}
          </Badge>
        );
      },
    },
    {
      field: 'submitted_at',
      headerName: 'Submitted',
      width: 140,
      sortable: false,
      renderCell: (params) => (
        <span className="text-sm text-slate-500">{formatDate(params.row.submitted_at ?? params.row.createdAt)}</span>
      ),
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 140,
      sortable: false,
      renderCell: (params) => (
        <Badge
          variant="outline"
          className={STATUS_BADGE_CLASS[params.row.status] ?? 'border-slate-200 bg-slate-100 text-slate-600'}
        >
          {formatStatusLabel(params.row.status)}
        </Badge>
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 100,
      sortable: false,
      renderCell: (params) => {
        if (!canView) return null;
        return (
          <div className="action_buttons">
            <button
              type="button"
              className="active_button"
              title="Review application"
              onClick={() => openReview(params.row)}
            >
              <Eye className="h-4 w-4" />
            </button>
          </div>
        );
      },
    },
  ];

  if (isLoading) {
    return (
      <AdminPage>
        <AdminPageHeader
          eyebrow="Mentor Management"
          title="Mentor Tier Upgrade Applications"
          description="Review mentor requests to upgrade to a higher tier."
        />
        <AdminMentorTierUpgradesSkeleton />
      </AdminPage>
    );
  }

  return (
    <AdminPage>
      <AdminPageHeader
        eyebrow="Mentor Management"
        title="Mentor Tier Upgrade Applications"
        description="Review mentor requests to upgrade to a higher tier."
      />

      <AdminSearchPanel>
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <AdminSearchInput
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search by mentor name, email, or statement..."
          />

          <div className="flex flex-wrap items-center gap-2 lg:shrink-0">
            <select
              value={statusFilter}
              onChange={(e) => handleStatusChange(e.target.value)}
              className={adminSelectClass}
            >
              <option value="">All statuses</option>
              {STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>
                  {formatStatusLabel(status)}
                </option>
              ))}
            </select>

            {hasActiveFilters ? (
              <button
                type="button"
                onClick={() => handleStatusChange('')}
                className="inline-flex h-9 items-center gap-1.5 whitespace-nowrap rounded-lg border border-red-200! px-3 text-sm text-red-600 transition-colors hover:bg-red-50"
              >
                <X className="h-3.5 w-3.5" />
                Clear
              </button>
            ) : null}
          </div>
        </div>

        {hasActiveFilters ? (
          <div className="flex flex-wrap gap-2">
            <span className={adminFilterPillClass}>
              {formatStatusLabel(statusFilter)}
              <button type="button" onClick={() => handleStatusChange('')} className="hover:text-primary/70">
                <X className="h-3 w-3" />
              </button>
            </span>
          </div>
        ) : null}
      </AdminSearchPanel>

      <div className="border border-gray-200 rounded-md overflow-hidden">
        <CommonDataTable
          rows={applications}
          columns={columns}
          getRowId={(row) => row._id}
          loading={isLoading}
          paginationMode="server"
          rowCount={total}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
        />
      </div>

      <Dialog open={!!reviewApplication} onOpenChange={(open) => !open && closeReview()}>
        <DialogContent className="admin_panel flex max-h-[90vh] flex-col gap-0 overflow-hidden p-0 sm:max-w-2xl">
          {reviewApplication ? (
            <>
              <DialogHeader className="shrink-0 border-b border-slate-100 px-6 pb-4 pt-6 pr-12">
                <DialogTitle>Review tier upgrade request</DialogTitle>
                <DialogDescription>
                  {getApplicantName(reviewApplication)} · {getApplicantEmail(reviewApplication)}
                </DialogDescription>
              </DialogHeader>

              <div className="custom_scrollbar flex-1 space-y-4 overflow-y-auto p-6! text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-slate-500">Current status:</span>
                  <Badge
                    variant="outline"
                    className={STATUS_BADGE_CLASS[reviewApplication.status] ?? 'border-slate-200 bg-slate-100 text-slate-600'}
                  >
                    {formatStatusLabel(reviewApplication.status)}
                  </Badge>
                </div>

                <div className="grid gap-2 rounded-lg border border-slate-100 bg-slate-50/60 p-3 sm:grid-cols-2">
                  <p><span className="text-slate-500">Current tier:</span> {reviewApplication.current_tier_id?.code ?? '—'}</p>
                  <p><span className="text-slate-500">Requested tier:</span> {reviewApplication.requested_tier_id?.code ?? '—'}</p>
                </div>

                <EligibilitySnapshot
                  eligibility={reviewApplication.eligibility}
                  requestedTier={reviewApplication.requested_tier_id}
                />

                {reviewApplication.application_statement ? (
                  <div className="space-y-1.5">
                    <Label>Application statement</Label>
                    <p className="whitespace-pre-wrap rounded-lg border border-slate-100 bg-slate-50/60 p-3 text-slate-700">
                      {reviewApplication.application_statement}
                    </p>
                  </div>
                ) : null}

                {reviewApplication.portfolio_url ? (
                  <a
                    href={reviewApplication.portfolio_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-primary hover:underline"
                  >
                    View portfolio
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                ) : null}

                <p><span className="text-slate-500">Submitted:</span> {formatDate(reviewApplication.submitted_at ?? reviewApplication.createdAt)}</p>

                {reviewApplication.admin_notes ? (
                  <p><span className="text-slate-500">Admin notes:</span> {reviewApplication.admin_notes}</p>
                ) : null}

                {getReviewerName(reviewApplication.reviewed_by) ? (
                  <p><span className="text-slate-500">Reviewed by:</span> {getReviewerName(reviewApplication.reviewed_by)} on {formatDate(reviewApplication.reviewed_at ?? undefined)}</p>
                ) : null}

                {reviewApplication.decision_reason ? (
                  <p><span className="text-slate-500">Previous decision note:</span> {reviewApplication.decision_reason}</p>
                ) : null}

                {canReview ? (
                  <>
                    {reviewApplication.eligibility?.is_eligible === false &&
                    action === MENTOR_TIER_UPGRADE_APPLICATION_ACTION.APPROVE ? (
                      <p className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                        This mentor is not currently eligible. You can still approve and assign the requested tier.
                      </p>
                    ) : null}

                    <div className="space-y-2">
                      <Label htmlFor="decision-select">Decision</Label>
                      <select
                        id="decision-select"
                        value={action}
                        onChange={(e) => setAction(e.target.value)}
                        className={cn(adminSelectClass, 'w-full')}
                      >
                        {DECISION_OPTIONS.map((item) => (
                          <option key={item.value} value={item.value}>{item.label}</option>
                        ))}
                      </select>
                    </div>

                    {action === MENTOR_TIER_UPGRADE_APPLICATION_ACTION.REJECT ? (
                      <div className="space-y-2">
                        <Label htmlFor="decision-reason">Decision reason</Label>
                        <Textarea
                          id="decision-reason"
                          rows={3}
                          value={reviewNotes}
                          onChange={(e) => setReviewNotes(e.target.value)}
                          placeholder="Share context that will be visible to the applicant..."
                        />
                      </div>
                    ) : null}

                    <div className="space-y-2">
                      <Label htmlFor="admin-notes">Admin notes</Label>
                      <Textarea
                        id="admin-notes"
                        rows={3}
                        value={adminNotes}
                        onChange={(e) => setAdminNotes(e.target.value)}
                        placeholder="Internal notes for this review..."
                      />
                    </div>
                  </>
                ) : null}
              </div>

              <DialogFooter className="shrink-0 gap-3 border-t border-slate-100 px-6 py-4">
                <UiButton type="button" className="global_btn outline_primary rounded_full" onPress={closeReview} disabled={isReviewing}>
                  <X className="h-4 w-4" /> {canReview ? 'Cancel' : 'Close'}
                </UiButton>
                {canReview ? (
                  <UiButton
                    type="button"
                    className="global_btn bg_primary rounded_full"
                    onPress={handleSubmitReview}
                    isLoading={isReviewing}
                  >
                    <Save className="h-4 w-4" /> Save
                  </UiButton>
                ) : null}
              </DialogFooter>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </AdminPage>
  );
}
