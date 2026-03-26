'use client';

import { FileText, MoreVertical, Eye, Edit, Trash2, ChevronDown, Loader2 } from 'lucide-react';
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
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '../../ui/dropdown-menu';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { IAllChaptersAPIResponseData } from '@/types/chapter';
import { getEditChapterRoutePath } from '@/routes/routes';
import ImageComponent from '@/components/ui/ImageComponent';
import { useUpdateChapterMutation } from '@/store/rtkQueries/adminPostApi';
import toast from '@/utils/toast';

interface ChapterListingProps {
  data: IAllChaptersAPIResponseData[];
  searchQuery?: string;
  setPreviewChapter: (chapter: IAllChaptersAPIResponseData | null) => void;
  setDeleteConfirmChapter: (chapter: IAllChaptersAPIResponseData | null) => void;
}

const STATUS_CONFIG: Record<string, { badge: string; dot: string; label: string }> = {
  Published: {
    badge: 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100',
    dot: 'bg-green-500',
    label: 'Published',
  },
  Draft: {
    badge: 'bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100',
    dot: 'bg-yellow-500',
    label: 'Draft',
  },
};

const STATUSES = ['Published', 'Draft'] as const;

export function ChapterListing({ data, searchQuery = '', setPreviewChapter, setDeleteConfirmChapter }: ChapterListingProps) {
  const router = useRouter();
  const [updateChapter] = useUpdateChapterMutation();
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const handleStatusChange = async (chapter: IAllChaptersAPIResponseData, status: string) => {
    if (status === chapter.status || updatingId) return;
    const formData = new FormData();
    formData.append('status', status);
    setUpdatingId(chapter.id);
    try {
      await updateChapter({ id: chapter.id, values: formData }).unwrap();
      toast.success(`Chapter marked as ${status}`);
    } catch {
      toast.error('Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

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
            {data && data.length > 0 && data?.map((chapter) => {
              return (
                <TableRow key={chapter.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-lg bg-muted shrink-0 overflow-hidden">
                        {chapter?.coverImage && (
                          <ImageComponent
                            src={chapter?.coverImage}
                            alt={chapter.title}
                            object_cover={true}
                          />
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="font-medium line-clamp-1 truncate max-w-40">{chapter.title}</div>
                        <div className="text-sm text-muted-foreground line-clamp-1">
                          Chapter {chapter.number}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="line-clamp-1 truncate max-w-40">{chapter?.book?.title || 'N/A'}</div>
                  </TableCell>
                  <TableCell>
                    <div className="line-clamp-1 truncate max-w-40">{chapter?.book?.thoughtLeader?.fullName || 'Unknown'}</div>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    <span className="font-semibold text-primary">
                      KSH {chapter.price.toFixed(2)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild disabled={!!updatingId}>
                        <button className="focus:outline-none">
                          <Badge
                            variant="outline"
                            className={`cursor-pointer select-none transition-colors flex items-center gap-1.5 ${(STATUS_CONFIG[chapter.status] ?? STATUS_CONFIG['Draft']).badge}`}
                          >
                            {updatingId === chapter.id ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <span className={`h-1.5 w-1.5 rounded-full ${(STATUS_CONFIG[chapter.status] ?? STATUS_CONFIG['Draft']).dot}`} />
                            )}
                            {chapter.status}
                            <ChevronDown className="h-3 w-3 opacity-60" />
                          </Badge>
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start" className="w-40">
                        <DropdownMenuLabel className="text-xs text-muted-foreground font-normal">
                          Change status
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {STATUSES.map((s) => (
                          <DropdownMenuItem
                            key={s}
                            onSelect={() => handleStatusChange(chapter, s)}
                            className="flex items-center gap-2"
                            disabled={chapter.status === s}
                          >
                            <span className={`h-2 w-2 rounded-full ${STATUS_CONFIG[s].dot}`} />
                            {STATUS_CONFIG[s].label}
                            {chapter.status === s && (
                              <span className="ml-auto text-xs text-muted-foreground">current</span>
                            )}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button isIconOnly className="global_btn rounded_full bg_transparent icon_btn fit_btn">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onSelect={() => setPreviewChapter(chapter)}>
                          <Eye className="h-4 w-4 mr-2" />
                          Preview
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => router.push(getEditChapterRoutePath(chapter.id))}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onSelect={() => setDeleteConfirmChapter(chapter)}
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

        {data && data.length === 0 && (
          <div className="p-12">
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-accent rounded-full flex items-center justify-center">
                <FileText className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h3 className="font-bold">No chapters found</h3>
                <p className="text-muted-foreground">
                  {searchQuery.trim()
                    ? `No chapters match "${searchQuery}"`
                    : 'Create your first chapter to get started'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
