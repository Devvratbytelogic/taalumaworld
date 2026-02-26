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
}

export function PaymentListing({ payments }: PaymentListingProps) {
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
    </div>
  );
}
