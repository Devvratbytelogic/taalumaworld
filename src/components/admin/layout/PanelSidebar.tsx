'use client';

import Link from 'next/link';
import { Avatar } from '@heroui/react';
import { Shield } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/components/ui/utils';

export interface SidebarNavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  href: string;
  badge?: number;
}

export interface SidebarNavGroup {
  title: string;
  items: SidebarNavItem[];
}

export function SidebarRoleCard({
  name,
  role,
  avatar,
}: {
  name: string;
  role: string;
  avatar?: string;
}) {
  return (
    <div className="mb-5 rounded-2xl border border-primary/10 bg-linear-to-br from-primary/8 via-white to-primary/5 p-4">
      <div className="flex items-center gap-3">
        <Avatar src={avatar} name={name} size="sm" className="h-10 w-10 ring-2 ring-white shadow-sm" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-foreground">{name}</p>
          <Badge variant="secondary" className="mt-1 gap-1 bg-primary/10 text-primary border-0">
            <Shield className="h-3 w-3" />
            {role}
          </Badge>
        </div>
      </div>
    </div>
  );
}

export function SidebarNavLink({
  item,
  isActive,
  onClick,
}: {
  item: SidebarNavItem;
  isActive: boolean;
  onClick?: () => void;
}) {
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={cn(
        'group relative flex items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
        isActive
          ? 'bg-primary text-white shadow-[0_8px_20px_-6px_rgba(10,102,194,0.55)]'
          : 'text-foreground/75 hover:bg-muted/70 hover:text-foreground',
      )}
    >
      {isActive && (
        <span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-white/90" />
      )}
      <div className="flex min-w-0 items-center gap-3 pl-0.5">
        <span
          className={cn(
            'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors',
            isActive
              ? 'bg-white/20 text-white'
              : 'bg-muted/60 text-primary group-hover:bg-primary/10',
          )}
        >
          <Icon className="h-[18px] w-[18px]" />
        </span>
        <span className="truncate leading-snug">{item.label}</span>
      </div>
      {item.badge ? (
        <Badge
          variant={isActive ? 'secondary' : 'default'}
          className={cn('h-5 shrink-0 px-2', isActive && 'bg-white/20 text-white')}
        >
          {item.badge}
        </Badge>
      ) : null}
    </Link>
  );
}

export function SidebarNavGroups({
  groups,
  pathname,
  onNavigate,
}: {
  groups: SidebarNavGroup[];
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <nav className="space-y-1">
      {groups.map((group) => (
        <div key={group.title} className="pt-4 first:pt-0">
          <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground/70">
            {group.title}
          </p>
          <div className="space-y-0.5">
            {group.items.map((item) => (
              <SidebarNavLink
                key={item.id}
                item={item}
                isActive={pathname === item.href}
                onClick={onNavigate}
              />
            ))}
          </div>
        </div>
      ))}
    </nav>
  );
}

export function SidebarPanel({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border/50 bg-white/90 p-3 shadow-[0_8px_30px_-12px_rgba(10,102,194,0.15)] backdrop-blur-sm">
      {children}
    </div>
  );
}
