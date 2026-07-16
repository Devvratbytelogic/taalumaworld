import { Card } from '../../ui/card';
import { TrendingUp, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { IAllTransactionsSummary } from '@/types/transaction';

interface TransactionStatsProps {
  summary?: IAllTransactionsSummary;
}

export function TransactionStats({ summary }: TransactionStatsProps) {
  const totalRevenue = summary?.totalRevenue ?? 0;
  const totalTransactions = summary?.totalTransactions ?? 0;
  const completedTransactions = summary?.completedTransactions ?? 0;
  const failedTransactions = summary?.failedTransactions ?? 0;
  const pendingTransactions = summary?.pendingTransactions ?? 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      <Card className="p-4 admin-surface border">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-50 rounded-lg flex items-center justify-center">
            <span className="text-xs font-bold text-green-600">KSh</span>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Revenue</p>
            <p className="text-2xl font-bold">KSH {totalRevenue.toFixed(2)}</p>
          </div>
        </div>
      </Card>
      <Card className="p-4 admin-surface border">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 rounded-lg">
            <TrendingUp className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Transactions</p>
            <p className="text-2xl font-bold">{totalTransactions}</p>
          </div>
        </div>
      </Card>
      <Card className="p-4 admin-surface border">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-50 rounded-lg">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Completed</p>
            <p className="text-2xl font-bold">{completedTransactions}</p>
          </div>
        </div>
      </Card>
      <Card className="p-4 admin-surface border">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-red-50 rounded-lg">
            <XCircle className="h-5 w-5 text-red-600" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Failed</p>
            <p className="text-2xl font-bold">{failedTransactions}</p>
          </div>
        </div>
      </Card>
      <Card className="p-4 admin-surface border">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-yellow-50 rounded-lg">
            <Clock className="h-5 w-5 text-yellow-600" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Pending</p>
            <p className="text-2xl font-bold">{pendingTransactions}</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
