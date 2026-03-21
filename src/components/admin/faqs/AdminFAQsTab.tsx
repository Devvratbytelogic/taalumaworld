'use client';
import { useState } from 'react';
import toast from '@/utils/toast';
import { useGetAllFaqsQuery } from '@/store/rtkQueries/adminGetApi';
import {
  useAddFAQMutation,
  useUpdateFAQMutation,
  useDeleteFAQMutation,
} from '@/store/rtkQueries/adminPostApi';
import type { IAllFaqsDataEntity } from '@/types/faqs';
import AdminFAQsSkeleton from '@/components/skeleton-loader/AdminFAQsSkeleton';
import { AdminFAQsHeader } from './AdminFAQsHeader';
import { AdminFAQsSearch } from './AdminFAQsSearch';
import { FAQForm, type FAQFormValues } from './FAQForm';
import { FAQListing } from './FAQListing';
import { DeleteFAQDialog } from './DeleteFAQDialog';

export function AdminFAQsTab() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteConfirmFAQ, setDeleteConfirmFAQ] = useState<IAllFaqsDataEntity | null>(null);

  const { data, isLoading, isFetching } = useGetAllFaqsQuery();
  const [addFAQ, { isLoading: isAdding }] = useAddFAQMutation();
  const [updateFAQ, { isLoading: isUpdating }] = useUpdateFAQMutation();
  const [deleteFAQ, { isLoading: isDeleting }] = useDeleteFAQMutation();

  const faqs = data?.data ?? [];

  const filtered = faqs.filter(
    (f) =>
      f.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAdd = async (values: FAQFormValues) => {
    try {
      await addFAQ(values).unwrap();
      toast.success('FAQ added successfully');
      setShowAddForm(false);
    } catch {
      // Error handled by API layer
    }
  };

  const handleUpdate = async (id: string, values: FAQFormValues) => {
    try {
      await updateFAQ({ id, values }).unwrap();
      toast.success('FAQ updated successfully');
      setEditingId(null);
    } catch {
      // Error handled by API layer
    }
  };

  const confirmDelete = async () => {
    if (!deleteConfirmFAQ) return;
    try {
      await deleteFAQ({ id: deleteConfirmFAQ._id }).unwrap();
      toast.success('FAQ deleted');
      setDeleteConfirmFAQ(null);
    } catch {
      // Error handled by API layer
    }
  };

  return (
    <div className="space-y-8">
      <AdminFAQsHeader
        totalCount={faqs.length}
        onAddFAQ={() => { setShowAddForm(true); setEditingId(null); }}
      />

      {showAddForm && (
        <FAQForm
          isLoading={isAdding}
          onSubmit={handleAdd}
          onCancel={() => setShowAddForm(false)}
        />
      )}

      <AdminFAQsSearch searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      {isLoading || isFetching ? (
        <AdminFAQsSkeleton />
      ) : (
        <FAQListing
          faqs={filtered}
          editingId={editingId}
          isUpdating={isUpdating}
          onEdit={(id) => { setEditingId(id); setShowAddForm(false); }}
          onCancelEdit={() => setEditingId(null)}
          onUpdate={handleUpdate}
          onDelete={setDeleteConfirmFAQ}
        />
      )}

      <DeleteFAQDialog
        faq={deleteConfirmFAQ}
        open={!!deleteConfirmFAQ}
        onOpenChange={(open) => !open && setDeleteConfirmFAQ(null)}
        onConfirm={confirmDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
}
