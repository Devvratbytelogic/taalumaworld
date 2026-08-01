'use client';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Pencil, Trash2 } from 'lucide-react';
import { type GridColDef } from '@mui/x-data-grid';
import toast from '@/utils/toast';
import { cn } from '@/components/ui/utils';
import { Badge } from '@/components/ui/badge';
import CommonDataTable from '@/components/admin/CommonDataTable';
import { closeModal, openModal } from '@/store/slices/allModalSlice';
import { useGetAllFaqsQuery } from '@/store/rtkQueries/adminGetApi';
import {
  useAddFAQMutation,
  useUpdateFAQMutation,
  useDeleteFAQMutation,
} from '@/store/rtkQueries/adminPostApi';
import type { IAllFaqsDataEntity } from '@/types/faqs';
import { useDebounce } from '@/hooks/useDebounce';
import { AdminFAQsHeader } from './AdminFAQsHeader';
import { AdminFAQsSearch } from './AdminFAQsSearch';
import { FAQForm, type FAQFormValues } from './FAQForm';
import { useAdminPermissions } from '@/hooks/useAdminPermissions';

const FAQS_MODEL = 'FAQs';

const STATUS_BADGE_CLASS: Record<string, string> = {
  Active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Inactive: 'bg-red-50 text-red-700 border-red-200',
};

const TYPE_LABEL: Record<string, string> = {
  reading: 'Reading',
  payment: 'Payment',
  account: 'Account',
};

export function AdminFAQsTab() {
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
  const { hasPermission } = useAdminPermissions();

  const canAdd = hasPermission(FAQS_MODEL, 'add');
  const canEdit = hasPermission(FAQS_MODEL, 'edit');
  const canDelete = hasPermission(FAQS_MODEL, 'delete');

  const debouncedSearch = useDebounce(searchQuery, 500);
  const queryParams = {
    page: paginationModel.page + 1,
    limit: paginationModel.pageSize,
    ...(debouncedSearch.trim() ? { search: debouncedSearch.trim() } : {}),
    ...(statusFilter ? { status: statusFilter } : {}),
  };
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const { data, isLoading, isFetching } = useGetAllFaqsQuery(queryParams);
  const [addFAQ, { isLoading: isAdding }] = useAddFAQMutation();
  const [updateFAQ, { isLoading: isUpdating }] = useUpdateFAQMutation();
  const [deleteFAQ] = useDeleteFAQMutation();

  const listData = data?.data;
  const faqs = listData?.data ?? [];
  const totalFAQs = listData?.total ?? 0;

  const editingFAQ = editingId ? faqs.find((f) => f._id === editingId) ?? null : null;

  const resetToFirstPage = () => setPaginationModel((prev) => ({ ...prev, page: 0 }));

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    resetToFirstPage();
  };

  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
    resetToFirstPage();
  };

  const handleAdd = async (values: FAQFormValues) => {
    try {
      const res = await addFAQ(values).unwrap();
      if (res?.http_status_code === 200 || res?.http_status_code === 201) {
        toast.success(res.message ?? 'FAQ added successfully');
        setShowAddForm(false);
      }
    } catch {
      // Error handled by API layer
    }
  };

  const handleUpdate = async (id: string, values: FAQFormValues) => {
    try {
      const res = await updateFAQ({ id, values }).unwrap();
      if (res?.http_status_code === 200 || res?.http_status_code === 201) {
        toast.success(res.message ?? 'FAQ updated successfully');
        setEditingId(null);
      }
    } catch {
      // Error handled by API layer
    }
  };

  const onDeleteFAQ = async (id: string) => {
    try {
      const res = await deleteFAQ({ id }).unwrap();
      if (res?.http_status_code === 200 || res?.http_status_code === 201) {
        toast.success(res.message ?? 'FAQ deleted');
        dispatch(closeModal());
      }
    } catch {
      // Error handled by API layer
    }
  };

  const columns: GridColDef<IAllFaqsDataEntity>[] = [
    {
      field: 'question',
      headerName: 'Question',
      minWidth: 240,
      flex: 1.4,
      sortable: false,
      renderCell: (params) => (
        <p className="text-sm font-medium truncate">{params.row.question}</p>
      ),
    },
    {
      field: 'answer',
      headerName: 'Answer',
      minWidth: 260,
      flex: 1,
      sortable: false,
      renderCell: (params) => (
        <p className="text-sm text-muted-foreground truncate">{params.row.answer}</p>
      ),
    },
    {
      field: 'type',
      headerName: 'Type',
      width: 120,
      sortable: false,
      renderCell: (params) => (
        <Badge variant="outline" className="capitalize bg-gray-50 text-gray-600 border-gray-200">
          {TYPE_LABEL[params.row.type] ?? params.row.type}
        </Badge>
      ),
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      sortable: false,
      renderCell: (params) => (
        <Badge
          variant="outline"
          className={cn('capitalize', STATUS_BADGE_CLASS[params.row.status] ?? 'bg-gray-50 text-gray-600 border-gray-200')}
        >
          {params.row.status || '—'}
        </Badge>
      ),
    },
    {
      field: 'actions',
      headerName: '',
      width: 100,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        if (!canEdit && !canDelete) return null;
        return (
          <div className="action_buttons">
            {canEdit ? (
              <button
                type="button"
                className="edit_button"
                title="Edit FAQ"
                onClick={() => { setEditingId(params.row._id); setShowAddForm(false); }}
              >
                <Pencil className="h-4 w-4" />
              </button>
            ) : null}
            {canDelete ? (
              <button
                type="button"
                className="delete_button"
                title="Delete FAQ"
                onClick={() => dispatch(openModal({
                  componentName: 'DeleteConfirmation',
                  data: {
                    itemName: params.row.question,
                    onDelete: () => onDeleteFAQ(params.row._id),
                  },
                }))}
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
      <AdminFAQsHeader
        totalCount={totalFAQs}
        canAdd={canAdd}
        onAddFAQ={() => { setShowAddForm(true); setEditingId(null); }}
      />

      {((canAdd && showAddForm) || (canEdit && editingFAQ)) && (
        <FAQForm
          initial={editingFAQ ?? undefined}
          isLoading={editingFAQ ? isUpdating : isAdding}
          onSubmit={editingFAQ ? (values) => handleUpdate(editingFAQ._id, values) : handleAdd}
          onCancel={() => { setShowAddForm(false); setEditingId(null); }}
        />
      )}

      <AdminFAQsSearch
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        selectedStatus={statusFilter}
        onStatusChange={handleStatusChange}
      />

      <div className="border border-gray-200 rounded-md overflow-hidden">
        <CommonDataTable
          rows={faqs}
          columns={columns}
          getRowId={(row) => row._id}
          loading={isLoading || isFetching}
          paginationMode="server"
          rowCount={totalFAQs}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
        />
      </div>
    </div>
  );
}
