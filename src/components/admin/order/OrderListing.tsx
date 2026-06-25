'use client';

import { useState } from 'react';
import { ShoppingBag, Download, Loader2 } from 'lucide-react';
import { Tooltip, addToast } from '@heroui/react';
import Cookies from 'js-cookie';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '../../ui/table';
import type { IOrderEntity } from '@/types/order';
import { API_BASE_URL } from '@/utils/config';


function PaymentStatusBadge({ status }: { status: string }) {
    const s = (status || '').toLowerCase();
    const styles: Record<string, string> = {
        paid:    'bg-emerald-100 text-emerald-700 border-emerald-200',
        unpaid:  'bg-red-100 text-red-700 border-red-200',
        partial: 'bg-amber-100 text-amber-700 border-amber-200',
    };
    const cls = styles[s] ?? 'bg-gray-100 text-gray-600 border-gray-200';
    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${cls}`}>
            {status || '—'}
        </span>
    );
}

function DownloadInvoiceButton({ orderId, orderNumber }: { orderId: string; orderNumber: number }) {
    const [isDownloading, setIsDownloading] = useState(false);

    async function handleDownload() {
        setIsDownloading(true);
        try {
            const token = Cookies.get('auth_token') || '';
            const deviceId = Cookies.get('device') || '';
            const userId = Cookies.get('userID') || '';
            const res = await fetch(`${API_BASE_URL}/admin/invoice/${orderId}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                    device: deviceId,
                    userID: userId,
                },
            });
            if (!res.ok) throw new Error('Failed to download invoice');
            const blob = await res.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `invoice-${orderNumber}.pdf`;
            a.click();
            URL.revokeObjectURL(url);
        } catch {
            addToast({ title: 'Error', description: 'Failed to download invoice', color: 'danger', timeout: 2000 });
        } finally {
            setIsDownloading(false);
        }
    }

    return (
        <button
            type="button"
            disabled={isDownloading}
            onClick={handleDownload}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-primary/10 text-primary hover:bg-primary/20 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
            {isDownloading
                ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                : <Download className="h-3.5 w-3.5" />
            }
            Invoice
        </button>
    );
}

interface OrderListingProps {
    orders: IOrderEntity[];
    searchQuery?: string;
    orderType: 'books' | 'blueprints';
}

export function OrderListing({ orders, searchQuery = '', orderType }: OrderListingProps) {
    const emptyLabel = orderType === 'books' ? 'book orders' : 'blueprint orders';

    return (
        <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Order #</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Items</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Payment</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {orders.map((order) => {
                        const firstItem = order.items?.[0];
                        const extraCount = (order.items?.length ?? 0) - 1;
                        return (
                            <TableRow key={order.id}>
                                <TableCell>
                                    <div className="font-semibold text-sm">#{order.orderNumber}</div>
                                    {/* <div className="text-xs text-muted-foreground">Inv #{order.invoiceNumber}</div> */}
                                </TableCell>
                                <TableCell>
                                    <div className="font-medium text-sm max-w-32 truncate">{order.customer?.name ?? '—'}</div>
                                    <div className="text-xs text-muted-foreground max-w-40 truncate">{order.customer?.email ?? '—'}</div>
                                </TableCell>
                                <TableCell className="max-w-48">
                                    {firstItem ? (
                                        <div>
                                            <div className="text-sm truncate max-w-44">{firstItem.title}</div>
                                            {extraCount > 0 && (
                                                <Tooltip
                                                    content={
                                                        <div className="py-1 px-0.5 space-y-1.5 max-w-56">
                                                            {order.items.slice(1).map((item) => (
                                                                <div key={item.id} className="flex items-center gap-2">
                                                                    <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                                                                    <span className="text-xs leading-snug">{item.title}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    }
                                                    placement="right"
                                                    delay={100}
                                                    closeDelay={0}
                                                >
                                                    <span className="cursor-default text-xs text-primary font-medium underline decoration-dotted underline-offset-2">
                                                        +{extraCount} more
                                                    </span>
                                                </Tooltip>
                                            )}
                                        </div>
                                    ) : '—'}
                                </TableCell>
                                <TableCell className="font-medium whitespace-nowrap">
                                    KSH {(order.totalAmount ?? 0).toFixed(2)}
                                </TableCell>
                                <TableCell>
                                    <div className="text-xs text-muted-foreground mb-1">{order.paymentMethod}</div>
                                    <PaymentStatusBadge status={order.paymentStatus} />
                                </TableCell>
                                <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                                    {order.createdAt}
                                </TableCell>
                                <TableCell>
                                    <DownloadInvoiceButton orderId={order.id} orderNumber={order.orderNumber} />
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>

            {orders.length === 0 && (
                <div className="p-12">
                    <div className="text-center space-y-4">
                        <div className="mx-auto w-16 h-16 bg-accent rounded-full flex items-center justify-center">
                            <ShoppingBag className="h-8 w-8 text-primary" />
                        </div>
                        <div>
                            <h3 className="font-bold">No orders found</h3>
                            <p className="text-muted-foreground">
                                {searchQuery
                                    ? 'Try adjusting your search query'
                                    : `There are no ${emptyLabel} to display`}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
