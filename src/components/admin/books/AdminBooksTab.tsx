'use client';

import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { type GridColDef } from '@mui/x-data-grid';
import { Eye, Edit2, Trash2, RotateCcw, ChevronDown, Loader2 } from 'lucide-react';
import { useGetAllBooksQuery } from '@/store/rtkQueries/adminGetApi';
import {
  useAddBookMutation,
  useUpdateBookMutation,
  useDeleteBookMutation,
  useRestoreBookMutation,
} from '@/store/rtkQueries/adminPostApi';
import { closeModal, openModal } from '@/store/slices/allModalSlice';
import { useDebounce } from '@/hooks/useDebounce';
import CommonDataTable from '../CommonDataTable';
import { AdminBooksHeader } from './AdminBooksHeader';
import { AdminBooksSearch } from './AdminBooksSearch';
import { BookPreviewModal } from './BookPreviewModal';
import { AddBookModal } from './AddBookModal';
import { EditBookModal } from './EditBookModal';
import ImageComponent from '@/components/ui/ImageComponent';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import toast from '@/utils/toast';
import { useGetAllUsersQuery } from '@/store/rtkQueries/rolesPermissionsApi';

const STATUS_CONFIG: Record<string, { badge: string; dot: string; label: string }> = {
  Published: {
    badge: 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100',
    dot: 'bg-green-500',
    label: 'Published',
  },
  Draft: {
    badge: 'bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100',
    dot: 'bg-yellow-500',
    label: 'Draft',
  },
};

const STATUSES = ['Published', 'Draft'] as const;

export function AdminBooksTab() {
  const dispatch = useDispatch();
  const [search, setSearch] = useState('');
  const [selectedLeader, setSelectedLeader] = useState('');
  const [filterByStatus, setFilterByStatus] = useState('');
  const [isTrashView, setIsTrashView] = useState(false);
  const [filterByIsMine, setFilterByIsMine] = useState(false);
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
  const [previewBook, setPreviewBook] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const debouncedSearch = useDebounce(search, 500);

  const { data: booksResponse, isLoading } = useGetAllBooksQuery({
    page: paginationModel.page + 1,
    limit: paginationModel.pageSize,
    ...(debouncedSearch.trim() ? { search: debouncedSearch.trim() } : {}),
    ...(selectedLeader ? { mentor_id: selectedLeader } : {}),
    ...(filterByStatus ? { status: filterByStatus } : {}),
    ...(isTrashView ? { isDeleted: true } : {}),
    ...(filterByIsMine ? { isMine: true } : {}),
  });

  const { data: leadersResponse } = useGetAllUsersQuery({ user_type: 'mentor' });

  const books = booksResponse?.data?.data ?? [];
  const thoughtLeaders = leadersResponse?.data?.data ?? [];
  const leaderOptions = thoughtLeaders.map((l) => ({ value: l._id, label: l.name }));

  const totalBooks = booksResponse?.data?.total ?? 0;

  const [addBook, { isLoading: isAdding }] = useAddBookMutation();
  const [updateBook, { isLoading: isUpdating }] = useUpdateBookMutation();
  const [deleteBook] = useDeleteBookMutation();
  const [restoreBook] = useRestoreBookMutation();

  useEffect(() => {
    setPaginationModel((prev) => ({ ...prev, page: 0 }));
  }, [debouncedSearch, selectedLeader, filterByStatus, isTrashView, filterByIsMine]);

  const onDeleteBook = async (id: string) => {
    try {
      const res = await deleteBook({ id }).unwrap();
      if (res?.http_status_code === 200 || res?.http_status_code === 201) {
        toast.success(res.message ?? 'Series deleted successfully');
        dispatch(closeModal());
      }
    } catch (error) {
      console.error('Error deleting series:', error);
    }
  };

  const onRestoreBook = async (id: string) => {
    try {
      const res = await restoreBook({ id }).unwrap();
      if (res?.http_status_code === 200 || res?.http_status_code === 201) {
        toast.success(res.message ?? 'Series restored successfully');
        dispatch(closeModal());
      }
    } catch (error) {
      console.error('Error restoring series:', error);
    }
  };

  const handleStatusChange = async (book: { _id?: string; id?: string; status?: string }, status: string) => {
    const id = book._id ?? book.id ?? '';
    if (!id || status === book.status || updatingId) return;

    const formData = new FormData();
    formData.append('status', status);
    setUpdatingId(id);

    try {
      const res = await updateBook({ id, values: formData }).unwrap();
      if (res?.http_status_code === 200 || res?.http_status_code === 201) {
        toast.success(res.message ?? `Series marked as ${status}`);
      }
    } catch {
      toast.error('Failed to update status');
    } finally {
      setUpdatingId(null);
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
      headerName: 'Series Title',
      minWidth: 150,
      flex: 1,
      sortable: false,
      renderCell: (params) => (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-sm bg-muted shrink-0 overflow-hidden">
            {params.row.coverImage ? (
              <ImageComponent
                src={params.row.coverImage}
                alt={params.row.title}
                object_cover={true}
              />
            ) : null}
          </div>
          <p className="font-medium text-sm whitespace-nowrap">{params.row.title}</p>
        </div>
      ),
    },
    {
      field: 'mentor',
      headerName: 'Mentor',
      minWidth: 160,
      sortable: false,
      valueGetter: (_value, row) => row.createdBy?.name ?? 'Unknown',
      renderCell: (params) => (
        <span className="text-sm whitespace-nowrap">{params.value}</span>
      ),
    },
    // {
    //   field: 'category',
    //   headerName: 'Category',
    //   minWidth: 140,
    //   sortable: false,
    //   valueGetter: (_value, row) => row.category?.name ?? 'N/A',
    //   renderCell: (params) => (
    //     <Badge variant="outline" className="text-xs whitespace-nowrap">
    //       {params.value}
    //     </Badge>
    //   ),
    // },
    {
      field: 'pricingModel',
      headerName: 'Pricing',
      width: 120,
      sortable: false,
      renderCell: (params) => (
        <span className="text-sm capitalize whitespace-nowrap">
          {params.value === 'book' ? 'Series' : 'Blueprint'}
        </span>
      ),
    },
    {
      field: 'price',
      headerName: 'Price',
      width: 120,
      sortable: false,
      renderCell: (params) => (
        <span className="text-sm font-semibold text-primary whitespace-nowrap">
          {params.row.pricingModel === 'book' && params.value != null
            ? `KSH ${Number(params.value).toFixed(2)}`
            : '—'}
        </span>
      ),
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 150,
      sortable: false,
      renderCell: (params) => {
        const book = params.row;
        const config = STATUS_CONFIG[book.status] ?? STATUS_CONFIG.Draft;
        const bookId = book._id ?? book.id;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild disabled={!!updatingId}>
              <button type="button" className="focus:outline-none">
                <Badge
                  variant="outline"
                  className={`cursor-pointer select-none transition-colors flex items-center gap-1.5 ${config.badge}`}
                >
                  {updatingId === bookId ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
                  )}
                  {book.status}
                  <ChevronDown className="h-3 w-3 opacity-60" />
                </Badge>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-40">
              <DropdownMenuLabel className="text-xs text-muted-foreground font-normal">
                Change status
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {STATUSES.map((s) => (
                <DropdownMenuItem
                  key={s}
                  onSelect={() => handleStatusChange(book, s)}
                  className="flex items-center gap-2"
                  disabled={book.status === s}
                >
                  <span className={`h-2 w-2 rounded-full ${STATUS_CONFIG[s].dot}`} />
                  {STATUS_CONFIG[s].label}
                  {book.status === s ? (
                    <span className="ml-auto text-xs text-muted-foreground">current</span>
                  ) : null}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      sortable: false,
      renderCell: (params) => (
        <div className="action_buttons">
          <button
            type="button"
            className="active_button"
            title="View series"
            onClick={() => setPreviewBook(params.row)}
          >
            <Eye className="h-4 w-4" />
          </button>
          {isTrashView ? (
            <button
              type="button"
              className="active_button"
              title="Restore series"
              onClick={() => dispatch(openModal({
                componentName: 'RestoreConfirmation',
                data: {
                  itemName: params.row.title,
                  onRestore: () => onRestoreBook(params.row._id),
                },
              }))}
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          ) : (
            <>
              <button
                type="button"
                className="edit_button"
                onClick={() => setEditingBook(params.row)}
              >
                <Edit2 className="h-4 w-4" />
              </button>
              <button
                type="button"
                className="delete_button"
                onClick={() => dispatch(openModal({
                  componentName: 'DeleteConfirmation',
                  data: {
                    itemName: params.row.title,
                    onDelete: () => onDeleteBook(params.row._id),
                  },
                }))}
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
      <AdminBooksHeader
        onCreateBook={() => setIsCreateModalOpen(true)}
        isTrashView={isTrashView}
        onToggleTrash={() => setIsTrashView((prev) => !prev)}
      />

      <AdminBooksSearch
        searchQuery={search}
        onSearchChange={setSearch}
        leaders={leaderOptions}
        selectedLeader={selectedLeader}
        onLeaderChange={setSelectedLeader}
        selectedStatus={filterByStatus}
        onStatusChange={setFilterByStatus}
        isMine={filterByIsMine}
        onIsMineChange={setFilterByIsMine}
      />

      <div className="border border-gray-200 rounded-md overflow-hidden">
        <CommonDataTable
          rows={books}
          columns={columns}
          getRowId={(row) => row.id ?? row._id}
          loading={isLoading}
          paginationMode="server"
          rowCount={totalBooks}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
        />
      </div>

      <BookPreviewModal
        book={previewBook}
        open={!!previewBook}
        onOpenChange={(open) => !open && setPreviewBook(null)}
      />

      <AddBookModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        // categories={categories}
        onSubmit={addBook}
        isSubmitting={isAdding}
      />

      <EditBookModal
        book={editingBook}
        open={!!editingBook}
        onOpenChange={(open) => !open && setEditingBook(null)}
        onSubmit={updateBook}
        isSubmitting={isUpdating}
      />
    </div>
  );
}
