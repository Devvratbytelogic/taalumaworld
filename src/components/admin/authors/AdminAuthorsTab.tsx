/**
 * Admin Authors (Thought Leaders) Tab
 * Manage authors and thought leaders
 */

import { useState } from 'react';
import { useGetAuthorsQuery } from '../../../store/api/authorsApi';
import toast from '@/utils/toast';
import type { Author } from '../../../data/mockData';
import { AdminAuthorsHeader } from './AdminAuthorsHeader';
import { AdminAuthorsStats } from './AdminAuthorsStats';
import { AdminAuthorsSearch } from './AdminAuthorsSearch';
import { AuthorListing } from './AuthorListing';
import { AddAuthorModal } from './AddAuthorModal';
import { EditAuthorModal } from './EditAuthorModal';
import { DeleteAuthorDialog } from './DeleteAuthorDialog';

export function AdminAuthorsTab() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingAuthor, setEditingAuthor] = useState<Author | null>(null);
  const [deleteConfirmAuthor, setDeleteConfirmAuthor] = useState<Author | null>(null);

  const { data: authors = [] } = useGetAuthorsQuery();

  const filteredAuthors = authors.filter(
    (author) =>
      author.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (author.bio && author.bio.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleEditAuthor = (author: Author) => {
    setEditingAuthor(author);
  };

  const handleDeleteAuthor = (author: Author) => {
    setDeleteConfirmAuthor(author);
  };

  const confirmDeleteAuthor = () => {
    if (deleteConfirmAuthor) {
      toast.success(`"${deleteConfirmAuthor.name}" deleted`);
      setDeleteConfirmAuthor(null);
    }
  };

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
      />

      <EditAuthorModal
        author={editingAuthor}
        open={!!editingAuthor}
        onOpenChange={(open) => !open && setEditingAuthor(null)}
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
