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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import UiButton from '@/components/ui/Button';
import toast from '@/utils/toast';
import {
  AdminPage,
  AdminPageHeader,
  AdminSearchInput,
  AdminSearchPanel,
} from '@/components/admin/layout/AdminContent';
import CommonDataTable from '@/components/admin/CommonDataTable';
import { useDebounce } from '@/hooks/useDebounce';
import { useGetAllMentorApplicationsQuery } from '@/store/rtkQueries/mentorApis';
import type { IMentorApplicationEntity } from '@/types/mentorApplication';
import { type ApplicationStatus } from '@/components/admin/applications/data/mentorApplicationsData';

const STATUSES: ApplicationStatus[] = ['Pending Review', 'Approved', 'Waitlisted', 'Rejected', 'Suspended'];

const APPLICANT_STATUS_BADGE_CLASS: Record<string, string> = {
  pending: 'bg-sky-50 text-sky-700 border-sky-200',
  approved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  waitlisted: 'bg-amber-50 text-amber-700 border-amber-200',
  rejected: 'bg-red-50 text-red-700 border-red-200',
  suspended: 'bg-slate-100 text-slate-600 border-slate-200',
};

function getApplicantName(app: IMentorApplicationEntity) {
  if (typeof app.user === 'object' && app.user?.name) return app.user.name;
  return app.name ?? '—';
}

function getApplicantEmail(app: IMentorApplicationEntity) {
  if (typeof app.user === 'object' && app.user?.email) return app.user.email;
  return app.email ?? '—';
}

function formatStatusLabel(status?: string) {
  if (!status) return '—';
  return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
}

export function AdminMentorApplicationsTab() {
  const [searchQuery, setSearchQuery] = useState('');
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
  const [reviewConversion, setReviewConversion] = useState<IMentorApplicationEntity | null>(null);
  const [reviewStatus, setReviewStatus] = useState<ApplicationStatus>('Pending Review');
  const [reviewNotes, setReviewNotes] = useState('');

  const debouncedSearch = useDebounce(searchQuery, 400);

  const { data, isLoading } = useGetAllMentorApplicationsQuery({
    page: paginationModel.page + 1,
    limit: paginationModel.pageSize,
    ...(debouncedSearch.trim() ? { search: debouncedSearch.trim() } : {}),
  });

  const applications = data?.data?.data ?? [];
  const total = data?.data?.total ?? 0;

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setPaginationModel((prev) => ({ ...prev, page: 0 }));
  };

  const openConversionReview = (app: IMentorApplicationEntity) => {
    setReviewConversion(app);
    setReviewNotes(app.admin_notes ?? '');
  };

  const closeReview = () => setReviewConversion(null);

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
      field: 'years_of_experience',
      headerName: 'Experience',
      width: 120,
      sortable: false,
      renderCell: (params) => (
        <span className="text-sm text-slate-700">
          {params.row.years_of_experience != null ? `${params.row.years_of_experience} yrs` : '—'}
        </span>
      ),
    },
    {
      field: 'createdAt',
      headerName: 'Submitted',
      width: 140,
      sortable: false,
      renderCell: (params) => (
        <span className="text-sm text-slate-500">
          {params.row.createdAt
            ? new Date(params.row.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
            : '—'}
        </span>
      ),
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 130,
      sortable: false,
      renderCell: (params) => (
        <Badge
          variant="outline"
          className={APPLICANT_STATUS_BADGE_CLASS[params.row.status?.toLowerCase()] ?? 'border-slate-200 bg-slate-100 text-slate-600'}
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
            onClick={() => openConversionReview(params.row)}
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
        <AdminSearchInput value={searchQuery} onChange={handleSearchChange} placeholder="Search applications..." />
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

      <Dialog open={!!reviewConversion} onOpenChange={(open) => !open && closeReview()}>
        <DialogContent className="admin_panel flex max-h-[90vh] flex-col gap-0 overflow-hidden p-0 sm:max-w-2xl">
          {reviewConversion ? (
            <>
              <DialogHeader className="shrink-0 border-b border-slate-100 px-6 pb-4 pt-6 pr-12">
                <DialogTitle>Review mentor application</DialogTitle>
                <DialogDescription>
                  {getApplicantName(reviewConversion)} · {getApplicantEmail(reviewConversion)}
                </DialogDescription>
              </DialogHeader>

              <div className="custom_scrollbar flex-1 space-y-4 overflow-y-auto p-6! text-sm">
                <p><span className="text-slate-500">Experience:</span> {reviewConversion.years_of_experience ?? '—'} years</p>
                {reviewConversion.linkedin_url ? <p><span className="text-slate-500">LinkedIn:</span> {reviewConversion.linkedin_url}</p> : null}
                {reviewConversion.facebook_url ? <p><span className="text-slate-500">Facebook:</span> {reviewConversion.facebook_url}</p> : null}
                {reviewConversion.x_url ? <p><span className="text-slate-500">X:</span> {reviewConversion.x_url}</p> : null}
                {reviewConversion.personal_website ? <p><span className="text-slate-500">Website:</span> {reviewConversion.personal_website}</p> : null}
                {reviewConversion.career_summary ? <p><span className="text-slate-500">Career summary:</span> {reviewConversion.career_summary}</p> : null}
                <p>
                  <span className="text-slate-500">Bank:</span> {reviewConversion.bank_name ?? '—'} · {reviewConversion.account_name ?? '—'} · {reviewConversion.account_number ?? '—'}
                </p>
                {reviewConversion.mpesa_number ? <p><span className="text-slate-500">M-Pesa:</span> {reviewConversion.mpesa_number}</p> : null}
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={reviewStatus} onValueChange={(v) => setReviewStatus(v as ApplicationStatus)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {STATUSES.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="conversion-notes">Admin notes</Label>
                  <Textarea id="conversion-notes" rows={3} value={reviewNotes} onChange={(e) => setReviewNotes(e.target.value)} />
                </div>
              </div>

              <DialogFooter className="shrink-0 gap-3 border-t border-slate-100 px-6 py-4">
                <UiButton type="button" className="global_btn outline_primary rounded_full" onPress={closeReview}>
                  <X className="h-4 w-4" /> Cancel
                </UiButton>
                <UiButton
                  type="button"
                  className="global_btn bg_primary rounded_full"
                  onPress={() => {
                    toast.success('Review saved. Connect the update endpoint to persist this change.');
                    closeReview();
                  }}
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
