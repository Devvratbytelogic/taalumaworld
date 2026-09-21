'use client';

import { useMemo, useState } from 'react';
import { type GridColDef } from '@mui/x-data-grid';
import { Eye, FileSignature } from 'lucide-react';
import {
  useGetAllAgreementsQuery,
  useGetAllAgreementTypesQuery,
} from '@/store/rtkQueries/agreementAPIs';
import { useDebounce } from '@/hooks/useDebounce';
import { Badge } from '@/components/ui/badge';
import CommonDataTable from '@/components/admin/CommonDataTable';
import { AdminAgreementsHeader } from './AdminAgreementsHeader';
import { AdminAgreementsSearch } from './AdminAgreementsSearch';
import { AgreementViewModal } from './AgreementViewModal';
import { useAdminPermissions } from '@/hooks/useAdminPermissions';
import { AdminAgreementsSkeleton } from '@/components/skeleton-loader/admin';

const AGREEMENTS_MODEL = 'Agreements';

const STATUS_BADGE_CLASS: Record<string, string> = {
  active: 'bg-emerald-50 text-emerald-700 border-emerald-200!',
  inactive: 'bg-slate-100 text-slate-600 border-slate-200!',
};

export function AdminAgreementsTab() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [agreementTypeFilter, setAgreementTypeFilter] = useState('');
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
  const [viewingAgreementId, setViewingAgreementId] = useState<string | null>(null);
  const { hasPermission } = useAdminPermissions();

  const canView = hasPermission(AGREEMENTS_MODEL, 'view');
  const canAdd = hasPermission(AGREEMENTS_MODEL, 'add');

  const debouncedSearch = useDebounce(search, 500);

  const { data: agreementTypesResponse } = useGetAllAgreementTypesQuery({ limit: 100, status: 'active' });
  const agreementTypeOptions = useMemo(
    () => (agreementTypesResponse?.data?.data ?? []).map((type) => ({ value: type._id, label: type.name })),
    [agreementTypesResponse],
  );

  const { data: agreementsResponse, isLoading } = useGetAllAgreementsQuery({
    page: paginationModel.page + 1,
    limit: paginationModel.pageSize,
    search: debouncedSearch,
    ...(statusFilter ? { status: statusFilter } : {}),
    ...(agreementTypeFilter ? { agreementType: agreementTypeFilter } : {}),
  });

  const agreementsData = agreementsResponse?.data;
  const agreements = agreementsData?.data ?? [];
  const totalAgreements = agreementsData?.total ?? 0;

  const resetToFirstPage = () => setPaginationModel((prev) => ({ ...prev, page: 0 }));

  const handleSearchChange = (value: string) => {
    setSearch(value);
    resetToFirstPage();
  };

  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
    resetToFirstPage();
  };

  const handleAgreementTypeChange = (value: string) => {
    setAgreementTypeFilter(value);
    resetToFirstPage();
  };

  const columns: GridColDef[] = [
    {
      field: 'index',
      headerName: '#',
      width: 60,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        const rowIndex = params.api.getRowIndexRelativeToVisibleRows(params.id);
        return (
          <span className="text-sm text-muted-foreground">
            {paginationModel.page * paginationModel.pageSize + rowIndex + 1}
          </span>
        );
      },
    },
    {
      field: 'title',
      headerName: 'Agreement',
      minWidth: 220,
      flex: 1,
      sortable: false,
      renderCell: (params) => (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <FileSignature className="h-4 w-4 text-primary" />
          </div>
          <div className="min-w-0">
            <p className="font-medium text-sm text-slate-900">{params.row.title}</p>
            <p className="text-xs text-muted-foreground">{params.row.slug}</p>
          </div>
        </div>
      ),
    },
    {
      field: 'agreementType',
      headerName: 'Agreement type',
      minWidth: 180,
      flex: 0.8,
      sortable: false,
      renderCell: (params) => <span className="text-sm text-slate-700">{params.row.agreementType?.name ?? '—'}</span>,
    },
    {
      field: 'version',
      headerName: 'Version',
      width: 100,
      sortable: false,
      renderCell: (params) => <span className="text-sm text-slate-700">{params.row.version ?? '—'}</span>,
    },
    {
      field: 'can_block',
      headerName: 'Can block',
      width: 110,
      sortable: false,
      renderCell: (params) => (
        <Badge variant="outline" className={params.row.can_block ? STATUS_BADGE_CLASS.active : STATUS_BADGE_CLASS.inactive}>
          {params.row.can_block ? 'Yes' : 'No'}
        </Badge>
      ),
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      sortable: false,
      renderCell: (params) => (
        <Badge variant="outline" className={STATUS_BADGE_CLASS[params.row.status] ?? 'border-slate-200 text-slate-600'}>
          {params.row.status}
        </Badge>
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 130,
      sortable: false,
      renderCell: (params) => {
        if (!canView) return null;
        return (
          <div className="action_buttons">
            <button
              type="button"
              className="active_button"
              title="View agreement"
              onClick={() => setViewingAgreementId(params.row._id)}
            >
              <Eye className="h-4 w-4" />
            </button>
          </div>
        );
      },
    },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <AdminAgreementsHeader canAdd={canAdd} />
        <AdminAgreementsSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AdminAgreementsHeader canAdd={canAdd} />

      <AdminAgreementsSearch
        searchQuery={search}
        onSearchChange={handleSearchChange}
        selectedStatus={statusFilter}
        onStatusChange={handleStatusChange}
        selectedAgreementType={agreementTypeFilter}
        onAgreementTypeChange={handleAgreementTypeChange}
        agreementTypeOptions={agreementTypeOptions}
      />

      <div className="border border-gray-200 rounded-md overflow-hidden">
        <CommonDataTable
          rows={agreements}
          columns={columns}
          getRowId={(row) => row._id}
          loading={isLoading}
          paginationMode="server"
          rowCount={totalAgreements}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
        />
      </div>

      {canView ? (
        <AgreementViewModal
          open={!!viewingAgreementId}
          agreementId={viewingAgreementId}
          onOpenChange={(open) => !open && setViewingAgreementId(null)}
        />
      ) : null}
    </div>
  );
}
