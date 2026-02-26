import { Card } from '../../ui/card';
import { DollarSign, TrendingUp } from 'lucide-react';

interface TransactionStatsProps {
  totalRevenue: number;
  transactionCount: number;
}

export function TransactionStats({
  totalRevenue,
  transactionCount,
}: TransactionStatsProps) {
  const avgTransaction =
    transactionCount > 0 ? totalRevenue / transactionCount : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="p-4 bg-white rounded-3xl shadow-sm border">
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
      <Card className="p-4 bg-white rounded-3xl shadow-sm border">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 rounded-lg">
            <TrendingUp className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Transactions</p>
            <p className="text-2xl font-bold">{transactionCount}</p>
          </div>
        </div>
      </Card>
      <Card className="p-4 bg-white rounded-3xl shadow-sm border">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-50 rounded-lg">
            <DollarSign className="h-5 w-5 text-purple-600" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Avg. Transaction</p>
            <p className="text-2xl font-bold">
              ${avgTransaction.toFixed(2)}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
