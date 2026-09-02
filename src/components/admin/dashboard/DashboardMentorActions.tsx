'use client';

import Link from 'next/link';
import { ArrowUpRight, ClipboardList, ShieldCheck, TrendingUp, UserPlus } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/components/ui/utils';
import { adminPanelClass } from '@/components/admin/layout/AdminContent';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getInitials } from '@/utils/getInitials';
import { formatNotificationTime } from '@/utils/adminNotifications';
import { getAdminMentorApplicationsRoutePath, getAdminSectionRoutePath } from '@/routes/routes';
import { useAdminPermissions } from '@/hooks/useAdminPermissions';
import type {
  IAdminDashboardStats,
  IDashboardMentorActionItem,
  IDashboardMentorActionQueue,
} from '@/types/dashboard';

type QueueId = 'registrations' | 'conversions' | 'verification' | 'upgrades';
type QueueDataKey =
  | 'newMentorRegistrations'
  | 'mentorConversions'
  | 'mentorVerification'
  | 'mentorTierUpgrade';

interface QueueConfig {
  id: QueueId;
  dataKey: QueueDataKey;
  model: string;
  title: string;
  description: string;
  href: string;
  tone: 'blue' | 'green' | 'purple' | 'orange';
  icon: LucideIcon;
}

const QUEUE_CONFIG: QueueConfig[] = [
  {
    id: 'registrations',
    dataKey: 'newMentorRegistrations',
    model: 'Mentors',
    title: 'New mentor registrations',
    description: 'Mentors who recently joined the platform.',
    href: getAdminSectionRoutePath('authors'),
    tone: 'green',
    icon: UserPlus,
  },
  {
    id: 'conversions',
    dataKey: 'mentorConversions',
    model: 'Mentor Application',
    title: 'Career Architect → Mentor',
    description: 'Conversion requests awaiting review.',
    href: getAdminMentorApplicationsRoutePath(),
    tone: 'blue',
    icon: ClipboardList,
  },
  {
    id: 'verification',
    dataKey: 'mentorVerification',
    model: 'Mentor Verification',
    title: 'Mentor verification',
    description: 'Applications for Verified Mentor status.',
    href: getAdminSectionRoutePath('mentor_verification'),
    tone: 'purple',
    icon: ShieldCheck,
  },
  {
    id: 'upgrades',
    dataKey: 'mentorTierUpgrade',
    model: 'Mentor Tier Upgrade',
    title: 'Mentor tier upgrade applications',
    description: 'Requests to move to a higher mentor tier.',
    href: getAdminSectionRoutePath('mentor_tier_upgrades'),
    tone: 'orange',
    icon: TrendingUp,
  },
];

const TONE_CLASSES = {
  blue: 'bg-sky-50 text-sky-600',
  green: 'bg-emerald-50 text-emerald-600',
  purple: 'bg-violet-50 text-violet-600',
  orange: 'bg-amber-50 text-amber-600',
};

function getStatusBadgeClass(status?: string | null, statusLabel?: string | null): string {
  const value = `${status ?? ''} ${statusLabel ?? ''}`.toLowerCase();
  if (value.includes('new')) return 'bg-sky-50 text-sky-700 border-sky-200!';
  if (value.includes('approved')) return 'bg-emerald-50 text-emerald-700 border-emerald-200!';
  if (value.includes('reject')) return 'bg-red-50 text-red-700 border-red-200!';
  if (value.includes('pending')) return 'bg-amber-50 text-amber-700 border-amber-200!';
  return 'bg-slate-50 text-slate-600 border-slate-200!';
}

function getQueueData(
  stats: IAdminDashboardStats | undefined,
  key: QueueDataKey,
): { total: number; latest: IDashboardMentorActionItem[] } {
  const queue: IDashboardMentorActionQueue | undefined = stats?.[key];
  return {
    total: queue?.total ?? 0,
    latest: queue?.latest ?? [],
  };
}

function QueueCardSkeleton() {
  return (
    <div className={cn(adminPanelClass, 'flex h-full flex-col p-5')}>
      <div className="mb-4 flex animate-pulse items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 rounded-lg bg-slate-100" />
          <div className="space-y-2">
            <div className="h-4 w-40 rounded bg-slate-100" />
            <div className="h-3 w-52 rounded bg-slate-100" />
          </div>
        </div>
        <div className="h-7 w-8 rounded bg-slate-100" />
      </div>
      <div className="flex-1 space-y-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="flex animate-pulse items-start gap-3 px-1 py-2">
            <div className="h-8 w-8 shrink-0 rounded-full bg-slate-100" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-2/3 rounded bg-slate-100" />
              <div className="h-3 w-1/2 rounded bg-slate-100" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

interface DashboardMentorActionsProps {
  stats?: IAdminDashboardStats;
  isLoading?: boolean;
}

export function DashboardMentorActions({ stats, isLoading }: DashboardMentorActionsProps) {
  const { hasAccess } = useAdminPermissions();
  const queues = QUEUE_CONFIG.filter((queue) => hasAccess(queue.model));

  if (queues.length === 0) return null;


  return (
    <section>
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-slate-900">Mentor actions</h2>
          <p className="mt-1 text-sm text-slate-500">
            Pending queues for registrations, conversions, verification, and tier upgrades.
          </p>
        </div>
       
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {isLoading
          ? queues.map((queue) => <QueueCardSkeleton key={queue.id} />)
          : queues.map((queue) => {
              const Icon = queue.icon;
              const { total, latest } = getQueueData(stats, queue.dataKey);

              return (
                <Link
                  key={queue.id}
                  href={queue.href}
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
                      <p className="text-2xl font-semibold tracking-tight text-slate-900">{total}</p>
                      <p className="text-[11px] font-medium text-slate-400">pending</p>
                    </div>
                  </div>

                  {latest.length === 0 ? (
                    <p className="flex-1 py-8 text-center text-sm text-slate-500">No pending items</p>
                  ) : (
                    <ul className="flex-1 space-y-1">
                      {latest.map((item) => {
                        const statusLabel = item.status_label || item.status || 'Pending';
                        const timeLabel = formatNotificationTime(item.createdAt);

                        return (
                          <li key={item._id} className="flex items-start gap-3 rounded-lg px-1 py-2">
                            <Avatar className="mt-0.5 h-8 w-8 shrink-0 border border-slate-200">
                              <AvatarImage src={item.profile_pic ?? ''} alt={item.name} />
                              <AvatarFallback className="bg-slate-100 text-[11px] font-semibold text-slate-600">
                                {getInitials(item.name || item.email || 'M')}
                              </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-start justify-between gap-2">
                                <p className="truncate text-sm font-medium text-slate-900">{item.name || '—'}</p>
                                <span
                                  className={cn(
                                    'shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-medium',
                                    getStatusBadgeClass(item.status, item.status_label),
                                  )}
                                >
                                  {statusLabel}
                                </span>
                              </div>
                              <p className="truncate text-xs text-slate-500">{item.subtitle || item.email}</p>
                              {timeLabel ? (
                                <p className="mt-0.5 text-[11px] text-slate-400">{timeLabel}</p>
                              ) : null}
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  )}

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
