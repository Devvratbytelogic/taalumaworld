import { Plus, Users, MoreVertical, Edit, Trash2 } from 'lucide-react';
import Button from '../../ui/Button';
import { Badge } from '../../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar';
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
import type { Author } from '../../../data/mockData';

interface AuthorListingProps {
  authors: Author[];
  searchQuery: string;
  onCreateAuthor: () => void;
  onEdit: (author: Author) => void;
  onDelete: (author: Author) => void;
}

export function AuthorListing({
  authors,
  searchQuery,
  onCreateAuthor,
  onEdit,
  onDelete,
}: AuthorListingProps) {
  return (
    <>
      <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Thought Leader</TableHead>
              <TableHead>Bio</TableHead>
              <TableHead>Books</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {authors.map((author) => (
              <TableRow key={author.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={author.avatar} alt={author.name} />
                      <AvatarFallback>{author.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{author.name}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <p className="text-sm text-muted-foreground line-clamp-2 max-w-md">
                    {author.bio || '—'}
                  </p>
                </TableCell>
                <TableCell>
                  <span className="font-medium">{author.booksCount}</span>
                  <span className="text-muted-foreground text-sm"> books</span>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button className="global_btn rounded_full bg_transparent" isIconOnly>
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onSelect={() => onEdit(author)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive"
                        onSelect={() => onDelete(author)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {authors.length === 0 && (
          <div className="p-12">
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-accent rounded-full flex items-center justify-center">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h3 className="font-bold">No thought leaders found</h3>
                <p className="text-muted-foreground">
                  {searchQuery
                    ? 'Try adjusting your search query'
                    : 'Add your first thought leader to get started'}
                </p>
              </div>
              {!searchQuery && (
                <Button
                  onPress={onCreateAuthor}
                  className="global_btn rounded_full bg_primary"
                  startContent={<Plus className="h-4 w-4" />}
                >
                  Add Your First Thought Leader
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
