import { useState } from 'react';
import { Plus, FileText, MoreVertical, Eye, Edit, Trash2, Search, Filter } from 'lucide-react';
import Button from '../ui/Button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { useGetAllChaptersQuery } from '../../store/api/chaptersApi';
import { useGetAllBooksQuery } from '../../store/api/booksApi';
import { useGetAuthorsQuery } from '../../store/api/authorsApi';
import type { ContentMode } from '../../types/admin';

interface AdminChaptersTabProps {
  contentMode?: ContentMode;
}

export function AdminChaptersTab({ contentMode = 'chapters' }: AdminChaptersTabProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const { data: chapters = [] } = useGetAllChaptersQuery();
  const { data: books = [] } = useGetAllBooksQuery();
  const { data: authors = [] } = useGetAuthorsQuery();

  const filteredChapters = chapters.filter(chapter =>
    chapter.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chapter.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="bg-white rounded-3xl p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Chapters Management
            </h1>
            <p className="text-muted-foreground">
              Manage all chapters across all books
            </p>
          </div>
          <Button onClick={() => setIsCreateModalOpen(true)} className="global_btn rounded_full bg_primary">
            <Plus className="h-4 w-4" />
            Create New Chapter
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-3xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search chapters by title, book, or author..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button className="global_btn rounded_full outline_primary">
            <Filter className="h-4 w-4" />
            Filters
          </Button>
        </div>
      </div>

      {/* Chapters Table */}
      <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Chapter Title</TableHead>
              <TableHead>Book</TableHead>
              <TableHead>Thought Leader</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredChapters.map((chapter) => {
              const book = books.find((b) => b.id === chapter.bookId);
              const author = book ? authors.find((a) => a.id === book.authorId) : null;

              return (
                <TableRow key={chapter.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-lg bg-muted shrink-0 overflow-hidden">
                        {chapter.featuredImage && (
                          <img
                            src={chapter.featuredImage}
                            alt={chapter.title}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="font-medium line-clamp-1">{chapter.title}</div>
                        <div className="text-sm text-muted-foreground line-clamp-1">
                          Chapter {chapter.sequence}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="line-clamp-1">{book?.title || 'N/A'}</div>
                  </TableCell>
                  <TableCell>
                    <div className="line-clamp-1">{author?.name || 'Unknown'}</div>
                  </TableCell>
                  <TableCell>
                    <span className="font-semibold text-primary">
                      ${chapter.price.toFixed(2)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      Published
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button className="global_btn rounded_full bg_transparent">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="h-4 w-4 mr-2" />
                          Preview
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        {filteredChapters.length === 0 && (
          <div className="p-12">
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-accent rounded-full flex items-center justify-center">
                <FileText className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h3 className="font-bold">No chapters found</h3>
                <p className="text-muted-foreground">
                  {searchQuery ? 'Try adjusting your search query' : 'Create your first chapter to get started'}
                </p>
              </div>
              {!searchQuery && (
                <Button onPress={() => setIsCreateModalOpen(true)} className="global_btn rounded_full bg_primary">
                  Create Your First Chapter
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}