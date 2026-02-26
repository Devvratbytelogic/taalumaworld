import { Users, Book, Star } from 'lucide-react';
import { Card } from '../../ui/card';
import type { Author } from '../../../data/mockData';

interface AdminAuthorsStatsProps {
  authors: Author[];
}

export function AdminAuthorsStats({ authors }: AdminAuthorsStatsProps) {
  const totalAuthors = authors.length;
  const publishedBooks = authors.reduce((sum, a) => sum + a.booksCount, 0);
  // Avg. Rating and Total Followers can be wired when API supports them
  const avgRating = '—';
  const totalFollowers = '—';

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card className="p-4 bg-white rounded-3xl shadow-sm border">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 rounded-lg">
            <Users className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Authors</p>
            <p className="text-2xl font-bold">{totalAuthors}</p>
          </div>
        </div>
      </Card>
      <Card className="p-4 bg-white rounded-3xl shadow-sm border">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-50 rounded-lg">
            <Book className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Published Books</p>
            <p className="text-2xl font-bold">{publishedBooks}</p>
          </div>
        </div>
      </Card>
      <Card className="p-4 bg-white rounded-3xl shadow-sm border">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-50 rounded-lg">
            <Star className="h-5 w-5 text-purple-600" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Avg. Rating</p>
            <p className="text-2xl font-bold">{avgRating}</p>
          </div>
        </div>
      </Card>
      <Card className="p-4 bg-white rounded-3xl shadow-sm border">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-50 rounded-lg">
            <Users className="h-5 w-5 text-orange-600" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Followers</p>
            <p className="text-2xl font-bold">{totalFollowers}</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
