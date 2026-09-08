'use client';

import Link from 'next/link';
import moment from 'moment';
import { ArrowLeft, Check, Flag, Star, X } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { usePathname } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import Button from '@/components/ui/Button';
import {
  AdminPage,
  AdminPageHeader,
  AdminPanel,
  AdminSectionHeader,
} from '@/components/admin/layout/AdminContent';
import ImageComponent from '@/components/ui/ImageComponent';
import { useGetAdminReviewReportByIdQuery } from '@/store/rtkQueries/adminReviewReportsApi';
import { openModal } from '@/store/slices/allModalSlice';
import { getReviewReportsListRoutePath, isMentorPanelPath } from '@/routes/routes';
import { useAdminPermissions } from '@/hooks/useAdminPermissions';

const REVIEW_REPORTS_MODEL = 'Review Reports';

const STATUS_BADGE_CLASS: Record<string, string> = {
  pending: 'bg-amber-50 text-amber-700 border-amber-200!',
  accepted: 'bg-emerald-50 text-emerald-700 border-emerald-200!',
  ignored: 'bg-slate-50 text-slate-700 border-slate-200!',
  approved: 'bg-emerald-50 text-emerald-700 border-emerald-200!',
  rejected: 'bg-red-50 text-red-700 border-red-200!',
};

function formatStatusLabel(status?: string) {
  if (!status) return '—';
  return status.charAt(0).toUpperCase() + status.slice(1);
}

function formatTypeLabel(type?: string) {
  if (type === 'Chapter') return 'Blueprint';
  if (type === 'Book') return 'Series';
  return type || '—';
}

function PersonRow({
  person,
  emptyLabel,
}: {
  person?: { name?: string; email?: string; profile_pic?: string | null } | null;
  emptyLabel: string;
}) {
  if (!person) {
    return <p className="text-sm text-muted-foreground">{emptyLabel}</p>;
  }
  return (
    <div className="flex items-center gap-3 min-w-0">
      <div className="border h-10 w-10 rounded-full overflow-hidden shrink-0">
        <ImageComponent src={person.profile_pic ?? ''} alt={person.name ?? ''} object_cover={true} />
      </div>
      <div className="min-w-0">
        <p className="text-sm font-medium truncate">{person.name || '—'}</p>
        <p className="text-xs text-muted-foreground truncate">{person.email || '—'}</p>
      </div>
    </div>
  );
}

interface ReviewReportDetailViewProps {
  reportId: string;
}

export function ReviewReportDetailView({ reportId }: ReviewReportDetailViewProps) {
  const dispatch = useDispatch();
  const pathname = usePathname();
  const isMentor = isMentorPanelPath(pathname);
  const { hasPermission } = useAdminPermissions();
  const canProcessReports = hasPermission(REVIEW_REPORTS_MODEL, 'edit');
  const { data, isLoading, isError } = useGetAdminReviewReportByIdQuery(reportId);
  const report = data?.data;
  const listHref = getReviewReportsListRoutePath(isMentor);

  if (isLoading) {
    return (
      <AdminPage>
        <AdminPanel className="p-10 text-center text-sm text-slate-500">Loading report...</AdminPanel>
      </AdminPage>
    );
  }

  if (isError || !report) {
    return (
      <AdminPage>
        <Link
          href={listHref}
          className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-slate-500 transition-colors hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to review reports
        </Link>
        <AdminPanel className="p-10 text-center text-sm text-slate-500">
          Report not found, or you are not allowed to access this report.
        </AdminPanel>
      </AdminPage>
    );
  }

  const review = report.review;
  const statusKey = String(report.status || 'pending').toLowerCase();

  return (
    <AdminPage>
      <Link
        href={listHref}
        className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-slate-500 transition-colors hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to review reports
      </Link>

      <AdminPageHeader
        title="Review report"
        description="Accept to hide the review, or ignore if this is not a policy violation."
      >
        <Badge variant="outline" className={STATUS_BADGE_CLASS[statusKey] ?? STATUS_BADGE_CLASS.pending}>
          {formatStatusLabel(report.status)}
        </Badge>
      </AdminPageHeader>

      <AdminPanel className="p-6">
        <AdminSectionHeader
          title="Report"
          badge={<Flag className="h-4 w-4 text-orange-600" />}
        />
        <dl className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">Reporter</dt>
            <dd className="mt-2">
              <PersonRow person={report.reported_by} emptyLabel="—" />
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">Reported on</dt>
            <dd className="mt-2 text-sm text-slate-700">
              {report.createdAt ? moment(report.createdAt).format('DD MMM YYYY, hh:mm A') : '—'}
            </dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">Reason</dt>
            <dd className="mt-2 rounded-md border border-slate-100 bg-slate-50/60 p-3 text-sm text-slate-700 whitespace-pre-wrap">
              {report.reason?.trim() || '—'}
            </dd>
          </div>
        </dl>
      </AdminPanel>

      <AdminPanel className="p-6">
        <AdminSectionHeader title="Review" />
        <div className="space-y-4">
          <PersonRow person={review?.customer} emptyLabel="Reviewer unavailable" />
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((value) => (
                <Star
                  key={value}
                  className={`h-4 w-4 ${value <= (review?.rating ?? 0) ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`}
                />
              ))}
            </span>
            {review?.status ? (
              <Badge
                variant="outline"
                className={STATUS_BADGE_CLASS[String(review.status).toLowerCase()] ?? STATUS_BADGE_CLASS.pending}
              >
                {formatStatusLabel(review.status)}
              </Badge>
            ) : null}
          </div>
          <p className="rounded-md border border-slate-100 bg-white p-3 text-sm text-slate-700 whitespace-pre-wrap">
            {review?.comment?.trim() || '—'}
          </p>
          <p className="text-sm text-muted-foreground">
            {formatTypeLabel(review?.type)}
            {review?.item?.title ? ` · ${review.item.title}` : ''}
            {review?.createdAt ? ` · ${moment(review.createdAt).format('DD MMM YYYY')}` : ''}
          </p>
        </div>
      </AdminPanel>

      {report.process_reason || report.processed_by || report.processed_at ? (
        <AdminPanel className="p-6">
          <AdminSectionHeader title="Processing" />
          <dl className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">Processed by</dt>
              <dd className="mt-2">
                <PersonRow person={report.processed_by} emptyLabel="—" />
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">Processed at</dt>
              <dd className="mt-2 text-sm text-slate-700">
                {report.processed_at ? moment(report.processed_at).format('DD MMM YYYY, hh:mm A') : '—'}
              </dd>
            </div>
            {report.process_reason ? (
              <div className="sm:col-span-2">
                <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">Process reason</dt>
                <dd className="mt-2 rounded-md border border-slate-100 bg-slate-50/60 p-3 text-sm text-slate-700 whitespace-pre-wrap">
                  {report.process_reason}
                </dd>
              </div>
            ) : null}
          </dl>
        </AdminPanel>
      ) : null}

      {report.can_process && canProcessReports ? (
        <div className="flex flex-wrap justify-end gap-2">
          <Button
            type="button"
            className="global_btn outline_primary rounded_full"
            onPress={() =>
              dispatch(
                openModal({
                  componentName: 'ReviewReportProcessModal',
                  data: { id: report.id, action: 'ignore', reason: report.reason },
                }),
              )
            }
          >
            <X className="h-4 w-4" /> Ignore
          </Button>
          <Button
            type="button"
            className="global_btn bg_primary rounded_full"
            onPress={() =>
              dispatch(
                openModal({
                  componentName: 'ReviewReportProcessModal',
                  data: { id: report.id, action: 'accept', reason: report.reason },
                }),
              )
            }
          >
            <Check className="h-4 w-4" /> Accept — hide review
          </Button>
        </div>
      ) : null}
    </AdminPage>
  );
}
