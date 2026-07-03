import { Users, Book } from 'lucide-react';
import { AdminStatCard } from '@/components/admin/layout/AdminContent';
import type { Author } from '@/types/content';

interface AdminAuthorsStatsProps {
  authors: Author[];
}

export function AdminAuthorsStats({ authors }: AdminAuthorsStatsProps) {
  const totalAuthors = authors.length;
  const publishedBooks = authors.reduce((sum, a) => sum + (a.followersCount ?? 0), 0);

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      <AdminStatCard label="Total mentors" value={totalAuthors} icon={Users} tone="blue" />
      <AdminStatCard label="Published series" value={publishedBooks} icon={Book} tone="green" />
    </div>
  );
}
