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
    <Card className="overflow-hidden rounded-3xl shadow-sm hover:shadow-lg transition-all">
      <div className="aspect-3/4 overflow-hidden bg-muted relative">
        <img
          src={book.coverImage ?? ''}
          alt={book.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 right-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                className="global_btn rounded_full bg_primary fit_btn"
                isIconOnly={true}
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onSelect={() => onPreview(book)}>
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => onEdit(book)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Book
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive"
                onSelect={() => onDelete(book)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Book
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <CardHeader className="pb-3">
        <h3 className="line-clamp-1 font-bold">{book.title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-1">
          by {book.thoughtLeader?.fullName ?? 'Unknown Thought Leader'}
        </p>
        <div className="flex items-center gap-2 flex-wrap pt-2">
          {category && category.name !== 'N/A' && (
            <Badge variant="outline" className="text-sm">
              {category.name}
            </Badge>
          )}
          {subcategory?.name && subcategory?.name !== 'N/A' && (
            <Badge variant="outline" className="text-sm">
              {subcategory.name}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="pb-3 space-y-2">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {book.description ?? ''}
        </p>

        <div className="text-sm">
          <span className="text-muted-foreground">Type:</span>
          <span className="ml-1 font-medium capitalize">{book.pricingModel ?? 'book'}</span>
        </div>

        {book.pricingModel === 'book' && book.price != null && (
          <div className="pt-2">
            <span className="text-lg font-bold text-primary">
              KSH {Number(book.price).toFixed(2)}
            </span>
            <span className="text-sm text-muted-foreground ml-1">
              full book
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
