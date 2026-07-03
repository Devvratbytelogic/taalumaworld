import Link from 'next/link';
import { AlertCircle, ArrowUpRight, MessageSquare, TrendingUp } from 'lucide-react';
import { cn } from '@/components/ui/utils';
import { adminPanelClass } from '@/components/admin/layout/AdminContent';

interface DashboardQuickActionsProps {
  pendingTestimonials?: number;
  inactiveContent?: number;
  isLoading?: boolean;
}

const actions = [
  {
    key: 'testimonials',
    title: 'Pending testimonials',
    description: 'Waiting for moderation',
    href: '/admin/testimonials',
    cta: 'Review now',
    icon: MessageSquare,
    tone: 'bg-amber-50 text-amber-600',
    countKey: 'pendingTestimonials' as const,
  },
  {
    key: 'inactive',
    title: 'Inactive content',
    description: 'Not yet published',
    href: '/admin/chapters',
    cta: 'View queue',
    icon: AlertCircle,
    tone: 'bg-red-50 text-red-600',
    countKey: 'inactiveContent' as const,
  },
  {
    key: 'health',
    title: 'System health',
    description: 'All systems operational',
    href: '/admin/analytics',
    cta: 'View details',
    icon: TrendingUp,
    tone: 'bg-emerald-50 text-emerald-600',
    staticValue: '98%',
  },
];

export function DashboardQuickActions({
  pendingTestimonials = 0,
  inactiveContent = 0,
  isLoading = false,
}: DashboardQuickActionsProps) {
  const counts = { pendingTestimonials, inactiveContent };

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      {actions.map((action) => {
        const Icon = action.icon;
        const value = action.staticValue ?? counts[action.countKey!];

        return (
          <div key={action.key} className={cn(adminPanelClass, 'flex flex-col p-5')}>
            <div className="mb-4 flex items-start gap-3">
              <div className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-lg', action.tone)}>
                <Icon className="h-[18px] w-[18px]" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900">{action.title}</p>
                {isLoading && !action.staticValue ? (
                  <div className="mt-1 h-7 w-10 animate-pulse rounded bg-slate-100" />
                ) : (
                  <p className="mt-0.5 text-2xl font-semibold tracking-tight text-slate-900">{value}</p>
                )}
              </div>
            </div>
            <p className="mb-4 text-sm text-slate-500">{action.description}</p>
            <Link
              href={action.href}
              className="mt-auto inline-flex items-center gap-1 text-sm font-medium text-primary transition-colors hover:text-primary/80"
            >
              {action.cta}
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        );
      })}
    </div>
  );
}
