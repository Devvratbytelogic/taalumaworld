import { AdminSearchInput, AdminSearchPanel } from '@/components/admin/layout/AdminContent';
import { Download } from 'lucide-react';
import toast from '@/utils/toast';

interface AdminAuditLogsSearchProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onExportLogsChange: (value: boolean) => void;
}

export function AdminAuditLogsSearch({ searchQuery, onSearchChange, onExportLogsChange }: AdminAuditLogsSearchProps) {
  const handleExportLogs = () => {
    onExportLogsChange(true);
    toast.success('Exporting logs...');
  };
  return (
    <AdminSearchPanel>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <AdminSearchInput
          value={searchQuery}
          onChange={onSearchChange}
          placeholder="Search by action, module, or user..."
        />
        <button
          type="button"
          onClick={handleExportLogs}
          className="global_btn rounded_full bg_primary w_fit"
        >
          <Download className="h-4 w-4 mr-2" /> Export Logs
        </button>
      </div>
    </AdminSearchPanel>
  );
}
