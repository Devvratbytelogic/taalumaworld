/**
 * Admin Transactions Tab
 * View all payment transactions
 */

import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { DollarSign, TrendingUp } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';

export function AdminTransactionsTab() {
  const transactions = [
    { id: 'TXN-001', user: 'Sarah Johnson', amount: 20.00, item: 'Leadership Fundamentals', status: 'completed', date: '2024-01-21' },
    { id: 'TXN-002', user: 'Michael Chen', amount: 35.00, item: 'Strategic Thinking', status: 'completed', date: '2024-01-21' },
    { id: 'TXN-003', user: 'Emily Rodriguez', amount: 20.00, item: 'Career Growth', status: 'pending', date: '2024-01-20' },
    { id: 'TXN-004', user: 'David Kim', amount: 40.00, item: 'Communication Skills', status: 'completed', date: '2024-01-20' },
  ];

  const totalRevenue = transactions.reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Transactions</h2>
          <p className="text-muted-foreground">View all payment transactions</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-50 rounded-lg">
              <DollarSign className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Revenue</p>
              <p className="text-2xl font-bold">${totalRevenue.toFixed(2)}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <TrendingUp className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Transactions</p>
              <p className="text-2xl font-bold">{transactions.length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-50 rounded-lg">
              <DollarSign className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Avg. Transaction</p>
              <p className="text-2xl font-bold">${(totalRevenue / transactions.length).toFixed(2)}</p>
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Transaction ID</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Item</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((txn) => (
              <TableRow key={txn.id}>
                <TableCell className="font-mono text-sm">{txn.id}</TableCell>
                <TableCell>{txn.user}</TableCell>
                <TableCell>{txn.item}</TableCell>
                <TableCell className="font-medium">${txn.amount.toFixed(2)}</TableCell>
                <TableCell>
                  <Badge variant={txn.status === 'completed' ? 'default' : 'secondary'}>
                    {txn.status}
                  </Badge>
                </TableCell>
                <TableCell>{txn.date}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
