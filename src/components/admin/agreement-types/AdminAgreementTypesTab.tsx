'use client';

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { type GridColDef } from '@mui/x-data-grid';
import { Edit2, FileSignature, RotateCcw, Trash2 } from 'lucide-react';
import {
  useGetAllAgreementTypesQuery,
  useAddAgreementTypeMutation,
  useUpdateAgreementTypeMutation,
  useDeleteAgreementTypeMutation,
  useRestoreAgreementTypeMutation,
} from '@/store/rtkQueries/agreementAPIs';
import type { IAllAgreementTypesDataEntity } from '@/types/agreementTypes';
import { closeModal, openModal } from '@/store/slices/allModalSlice';
import { useDebounce } from '@/hooks/useDebounce';
import { Badge } from '@/components/ui/badge';
import CommonDataTable from '@/components/admin/CommonDataTable';
import { AdminAgreementTypesHeader } from './AdminAgreementTypesHeader';
import { AdminAgreementTypesSearch } from './AdminAgreementTypesSearch';
import { AgreementTypeModal, type AgreementTypeFormValues } from './AgreementTypeModal';
import toast from '@/utils/toast';

const STATUS_BADGE_CLASS: Record<string, string> = {
  active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  inactive: 'bg-slate-100 text-slate-600 border-slate-200',
};

export function AdminAgreementTypesTab() {
  const dispatch = useDispatch();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isTrashView, setIsTrashView] = useState(false);
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingType, setEditingType] = useState<IAllAgreementTypesDataEntity | null>(null);

  const debouncedSearch = useDebounce(search, 500);

  const { data: agreementTypesResponse, isLoading } = useGetAllAgreementTypesQuery({
    page: paginationModel.page + 1,
    limit: paginationModel.pageSize,
    search: debouncedSearch,
    ...(statusFilter ? { status: statusFilter } : {}),
    ...(isTrashView ? { isDeleted: true } : {}),
  });

  const agreementTypesData = agreementTypesResponse?.data;
  const agreementTypes = agreementTypesData?.data ?? [];
  const totalAgreementTypes = agreementTypesData?.total ?? 0;

  const [addAgreementType] = useAddAgreementTypeMutation();
  const [updateAgreementType] = useUpdateAgreementTypeMutation();
  const [deleteAgreementType] = useDeleteAgreementTypeMutation();
  const [restoreAgreementType] = useRestoreAgreementTypeMutation();

  const resetToFirstPage = () => setPaginationModel((prev) => ({ ...prev, page: 0 }));

  const handleSearchChange = (value: string) => {
    setSearch(value);
    resetToFirstPage();
  };

  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
    resetToFirstPage();
  };

  const handleToggleTrash = () => {
    setIsTrashView((prev) => !prev);
    resetToFirstPage();
  };

  const handleSave = async (values: AgreementTypeFormValues, id?: string) => {
    try {
      if (id) {
        await updateAgreementType({ id, values }).unwrap();
        toast.success('Agreement type updated successfully');
      } else {
        await addAgreementType(values).unwrap();
        toast.success('Agreement type created successfully');
      }
      setIsModalOpen(false);
      setEditingType(null);
    } catch (error) {
      console.error('Error saving agreement type', error);
    }
  };

  const onDeleteAgreementType = async (id: string) => {
    try {
      await deleteAgreementType({ id }).unwrap();
      toast.success('Agreement type deleted successfully');
      dispatch(closeModal());
    } catch (error) {
      console.error('Error deleting agreement type', error);
    }
  };

  const onRestoreAgreementType = async (id: string) => {
    try {
      await restoreAgreementType({ id }).unwrap();
      toast.success('Agreement type restored successfully');
      dispatch(closeModal());
    } catch (error) {
      console.error('Error restoring agreement type', error);
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
      field: 'name',
      headerName: 'Agreement type',
      minWidth: 220,
      flex: 1,
      sortable: false,
      renderCell: (params) => (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <FileSignature className="h-4 w-4 text-primary" />
          </div>
          <div className="min-w-0">
            <p className="font-medium text-sm text-slate-900">{params.row.name}</p>
          </div>
        </div>
      ),
    },
    {
      field: 'description',
      headerName: 'Description',
      minWidth: 260,
      flex: 1.4,
      sortable: false,
      renderCell: (params) => (
        <p className="truncate text-sm text-slate-600" title={params.row.description}>
          {params.row.description}
        </p>
      ),
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 130,
      sortable: false,
      renderCell: (params) => (
        <Badge variant="outline" className={STATUS_BADGE_CLASS[params.row.status] ?? 'border-slate-200 text-slate-600'}>
          {params.row.status}
        </Badge>
      ),
    },
    {
      field: 'createdAt',
      headerName: 'Created',
      width: 140,
      sortable: false,
      renderCell: (params) => (
        <span className="text-sm text-slate-500">
          {params.row.createdAt
            ? new Date(params.row.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
            : '—'}
        </span>
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      sortable: false,
      renderCell: (params) => (
        <div className="action_buttons">
          {isTrashView ? (
            <button
              type="button"
              className="active_button"
              title="Restore agreement type"
              onClick={() =>
                dispatch(
                  openModal({
                    componentName: 'RestoreConfirmation',
                    data: {
                      itemName: params.row.name,
                      onRestore: () => onRestoreAgreementType(params.row._id),
                    },
                  }),
                )
              }
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          ) : (
            <>
              <button
                type="button"
                className="edit_button"
                title="Edit agreement type"
                onClick={() => {
                  setEditingType(params.row);
                  setIsModalOpen(true);
                }}
              >
                <Edit2 className="h-4 w-4" />
              </button>
              <button
                type="button"
                className="delete_button"
                title="Delete agreement type"
                onClick={() =>
                  dispatch(
                    openModal({
                      componentName: 'DeleteConfirmation',
                      data: {
                        itemName: params.row.name,
                        onDelete: () => onDeleteAgreementType(params.row._id),
                      },
                    }),
                  )
                }
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <AdminAgreementTypesHeader
        isTrashView={isTrashView}
        onToggleTrash={handleToggleTrash}
        onCreateType={() => {
          setEditingType(null);
          setIsModalOpen(true);
        }}
      />

      <AdminAgreementTypesSearch
        searchQuery={search}
        onSearchChange={handleSearchChange}
        selectedStatus={statusFilter}
        onStatusChange={handleStatusChange}
      />

      <div className="border border-gray-200 rounded-md overflow-hidden">
        <CommonDataTable
          rows={agreementTypes}
          columns={columns}
          getRowId={(row) => row._id}
          loading={isLoading}
          paginationMode="server"
          rowCount={totalAgreementTypes}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
        />
      </div>

      <AgreementTypeModal
        open={isModalOpen}
        agreementType={editingType}
        onOpenChange={(open) => {
          setIsModalOpen(open);
          if (!open) setEditingType(null);
        }}
        onSubmit={handleSave}
      />
    </div>
  );
}
