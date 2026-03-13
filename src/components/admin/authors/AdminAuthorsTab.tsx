import { useMemo, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useGetAllAuthorLeadersQuery } from '@/store/rtkQueries/adminGetApi';
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
import { EditAuthorModal, type EditAuthorFormValues } from './EditAuthorModal';
import { DeleteAuthorDialog } from './DeleteAuthorDialog';

function mapLeaderToAuthor(leader: LeadersEntity): Author {
  return {
    id: leader.id ?? leader._id,
    name: leader.fullName,
    bio: leader.professionalBio ?? '',
    avatar: leader.avatar ?? '',
    booksCount: 0,
  };
}

export function AdminAuthorsTab() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingLeader, setEditingLeader] = useState<LeadersEntity | null>(null);
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
      author.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (author.bio && author.bio.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleEditAuthor = (author: Author) => {
    const leader = leadersResponse?.data?.leaders?.find(
      (l) => (l.id ?? l._id) === author.id
    );
    setEditingLeader(leader ?? null);
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
      toast.error('Failed to delete thought leader');
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

  const handleUpdateAuthor = async (
    id: string,
    values: EditAuthorFormValues
  ) => {
    const formData = new FormData();
    formData.append('fullName', values.fullName);
    formData.append('email', values.email);
    formData.append('professionalBio', values.professionalBio);
    formData.append('status', values.status);
    if (values.avatar) {
      formData.append('avatar', values.avatar);
    }
    await updateAuthorLeader({ id, values: formData }).unwrap();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-80">
        <div className="text-center">
          <Loader2 className="h-10 w-10 text-primary animate-spin mx-auto mb-3" />
          <p className="text-muted-foreground">Loading thought leaders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
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
        onEdit={handleEditAuthor}
        onDelete={handleDeleteAuthor}
      />

      <AddAuthorModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onSubmitForm={handleAddAuthor}
      />

      <EditAuthorModal
        leader={editingLeader}
        open={!!editingLeader}
        onOpenChange={(open) => !open && setEditingLeader(null)}
        onSubmitForm={handleUpdateAuthor}
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
