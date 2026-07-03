import { Receipt } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../ui/table';
import { AdminEmptyState, AdminTableShell } from '@/components/admin/layout/AdminContent';
import { AdminPagination } from '@/components/admin/shared/AdminPagination';

function StatusBadge({ status }: { status: string }) {
  const s = (status || 'pending').toLowerCase();
  const styles: Record<string, string> = {
    completed: 'bg-green-100 text-green-700 border-green-200',
    paid: 'bg-blue-100 text-blue-700 border-blue-200',
    failed: 'bg-red-100 text-red-700 border-red-200',
    pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    refunded: 'bg-purple-100 text-purple-700 border-purple-200',
    cancelled: 'bg-gray-100 text-gray-600 border-gray-200',
  };
  const cls = styles[s] ?? 'bg-gray-100 text-gray-600 border-gray-200';
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize ${cls}`}>
      {status || 'pending'}
    </span>
  );
}

export interface TransactionEntry {
  id: string;
  user: string;
  amount: number;
  item: string;
  type: string;
  status: string;
  date: string;
}

interface TransactionListingProps {
  transactions: TransactionEntry[];
  searchQuery?: string;
  page: number;
  pageLimit: number;
  totalTransactions: number;
  totalPages: number;
  isFetching?: boolean;
  onPageChange: (page: number) => void;
  onPageLimitChange: (limit: number) => void;
}

export function TransactionListing({
  transactions,
  searchQuery = '',
  page,
  pageLimit,
  totalTransactions,
  totalPages,
  isFetching = false,
  onPageChange,
  onPageLimitChange,
}: TransactionListingProps) {
  return (
    <>
      <AdminTableShell>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Transaction ID</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Item</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((txn, idx) => (
              <TableRow key={`${txn.id ?? 'no-id'}-${idx}`}>
                <TableCell className="font-mono text-sm max-w-36 truncate">{txn.id}</TableCell>
                <TableCell className="max-w-32 truncate">{txn.user}</TableCell>
                <TableCell className="max-w-40 truncate">{txn.item}</TableCell>
                <TableCell className="capitalize max-w-24 truncate">{txn.type}</TableCell>
                <TableCell className="font-medium whitespace-nowrap">
                  KSH {txn.amount.toFixed(2)}
                </TableCell>
                <TableCell>
                  <StatusBadge status={txn.status} />
                </TableCell>
                <TableCell className="whitespace-nowrap">{txn.date}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {transactions.length === 0 && (
          <AdminEmptyState
            icon={Receipt}
            title="No transactions found"
            description={
              searchQuery.trim()
                ? 'Try adjusting your search or filters.'
                : 'There are no transactions to display.'
            }
          />
        )}
      </AdminTableShell>

      {totalTransactions > 0 && (
        <AdminPagination
          page={page}
          limit={pageLimit}
          total={totalTransactions}
          totalPages={totalPages}
          itemLabel="transactions"
          disabled={isFetching}
          onPageChange={onPageChange}
          onLimitChange={onPageLimitChange}
        />
      )}
    </>
  );
}
