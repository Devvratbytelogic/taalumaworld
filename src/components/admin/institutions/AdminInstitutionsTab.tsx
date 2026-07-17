'use client';

import { useEffect, useState } from 'react';
import { Building2, BookOpen, BarChart3, MessageSquare, Lock } from 'lucide-react';
import { AdminEmptyState, AdminPageHeader, adminPanelClass } from '@/components/admin/layout/AdminContent';
import { cn } from '@/components/ui/utils';
import { InstitutionRegistryTab } from './InstitutionRegistryTab';
import { BlueprintAccessTab } from './BlueprintAccessTab';
import { UsageReportTab } from './UsageReportTab';
import { RegistrationPromptTab } from './RegistrationPromptTab';
import { useAdminPermissions } from '@/hooks/useAdminPermissions';

type Tab = 'registry' | 'blueprints' | 'usage' | 'prompt';

const TABS: { id: Tab; model: string; label: string; icon: React.ElementType; description: string }[] = [
    {
        model: 'Institution',
        id: 'registry',
        label: 'Institution Registry',
        icon: Building2,
        description: 'Register and manage partner universities',
    },
    {
        model: 'Institution Access',
        id: 'blueprints',
        label: 'Blueprint Access',
        icon: BookOpen,
        description: 'Configure blueprints per institution',
    },
    {
        model: 'Institute Usage Report',
        id: 'usage',
        label: 'Usage Report',
        icon: BarChart3,
        description: 'Registrations, conversions & analytics',
    },
    {
        model: 'Registration Prompt',
        id: 'prompt',
        label: 'Registration Prompt',
        icon: MessageSquare,
        description: 'Customise the student registration message',
    },
];

export function AdminInstitutionsTab() {
    const { hasAccess, isLoading } = useAdminPermissions();
    const visibleTabs = TABS.filter((tab) => hasAccess(tab.model));
    const [activeTab, setActiveTab] = useState<Tab>('registry');

    useEffect(() => {
        if (isLoading || visibleTabs.some((tab) => tab.id === activeTab)) return;
        if (visibleTabs.length > 0) setActiveTab(visibleTabs[0].id);
    }, [isLoading, visibleTabs, activeTab]);

    return (
        <div className="space-y-6">
            <AdminPageHeader
                eyebrow="Institutional Access"
                title="University Partnerships"
                description="Manage partner universities, promotional periods, and student access"
            />

            {visibleTabs.length === 0 && !isLoading ? (
                <AdminEmptyState
                    icon={Lock}
                    title="No access"
                    description="You don't have permission to view any section of University Partnerships."
                />
            ) : (
                <>
                    {/* Tab navigation */}
                    <div className={cn(adminPanelClass, 'flex flex-wrap gap-1 p-1.5')}>
                        {visibleTabs.map((tab) => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    type="button"
                                    onClick={() => setActiveTab(tab.id)}
                                    className={cn(
                                        'flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all sm:flex-none sm:justify-start',
                                        isActive
                                            ? 'bg-primary text-white shadow-sm'
                                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900',
                                    )}
                                >
                                    <Icon className="h-4 w-4 shrink-0" />
                                    <span className="hidden sm:inline">{tab.label}</span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Active tab content */}
                    {activeTab === 'registry' && <InstitutionRegistryTab />}
                    {activeTab === 'blueprints' && <BlueprintAccessTab />}
                    {activeTab === 'usage' && <UsageReportTab />}
                    {activeTab === 'prompt' && <RegistrationPromptTab />}
                </>
            )}
        </div>
    );
}
