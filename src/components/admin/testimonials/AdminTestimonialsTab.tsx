'use client';
import { useState } from 'react';
import toast from '@/utils/toast';
import { useGetAllTestimonialsQuery } from '@/store/rtkQueries/adminGetApi';
import {
  useAddTestimonialMutation,
  useUpdateTestimonialMutation,
  useDeleteTestimonialMutation,
} from '@/store/rtkQueries/adminPostApi';
import type { ITestimonialsDataEntity } from '@/types/testimonial';
import AdminTestimonialsSkeleton from '@/components/skeleton-loader/AdminTestimonialsSkeleton';
import { AdminPagination } from '@/components/admin/shared/AdminPagination';
import { AdminTestimonialsHeader } from './AdminTestimonialsHeader';
import { AdminTestimonialsSearch } from './AdminTestimonialsSearch';
import { TestimonialForm } from './TestimonialForm';
import { TestimonialListing } from './TestimonialListing';
import { DeleteTestimonialDialog } from './DeleteTestimonialDialog';
import { useDebounce } from '@/hooks/useDebounce';

export function AdminTestimonialsTab() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [pageLimit, setPageLimit] = useState(10);
  const debouncedSearch = useDebounce(searchQuery, 500);
  const queryParams = {
    page,
    limit: pageLimit,
    ...(debouncedSearch.trim() ? { search: debouncedSearch.trim() } : {}),
    ...(statusFilter ? { status: statusFilter } : {}),
  };
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteConfirmTestimonial, setDeleteConfirmTestimonial] = useState<ITestimonialsDataEntity | null>(null);

  const { data, isLoading, isFetching } = useGetAllTestimonialsQuery(queryParams);
  const [addTestimonial, { isLoading: isAdding }] = useAddTestimonialMutation();
  const [updateTestimonial, { isLoading: isUpdating }] = useUpdateTestimonialMutation();
  const [deleteTestimonial, { isLoading: isDeleting }] = useDeleteTestimonialMutation();

  const listData = data?.data;
  const testimonials = listData?.data ?? [];
  const totalTestimonials = listData?.total ?? 0;
  const totalPages = listData?.totalPages ?? 1;

  const resetToFirstPage = () => setPage(1);

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
        toast.success(res.message ?? 'Testimonial updated successfully');
        setEditingId(null);
      }
    } catch {
      // Error handled by API layer
    }
  };

  const confirmDelete = async () => {
    if (!deleteConfirmTestimonial) return;
    try {
      const res = await deleteTestimonial({ id: deleteConfirmTestimonial._id }).unwrap();
      if (res?.http_status_code === 200 || res?.http_status_code === 201) {
        toast.success(res.message ?? 'Testimonial deleted');
        setDeleteConfirmTestimonial(null);
      }
    } catch {
      // Error handled by API layer
    }
  };

  return (
    <div className="space-y-6">
      <AdminTestimonialsHeader
        totalCount={totalTestimonials}
        onAddTestimonial={() => { setShowAddForm(true); setEditingId(null); }}
      />

      {showAddForm && (
        <TestimonialForm
          isLoading={isAdding}
          onSubmit={handleAdd}
          onCancel={() => setShowAddForm(false)}
        />
      )}

      <AdminTestimonialsSearch
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        selectedStatus={statusFilter}
        onStatusChange={handleStatusChange}
      />

      {isLoading || isFetching ? (
        <AdminTestimonialsSkeleton />
      ) : (
        <>
          <TestimonialListing
            testimonials={testimonials}
            editingId={editingId}
            isUpdating={isUpdating}
            onEdit={(id) => { setEditingId(id); setShowAddForm(false); }}
            onCancelEdit={() => setEditingId(null)}
            onUpdate={handleUpdate}
            onDelete={setDeleteConfirmTestimonial}
          />

          <AdminPagination
            page={page}
            limit={pageLimit}
            total={totalTestimonials}
            totalPages={totalPages}
            onPageChange={setPage}
            onLimitChange={(limit) => { setPageLimit(limit); resetToFirstPage(); }}
            itemLabel="testimonials"
          />
        </>
      )}

      <DeleteTestimonialDialog
        testimonial={deleteConfirmTestimonial}
        open={!!deleteConfirmTestimonial}
        onOpenChange={(open) => !open && setDeleteConfirmTestimonial(null)}
        onConfirm={confirmDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
}
