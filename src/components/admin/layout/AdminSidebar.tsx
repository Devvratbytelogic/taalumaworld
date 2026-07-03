'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { X } from 'lucide-react';
import { cn } from '@/components/ui/utils';
import { useGetAdminProfileQuery } from '@/store/rtkQueries/adminGetApi';
import {
  ADMIN_SIDEBAR_WIDTH,
  SidebarNavGroups,
  SidebarRoleCard,
  type SidebarNavGroup,
} from '@/components/admin/layout/PanelSidebar';

interface AdminSidebarProps {
  groups: SidebarNavGroup[];
  mobileMenuOpen: boolean;
  onCloseMobileMenu: () => void;
}

export function AdminSidebar({ groups, mobileMenuOpen, onCloseMobileMenu }: AdminSidebarProps) {
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);
  const { data: profileData } = useGetAdminProfileQuery();

  const name = profileData?.data?.name ?? 'Admin User';
  const role = profileData?.data?.role?.name ?? 'Admin';
  const avatar = profileData?.data?.profile_pic ?? '';

  useEffect(() => {
    if (mobileMenuOpen) setIsMounted(true);
  }, [mobileMenuOpen]);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const roleCard = <SidebarRoleCard name={name} role={role} avatar={avatar} />;
  const navGroups = (
    <SidebarNavGroups groups={groups} pathname={pathname} onNavigate={onCloseMobileMenu} />
  );

  return (
    <>
      <aside
        style={{ width: ADMIN_SIDEBAR_WIDTH }}
        className="hidden lg:fixed lg:left-0 lg:top-(--admin-header-height) lg:z-30 lg:flex lg:h-[calc(100vh-var(--admin-header-height))] lg:flex-col lg:border-r lg:border-slate-200 lg:bg-white"
      >
        <div className="shrink-0 p-3">{roleCard}</div>
        <div className="custom_scrollbar min-h-0 flex-1 overflow-y-auto px-2 pb-4">
          {navGroups}
        </div>
      </aside>

      {isMounted && (
        <>
          <div
            className={cn(
              'fixed inset-0 z-60 bg-slate-900/20 backdrop-blur-[1px] transition-opacity duration-200 lg:hidden',
              mobileMenuOpen ? 'opacity-100' : 'pointer-events-none opacity-0',
            )}
            onClick={onCloseMobileMenu}
            aria-hidden="true"
          />

          <div
            className={cn(
              'fixed top-0 left-0 z-70 flex h-full w-[min(18rem,88vw)] flex-col border-r border-slate-200 bg-white transition-transform duration-200 ease-out lg:hidden',
              mobileMenuOpen ? 'translate-x-0' : '-translate-x-full',
            )}
            onTransitionEnd={() => {
              if (!mobileMenuOpen) setIsMounted(false);
            }}
          >
            <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3.5">
              <p className="text-sm font-semibold text-slate-900">Menu</p>
              <button
                type="button"
                onClick={onCloseMobileMenu}
                className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="custom_scrollbar flex-1 overflow-y-auto p-3">
              {roleCard}
              {navGroups}
            </div>
          </div>
        </>
      )}
    </>
  );
}
