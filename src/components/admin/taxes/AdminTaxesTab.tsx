'use client';

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { type GridColDef } from '@mui/x-data-grid';
import { Edit2, Percent, Trash2 } from 'lucide-react';
import {
  useGetAllTaxesQuery,
  useAddTaxMutation,
  useUpdateTaxMutation,
  useDeleteTaxMutation,
} from '@/store/rtkQueries/taxApis';
import type { IAllTaxesDataEntity } from '@/types/taxes';
import { closeModal, openModal } from '@/store/slices/allModalSlice';
import { useDebounce } from '@/hooks/useDebounce';
import { useAdminPermissions } from '@/hooks/useAdminPermissions';
import { Badge } from '@/components/ui/badge';
import CommonDataTable from '@/components/admin/CommonDataTable';
import { AdminTaxesHeader } from './AdminTaxesHeader';
import { AdminTaxesSearch } from './AdminTaxesSearch';
import { DefaultTaxRateCard } from './DefaultTaxRateCard';
import { TaxModal, type TaxFormValues } from './TaxModal';
import toast from '@/utils/toast';

const TAXES_MODEL = 'Taxes';

const STATUS_BADGE_CLASS: Record<string, string> = {
  Active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Inactive: 'bg-red-50 text-red-700 border-red-200',
};

export function AdminTaxesTab() {
  const dispatch = useDispatch();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTax, setEditingTax] = useState<IAllTaxesDataEntity | null>(null);
  const { hasPermission } = useAdminPermissions();

  const canAdd = hasPermission(TAXES_MODEL, 'add');
  const canEdit = hasPermission(TAXES_MODEL, 'edit');
  const canDelete = hasPermission(TAXES_MODEL, 'delete');

  const debouncedSearch = useDebounce(search, 500);

  const { data: taxesResponse, isLoading } = useGetAllTaxesQuery({
    page: paginationModel.page + 1,
    limit: paginationModel.pageSize,
    ...(debouncedSearch.trim() ? { search: debouncedSearch.trim() } : {}),
    ...(statusFilter ? { status: statusFilter } : {}),
  });

  const taxesData = taxesResponse?.data;
  const taxes = taxesData?.data ?? [];
  const totalTaxes = taxesData?.total ?? 0;

  const [addTax] = useAddTaxMutation();
  const [updateTax] = useUpdateTaxMutation();
  const [deleteTax] = useDeleteTaxMutation();

  const resetToFirstPage = () => setPaginationModel((prev) => ({ ...prev, page: 0 }));

  const handleSearchChange = (value: string) => {
    setSearch(value);
    resetToFirstPage();
  };

  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
    resetToFirstPage();
  };

  const handleSave = async (values: TaxFormValues, id?: string) => {
    const payload = {
      country: values.country.trim(),
      country_code: values.country_code.trim().toUpperCase(),
      tax_name: values.tax_name.trim(),
      tax_percent: Number(values.tax_percent),
      status: values.status,
    };

    try {
      const res = id
        ? await updateTax({ id, values: payload }).unwrap()
        : await addTax(payload).unwrap();
      if (res?.http_status_code === 200 || res?.http_status_code === 201) {
        toast.success(res.message ?? (id ? 'Tax updated successfully' : 'Tax created successfully'));
        setIsModalOpen(false);
        setEditingTax(null);
      }
    } catch (error) {
      console.error('Error saving tax', error);
    }
  };

  const onDeleteTax = async (id: string) => {
    try {
      const res = await deleteTax({ id }).unwrap();
      if (res?.http_status_code === 200 || res?.http_status_code === 201) {
        toast.success(res.message ?? 'Tax deleted successfully');
        dispatch(closeModal());
      }
    } catch (error) {
      console.error('Error deleting tax', error);
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
      field: 'country',
      headerName: 'Country',
      minWidth: 180,
      flex: 1,
      sortable: false,
      renderCell: (params) => (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <Percent className="h-4 w-4 text-primary" />
          </div>
          <div className="min-w-0">
            <p className="font-medium text-sm text-slate-900">{params.row.country}</p>
            <p className="text-xs text-slate-500">{params.row.country_code}</p>
          </div>
        </div>
      ),
    },
    {
      field: 'tax_name',
      headerName: 'Tax name',
      minWidth: 140,
      flex: 0.8,
      sortable: false,
      renderCell: (params) => <span className="text-sm text-slate-700">{params.row.tax_name}</span>,
    },
    {
      field: 'tax_percent',
      headerName: 'Rate',
      width: 100,
      sortable: false,
      renderCell: (params) => (
        <span className="text-sm font-medium text-slate-900">{params.row.tax_percent}%</span>
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
            ? new Date(params.row.createdAt).toLocaleDateString('en-US', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })
            : '—'}
        </span>
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      sortable: false,
      renderCell: (params) => {
        if (!canEdit && !canDelete) return null;
        return (
          <div className="action_buttons">
            {canEdit ? (
              <button
                type="button"
                className="edit_button"
                title="Edit tax"
                onClick={() => {
                  setEditingTax(params.row);
                  setIsModalOpen(true);
                }}
              >
                <Edit2 className="h-4 w-4" />
              </button>
            ) : null}
            {canDelete ? (
              <button
                type="button"
                className="delete_button"
                title="Delete tax"
                onClick={() =>
                  dispatch(
                    openModal({
                      componentName: 'DeleteConfirmation',
                      data: {
                        itemName: `${params.row.tax_name} (${params.row.country})`,
                        onDelete: () => onDeleteTax(params.row._id),
                      },
                    }),
                  )
                }
              >
                <Trash2 className="h-4 w-4" />
              </button>
            ) : null}
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <AdminTaxesHeader
        canAdd={canAdd}
        onCreateTax={() => {
          setEditingTax(null);
          setIsModalOpen(true);
        }}
      />

      <DefaultTaxRateCard />

      <AdminTaxesSearch
        searchQuery={search}
        onSearchChange={handleSearchChange}
        selectedStatus={statusFilter}
        onStatusChange={handleStatusChange}
      />

      <div className="border border-gray-200 rounded-md overflow-hidden">
        <CommonDataTable
          rows={taxes}
          columns={columns}
          getRowId={(row) => row._id}
          loading={isLoading}
          paginationMode="server"
          rowCount={totalTaxes}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
        />
      </div>

      {canAdd || canEdit ? (
        <TaxModal
          open={isModalOpen}
          tax={editingTax}
          onOpenChange={(open) => {
            setIsModalOpen(open);
            if (!open) setEditingTax(null);
          }}
          onSubmit={handleSave}
        />
      ) : null}
    </div>
  );
}
