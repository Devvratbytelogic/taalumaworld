import { MoreVertical, Eye, Edit, Trash2 } from 'lucide-react';
import Button from '../../ui/Button';
import { Card, CardContent, CardHeader } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../../ui/dropdown-menu';
import { IAllBooksAPIResponseDataEntity } from '@/types/books';

interface BookCardProps {
  book: IAllBooksAPIResponseDataEntity;
  onPreview: (book: IAllBooksAPIResponseDataEntity) => void;
  onEdit: (book: IAllBooksAPIResponseDataEntity) => void;
  onDelete: (book: IAllBooksAPIResponseDataEntity) => void;
}

export function BookCard({ book, onPreview, onEdit, onDelete }: BookCardProps) {
  const category = book.category;
  const subcategory = book.subcategory;

  return (
    <Card className="admin-surface overflow-hidden transition-all">
      <div className="relative aspect-3/4 overflow-hidden bg-slate-100">
        <img
          src={book.coverImage ?? ''}
          alt={book.title}
          className="h-full w-full object-cover"
        />
        <div className="absolute top-3 right-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="global_btn bg_transparent icon_btn" isIconOnly>
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onSelect={() => onPreview(book)}>
                <Eye className="mr-2 h-4 w-4" />
                Preview
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => onEdit(book)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit series
              </DropdownMenuItem>
              <DropdownMenuItem className="text-destructive" onSelect={() => onDelete(book)}>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete series
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <CardHeader className="gap-1 px-5 pt-4 pb-2">
        <h3 className="line-clamp-1 text-base font-semibold text-slate-900">{book.title}</h3>
        <p className="line-clamp-1 text-sm text-slate-500">
          by {book.thoughtLeader?.fullName ?? 'Unknown mentor'}
        </p>
        <div className="flex flex-wrap items-center gap-2 pt-2">
          {category && category.name !== 'N/A' ? (
            <Badge variant="outline" className="border-slate-200 text-xs text-slate-600">
              {category.name}
            </Badge>
          ) : null}
          {subcategory?.name && subcategory?.name !== 'N/A' ? (
            <Badge variant="outline" className="border-slate-200 text-xs text-slate-600">
              {subcategory.name}
            </Badge>
          ) : null}
        </div>
      </CardHeader>

      <CardContent className="space-y-2 px-5 pb-5">
        <p className="line-clamp-2 text-sm text-slate-500">{book.description ?? ''}</p>
        <div className="text-sm text-slate-600">
          <span className="text-slate-400">Type:</span>
          <span className="ml-1 font-medium capitalize">
            {book.pricingModel === 'book' ? 'series' : (book.pricingModel ?? 'series')}
          </span>
        </div>
        {book.pricingModel === 'book' && book.price != null ? (
          <div className="pt-1">
            <span className="text-lg font-semibold text-primary">KSH {Number(book.price).toFixed(2)}</span>
            <span className="ml-1 text-sm text-slate-400">full series</span>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
