'use client';

import Link from 'next/link';
import { Avatar } from '@heroui/react';
import { cn } from '@/components/ui/utils';

export interface SidebarNavItem {
  model?: string;
  submodel?: string[];
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

/** Shared width for fixed admin/mentor sidebar */
export const ADMIN_SIDEBAR_WIDTH = '17rem';

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
    <div className="border-b border-slate-200/90 px-1 pb-4">
      <div className="flex items-center gap-3">
        <Avatar
          src={avatar}
          name={name}
          size="sm"
          className="h-9 w-9 shrink-0 ring-1 ring-slate-200/80"
        />
        <div className="min-w-0">
          <p className="truncate text-base font-semibold tracking-tight text-slate-900">{name}</p>
          <p className="truncate text-sm text-slate-500">{role}</p>
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
        'group flex items-center gap-3 rounded-sm px-3 py-2.5 text-sm leading-snug transition-colors duration-150',
        isActive
          ? 'bg-primary/10 font-medium text-primary'
          : 'font-normal text-slate-600 hover:bg-slate-50 hover:text-slate-900',
      )}
    >
      <Icon
        className={cn(
          'h-4.5 w-4.5 shrink-0 transition-colors',
          isActive ? 'text-primary' : 'text-slate-400 group-hover:text-slate-600',
        )}
        strokeWidth={isActive ? 2.25 : 2}
      />
      <span className="truncate">{item.label}</span>
      {item.badge ? (
        <span
          className={cn(
            'ml-auto rounded-sm px-1.5 py-0.5 text-xs font-semibold tabular-nums',
            isActive ? 'bg-primary/15 text-primary' : 'bg-slate-100 text-slate-600',
          )}
        >
          {item.badge}
        </span>
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
    <nav className="space-y-5 pt-4">
      {groups.map((group) => (
        <div key={group.title}>
          <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">
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

export function SidebarPanel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'flex flex-col overflow-hidden rounded-lg border border-slate-200/90 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_4px_16px_rgba(15,23,42,0.04)]',
        className,
      )}
    >
      {children}
    </div>
  );
}
