import { Plus, Users, MoreVertical, Trash2 } from 'lucide-react';
import Button from '../../ui/Button';
import { Badge } from '../../ui/badge';
import ImageComponent from '@/components/ui/ImageComponent';
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
import { AdminEmptyState, AdminTableShell } from '@/components/admin/layout/AdminContent';
import type { Author } from '@/types/content';

const MENTOR_STATUSES = ['active', 'inactive', 'suspended', 'pending', 'rejected'];

const STATUS_COLORS: Record<string, string> = {
  active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  inactive: 'bg-slate-100 text-slate-600 border-slate-200',
  suspended: 'bg-amber-50 text-amber-700 border-amber-200',
  pending: 'bg-sky-50 text-sky-700 border-sky-200',
  rejected: 'bg-red-50 text-red-700 border-red-200',
};

interface AuthorListingProps {
  authors: Author[];
  searchQuery: string;
  onCreateAuthor: () => void;
  onUpdateStatus: (author: Author, status: string) => void;
  onDelete: (author: Author) => void;
}

export function AuthorListing({
  authors,
  searchQuery,
  onCreateAuthor,
  onUpdateStatus,
  onDelete,
}: AuthorListingProps) {
  return (
    <AdminTableShell>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Mentor</TableHead>
            <TableHead>Bio</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Series</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {authors.map((author) => {
            const status = author.status || 'pending';
            return (
              <TableRow key={author.id}>
                <TableCell className="max-w-44">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                      {author.avatar ? (
                        <ImageComponent
                          src={author.avatar}
                          alt={author.name ?? ''}
                          object_cover={true}
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-sm font-medium text-slate-500">
                          {author?.name?.substring(0, 2).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <p className="truncate font-medium text-slate-900">{author.name}</p>
                  </div>
                </TableCell>
                <TableCell className="max-w-sm">
                  <p className="line-clamp-2 text-sm text-slate-500">{author.bio || '—'}</p>
                </TableCell>
                <TableCell>
                  <Badge className={`capitalize ${STATUS_COLORS[status] ?? STATUS_COLORS.pending}`}>
                    {status}
                  </Badge>
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  <span className="font-medium text-slate-900">{author.followersCount}</span>
                  <span className="text-sm text-slate-400"> series</span>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button className="global_btn bg_transparent icon_btn" isIconOnly>
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {MENTOR_STATUSES.map((item) => (
                        <DropdownMenuItem
                          key={item}
                          disabled={status === item}
                          onSelect={() => onUpdateStatus(author, item)}
                        >
                          {item}
                        </DropdownMenuItem>
                      ))}
                      <DropdownMenuItem className="text-destructive" onSelect={() => onDelete(author)}>
                        <Trash2 className="mr-2 h-4 w-4" />
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

      {authors.length === 0 ? (
        <AdminEmptyState
          icon={Users}
          title="No mentors found"
          description={
            searchQuery
              ? 'Try adjusting your search query'
              : 'Add your first mentor to get started'
          }
          action={
            !searchQuery ? (
              <Button
                onPress={onCreateAuthor}
                className="global_btn rounded_full bg_primary"
                startContent={<Plus className="h-4 w-4" />}
              >
                Add mentor
              </Button>
            ) : undefined
          }
        />
      ) : null}
    </AdminTableShell>
  );
}
