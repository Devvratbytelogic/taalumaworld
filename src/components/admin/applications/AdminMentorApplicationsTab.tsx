'use client';

import { useState } from 'react';
import { type GridColDef } from '@mui/x-data-grid';
import { Eye, Save, Users, X } from 'lucide-react';
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
  useGetAllMentorApplicationsQuery,
  useReviewMentorApplicationMutation,
} from '@/store/rtkQueries/mentorApis';
import type { ApplicationsEntity } from '@/types/mentorApplication';
import {
  VERIFIED_MENTOR_APPLICATION_ACTION,
  VERIFIED_MENTOR_APPLICATION_STATUS,
} from '@/constants/verifiedMentorApplication';

const STATUS_OPTIONS = Object.values(VERIFIED_MENTOR_APPLICATION_STATUS);

const STATUS_BADGE_CLASS: Record<string, string> = {
  [VERIFIED_MENTOR_APPLICATION_STATUS.PENDING_REVIEW]: 'bg-sky-50 text-sky-700 border-sky-200!',
  [VERIFIED_MENTOR_APPLICATION_STATUS.APPROVED]: 'bg-emerald-50 text-emerald-700 border-emerald-200!',
  [VERIFIED_MENTOR_APPLICATION_STATUS.REJECTED]: 'bg-red-50 text-red-700 border-red-200!',
};

const DECISION_OPTIONS = [
  { value: VERIFIED_MENTOR_APPLICATION_ACTION.APPROVE, label: 'Approve' },
  { value: VERIFIED_MENTOR_APPLICATION_ACTION.REJECT, label: 'Reject' },
];

function getApplicantName(app: ApplicationsEntity) {
  return app.user_id?.name ?? '—';
}

function getApplicantEmail(app: ApplicationsEntity) {
  return app.user_id?.email ?? '—';
}

function getReviewerName(reviewedBy: ApplicationsEntity['reviewed_by']) {
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

export function AdminMentorApplicationsTab() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
  const [reviewApplication, setReviewApplication] = useState<ApplicationsEntity | null>(null);
  const [action, setAction] = useState<string>(VERIFIED_MENTOR_APPLICATION_ACTION.APPROVE);
  const [reviewNotes, setReviewNotes] = useState('');

  const debouncedSearch = useDebounce(searchQuery, 400);

  const { data, isLoading } = useGetAllMentorApplicationsQuery({
    page: paginationModel.page + 1,
    limit: paginationModel.pageSize,
    ...(statusFilter ? { status: statusFilter } : {}),
    ...(debouncedSearch.trim() ? { search: debouncedSearch.trim() } : {}),
  });

  const [reviewMentorApplication, { isLoading: isReviewing }] = useReviewMentorApplicationMutation();

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

  const openReview = (app: ApplicationsEntity) => {
    setReviewApplication(app);
    setAction(
      app.status === VERIFIED_MENTOR_APPLICATION_STATUS.REJECTED
        ? VERIFIED_MENTOR_APPLICATION_ACTION.REJECT
        : VERIFIED_MENTOR_APPLICATION_ACTION.APPROVE,
    );
    setReviewNotes(app.decision_reason ?? '');
  };

  const closeReview = () => {
    setReviewApplication(null);
    setReviewNotes('');
  };

  const handleSubmitReview = async () => {
    if (!reviewApplication) return;
    try {
      const res = await reviewMentorApplication({
        id: reviewApplication._id,
        values: {
          action,
          decision_reason: reviewNotes.trim(),
        },
      }).unwrap();
      toast.success(res?.message ?? 'Application reviewed successfully');
      closeReview();
    } catch (error) {
      console.error('Failed to review mentor application', error);
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
      headerName: 'Applicant',
      minWidth: 220,
      flex: 1,
      sortable: false,
      renderCell: (params) => (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <Users className="h-4 w-4 text-primary" />
          </div>
          <div className="min-w-0">
            <p className="truncate font-medium text-sm text-slate-900">{getApplicantName(params.row)}</p>
            <p className="truncate text-xs text-muted-foreground">{getApplicantEmail(params.row)}</p>
          </div>
        </div>
      ),
    },
    {
      field: 'previous_role',
      headerName: 'Previous role',
      minWidth: 160,
      flex: 1,
      sortable: false,
      renderCell: (params) => (
        <span className="truncate text-sm text-slate-700">{params.row.previous_role || '—'}</span>
      ),
    },
    {
      field: 'preferred_payment_frequency',
      headerName: 'Payout frequency',
      width: 140,
      sortable: false,
      renderCell: (params) => (
        <span className="text-sm text-slate-700">{formatStatusLabel(params.row.preferred_payment_frequency)}</span>
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
        title="Mentor Applications"
        description="Review Career Architect → Mentor conversion requests."
      />

      <AdminSearchPanel>
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <AdminSearchInput
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search by applicant name or email..."
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
                <DialogTitle>Review mentor application</DialogTitle>
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

                <p><span className="text-slate-500">Previous role:</span> {reviewApplication.previous_role || '—'}</p>

                <div className="space-y-1.5">
                  <div className="flex items-baseline justify-between gap-3">
                    <Label>Professional summary</Label>
                    {reviewApplication.summary_word_count != null ? (
                      <span className="shrink-0 text-xs tabular-nums text-slate-400">
                        {reviewApplication.summary_word_count} words
                      </span>
                    ) : null}
                  </div>
                  <p className="whitespace-pre-wrap rounded-lg border border-slate-100 bg-slate-50/60 p-3 text-slate-700">
                    {reviewApplication.professional_summary || '—'}
                  </p>
                </div>

                <div className="grid gap-2 rounded-lg border border-slate-100 bg-slate-50/60 p-3 sm:grid-cols-2">
                  <p><span className="text-slate-500">Payout frequency:</span> {formatStatusLabel(reviewApplication.preferred_payment_frequency)}</p>
                  <p><span className="text-slate-500">Bank name:</span> {reviewApplication.bank_name || '—'}</p>
                  <p><span className="text-slate-500">Bank number:</span> {reviewApplication.bank_number || '—'}</p>
                  {reviewApplication.bank_branch ? <p><span className="text-slate-500">Bank branch:</span> {reviewApplication.bank_branch}</p> : null}
                  {reviewApplication.mpesa_number ? <p><span className="text-slate-500">M-Pesa:</span> {reviewApplication.mpesa_number}</p> : null}
                  {reviewApplication.tax_id ? <p><span className="text-slate-500">Tax ID:</span> {reviewApplication.tax_id}</p> : null}
                </div>

                <p><span className="text-slate-500">Submitted:</span> {formatDate(reviewApplication.submitted_at ?? reviewApplication.createdAt)}</p>

                {getReviewerName(reviewApplication.reviewed_by) ? (
                  <p><span className="text-slate-500">Reviewed by:</span> {getReviewerName(reviewApplication.reviewed_by)} on {formatDate(reviewApplication.reviewed_at ?? undefined)}</p>
                ) : null}

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
                  <Label htmlFor="decision-reason">Decision reason</Label>
                  <Textarea
                    id="decision-reason"
                    rows={3}
                    value={reviewNotes}
                    onChange={(e) => setReviewNotes(e.target.value)}
                    placeholder="Share context that will be visible to the applicant..."
                  />
                </div>
              </div>

              <DialogFooter className="shrink-0 gap-3 border-t border-slate-100 px-6 py-4">
                <UiButton type="button" className="global_btn outline_primary rounded_full" onPress={closeReview} disabled={isReviewing}>
                  <X className="h-4 w-4" /> Cancel
                </UiButton>
                <UiButton
                  type="button"
                  className="global_btn bg_primary rounded_full"
                  onPress={handleSubmitReview}
                  isLoading={isReviewing}
                >
                  <Save className="h-4 w-4" /> Save
                </UiButton>
              </DialogFooter>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </AdminPage>
  );
}
