import { DollarSign } from 'lucide-react';
import { Badge } from '../../ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../ui/table';

export interface PaymentEntry {
  id: string;
  user: string;
  item: string;
  type: 'chapter' | 'book';
  amount: number;
  date: string;
  status: string;
}

interface PaymentListingProps {
  payments: PaymentEntry[];
  searchQuery?: string;
}

export function PaymentListing({ payments, searchQuery = '' }: PaymentListingProps) {
  return (
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
          {payments.map((payment) => (
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
                <Badge
                  variant="outline"
                  className="bg-green-50 text-green-700 border-green-200"
                >
                  {payment.status || 'completed'}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {payments.length === 0 && (
        <div className="p-12">
          <div className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-accent rounded-full flex items-center justify-center">
              <DollarSign className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h3 className="font-bold">No payments found</h3>
              <p className="text-muted-foreground">
                {searchQuery
                  ? 'Try adjusting your search query'
                  : 'There are no payments to display'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
