import { Plus, FileText, MoreVertical, Eye, Edit, Trash2 } from 'lucide-react';
import Button from '../../ui/Button';
import { Badge } from '../../ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../ui/dropdown-menu';
import type { Chapter } from '../../../data/mockData';
import type { Book } from '../../../data/mockData';
import type { Author } from '../../../data/mockData';

interface ChapterListingProps {
  chapters: Chapter[];
  books: Book[];
  authors: Author[];
  searchQuery: string;
  onCreateChapter: () => void;
  onPreview: (chapter: Chapter) => void;
  onEdit: (chapter: Chapter) => void;
  onDelete: (chapter: Chapter) => void;
}

export function ChapterListing({
  chapters,
  books,
  authors,
  searchQuery,
  onCreateChapter,
  onPreview,
  onEdit,
  onDelete,
}: ChapterListingProps) {
  return (
    <>
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
            {chapters.map((chapter) => {
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
                        <DropdownMenuItem onSelect={() => onPreview(chapter)}>
                          <Eye className="h-4 w-4 mr-2" />
                          Preview
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => onEdit(chapter)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onSelect={() => onDelete(chapter)}
                        >
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

        {chapters.length === 0 && (
          <div className="p-12">
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-accent rounded-full flex items-center justify-center">
                <FileText className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h3 className="font-bold">No chapters found</h3>
                <p className="text-muted-foreground">
                  {searchQuery
                    ? 'Try adjusting your search query'
                    : 'Create your first chapter to get started'}
                </p>
              </div>
              {!searchQuery && (
                <Button
                  onPress={onCreateChapter}
                  className="global_btn rounded_full bg_primary"
                  startContent={<Plus className="h-4 w-4" />}
                >
                  Create Your First Chapter
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
