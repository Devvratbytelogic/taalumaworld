import { Download } from 'lucide-react';
import Button from '../../ui/Button';
import { Badge } from '../../ui/badge';

interface AdminPaymentsHeaderProps {
  totalRevenue: number;
  onExport?: () => void;
}

export function AdminPaymentsHeader({
  totalRevenue,
  onExport,
}: AdminPaymentsHeaderProps) {
  return (
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
          <Button className="gap-2 global_btn rounded_full bg_primary text_white" onPress={onExport}>
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>
    </div>
  );
}
