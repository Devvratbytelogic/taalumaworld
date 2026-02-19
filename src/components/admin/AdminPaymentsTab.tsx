import { useState } from 'react';
import { DollarSign, Search, Download } from 'lucide-react';
import Button from '../ui/Button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';

interface AdminPaymentsTabProps {
  contentMode: 'chapters' | 'books';
}

// Mock payment data
const mockPayments = [
  {
    id: 'PAY-001',
    user: 'Sarah Johnson',
    item: 'Introduction to Career Growth',
    type: 'chapter',
    amount: 4.99,
    date: '2024-01-20',
    status: 'completed',
  },
  {
    id: 'PAY-002',
    user: 'Michael Chen',
    item: 'Professional Development 101',
    type: 'book',
    amount: 29.99,
    date: '2024-01-19',
    status: 'completed',
  },
  {
    id: 'PAY-003',
    user: 'Emily Rodriguez',
    item: 'Leadership Essentials',
    type: 'chapter',
    amount: 4.99,
    date: '2024-01-18',
    status: 'completed',
  },
];

export function AdminPaymentsTab({ contentMode }: AdminPaymentsTabProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPayments = mockPayments.filter(payment =>
    payment.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
    payment.item.toLowerCase().includes(searchQuery.toLowerCase()) ||
    payment.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalRevenue = mockPayments.reduce((sum, payment) => sum + payment.amount, 0);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="bg-white rounded-3xl p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Payment Reports
            </h1>
            <p className="text-muted-foreground">
              Track all transactions and revenue
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="text-lg px-4 py-2">
              Total Revenue: ${totalRevenue.toFixed(2)}
            </Badge>
            <Button className="gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-3xl p-6 shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search payments by user, item, or transaction ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Transaction ID</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Item</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPayments.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell className="font-mono text-sm">{payment.id}</TableCell>
                <TableCell className="font-medium">{payment.user}</TableCell>
                <TableCell>{payment.item}</TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {payment.type === 'chapter' ? 'Focus Area' : 'Book'}
                  </Badge>
                </TableCell>
                <TableCell className="font-semibold text-primary">
                  ${payment.amount.toFixed(2)}
                </TableCell>
                <TableCell>{payment.date}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    {payment.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
