'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { X } from 'lucide-react';
import { cn } from '@/components/ui/utils';
import { useGetAdminProfileQuery } from '@/store/rtkQueries/adminGetApi';
import {
  SidebarNavGroups,
  SidebarPanel,
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

  const sidebarContent = (
    <>
      <SidebarRoleCard name={name} role={role} avatar={avatar} />
      <SidebarNavGroups groups={groups} pathname={pathname} onNavigate={onCloseMobileMenu} />
    </>
  );

  return (
    <>
      <aside className="hidden lg:block lg:w-70 shrink-0">
        <div className="sticky top-24">
          <SidebarPanel>{sidebarContent}</SidebarPanel>
        </div>
      </aside>

      {isMounted && (
        <>
          <div
            className={cn(
              'fixed inset-0 z-60 bg-black/40 backdrop-blur-[2px] transition-opacity duration-300 lg:hidden',
              mobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none',
            )}
            onClick={onCloseMobileMenu}
            aria-hidden="true"
          />

          <div
            className={cn(
              'fixed top-0 left-0 z-70 flex h-full w-[min(20rem,88vw)] flex-col bg-white shadow-2xl transition-transform duration-300 ease-out lg:hidden',
              mobileMenuOpen ? 'translate-x-0' : '-translate-x-full',
            )}
            onTransitionEnd={() => {
              if (!mobileMenuOpen) setIsMounted(false);
            }}
          >
            <div className="flex items-center justify-between border-b border-border/60 px-5 py-4">
              <p className="text-sm font-semibold">Navigation</p>
              <button
                type="button"
                onClick={onCloseMobileMenu}
                className="rounded-full p-2 hover:bg-muted"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">{sidebarContent}</div>
          </div>
        </>
      )}
    </>
  );
}
