import { useMemo, useState } from 'react';
import { useGetAllAuthorLeadersQuery } from '@/store/rtkQueries/adminGetApi';
import AdminAuthorsSkeleton from '@/components/skeleton-loader/AdminAuthorsSkeleton';
import {
  useAddAuthorLeaderMutation,
  useUpdateAuthorLeaderMutation,
  useDeleteAuthorLeaderMutation,
} from '@/store/rtkQueries/adminPostApi';
import toast from '@/utils/toast';
import type { Author } from '@/types/content';
import type { LeadersEntity } from '@/types/authleaders';
import { AdminAuthorsHeader } from './AdminAuthorsHeader';
import { AdminAuthorsStats } from './AdminAuthorsStats';
import { AdminAuthorsSearch } from './AdminAuthorsSearch';
import { AuthorListing } from './AuthorListing';
import { AddAuthorModal, type AddAuthorFormValues } from './AddAuthorModal';
import { DeleteAuthorDialog } from './DeleteAuthorDialog';

function mapLeaderToAuthor(leader: LeadersEntity): Author {
  return {
    id: leader.id ?? leader._id,
    name: leader.fullName,
    bio: leader.professionalBio ?? '',
    avatar: leader.avatar ?? '',
    followersCount: leader.followersCount ?? 0,
    status: leader.status?.toLowerCase() ?? 'pending',
  };
}

export function AdminAuthorsTab() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [deleteConfirmAuthor, setDeleteConfirmAuthor] = useState<Author | null>(null);

  const { data: leadersResponse, isLoading } = useGetAllAuthorLeadersQuery();
  const [addAuthorLeader] = useAddAuthorLeaderMutation();
  const [updateAuthorLeader] = useUpdateAuthorLeaderMutation();
  const [deleteAuthorLeader] = useDeleteAuthorLeaderMutation();

  const authors: Author[] = useMemo(() => {
    const leaders = leadersResponse?.data?.leaders ?? [];
    return leaders.map(mapLeaderToAuthor);
  }, [leadersResponse?.data?.leaders]);

  const filteredAuthors = authors.filter(
    (author) =>
      author?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (author.bio && author.bio.toLowerCase().includes(searchQuery.toLowerCase()))
  );

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

  const handleAddAuthor = async (values: AddAuthorFormValues) => {
    const formData = new FormData();
    formData.append('fullName', values.fullName);
    formData.append('email', values.email);
    formData.append('professionalBio', values.professionalBio);
    formData.append('status', values.status);
    if (values.avatar) {
      formData.append('avatar', values.avatar);
    }
    await addAuthorLeader(formData).unwrap();
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <AdminAuthorsHeader onCreateAuthor={() => setIsCreateModalOpen(true)} />
        <AdminAuthorsSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AdminAuthorsHeader onCreateAuthor={() => setIsCreateModalOpen(true)} />

      <AdminAuthorsStats authors={authors} />

      <AdminAuthorsSearch
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <AuthorListing
        authors={filteredAuthors}
        searchQuery={searchQuery}
        onCreateAuthor={() => setIsCreateModalOpen(true)}
        onUpdateStatus={handleUpdateStatus}
        onDelete={handleDeleteAuthor}
      />

      <AddAuthorModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onSubmitForm={handleAddAuthor}
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
