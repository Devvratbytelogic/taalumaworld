'use client';

import { useState } from 'react';
import { GraduationCap, Building2, BookOpen, BarChart3, MessageSquare, Clock } from 'lucide-react';
import { useGetAllInstitutionsQuery } from '@/store/rtkQueries/institutionApi';
import { InstitutionRegistryTab } from './InstitutionRegistryTab';
import { BlueprintAccessTab } from './BlueprintAccessTab';
import { PromotionConfigTab } from './PromotionConfigTab';
import { UsageReportTab } from './UsageReportTab';
import { RegistrationPromptTab } from './RegistrationPromptTab';

type Tab = 'registry' | 'blueprints' | 'promotions' | 'usage' | 'prompt';

const TABS: { id: Tab; label: string; icon: React.ElementType; description: string }[] = [
    {
        id: 'registry',
        label: 'Institution Registry',
        icon: Building2,
        description: 'Register and manage partner universities',
    },
    {
        id: 'blueprints',
        label: 'Blueprint Access',
        icon: BookOpen,
        description: 'Configure blueprints per institution',
    },
    {
        id: 'promotions',
        label: 'Promotions',
        icon: Clock,
        description: 'Promotional periods and expiry control',
    },
    {
        id: 'usage',
        label: 'Usage Report',
        icon: BarChart3,
        description: 'Registrations, conversions & analytics',
    },
    {
        id: 'prompt',
        label: 'Registration Prompt',
        icon: MessageSquare,
        description: 'Customise the student registration message',
    },
];

export function AdminInstitutionsTab() {
    const [activeTab, setActiveTab] = useState<Tab>('registry');
    const { data } = useGetAllInstitutionsQuery();
    const institutions = data?.data ?? [];
    const activeCount = institutions.filter((i) => i.status === 'active').length;

    return (
        <div className="space-y-8">
            {/* Page header */}
            <div className="bg-white rounded-3xl p-8 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                            <GraduationCap className="h-7 w-7 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-foreground mb-1">
                                University Partnerships
                            </h1>
                            <p className="text-muted-foreground text-sm">
                                Institutional access program — manage partner universities, promotional periods, and student access
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <div className="bg-accent rounded-2xl px-5 py-3 text-center">
                            <p className="text-2xl font-bold text-primary">{institutions.length}</p>
                            <p className="text-xs text-muted-foreground">Partners</p>
                        </div>
                        <div className="bg-green-50 rounded-2xl px-5 py-3 text-center">
                            <p className="text-2xl font-bold text-green-600">{activeCount}</p>
                            <p className="text-xs text-muted-foreground">Active</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tab navigation */}
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

            {/* Tab description */}
            <div className="text-sm text-muted-foreground">
                {TABS.find((t) => t.id === activeTab)?.description}
            </div>

            {/* Active tab content */}
            {activeTab === 'registry' && <InstitutionRegistryTab />}
            {activeTab === 'blueprints' && <BlueprintAccessTab />}
            {activeTab === 'promotions' && <PromotionConfigTab />}
            {activeTab === 'usage' && <UsageReportTab />}
            {activeTab === 'prompt' && <RegistrationPromptTab />}
        </div>
    );
}
