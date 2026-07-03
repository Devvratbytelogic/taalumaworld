'use client';

import { useState } from 'react';
import { Shield, Grid3X3, UserCog, Users } from 'lucide-react';
import { useGetAllRolesQuery } from '@/store/rtkQueries/rolesPermissionsApi';
import { RolesRegistryTab } from './RolesRegistryTab';
import { PermissionsMatrixTab } from './PermissionsMatrixTab';
import { StaffAssignmentsTab } from './StaffAssignmentsTab';
import { UserSegmentsTab } from './UserSegmentsTab';
import { AdminPage, AdminPageHeader, adminPanelClass } from '@/components/admin/layout/AdminContent';
import { cn } from '@/components/ui/utils';

type Tab = 'roles' | 'permissions' | 'staff' | 'segments';

const TABS: { id: Tab; label: string; icon: React.ElementType; description: string }[] = [
  {
    id: 'roles',
    label: 'Roles Registry',
    icon: Shield,
    description: 'Create, edit, and delete roles',
  },
  {
    id: 'permissions',
    label: 'Permissions Matrix',
    icon: Grid3X3,
    description: 'Adjust role permissions dynamically without code changes',
  },
  {
    id: 'staff',
    label: 'Staff Assignments',
    icon: UserCog,
    description: 'Assign roles to administrators and mentors',
  },
  {
    id: 'segments',
    label: 'User Segments',
    icon: Users,
    description: 'Career Architects, Mentors, and Administrators',
  },
];

export function AdminRolesPermissionsTab() {
  const [activeTab, setActiveTab] = useState<Tab>('roles');
  const { data } = useGetAllRolesQuery();
  const roles = data?.data ?? [];
  const activeTabMeta = TABS.find((t) => t.id === activeTab);

  return (
    <AdminPage>
      <AdminPageHeader
        title="Roles & Permissions"
        description="Central RBAC — manage roles, permissions, and user segments across the platform"
      >
        <div className="flex gap-3">
          <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-center min-w-[5.5rem]">
            <p className="text-xl font-semibold tracking-tight text-slate-900">{roles.length}</p>
            <p className="text-xs text-slate-500">Roles</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-center min-w-[5.5rem]">
            <p className="text-xl font-semibold tracking-tight text-slate-900">4</p>
            <p className="text-xs text-slate-500">User Segments</p>
          </div>
        </div>
      </AdminPageHeader>

      <div className={cn(adminPanelClass, 'p-1.5')}>
        <div className="flex flex-wrap gap-1">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'inline-flex flex-1 sm:flex-none items-center justify-center sm:justify-start gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900',
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {activeTabMeta ? (
        <p className="text-sm text-slate-500">{activeTabMeta.description}</p>
      ) : null}

      {activeTab === 'roles' && <RolesRegistryTab />}
      {activeTab === 'permissions' && <PermissionsMatrixTab />}
      {activeTab === 'staff' && <StaffAssignmentsTab />}
      {activeTab === 'segments' && <UserSegmentsTab />}
    </AdminPage>
  );
}
