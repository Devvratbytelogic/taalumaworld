import { useState, useEffect } from 'react';
import { useGetAllAuthorLeadersQuery } from '@/store/rtkQueries/adminGetApi';
import AdminAuthorsSkeleton from '@/components/skeleton-loader/AdminAuthorsSkeleton';
import { useUpdateAuthorLeaderMutation, useDeleteAuthorLeaderMutation } from '@/store/rtkQueries/adminPostApi';
import toast from '@/utils/toast';
import type { Author } from '@/types/content';
import { AdminAuthorsHeader } from './AdminAuthorsHeader';
import { AdminAuthorsStats } from './AdminAuthorsStats';
import { AdminAuthorsSearch } from './AdminAuthorsSearch';
import { AuthorListing } from './AuthorListing';
import { DeleteAuthorDialog } from './DeleteAuthorDialog';
import { useDebounce } from '@/hooks/useDebounce';


export function AdminAuthorsTab() {
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [pageLimit, setPageLimit] = useState(10);
  const debouncedSearch = useDebounce(searchQuery, 400);
  const [deleteConfirmAuthor, setDeleteConfirmAuthor] = useState<Author | null>(null);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const queryParams = {
    page,
    limit: pageLimit,
    ...(debouncedSearch.trim() ? { search: debouncedSearch.trim() } : {}),
  };

  const { data: leadersResponse, isLoading, isFetching } = useGetAllAuthorLeadersQuery(queryParams);
  const [updateAuthorLeader] = useUpdateAuthorLeaderMutation();
  const [deleteAuthorLeader] = useDeleteAuthorLeaderMutation();

  const authors = leadersResponse?.data?.leaders ?? [];
  const pagination = leadersResponse?.data?.pagination;
  const totalAuthors = pagination?.total ?? leadersResponse?.data?.totalAuthors ?? 0;
  const totalPages = pagination?.totalPages ?? Math.max(1, Math.ceil(totalAuthors / pageLimit));

  const handleUpdateStatus = async (author: Author, status: string) => {
    if (!author.id) return;
    try {
      const formData = new FormData();
      formData.append('status', status);
      await updateAuthorLeader({ id: author.id, values: formData }).unwrap();
      toast.success(`Status updated to ${status}`);
    } catch {
      toast.error('Failed to update status');
    }
  };

  const handleDeleteAuthor = (author: Author) => {
    setDeleteConfirmAuthor(author);
  };

  const confirmDeleteAuthor = async () => {
    if (!deleteConfirmAuthor) return;
    try {
      await deleteAuthorLeader({ id: deleteConfirmAuthor.id }).unwrap();
      toast.success(`"${deleteConfirmAuthor.name}" deleted`);
      setDeleteConfirmAuthor(null);
    } catch {
      toast.error('Failed to delete mentor');
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <AdminAuthorsHeader />
        <AdminAuthorsSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AdminAuthorsHeader />

      <AdminAuthorsStats authors={authors} />

      <AdminAuthorsSearch
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <AuthorListing
        authors={authors}
        searchQuery={debouncedSearch}
        page={page}
        pageLimit={pageLimit}
        totalAuthors={totalAuthors}
        totalPages={totalPages}
        isFetching={isFetching}
        onPageChange={setPage}
        onPageLimitChange={(limit) => {
          setPageLimit(limit);
          setPage(1);
        }}
        onUpdateStatus={handleUpdateStatus}
        onDelete={handleDeleteAuthor}
      />

      <DeleteAuthorDialog
        author={deleteConfirmAuthor}
        open={!!deleteConfirmAuthor}
        onOpenChange={(open) => !open && setDeleteConfirmAuthor(null)}
        onConfirm={confirmDeleteAuthor}
      />
    </div>
  );
}
