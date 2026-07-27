'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import moment from 'moment';
import { type GridColDef } from '@mui/x-data-grid';
import { Eye } from 'lucide-react';
import { AdminPage, AdminPageHeader } from '@/components/admin/layout/AdminContent';
import CommonDataTable from '@/components/admin/CommonDataTable';
import { Badge } from '@/components/ui/badge';
import { useDebounce } from '@/hooks/useDebounce';
import { useGetAllAuditLogsQuery } from '@/store/rtkQueries/auditLogApi';
import type { IAllAuditLogsAPIResponseDataEntity } from '@/types/auditLog';
import { getViewAuditLogRoutePath } from '@/routes/routes';
import { AdminAuditLogsSearch } from './AdminAuditLogsSearch';

export function AdminAuditLogsTab() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
  const [exportLogs, setExportLogs] = useState(false);
  const debouncedSearch = useDebounce(searchQuery, 400);

  useEffect(() => {
    setPaginationModel((prev) => ({ ...prev, page: 0 }));
  }, [debouncedSearch]);

  const { data, isLoading, isFetching } = useGetAllAuditLogsQuery({
    page: paginationModel.page + 1,
    limit: paginationModel.pageSize,
    ...(debouncedSearch.trim() ? { search: debouncedSearch.trim() } : {}),
    ...(exportLogs ? { export: exportLogs } : {}),
  });

  const logs = data?.data?.data ?? [];
  const totalLogs = data?.data?.total ?? 0;

  const columns: GridColDef<IAllAuditLogsAPIResponseDataEntity>[] = [
    {
      field: 'action',
      headerName: 'Action',
      minWidth: 200,
      flex: 1,
      sortable: false,
      renderCell: (params) => (
        <div className="min-w-0">
          <p className="text-sm font-medium truncate">{params.row.action_label || params.row.action}</p>
          <p className="text-xs text-muted-foreground truncate font-mono">{params.row.action}</p>
        </div>
      ),
    },
    {
      field: 'entity_type',
      headerName: 'Entity',
      minWidth: 150,
      sortable: false,
      renderCell: (params) => (
        params.row.entity_type ? (
          <div className="min-w-0">
            <Badge variant="outline" className="capitalize border-slate-200 bg-slate-50 text-slate-700">
              {params.row.entity_type}
            </Badge>
            {params.row.entity_label ? (
              <p className="mt-1 text-xs text-muted-foreground truncate">{params.row.entity_label}</p>
            ) : null}
          </div>
        ) : <span className="text-sm text-muted-foreground">—</span>
      ),
    },
    {
      field: 'actor_name',
      headerName: 'Performed By',
      minWidth: 190,
      flex: 1,
      sortable: false,
      renderCell: (params) => (
        <div className="min-w-0">
          <p className="text-sm font-medium truncate">{params.row.actor_name || params.row.actor_id?.name || 'System'}</p>
          <p className="text-xs text-muted-foreground truncate">{params.row.actor_email || params.row.actor_id?.email}</p>
        </div>
      ),
    },
    {
      field: 'actor_role',
      headerName: 'Role',
      minWidth: 130,
      sortable: false,
      renderCell: (params) => (
        params.row.actor_role ? (
          <Badge variant="outline" className="capitalize border-slate-200 bg-slate-50 text-slate-700">
            {params.row.actor_role}
          </Badge>
        ) : <span className="text-sm text-muted-foreground">—</span>
      ),
    },
    {
      field: 'ip_address',
      headerName: 'IP Address',
      minWidth: 130,
      sortable: false,
      renderCell: (params) => (
        <span className="text-sm text-muted-foreground whitespace-nowrap">{params.row.ip_address ?? '—'}</span>
      ),
    },
    {
      field: 'createdAt',
      headerName: 'Date',
      minWidth: 160,
      sortable: false,
      renderCell: (params) => (
        <span className="text-sm whitespace-nowrap text-muted-foreground">
          {params.row.createdAt ? moment(params.row.createdAt).format('DD/MM/YYYY HH:mm') : '—'}
        </span>
      ),
    },
    {
      field: 'actions',
      headerName: '',
      width: 80,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <div className="action_buttons">
          <button
            type="button"
            className="active_button"
            title="View audit log"
            onClick={() => router.push(getViewAuditLogRoutePath(params.row._id))}
          >
            <Eye className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <AdminPage>
      <AdminPageHeader
        title="Audit Logs"
        description="Track every sensitive action taken across the admin panel."
      />
      <AdminAuditLogsSearch searchQuery={searchQuery} onSearchChange={setSearchQuery} onExportLogsChange={setExportLogs} />
      <div className="border border-gray-200 rounded-md overflow-hidden">
        <CommonDataTable
          rows={logs}
          columns={columns}
          getRowId={(row) => row._id}
          loading={isLoading || isFetching}
          paginationMode="server"
          rowCount={totalLogs}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
        />
      </div>
    </AdminPage>
  );
}
