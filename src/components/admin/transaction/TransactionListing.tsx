import { Receipt } from 'lucide-react';
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
  searchQuery?: string;
}

export function TransactionListing({
  transactions,
  searchQuery = '',
}: TransactionListingProps) {
  return (
    <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
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

      {transactions.length === 0 && (
        <div className="p-12">
          <div className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-accent rounded-full flex items-center justify-center">
              <Receipt className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h3 className="font-bold">No transactions found</h3>
              <p className="text-muted-foreground">
                {searchQuery
                  ? 'Try adjusting your search query'
                  : 'There are no transactions to display'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
