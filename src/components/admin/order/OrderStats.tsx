'use client';

import { ShoppingBag, TrendingUp, CheckCircle2, DollarSign } from 'lucide-react';
import { Card } from '../../ui/card';
import type { Summary } from '@/types/order';

interface OrderStatsProps {
    summary: Summary;
}

export function OrderStats({ summary }: OrderStatsProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="p-4 admin-surface border">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-50 rounded-lg flex items-center justify-center">
                        <DollarSign className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Total Revenue</p>
                        <p className="text-2xl font-bold">KSH {(summary.totalRevenue ?? 0).toFixed(2)}</p>
                    </div>
                </div>
            </Card>

            <Card className="p-4 admin-surface border">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 rounded-lg">
                        <ShoppingBag className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Total Orders</p>
                        <p className="text-2xl font-bold">{summary.totalOrders ?? 0}</p>
                    </div>
                </div>
            </Card>

            <Card className="p-4 admin-surface border">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-50 rounded-lg">
                        <CheckCircle2 className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Completed Orders</p>
                        <p className="text-2xl font-bold">{summary.completedOrders ?? 0}</p>
                    </div>
                </div>
            </Card>

            <Card className="p-4 admin-surface border">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-50 rounded-lg">
                        <TrendingUp className="h-5 w-5 text-amber-600" />
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Paid Orders</p>
                        <p className="text-2xl font-bold">{summary.paidOrders ?? 0}</p>
                    </div>
                </div>
            </Card>
        </div>
    );
}
