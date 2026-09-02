'use client';

import Link from 'next/link';
import { ArrowUpRight, ClipboardList, ShieldCheck, TrendingUp, UserPlus } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/components/ui/utils';
import { adminPanelClass } from '@/components/admin/layout/AdminContent';
import { getInitials } from '@/utils/getInitials';
import { getAdminMentorApplicationsRoutePath, getAdminSectionRoutePath } from '@/routes/routes';
import { useAdminPermissions } from '@/hooks/useAdminPermissions';
import {
  DUMMY_MENTOR_ACTION_QUEUES,
  type DummyMentorActionQueue,
} from './dummyMentorActions';

const QUEUE_ICONS: Record<DummyMentorActionQueue['id'], LucideIcon> = {
  registrations: UserPlus,
  conversions: ClipboardList,
  verification: ShieldCheck,
  upgrades: TrendingUp,
};

const TONE_CLASSES = {
  blue: 'bg-sky-50 text-sky-600',
  green: 'bg-emerald-50 text-emerald-600',
  purple: 'bg-violet-50 text-violet-600',
  orange: 'bg-amber-50 text-amber-600',
};

const STATUS_BADGE_CLASS: Record<string, string> = {
  New: 'bg-sky-50 text-sky-700 border-sky-200!',
  'Pending review': 'bg-amber-50 text-amber-700 border-amber-200!',
};

function getQueueHref(hrefKey: DummyMentorActionQueue['hrefKey']): string {
  if (hrefKey === 'mentor_applications') return getAdminMentorApplicationsRoutePath();
  return getAdminSectionRoutePath(hrefKey);
}

export function DashboardMentorActions() {
  const { hasAccess } = useAdminPermissions();
  const queues = DUMMY_MENTOR_ACTION_QUEUES.filter((queue) => hasAccess(queue.model));

  if (queues.length === 0) return null;

  const totalPending = queues.reduce((sum, queue) => sum + queue.pendingCount, 0);

  return (
    <section>
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-slate-900">Mentor actions</h2>
          <p className="mt-1 text-sm text-slate-500">
            Pending queues for registrations, conversions, verification, and tier upgrades.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-600">
            {totalPending} pending
          </span>
          <span className="rounded-md border border-dashed border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-500">
            Sample data
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {queues.map((queue) => {
          const Icon = QUEUE_ICONS[queue.id];
          const href = getQueueHref(queue.hrefKey);

          return (
            <Link
              key={queue.id}
              href={href}
              className={cn(
                adminPanelClass,
                'group flex h-full flex-col p-5 transition-colors hover:border-slate-300',
              )}
            >
              <div className="mb-4 flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-start gap-3">
                  <div className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-lg', TONE_CLASSES[queue.tone])}>
                    <Icon className="h-4.5 w-4.5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-900">{queue.title}</p>
                    <p className="mt-0.5 text-xs text-slate-500">{queue.description}</p>
                  </div>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-2xl font-semibold tracking-tight text-slate-900">{queue.pendingCount}</p>
                  <p className="text-[11px] font-medium text-slate-400">pending</p>
                </div>
              </div>

              <ul className="flex-1 space-y-1">
                {queue.items.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-start gap-3 rounded-lg px-1 py-2"
                  >
                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[11px] font-semibold text-slate-600">
                      {getInitials(item.name)}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className="truncate text-sm font-medium text-slate-900">{item.name}</p>
                        <span
                          className={cn(
                            'shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-medium',
                            STATUS_BADGE_CLASS[item.status] ?? 'bg-slate-50 text-slate-600 border-slate-200!',
                          )}
                        >
                          {item.status}
                        </span>
                      </div>
                      <p className="truncate text-xs text-slate-500">{item.detail}</p>
                      <p className="mt-0.5 text-[11px] text-slate-400">{item.time}</p>
                    </div>
                  </li>
                ))}
              </ul>

              <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary transition-colors group-hover:text-primary/80">
                Review all
                <ArrowUpRight className="h-4 w-4" />
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
