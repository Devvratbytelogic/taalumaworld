'use client';

import { useEffect, useState } from 'react';
import { Shield, Grid3X3, UserCog, Lock } from 'lucide-react';
import { RolesRegistryTab } from './RolesRegistryTab';
import { PermissionsMatrixTab } from './PermissionsMatrixTab';
import { StaffAssignmentsTab } from './StaffAssignmentsTab';
import { AdminEmptyState, AdminPage, AdminPageHeader, adminPanelClass } from '@/components/admin/layout/AdminContent';
import { useAdminPermissions } from '@/hooks/useAdminPermissions';

type Tab = 'roles' | 'permissions' | 'staff';

const TABS: { model: string; id: Tab; label: string; icon: React.ElementType; description: string }[] = [
  {
    model: 'Roles',
    id: 'roles',
    label: 'Roles Registry',
    icon: Shield,
    description: 'Create, edit, and delete roles',
  },
  {
    model: 'Permissions',
    id: 'permissions',
    label: 'Permissions Matrix',
    icon: Grid3X3,
    description: 'Adjust role permissions dynamically without code changes',
  },
  {
    model: 'Staff',
    id: 'staff',
    label: 'Staff',
    icon: UserCog,
    description: 'Assign roles to staff members',
  },
];

export function AdminRolesPermissionsTab() {
  const { hasAccess, isLoading } = useAdminPermissions();
  const visibleTabs = TABS.filter((tab) => hasAccess(tab.model));
  const [activeTab, setActiveTab] = useState<Tab>('roles');

  useEffect(() => {
    if (isLoading || visibleTabs.some((tab) => tab.id === activeTab)) return;
    if (visibleTabs.length > 0) setActiveTab(visibleTabs[0].id);
  }, [isLoading, visibleTabs, activeTab]);

  return (
    <AdminPage>
      <AdminPageHeader
        title="Roles & Permissions"
        description="Central RBAC — manage roles, permissions, and user segments across the platform"
      />

      {visibleTabs.length === 0 && !isLoading ? (
        <AdminEmptyState
          icon={Lock}
          title="No access"
          description="You don't have permission to view any section of Roles & Permissions."
        />
      ) : (
        <>
          <div className={`${adminPanelClass} p-1.5`}>
            <div className="flex flex-wrap gap-1">
              {visibleTabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`inline-flex flex-1 sm:flex-none items-center justify-center sm:justify-start gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-primary text-white shadow-sm'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span className="hidden sm:inline">{tab.label}</span>
                    <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {activeTab === 'roles' && <RolesRegistryTab />}
          {activeTab === 'permissions' && <PermissionsMatrixTab />}
          {activeTab === 'staff' && <StaffAssignmentsTab embedded />}
        </>
      )}
    </AdminPage>
  );
}
