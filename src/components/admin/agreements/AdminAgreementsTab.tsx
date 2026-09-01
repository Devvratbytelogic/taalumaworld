'use client';

import { useMemo, useState } from 'react';
import { type GridColDef } from '@mui/x-data-grid';
import { Edit2, Eye, FileSignature } from 'lucide-react';
import {
  useGetAllAgreementsQuery,
  useAddAgreementMutation,
  useUpdateAgreementMutation,
  useGetAllAgreementTypesQuery,
} from '@/store/rtkQueries/agreementAPIs';
import { useDebounce } from '@/hooks/useDebounce';
import { Badge } from '@/components/ui/badge';
import CommonDataTable from '@/components/admin/CommonDataTable';
import { AdminAgreementsHeader } from './AdminAgreementsHeader';
import { AdminAgreementsSearch } from './AdminAgreementsSearch';
import { AgreementModal, type AgreementFormValues } from './AgreementModal';
import { AgreementViewModal } from './AgreementViewModal';
import toast from '@/utils/toast';
import { useAdminPermissions } from '@/hooks/useAdminPermissions';
import { refreshAfterPolicyChange } from '@/store/server-api/refreshCache';

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAgreementId, setEditingAgreementId] = useState<string | null>(null);
  const [viewingAgreementId, setViewingAgreementId] = useState<string | null>(null);
  const { hasPermission } = useAdminPermissions();

  const canView = hasPermission(AGREEMENTS_MODEL, 'view');
  const canAdd = hasPermission(AGREEMENTS_MODEL, 'add');
  const canEdit = hasPermission(AGREEMENTS_MODEL, 'edit');

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

  const [addAgreement] = useAddAgreementMutation();
  const [updateAgreement] = useUpdateAgreementMutation();

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

  const handleSave = async (values: AgreementFormValues, id?: string) => {
    try {
      const res = id
        ? await updateAgreement({ agreementId: id, values }).unwrap()
        : await addAgreement(values).unwrap();
      if (res?.http_status_code === 200 || res?.http_status_code === 201) {
        void refreshAfterPolicyChange(values.slug);
        toast.success(res.message ?? (id ? 'Agreement updated successfully' : 'Agreement created successfully'));
        setIsModalOpen(false);
        setEditingAgreementId(null);
      }
    } catch (error) {
      console.error('Error saving agreement', error);
    }
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
    // {
    //   field: 'can_block',
    //   headerName: 'Can block',
    //   width: 110,
    //   sortable: false,
    //   renderCell: (params) => (
    //     <Badge variant="outline" className={params.row.can_block ? STATUS_BADGE_CLASS.active : STATUS_BADGE_CLASS.inactive}>
    //       {params.row.can_block ? 'Yes' : 'No'}
    //     </Badge>
    //   ),
    // },
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
        const isEditable = params.row.isEditable !== false;
        if (!canView && !canEdit) return null;
        return (
          <div className="action_buttons">
            {canView ? (
              <button
                type="button"
                className="active_button"
                title="View agreement"
                onClick={() => setViewingAgreementId(params.row._id)}
              >
                <Eye className="h-4 w-4" />
              </button>
            ) : null}
            {canEdit ? (
              <button
                type="button"
                className={`edit_button${!isEditable ? ' cursor-not-allowed! opacity-40 hover:bg-transparent! hover:text-primary!' : ''}`}
                title={isEditable ? 'Edit agreement' : 'This agreement cannot be edited'}
                disabled={!isEditable}
                aria-disabled={!isEditable}
                onClick={() => {
                  if (!isEditable) return;
                  setEditingAgreementId(params.row._id);
                  setIsModalOpen(true);
                }}
              >
                <Edit2 className="h-4 w-4" />
              </button>
            ) : null}
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <AdminAgreementsHeader
        canAdd={canAdd}
        onCreateAgreement={() => {
          setEditingAgreementId(null);
          setIsModalOpen(true);
        }}
      />

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

      {(canAdd || canEdit) ? (
        <AgreementModal
          open={isModalOpen}
          agreementId={editingAgreementId}
          agreementTypeOptions={agreementTypeOptions}
          onOpenChange={(open) => {
            setIsModalOpen(open);
            if (!open) setEditingAgreementId(null);
          }}
          onSubmit={handleSave}
        />
      ) : null}

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
