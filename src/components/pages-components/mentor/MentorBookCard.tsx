import Link from 'next/link';
import { FileText } from 'lucide-react';
import ImageComponent from '@/components/ui/ImageComponent';
import { getSeriesRoutePath } from '@/routes/routes';
import type { IMentorBookEntity } from '@/types/user/mentorDetails';

interface MentorBookCardProps {
  book: IMentorBookEntity;
  index: number;
}

export default function MentorBookCard({ book, index }: MentorBookCardProps) {
  return (
    <Link
      href={getSeriesRoutePath(book?.slug ?? '')}
      className="group flex flex-col overflow-hidden rounded-lg border border-border bg-card animate-fade-in transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/10"
      style={{ animationDelay: `${index * 40}ms` }}
    >
      <div className="aspect-3/4 w-full overflow-hidden bg-muted">
        {book?.coverImage ? (
          <ImageComponent src={book?.coverImage} alt={book?.title ?? ''} object_cover />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-3 p-6 text-center">
            <FileText className="h-10 w-10 text-muted-foreground/40" />
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            {book?.pricingModel === 'chapter' ? 'By Blueprint' : 'Full Series'}
          </span>
          {book?.status && (
            <span className="rounded-full border border-border px-3 py-1 text-xs font-medium text-muted-foreground">
              {book?.status}
            </span>
          )}
        </div>

        <h3 className="mt-3 line-clamp-2 text-base font-semibold text-foreground">{book?.title}</h3>

        {book?.description && (
          <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{book?.description}</p>
        )}

        <div className="mt-4 flex flex-1 items-end justify-between border-t border-border-subtle pt-4">
          <span className="text-sm text-muted-foreground">View series</span>
          <span className="font-semibold text-primary">
            {book?.price > 0 ? `KSH ${book?.price.toFixed(2)}` : 'FREE'}
          </span>
        </div>
      </div>
    </Link>
  );
}
