'use client';

import { Users, GraduationCap, BookOpen, ShieldCheck, FileText } from 'lucide-react';
import { useGetUserSegmentsQuery } from '@/store/rtkQueries/rolesPermissionsApi';
import type { IUserSegment, UserSegmentType } from '@/types/rolesPermissions';
import { Badge } from '@/components/ui/badge';

const SEGMENT_ICONS: Record<UserSegmentType, React.ElementType> = {
    career_architect: Users,
    institutional_career_architect: GraduationCap,
    mentor: BookOpen,
    administrator: ShieldCheck,
};

export function UserSegmentsTab() {
    const { data, isLoading } = useGetUserSegmentsQuery();
    const segments: IUserSegment[] = data?.data ?? [];

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="rounded-3xl shadow-sm p-6 h-48 animate-pulse bg-gray-100" />
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <p className="text-sm text-muted-foreground">
                Each user category has distinct permissions, dashboards, and Terms &amp; Conditions.
                All users must accept applicable T&amp;Cs before accessing the platform.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {segments.map((segment) => {
                    const Icon = SEGMENT_ICONS[segment.id];
                    return (
                        <div key={segment.id} className="bg-white rounded-3xl shadow-sm p-6 space-y-4">
                            <div className="flex items-start gap-4">
                                <div className="w-11 h-11 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                                    <Icon className="h-5 w-5 text-primary" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between gap-2">
                                        <h3 className="font-semibold text-gray-900">{segment.name}</h3>
                                        <Badge variant="secondary">{segment.user_count.toLocaleString()} users</Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground mt-1">{segment.description}</p>
                                </div>
                            </div>

                            <div className="space-y-2 pt-2 border-t border-gray-100">
                                <div className="flex items-center gap-2 text-sm">
                                    <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                                    <span className="text-muted-foreground">Terms:</span>
                                    <span className="font-medium">{segment.terms_document}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <ShieldCheck className="h-4 w-4 text-muted-foreground shrink-0" />
                                    <span className="text-muted-foreground">Dashboard:</span>
                                    <span className="font-medium">{segment.dashboard}</span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
