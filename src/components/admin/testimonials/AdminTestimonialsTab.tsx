'use client';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Pencil, Trash2, UserCircle } from 'lucide-react';
import { type GridColDef } from '@mui/x-data-grid';
import toast from '@/utils/toast';
import { cn } from '@/components/ui/utils';
import { Badge } from '@/components/ui/badge';
import CommonDataTable from '@/components/admin/CommonDataTable';
import { closeModal, openModal } from '@/store/slices/allModalSlice';
import { useGetAllTestimonialsQuery } from '@/store/rtkQueries/adminGetApi';
import {
  useAddTestimonialMutation,
  useUpdateTestimonialMutation,
  useDeleteTestimonialMutation,
} from '@/store/rtkQueries/adminPostApi';
import type { ITestimonialsDataEntity } from '@/types/testimonial';
import { AdminTestimonialsHeader } from './AdminTestimonialsHeader';
import { AdminTestimonialsSearch } from './AdminTestimonialsSearch';
import { TestimonialForm } from './TestimonialForm';
import { StarRating } from './StarRating';
import { useDebounce } from '@/hooks/useDebounce';
import { useAdminPermissions } from '@/hooks/useAdminPermissions';
import { refreshAfterTestimonialChange } from '@/store/server-api/refreshCache';

const TESTIMONIAL_MODEL = 'Testimonial';

const STATUS_BADGE_CLASS: Record<string, string> = {
  Active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Inactive: 'bg-red-50 text-red-700 border-red-200',
};

export function AdminTestimonialsTab() {
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
  const { hasPermission } = useAdminPermissions();

  const canAdd = hasPermission(TESTIMONIAL_MODEL, 'add');
  const canEdit = hasPermission(TESTIMONIAL_MODEL, 'edit');
  const canDelete = hasPermission(TESTIMONIAL_MODEL, 'delete');

  const debouncedSearch = useDebounce(searchQuery, 500);
  const queryParams = {
    page: paginationModel.page + 1,
    limit: paginationModel.pageSize,
    ...(debouncedSearch.trim() ? { search: debouncedSearch.trim() } : {}),
    ...(statusFilter ? { status: statusFilter } : {}),
  };
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const { data, isLoading, isFetching } = useGetAllTestimonialsQuery(queryParams);
  const [addTestimonial, { isLoading: isAdding }] = useAddTestimonialMutation();
  const [updateTestimonial, { isLoading: isUpdating }] = useUpdateTestimonialMutation();
  const [deleteTestimonial] = useDeleteTestimonialMutation();

  const listData = data?.data;
  const testimonials = listData?.data ?? [];
  const totalTestimonials = listData?.total ?? 0;
  const editingTestimonial = editingId ? testimonials.find((t) => t._id === editingId) ?? null : null;

  const resetToFirstPage = () => setPaginationModel((prev) => ({ ...prev, page: 0 }));

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    resetToFirstPage();
  };

  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
    resetToFirstPage();
  };

  const handleAdd = async (formData: FormData) => {
    try {
      const res = await addTestimonial(formData).unwrap();
      if (res?.http_status_code === 200 || res?.http_status_code === 201) {
        void refreshAfterTestimonialChange();
        toast.success(res.message ?? 'Testimonial added successfully');
        setShowAddForm(false);
      }
    } catch {
      // Error handled by API layer
    }
  };

  const handleUpdate = async (id: string, formData: FormData) => {
    try {
      const res = await updateTestimonial({ id, values: formData }).unwrap();
      if (res?.http_status_code === 200 || res?.http_status_code === 201) {
        void refreshAfterTestimonialChange();
        toast.success(res.message ?? 'Testimonial updated successfully');
        setEditingId(null);
      }
    } catch {
      // Error handled by API layer
    }
  };

  const onDeleteTestimonial = async (id: string) => {
    try {
      const res = await deleteTestimonial({ id }).unwrap();
      if (res?.http_status_code === 200 || res?.http_status_code === 201) {
        void refreshAfterTestimonialChange();
        toast.success(res.message ?? 'Testimonial deleted');
        dispatch(closeModal());
      }
    } catch {
      // Error handled by API layer
    }
  };

  const columns: GridColDef<ITestimonialsDataEntity>[] = [
    {
      field: 'name',
      headerName: 'Testimonial',
      minWidth: 220,
      flex: 1,
      sortable: false,
      renderCell: (params) => (
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-full overflow-hidden bg-gray-100 border border-gray-200 shrink-0 flex items-center justify-center">
            {params.row.photo ? (
              <img src={params.row.photo} alt={params.row.name} className="w-full h-full object-cover" />
            ) : (
              <UserCircle className="h-5 w-5 text-gray-300" />
            )}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium truncate">{params.row.name}</p>
            {params.row.title && (
              <p className="text-xs text-muted-foreground truncate">{params.row.title}</p>
            )}
          </div>
        </div>
      ),
    },
    {
      field: 'rating',
      headerName: 'Rating',
      width: 130,
      sortable: false,
      renderCell: (params) => <StarRating rating={params.row.rating} />,
    },
    {
      field: 'message',
      headerName: 'Message',
      minWidth: 240,
      flex: 1,
      sortable: false,
      renderCell: (params) => (
        <p className="text-sm text-muted-foreground truncate">{params.row.message}</p>
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
                title="Edit testimonial"
                onClick={() => { setEditingId(params.row._id); setShowAddForm(false); }}
              >
                <Pencil className="h-4 w-4" />
              </button>
            ) : null}
            {canDelete ? (
              <button
                type="button"
                className="delete_button"
                title="Delete testimonial"
                onClick={() => dispatch(openModal({
                  componentName: 'DeleteConfirmation',
                  data: {
                    itemName: params.row.name,
                    onDelete: () => onDeleteTestimonial(params.row._id),
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
      <AdminTestimonialsHeader
        totalCount={totalTestimonials}
        canAdd={canAdd}
        onAddTestimonial={() => { setShowAddForm(true); setEditingId(null); }}
      />

      {((canAdd && showAddForm) || (canEdit && editingTestimonial)) && (
        <TestimonialForm
          initial={editingTestimonial ?? undefined}
          isLoading={editingTestimonial ? isUpdating : isAdding}
          onSubmit={editingTestimonial ? (fd) => handleUpdate(editingTestimonial._id, fd) : handleAdd}
          onCancel={() => { setShowAddForm(false); setEditingId(null); }}
        />
      )}

      <AdminTestimonialsSearch
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        selectedStatus={statusFilter}
        onStatusChange={handleStatusChange}
      />

      <div className="border border-gray-200 rounded-md overflow-hidden">
        <CommonDataTable
          rows={testimonials}
          columns={columns}
          getRowId={(row) => row._id}
          loading={isLoading || isFetching}
          paginationMode="server"
          rowCount={totalTestimonials}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
        />
      </div>
    </div>
  );
}
