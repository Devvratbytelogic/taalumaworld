import { Card } from '../../ui/card';
import { Badge } from '../../ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../ui/table';

export interface TransactionEntry {
  id: string;
  user: string;
  amount: number;
  item: string;
  status: string;
  date: string;
}

interface TransactionListingProps {
  transactions: TransactionEntry[];
}

export function TransactionListing({
  transactions,
}: TransactionListingProps) {
  return (
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
              <TableCell className="font-medium">
                ${txn.amount.toFixed(2)}
              </TableCell>
              <TableCell>
                <Badge
                  variant={
                    txn.status === 'completed' ? 'default' : 'secondary'
                  }
                >
                  {txn.status || 'pending'}
                </Badge>
              </TableCell>
              <TableCell>{txn.date}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
