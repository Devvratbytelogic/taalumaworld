import { MoreVertical, Eye, Edit, Trash2 } from 'lucide-react';
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
    <article className="admin-surface group flex gap-4 p-4 transition-shadow hover:shadow-[0_4px_12px_rgba(15,23,42,0.08)]">
      <button
        type="button"
        onClick={() => onPreview(book)}
        className="relative h-28 w-20 shrink-0 overflow-hidden rounded-lg bg-slate-100"
      >
        <img
          src={book.coverImage ?? ''}
          alt={book.title}
          className="h-full w-full object-cover transition-transform group-hover:scale-105"
        />
      </button>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <button
            type="button"
            onClick={() => onPreview(book)}
            className="min-w-0 text-left"
          >
            <h3 className="line-clamp-1 text-base font-semibold text-slate-900 group-hover:text-primary">
              {book.title}
            </h3>
            <p className="mt-0.5 line-clamp-1 text-sm text-slate-500">
              by {book.thoughtLeader?.fullName ?? 'Unknown mentor'}
            </p>
          </button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition-colors hover:bg-slate-50"
              >
                <MoreVertical className="h-4 w-4" />
              </button>
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

        <div className="mt-2 flex flex-wrap items-center gap-1.5">
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

        {book.description ? (
          <p className="mt-2 line-clamp-2 text-sm text-slate-500">{book.description}</p>
        ) : null}

        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
          <span className="text-slate-500">
            Pricing Type:{' '}
            <span className="font-medium capitalize text-slate-700">
              {book.pricingModel === 'book' ? 'series' : 'blueprint'}
            </span>
          </span>
          {book.pricingModel === 'book' && book.price != null ? (
            <span className="font-semibold text-primary">KSH {Number(book.price).toFixed(2)}</span>
          ) : null}
        </div>
      </div>
    </article>
  );
}
