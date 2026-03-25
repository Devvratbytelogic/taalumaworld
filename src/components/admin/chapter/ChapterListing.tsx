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
import { useRouter } from 'next/navigation';
import { IAllChaptersAPIResponseData } from '@/types/chapter';
import { getEditChapterRoutePath } from '@/routes/routes';
import ImageComponent from '@/components/ui/ImageComponent';

interface ChapterListingProps {
  data: IAllChaptersAPIResponseData[];
  setPreviewChapter: (chapter: IAllChaptersAPIResponseData | null) => void;
  setDeleteConfirmChapter: (chapter: IAllChaptersAPIResponseData | null) => void;
}

export function ChapterListing({ data, setPreviewChapter, setDeleteConfirmChapter }: ChapterListingProps) {
  const router = useRouter();
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
                  Create your first chapter to get started
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
