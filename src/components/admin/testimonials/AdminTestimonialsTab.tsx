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
import { AdminTestimonialsHeader } from './AdminTestimonialsHeader';
import { AdminTestimonialsSearch } from './AdminTestimonialsSearch';
import { TestimonialForm } from './TestimonialForm';
import { TestimonialListing } from './TestimonialListing';
import { DeleteTestimonialDialog } from './DeleteTestimonialDialog';
import { useDebounce } from '@/hooks/useDebounce';

export function AdminTestimonialsTab() {
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [pageLimit, setPageLimit] = useState(10);
  const debouncedSearch = useDebounce(searchQuery, 500);
  const queryParams = {
    page,
    limit: pageLimit,
    ...(debouncedSearch.trim() ? { search: debouncedSearch.trim() } : {}),
  };
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteConfirmTestimonial, setDeleteConfirmTestimonial] = useState<ITestimonialsDataEntity | null>(null);

  const { data, isLoading, isFetching } = useGetAllTestimonialsQuery(queryParams);
  const [addTestimonial, { isLoading: isAdding }] = useAddTestimonialMutation();
  const [updateTestimonial, { isLoading: isUpdating }] = useUpdateTestimonialMutation();
  const [deleteTestimonial, { isLoading: isDeleting }] = useDeleteTestimonialMutation();

  const testimonials = data?.data ?? [];

  const handleAdd = async (formData: FormData) => {
    try {
      await addTestimonial(formData).unwrap();
      toast.success('Testimonial added successfully');
      setShowAddForm(false);
    } catch {
      // Error handled by API layer
    }
  };

  const handleUpdate = async (id: string, formData: FormData) => {
    try {
      await updateTestimonial({ id, values: formData }).unwrap();
      toast.success('Testimonial updated successfully');
      setEditingId(null);
    } catch {
      // Error handled by API layer
    }
  };

  const confirmDelete = async () => {
    if (!deleteConfirmTestimonial) return;
    try {
      await deleteTestimonial({ id: deleteConfirmTestimonial._id }).unwrap();
      toast.success('Testimonial deleted');
      setDeleteConfirmTestimonial(null);
    } catch {
      // Error handled by API layer
    }
  };

  return (
    <div className="space-y-6">
      <AdminTestimonialsHeader
        totalCount={testimonials.length}
        onAddTestimonial={() => { setShowAddForm(true); setEditingId(null); }}
      />

      {showAddForm && (
        <TestimonialForm
          isLoading={isAdding}
          onSubmit={handleAdd}
          onCancel={() => setShowAddForm(false)}
        />
      )}

      <AdminTestimonialsSearch searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      {isLoading || isFetching ? (
        <AdminTestimonialsSkeleton />
      ) : (
        <TestimonialListing
          testimonials={testimonials}
          editingId={editingId}
          isUpdating={isUpdating}
          onEdit={(id) => { setEditingId(id); setShowAddForm(false); }}
          onCancelEdit={() => setEditingId(null)}
          onUpdate={handleUpdate}
          onDelete={setDeleteConfirmTestimonial}
        />
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
