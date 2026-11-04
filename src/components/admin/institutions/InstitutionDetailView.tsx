'use client';

import Link from 'next/link';
import moment from 'moment';
import { ArrowLeft, Building2 } from 'lucide-react';
import { AdminEmptyState, AdminPage, AdminPageHeader, AdminPanel } from '@/components/admin/layout/AdminContent';
import { Badge } from '@/components/ui/badge';
import { useGetInstitutionByIdQuery } from '@/store/rtkQueries/institutionApi';
import { getAdminSectionRoutePath } from '@/routes/routes';
import { AdminUserDetailSkeleton } from '@/components/skeleton-loader/admin';
import { InstitutionStudentsTab } from '@/components/admin/institutions/InstitutionStudentsTab';

export function InstitutionDetailView({ institutionId }: { institutionId: string }) {
  const { data, isLoading, error } = useGetInstitutionByIdQuery(institutionId, { skip: !institutionId });
  const institution = data?.data;

  const backLink = (
    <Link
      href={getAdminSectionRoutePath('institutions')}
      className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-slate-500 transition-colors hover:text-primary"
    >
      <ArrowLeft className="h-4 w-4" />
      Back to institutions
    </Link>
  );

  if (isLoading) return <AdminUserDetailSkeleton />;

  if (error || !institution) {
    return (
      <AdminPage>
        {backLink}
        <AdminPanel>
          <AdminEmptyState
            icon={Building2}
            title="Institution not found"
            description="This institution may have been removed, or the link is invalid."
            action={
              <Link
                href={getAdminSectionRoutePath('institutions')}
                className="global_btn rounded_full bg_primary inline-flex items-center justify-center"
              >
                Back to institutions
              </Link>
            }
          />
        </AdminPanel>
      </AdminPage>
    );
  }

  const promo = [institution.promo_start, institution.promo_end]
    .filter(Boolean)
    .map((date) => moment(date).format('MMM D, YYYY'))
    .join(' – ');
  const pricingType = institution.books_pricing_type === 'Discount' ? 'Discounted Price' : institution.books_pricing_type || '—';
  const couponCode = institution.coupon && typeof institution.coupon === 'object' ? institution.coupon.coupon_code : '';

  return (
    <AdminPage>
      {backLink}
      <AdminPageHeader
        eyebrow="University Partnerships"
        title={institution.name}
        description="Institution profile and the students linked to it."
      />

      <AdminPanel className="p-6">
        <h2 className="text-lg font-semibold text-slate-900">{institution.name}</h2>
        <p className="text-sm text-slate-500">{institution.contact_email || '—'}</p>
        <dl className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">Status</dt>
            <dd className="mt-1">
              <Badge variant="outline">{institution.status || '—'}</Badge>
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">Domains</dt>
            <dd className="mt-1 text-sm text-slate-700">{institution.domains?.join(', ') || '—'}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">Promo</dt>
            <dd className="mt-1 text-sm text-slate-700">{promo || '—'}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">Pricing (after promo expiry)</dt>
            <dd className="mt-1 text-sm text-slate-700">
              {pricingType}
              {institution.books_pricing_type === 'Discount' && couponCode ? ` · ${couponCode}` : ''}
            </dd>
          </div>
        </dl>
      </AdminPanel>

      <div>
        <h2 className="mb-3 text-base font-semibold text-slate-900">Students</h2>
        <InstitutionStudentsTab institutionId={institutionId} />
      </div>
    </AdminPage>
  );
}
