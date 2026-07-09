'use client';

import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { type GridColDef } from '@mui/x-data-grid';
import { Eye, Edit2, Trash2 } from 'lucide-react';
import { useGetAllBooksQuery, useGetAllAuthorLeadersQuery, useGetAllCategoriesQuery, } from '@/store/rtkQueries/adminGetApi';
import { useAddBookMutation, useUpdateBookMutation, useDeleteBookMutation } from '@/store/rtkQueries/adminPostApi';
import type { IAllBooksAPIResponseDataEntity } from '@/types/books';
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
import toast from '@/utils/toast';

export function AdminBooksTab() {
  const dispatch = useDispatch();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLeader, setSelectedLeader] = useState('');
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
  const [previewBook, setPreviewBook] = useState<IAllBooksAPIResponseDataEntity | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<IAllBooksAPIResponseDataEntity | null>(null);

  const debouncedSearch = useDebounce(search, 500);

  const { data: booksResponse, isLoading } = useGetAllBooksQuery({
    page: paginationModel.page + 1,
    limit: paginationModel.pageSize,
    ...(debouncedSearch.trim() ? { search: debouncedSearch.trim() } : {}),
    ...(selectedCategory ? { category: selectedCategory } : {}),
    ...(selectedLeader ? { leader: selectedLeader } : {}),
  });

  const { data: leadersResponse } = useGetAllAuthorLeadersQuery();
  const { data: categoriesResponse } = useGetAllCategoriesQuery();

  const books = booksResponse?.data?.data ?? [];
  const thoughtLeaders = leadersResponse?.data?.leaders ?? [];
  const categories = categoriesResponse?.data ?? [];
  const categoryOptions = categories.map((c) => ({ id: c._id, name: c.name }));
  const leaderOptions = thoughtLeaders.map((l) => ({ id: l._id ?? l.id, name: l.fullName }));

  const totalBooks = booksResponse?.data?.total ?? 0;

  const [addBook, { isLoading: isAdding }] = useAddBookMutation();
  const [updateBook, { isLoading: isUpdating }] = useUpdateBookMutation();
  const [deleteBook] = useDeleteBookMutation();

  useEffect(() => {
    setPaginationModel((prev) => ({ ...prev, page: 0 }));
  }, [debouncedSearch, selectedCategory, selectedLeader]);

  const onDeleteBook = async (id: string) => {
    try {
      await deleteBook({ id }).unwrap();
      toast.success('Series deleted successfully');
      dispatch(closeModal());
    } catch (error) {
      console.error('Error deleting series:', error);
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
      minWidth: 240,
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
      valueGetter: (_value, row) => row.thoughtLeader?.fullName ?? 'Unknown',
      renderCell: (params) => (
        <span className="text-sm whitespace-nowrap">{params.value}</span>
      ),
    },
    {
      field: 'category',
      headerName: 'Category',
      minWidth: 140,
      sortable: false,
      valueGetter: (_value, row) => row.category?.name ?? 'N/A',
      renderCell: (params) => (
        <Badge variant="outline" className="text-xs whitespace-nowrap">
          {params.value}
        </Badge>
      ),
    },
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
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      sortable: false,
      renderCell: (params) => (
        <div className="action_buttons">
          <button
            type="button"
            className="edit_button"
            onClick={() => setPreviewBook(params.row)}
          >
            <Eye className="h-4 w-4" />
          </button>
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
                onDelete: () => onDeleteBook(params.row.id ?? params.row._id),
              },
            }))}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <AdminBooksHeader onCreateBook={() => setIsCreateModalOpen(true)} />



      <AdminBooksSearch
        searchQuery={search}
        onSearchChange={setSearch}
        categories={categoryOptions}
        leaders={leaderOptions}
        selectedCategory={selectedCategory}
        selectedLeader={selectedLeader}
        onCategoryChange={setSelectedCategory}
        onLeaderChange={setSelectedLeader}
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
        thoughtLeaders={thoughtLeaders}
        categories={categories}
        onSubmit={addBook}
        isSubmitting={isAdding}
      />

      <EditBookModal
        book={editingBook}
        open={!!editingBook}
        onOpenChange={(open) => !open && setEditingBook(null)}
        thoughtLeaders={thoughtLeaders}
        categories={categories}
        onSubmit={updateBook}
        isSubmitting={isUpdating}
      />
    </div>
  );
}
