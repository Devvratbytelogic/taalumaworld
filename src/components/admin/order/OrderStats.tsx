'use client';

import { ShoppingBag, TrendingUp, DollarSign } from 'lucide-react';
import { Card } from '../../ui/card';
import type { IOrderEntity } from '@/types/order';

interface OrderStatsProps {
    totalOrders: number;
    pageOrders: IOrderEntity[];
}

export function OrderStats({ totalOrders, pageOrders }: OrderStatsProps) {
    const pageRevenue = pageOrders.reduce((sum, o) => sum + (o.totalAmount ?? 0), 0);
    const avgOrder = pageOrders.length > 0 ? pageRevenue / pageOrders.length : 0;

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4 bg-white rounded-3xl shadow-sm border">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-50 rounded-lg flex items-center justify-center">
                        <DollarSign className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Page Revenue</p>
                        <p className="text-2xl font-bold">KSH {pageRevenue.toFixed(2)}</p>
                    </div>
                </div>
            </Card>

            <Card className="p-4 bg-white rounded-3xl shadow-sm border">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 rounded-lg">
                        <ShoppingBag className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Total Orders</p>
                        <p className="text-2xl font-bold">{totalOrders}</p>
                    </div>
                </div>
            </Card>

            <Card className="p-4 bg-white rounded-3xl shadow-sm border">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-50 rounded-lg">
                        <TrendingUp className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Avg. Order Value</p>
                        <p className="text-2xl font-bold">KSH {avgOrder.toFixed(2)}</p>
                    </div>
                </div>
            </Card>
        </div>
    );
}
