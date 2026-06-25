'use client';

import { useState } from 'react';
import { Download, TrendingUp, Users, BookOpen, RefreshCw } from 'lucide-react';
import {
    useGetInstitutionUsageReportQuery,
    useGetAllInstitutionsQuery,
} from '@/store/rtkQueries/institutionApi';
import type { IInstitution } from '@/types/institution';
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';

function ConversionBar({ rate }: { rate: number }) {
    const pct = Math.min(100, Math.max(0, rate));
    return (
        <div className="flex items-center gap-2">
            <div className="flex-1 bg-gray-100 rounded-full h-2">
                <div
                    className="bg-primary h-2 rounded-full"
                    style={{ width: `${pct}%` }}
                />
            </div>
            <span className="text-xs font-medium w-10 text-right">{pct.toFixed(1)}%</span>
        </div>
    );
}

export function UsageReportTab() {
    const [selectedId, setSelectedId] = useState<string>('all');

    const { data: reportData, isLoading: loadingReport, refetch } = useGetInstitutionUsageReportQuery();
    const { data: instData, isLoading: loadingInst } = useGetAllInstitutionsQuery();

    const institutions: IInstitution[] = instData?.data ?? [];
    const stats = reportData?.data ?? [];

    const filteredStats = selectedId === 'all'
        ? stats
        : stats.filter((s) => s.institution_id === selectedId);

    const totalReg = filteredStats.reduce((s, r) => s + r.total_registrations, 0);
    const totalActive = filteredStats.reduce((s, r) => s + r.active_users, 0);
    const totalViews = filteredStats.reduce((s, r) => s + r.blueprint_views, 0);
    const totalConv = filteredStats.reduce((s, r) => s + r.paid_conversions, 0);
    const avgConvRate = filteredStats.length
        ? filteredStats.reduce((s, r) => s + r.conversion_rate, 0) / filteredStats.length
        : 0;

    const loading = loadingReport || loadingInst;

    const handleExportCSV = () => {
        const rows = [
            ['Institution', 'Registrations', 'Active Users', 'Blueprint Views', 'Paid Conversions', 'Conversion Rate %'],
            ...filteredStats.map((r) => [
                r.institution_name,
                String(r.total_registrations),
                String(r.active_users),
                String(r.blueprint_views),
                String(r.paid_conversions),
                r.conversion_rate.toFixed(2),
            ]),
        ];
        const csv = rows.map((r) => r.map((v) => `"${v}"`).join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'institution-usage-report.csv';
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="space-y-6">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
                <div className="flex items-center gap-3">
                    <select
                        value={selectedId}
                        onChange={(e) => setSelectedId(e.target.value)}
                        className="border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                        <option value="all">All Institutions</option>
                        {institutions.map((i) => (
                            <option key={i._id} value={i._id}>{i.name}</option>
                        ))}
                    </select>
                    <button
                        onClick={() => refetch()}
                        className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
                        title="Refresh"
                    >
                        <RefreshCw className="h-4 w-4 text-gray-500" />
                    </button>
                </div>
                <button
                    onClick={handleExportCSV}
                    disabled={loading || filteredStats.length === 0}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-primary text-primary text-sm font-medium hover:bg-primary/5 transition-colors disabled:opacity-50"
                >
                    <Download className="h-4 w-4" /> Export CSV
                </button>
            </div>

            {/* Summary KPIs */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'Total Registrations', value: totalReg, icon: Users, color: 'blue' },
                    { label: 'Active Users', value: totalActive, icon: Users, color: 'green' },
                    { label: 'Blueprint Views', value: totalViews, icon: BookOpen, color: 'purple' },
                    { label: 'Paid Conversions', value: totalConv, icon: TrendingUp, color: 'amber' },
                ].map((card) => (
                    <div key={card.label} className="bg-white rounded-2xl shadow-sm p-5 space-y-2">
                        <div className={`w-9 h-9 rounded-xl bg-${card.color}-100 flex items-center justify-center`}>
                            <card.icon className={`h-5 w-5 text-${card.color}-600`} />
                        </div>
                        {loading ? (
                            <div className="h-8 bg-gray-100 rounded animate-pulse" />
                        ) : (
                            <p className="text-2xl font-bold">{card.value.toLocaleString()}</p>
                        )}
                        <p className="text-xs text-muted-foreground">{card.label}</p>
                    </div>
                ))}
            </div>

            {/* Avg conversion rate */}
            {!loading && (
                <div className="bg-primary/5 rounded-2xl p-5 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <TrendingUp className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                        <p className="text-sm font-medium text-gray-700">Average Paid Conversion Rate</p>
                        <ConversionBar rate={avgConvRate} />
                    </div>
                    <p className="text-2xl font-bold text-primary">{avgConvRate.toFixed(1)}%</p>
                </div>
            )}

            {/* Table */}
            <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-8">#</TableHead>
                            <TableHead>Institution</TableHead>
                            <TableHead className="text-right">Registrations</TableHead>
                            <TableHead className="text-right">Active</TableHead>
                            <TableHead className="text-right">BP Views</TableHead>
                            <TableHead className="text-right">Conversions</TableHead>
                            <TableHead>Conversion Rate</TableHead>
                            <TableHead className="text-right">Days Left</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading
                            ? Array.from({ length: 5 }).map((_, i) => (
                                <TableRow key={i}>
                                    {Array.from({ length: 8 }).map((__, j) => (
                                        <TableCell key={j}>
                                            <div className="h-4 bg-gray-100 rounded animate-pulse" />
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                            : filteredStats.map((row, idx) => (
                                <TableRow key={row.institution_id}>
                                    <TableCell className="text-muted-foreground text-sm">{idx + 1}</TableCell>
                                    <TableCell className="font-medium text-sm">{row.institution_name}</TableCell>
                                    <TableCell className="text-right text-sm">{row.total_registrations.toLocaleString()}</TableCell>
                                    <TableCell className="text-right text-sm">{row.active_users.toLocaleString()}</TableCell>
                                    <TableCell className="text-right text-sm">{row.blueprint_views.toLocaleString()}</TableCell>
                                    <TableCell className="text-right text-sm font-medium text-green-600">{row.paid_conversions.toLocaleString()}</TableCell>
                                    <TableCell className="min-w-[160px]">
                                        <ConversionBar rate={row.conversion_rate} />
                                    </TableCell>
                                    <TableCell className="text-right text-sm">
                                        {row.days_remaining < 0 ? (
                                            <span className="text-red-500 text-xs">Expired</span>
                                        ) : (
                                            <span className={row.days_remaining <= 7 ? 'text-red-500 font-medium' : ''}>
                                                {row.days_remaining}d
                                            </span>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>

                {!loading && filteredStats.length === 0 && (
                    <div className="p-12 text-center">
                        <BookOpen className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                        <p className="text-sm text-muted-foreground">No usage data available yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
