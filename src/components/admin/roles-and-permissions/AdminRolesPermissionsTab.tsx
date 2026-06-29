'use client';

import { useState } from 'react';
import { Shield, Grid3X3, UserCog, Users } from 'lucide-react';
import { useGetAllRolesQuery } from '@/store/rtkQueries/rolesPermissionsApi';
import { RolesRegistryTab } from './RolesRegistryTab';
import { PermissionsMatrixTab } from './PermissionsMatrixTab';
import { StaffAssignmentsTab } from './StaffAssignmentsTab';
import { UserSegmentsTab } from './UserSegmentsTab';

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

    return (
        <div className="space-y-8">
            <div className="bg-white rounded-3xl p-8 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                            <Shield className="h-7 w-7 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-foreground mb-1">
                                Roles &amp; Permissions
                            </h1>
                            <p className="text-muted-foreground text-sm">
                                Central RBAC — manage roles, permissions, and user segments across the platform
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <div className="bg-accent rounded-2xl px-5 py-3 text-center">
                            <p className="text-2xl font-bold text-primary">{roles.length}</p>
                            <p className="text-xs text-muted-foreground">Roles</p>
                        </div>
                        <div className="bg-blue-50 rounded-2xl px-5 py-3 text-center">
                            <p className="text-2xl font-bold text-blue-600">4</p>
                            <p className="text-xs text-muted-foreground">User Segments</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-2 flex flex-wrap gap-1">
                {TABS.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all flex-1 sm:flex-none justify-center sm:justify-start ${
                                isActive
                                    ? 'bg-primary text-white shadow-sm'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            }`}
                        >
                            <Icon className="h-4 w-4 shrink-0" />
                            <span className="hidden sm:inline">{tab.label}</span>
                        </button>
                    );
                })}
            </div>

            <div className="text-sm text-muted-foreground">
                {TABS.find((t) => t.id === activeTab)?.description}
            </div>

            {activeTab === 'roles' && <RolesRegistryTab />}
            {activeTab === 'permissions' && <PermissionsMatrixTab />}
            {activeTab === 'staff' && <StaffAssignmentsTab />}
            {activeTab === 'segments' && <UserSegmentsTab />}
        </div>
    );
}
