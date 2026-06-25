'use client';

import { useDispatch } from 'react-redux';
import { Button } from '@heroui/react';
import { Calendar, Clock, AlertTriangle, CheckCircle, XCircle, ChevronRight } from 'lucide-react';
import {
    useGetAllInstitutionsQuery,
    useSuspendInstitutionMutation,
    useRestoreInstitutionMutation,
    useTerminateInstitutionMutation,
} from '@/store/rtkQueries/institutionApi';
import { openModal } from '@/store/slices/allModalSlice';
import type { IInstitution } from '@/types/institution';
import toast from '@/utils/toast';
import { Badge } from '@/components/ui/badge';

function formatDate(iso?: string) {
    if (!iso) return '—';
    return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

function daysUntil(iso?: string): number | null {
    if (!iso) return null;
    return Math.ceil((new Date(iso).getTime() - Date.now()) / 86_400_000);
}

function ExpiryIndicator({ days }: { days: number | null }) {
    if (days === null) return <span className="text-muted-foreground text-sm">—</span>;
    if (days < 0)
        return <Badge className="bg-red-100 text-red-700 border-red-200 text-xs">Expired</Badge>;
    if (days <= 1)
        return <Badge className="bg-red-100 text-red-700 border-red-200 text-xs">{days}d left — Critical</Badge>;
    if (days <= 7)
        return <Badge className="bg-amber-100 text-amber-700 border-amber-200 text-xs">{days}d left — Urgent</Badge>;
    if (days <= 30)
        return <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200 text-xs">{days}d left</Badge>;
    return <Badge className="bg-green-100 text-green-700 border-green-200 text-xs">{days}d left</Badge>;
}

export function PromotionConfigTab() {
    const dispatch = useDispatch();

    const { data, isLoading } = useGetAllInstitutionsQuery();
    const [suspend] = useSuspendInstitutionMutation();
    const [restore] = useRestoreInstitutionMutation();
    const [terminate] = useTerminateInstitutionMutation();

    const institutions: IInstitution[] = data?.data ?? [];

    const sorted = [...institutions].sort((a, b) => {
        const dA = daysUntil(a.promotional_access?.end_date) ?? Infinity;
        const dB = daysUntil(b.promotional_access?.end_date) ?? Infinity;
        return dA - dB;
    });

    return (
        <div className="space-y-6">
            {/* Reminder info */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800 space-y-1">
                <p className="font-semibold flex items-center gap-2">
                    <Clock className="h-4 w-4" /> Automated Expiry Reminders
                </p>
                <p>
                    The system automatically sends reminder emails to institutional users at{' '}
                    <strong>30 days</strong>, <strong>7 days</strong>, and <strong>1 day</strong> before
                    their promotional access expires. Upon expiry, users are redirected to re-access
                    content at the configured price.
                </p>
            </div>

            {/* Summary cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    {
                        label: 'Expiring in ≤ 7d',
                        value: sorted.filter((i) => { const d = daysUntil(i.promotional_access?.end_date); return d !== null && d >= 0 && d <= 7; }).length,
                        color: 'red',
                    },
                    {
                        label: 'Expiring in ≤ 30d',
                        value: sorted.filter((i) => { const d = daysUntil(i.promotional_access?.end_date); return d !== null && d > 7 && d <= 30; }).length,
                        color: 'amber',
                    },
                    {
                        label: 'Active & Healthy',
                        value: sorted.filter((i) => { const d = daysUntil(i.promotional_access?.end_date); return d !== null && d > 30 && i.status === 'active'; }).length,
                        color: 'green',
                    },
                    {
                        label: 'Expired / Terminated',
                        value: sorted.filter((i) => { const d = daysUntil(i.promotional_access?.end_date); return i.status === 'terminated' || (d !== null && d < 0); }).length,
                        color: 'gray',
                    },
                ].map((card) => (
                    <div
                        key={card.label}
                        className={`rounded-2xl p-4 bg-${card.color === 'green' ? 'green' : card.color === 'red' ? 'red' : card.color === 'amber' ? 'amber' : 'gray'}-50`}
                    >
                        <p className={`text-2xl font-bold text-${card.color === 'green' ? 'green' : card.color === 'red' ? 'red' : card.color === 'amber' ? 'amber' : 'gray'}-600`}>
                            {card.value}
                        </p>
                        <p className="text-xs text-muted-foreground">{card.label}</p>
                    </div>
                ))}
            </div>

            {/* Institution list */}
            {isLoading ? (
                <div className="space-y-3">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="h-20 bg-gray-100 rounded-2xl animate-pulse" />
                    ))}
                </div>
            ) : sorted.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground text-sm">
                    No institutions registered. Add one in the Registry tab.
                </div>
            ) : (
                <div className="space-y-3">
                    {sorted.map((inst) => {
                        const days = daysUntil(inst.promotional_access?.end_date);
                        return (
                            <div
                                key={inst._id}
                                className="bg-white rounded-2xl shadow-sm p-5 flex flex-col sm:flex-row sm:items-center gap-4"
                            >
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <p className="font-semibold text-gray-900">{inst.name}</p>
                                        {inst.status === 'active' ? (
                                            <Badge className="bg-green-100 text-green-700 border-green-200 gap-1">
                                                <CheckCircle className="h-3 w-3" /> Active
                                            </Badge>
                                        ) : inst.status === 'suspended' ? (
                                            <Badge className="bg-amber-100 text-amber-700 border-amber-200 gap-1">
                                                <AlertTriangle className="h-3 w-3" /> Suspended
                                            </Badge>
                                        ) : (
                                            <Badge variant="secondary" className="gap-1">
                                                <XCircle className="h-3 w-3" /> Terminated
                                            </Badge>
                                        )}
                                        <ExpiryIndicator days={days} />
                                    </div>
                                    <div className="mt-1 flex gap-4 text-xs text-muted-foreground">
                                        <span className="flex items-center gap-1">
                                            <Calendar className="h-3 w-3" />
                                            {formatDate(inst.promotional_access?.start_date)} →{' '}
                                            {formatDate(inst.promotional_access?.end_date)}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-2 shrink-0">
                                    <Button
                                        size="sm"
                                        variant="bordered"
                                        onPress={() => dispatch(openModal({ componentName: 'ExtendPromotionModal', data: { institution: inst } }))}
                                        startContent={<ChevronRight className="h-3.5 w-3.5" />}
                                    >
                                        Extend
                                    </Button>
                                    {inst.status === 'active' && (
                                        <Button
                                            size="sm"
                                            variant="bordered"
                                            className="text-amber-600 border-amber-300"
                                            onPress={async () => {
                                                try {
                                                    await suspend({ id: inst._id }).unwrap();
                                                    toast.success('Institution suspended');
                                                } catch { /* handled */ }
                                            }}
                                        >
                                            Suspend
                                        </Button>
                                    )}
                                    {inst.status === 'suspended' && (
                                        <Button
                                            size="sm"
                                            color="success"
                                            variant="bordered"
                                            onPress={async () => {
                                                try {
                                                    await restore({ id: inst._id }).unwrap();
                                                    toast.success('Institution restored');
                                                } catch { /* handled */ }
                                            }}
                                        >
                                            Restore
                                        </Button>
                                    )}
                                    {inst.status !== 'terminated' && (
                                        <Button
                                            size="sm"
                                            variant="bordered"
                                            className="text-red-600 border-red-300"
                                            onPress={async () => {
                                                if (!confirm(`Terminate ${inst.name}?`)) return;
                                                try {
                                                    await terminate({ id: inst._id }).unwrap();
                                                    toast.success('Institution terminated');
                                                } catch { /* handled */ }
                                            }}
                                        >
                                            Terminate
                                        </Button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

        </div>
    );
}
