'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import moment from 'moment';
import { ArrowLeft, ScrollText, User } from 'lucide-react';
import {
  AdminPage,
  AdminPageHeader,
  AdminPanel,
  AdminSectionHeader,
} from '@/components/admin/layout/AdminContent';
import { useGetAuditLogByIdQuery } from '@/store/rtkQueries/auditLogApi';
import { getAdminSectionRoutePath } from '@/routes/routes';

function DetailRow({ label, value }: { label: string; value?: ReactNode }) {
  return (
    <div className="min-w-0">
      <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">{label}</dt>
      <dd className="mt-1 text-sm text-slate-700 wrap-break-word">
        {value === undefined || value === null || value === '' ? '-' : value}
      </dd>
    </div>
  );
}

interface AuditLogDetailViewProps {
  auditLogId: string;
}

export function AuditLogDetailView({ auditLogId }: AuditLogDetailViewProps) {
  const { data, isLoading } = useGetAuditLogByIdQuery(auditLogId);
  const log = data?.data;

  if (isLoading) {
    return (
      <AdminPage>
        <AdminPanel className="p-10 text-center text-sm text-slate-500">Loading audit log...</AdminPanel>
      </AdminPage>
    );
  }

  if (!log) {
    return (
      <AdminPage>
        <AdminPanel className="p-10 text-center text-sm text-slate-500">Audit log not found.</AdminPanel>
      </AdminPage>
    );
  }

  const actorName = log.actor_name || log.actor_id?.name || 'System';
  const actorEmail = log.actor_email || log.actor_id?.email;
  const hasChange = Boolean(log.old_value || log.new_value || log.reason);

  return (
    <AdminPage>
      <Link
        href={getAdminSectionRoutePath('audit_logs')}
        className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-slate-500 transition-colors hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to audit logs
      </Link>

      <AdminPageHeader
        title={log.action_label || log.action}
        description="Full details for this audit log entry."
      />

      <AdminPanel className="p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
            <ScrollText className="h-6 w-6" />
          </div>
          <div>
            <p className="text-lg font-semibold">{log.action_label || log.action}</p>
            <p className="text-sm text-muted-foreground font-mono">{log.action}</p>
          </div>
        </div>
      </AdminPanel>

      <AdminPanel className="p-6">
        <AdminSectionHeader title="Performed By" />
        <div className="flex items-center gap-3 mb-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-muted-foreground shrink-0">
            <User className="h-4 w-4" />
          </div>
          <div>
            <p className="text-sm font-medium">{actorName}</p>
            <p className="text-xs text-muted-foreground">{actorEmail ?? '—'}</p>
          </div>
        </div>
        <dl className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          <DetailRow label="Role" value={log.actor_role} />
          <DetailRow label="IP Address" value={log.ip_address} />
          <DetailRow label="User Agent" value={log.user_agent} />
        </dl>
      </AdminPanel>

      <AdminPanel className="p-6">
        <AdminSectionHeader title="Details" />
        <dl className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          <DetailRow label="Entity Type" value={log.entity_type} />
          <DetailRow label="Entity ID" value={log.entity_id} />
          <DetailRow label="Entity" value={log.entity_label} />
          <DetailRow label="Date" value={moment(log.createdAt).format('DD MMM YYYY, hh:mm A')} />
          <DetailRow
            label="Retention Until"
            value={log.retention_until ? moment(log.retention_until).format('DD MMM YYYY') : null}
          />
          <DetailRow label="Request URL" value={log.metadata?.original_url} />
          <DetailRow label="Response Status" value={log.metadata?.status_code} />
        </dl>
      </AdminPanel>

      {hasChange ? (
        <AdminPanel className="p-6">
          <AdminSectionHeader title="Change" />
          <div className="space-y-4">
            {log.reason ? (
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400 mb-1">Reason</p>
                <p className="text-sm text-slate-700">{log.reason}</p>
              </div>
            ) : null}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {log.old_value ? (
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400 mb-1">Before</p>
                  <pre className="overflow-x-auto rounded-lg bg-slate-50 p-4 text-xs text-slate-700">
                    {JSON.stringify(log.old_value, null, 2)}
                  </pre>
                </div>
              ) : null}
              {log.new_value ? (
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400 mb-1">After</p>
                  <pre className="overflow-x-auto rounded-lg bg-slate-50 p-4 text-xs text-slate-700">
                    {JSON.stringify(log.new_value, null, 2)}
                  </pre>
                </div>
              ) : null}
            </div>
          </div>
        </AdminPanel>
      ) : null}
    </AdminPage>
  );
}
