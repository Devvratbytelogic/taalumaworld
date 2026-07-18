'use client';

import { useState } from 'react';
import { type GridColDef } from '@mui/x-data-grid';
import { Eye, ExternalLink, ShieldCheck, ShieldX, X } from 'lucide-react';
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
import { AdminPage, AdminPageHeader, AdminSearchInput, AdminSearchPanel, adminFilterPillClass, adminSelectClass, } from '@/components/admin/layout/AdminContent';
import CommonDataTable from '@/components/admin/CommonDataTable';
import { useDebounce } from '@/hooks/useDebounce';
import { useGetAllVerifiedMentorApplicationsQuery, useReviewVerifiedMentorApplicationMutation, } from '@/store/rtkQueries/verifiedMentorApplicationApis';
import type { IApplicationsEntity } from '@/types/verifiedMentorApplication';
import {
  VERIFIED_MENTOR_APPLICATION_ACTION,
  VERIFIED_MENTOR_APPLICATION_STATUS,
} from '@/constants/verifiedMentorApplication';

const STATUS_OPTIONS = Object.values(VERIFIED_MENTOR_APPLICATION_STATUS);

const STATUS_BADGE_CLASS: Record<string, string> = {
  [VERIFIED_MENTOR_APPLICATION_STATUS.PENDING_REVIEW]: 'bg-amber-50 text-amber-700 border-amber-200!',
  [VERIFIED_MENTOR_APPLICATION_STATUS.APPROVED]: 'bg-emerald-50 text-emerald-700 border-emerald-200!',
  [VERIFIED_MENTOR_APPLICATION_STATUS.REJECTED]: 'bg-red-50 text-red-700 border-red-200!',
};

const DECISION_OPTIONS = [
  { value: VERIFIED_MENTOR_APPLICATION_ACTION.APPROVE, label: 'Approve' },
  { value: VERIFIED_MENTOR_APPLICATION_ACTION.REJECT, label: 'Reject' },
];

function formatStatusLabel(status?: string) {
  if (!status) return '—';
  return status
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function getApplicantName(app: IApplicationsEntity) {
  return app.user_id?.name ?? '—';
}

function getApplicantEmail(app: IApplicationsEntity) {
  return app.user_id?.email ?? '—';
}

function formatDate(value?: string) {
  if (!value) return '—';
  return new Date(value).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function AdminMentorVerificationTab() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
  const [reviewApplication, setReviewApplication] = useState<IApplicationsEntity | null>(null);
  const [action, setAction] = useState<string>(VERIFIED_MENTOR_APPLICATION_ACTION.APPROVE);
  const [decisionReason, setDecisionReason] = useState('');

  const debouncedSearch = useDebounce(searchQuery, 400);

  const { data, isLoading } = useGetAllVerifiedMentorApplicationsQuery({
    page: paginationModel.page + 1,
    limit: paginationModel.pageSize,
    ...(statusFilter ? { status: statusFilter } : {}),
    ...(debouncedSearch.trim() ? { search: debouncedSearch.trim() } : {}),
  });

  const [reviewVerifiedMentorApplication, { isLoading: isReviewing }] = useReviewVerifiedMentorApplicationMutation();

  const applications = data?.data?.applications ?? [];
  const total = data?.data?.pagination?.total ?? 0;

  const resetToFirstPage = () => setPaginationModel((prev) => ({ ...prev, page: 0 }));

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    resetToFirstPage();
  };

  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
    resetToFirstPage();
  };

  const openReview = (app: IApplicationsEntity) => {
    setReviewApplication(app);
    setAction(
      app.status === VERIFIED_MENTOR_APPLICATION_STATUS.REJECTED
        ? VERIFIED_MENTOR_APPLICATION_ACTION.REJECT
        : VERIFIED_MENTOR_APPLICATION_ACTION.APPROVE,
    );
    setDecisionReason(app.decision_reason ?? '');
  };

  const closeReview = () => {
    setReviewApplication(null);
    setDecisionReason('');
  };

  const handleSubmitReview = async () => {
    if (!reviewApplication) return;
    try {
      const res = await reviewVerifiedMentorApplication({
        id: reviewApplication._id,
        values: {
          action,
          decision_reason: decisionReason.trim(),
        },
      }).unwrap();
      toast.success(res?.message ?? 'Application reviewed successfully');
      closeReview();
    } catch (error) {
      console.error('Failed to review verification application', error);
    }
  };

  const hasActiveFilters = !!statusFilter;

  const columns: GridColDef[] = [
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
      minWidth: 220,
      flex: 1,
      sortable: false,
      renderCell: (params) => (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <ShieldCheck className="h-4 w-4 text-primary" />
          </div>
          <div className="min-w-0">
            <p className="truncate font-medium text-sm text-slate-900">{getApplicantName(params.row)}</p>
            <p className="truncate text-xs text-muted-foreground">{getApplicantEmail(params.row)}</p>
          </div>
        </div>
      ),
    },
    {
      field: 'portfolio_url',
      headerName: 'Portfolio',
      minWidth: 160,
      flex: 1,
      sortable: false,
      renderCell: (params) =>
        params.row.portfolio_url ? (
          <a
            href={params.row.portfolio_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 truncate text-sm font-medium text-primary hover:underline"
          >
            <span className="truncate">{params.row.portfolio_url}</span>
            <ExternalLink className="h-3.5 w-3.5 shrink-0" />
          </a>
        ) : (
          <span className="text-sm text-slate-400">—</span>
        ),
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
      width: 150,
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
      renderCell: (params) => (
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
      ),
    },
  ];

  return (
    <AdminPage>
      <AdminPageHeader
        eyebrow="Mentor Management"
        title="Mentor Verification"
        description="Review mentor applications for Verified Mentor status."
      />

      <AdminSearchPanel>
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <AdminSearchInput
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search by mentor name or email..."
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
                <DialogTitle>Review verification application</DialogTitle>
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

                <div className="space-y-1.5">
                  <div className="flex items-baseline justify-between gap-3">
                    <Label>Application statement</Label>
                    {reviewApplication.statement_word_count != null ? (
                      <span className="shrink-0 text-xs tabular-nums text-slate-400">
                        {reviewApplication.statement_word_count} words
                      </span>
                    ) : null}
                  </div>
                  <p className="whitespace-pre-wrap rounded-lg border border-slate-100 bg-slate-50/60 p-3 text-slate-700">
                    {reviewApplication.application_statement || '—'}
                  </p>
                </div>

                {reviewApplication.portfolio_url ? (
                  <p>
                    <span className="text-slate-500">Portfolio:</span>{' '}
                    <a
                      href={reviewApplication.portfolio_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-primary hover:underline"
                    >
                      {reviewApplication.portfolio_url}
                    </a>
                  </p>
                ) : null}

                <p><span className="text-slate-500">Submitted:</span> {formatDate(reviewApplication.submitted_at ?? reviewApplication.createdAt)}</p>

                {reviewApplication.decision_reason ? (
                  <p><span className="text-slate-500">Previous decision note:</span> {reviewApplication.decision_reason}</p>
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

                <div className="space-y-2">
                  <Label htmlFor="decision-reason">
                    Decision reason {action === VERIFIED_MENTOR_APPLICATION_ACTION.REJECT ? <span className="text-red-500">*</span> : <span className="font-normal text-slate-400">(optional)</span>}
                  </Label>
                  <Textarea
                    id="decision-reason"
                    rows={3}
                    value={decisionReason}
                    onChange={(e) => setDecisionReason(e.target.value)}
                    placeholder="Share context that will be visible to the mentor..."
                  />
                </div>
              </div>

              <DialogFooter className="shrink-0 gap-3 border-t border-slate-100 px-6 py-4">
                <UiButton type="button" className="global_btn outline_primary rounded_full" onPress={closeReview} disabled={isReviewing}>
                  <X className="h-4 w-4" /> Cancel
                </UiButton>
                <UiButton
                  type="button"
                  className={`global_btn rounded_full ${action === VERIFIED_MENTOR_APPLICATION_ACTION.REJECT ? 'danger_outline' : 'bg_primary'}`}
                  onPress={handleSubmitReview}
                  isLoading={isReviewing}
                  disabled={action === VERIFIED_MENTOR_APPLICATION_ACTION.REJECT && !decisionReason.trim()}
                >
                  {action === VERIFIED_MENTOR_APPLICATION_ACTION.REJECT ? (
                    <><ShieldX className="h-4 w-4" /> Reject</>
                  ) : (
                    <><ShieldCheck className="h-4 w-4" /> Approve</>
                  )}
                </UiButton>
              </DialogFooter>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </AdminPage>
  );
}
