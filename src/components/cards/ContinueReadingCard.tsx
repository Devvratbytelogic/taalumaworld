import { Card, CardContent } from '@/components/ui/card';
import Button from '@/components/ui/Button';
import type { Chapter, Book, Author } from '../../data/mockData';
import ImageComponent from '../ui/ImageComponent';
import { Badge } from '@/components/ui/badge';

interface ContinueReadingCardProps {
  chapter: Chapter;
  book?: Book;
  author?: Author;
  onClick: () => void;
  currentPage?: number;
  totalPages?: number;
  progress?: number; // Reading progress percentage (0-100)
}

export function ContinueReadingCard({
  chapter,
  book,
  onClick,
  currentPage = 0,
  totalPages = 0,
  progress = 0
}: ContinueReadingCardProps) {
  // Use provided progress or calculate from pages
  const progressPercentage = progress > 0 ? progress : (totalPages > 0 ? Math.round((currentPage / totalPages) * 100) : 0);

  return (
    <Card
      className="overflow-hidden cursor-pointer hover:border-primary/50 rounded-2xl transition-all border-border h-full"
      onClick={onClick}
    >
      <CardContent className="p-0 flex h-full">
        {/* Left Side - Image */}
        <div className="w-26.5 h-full flexshrink-0 relative">
          <ImageComponent
            src={book?.coverImage || 'https://images.unsplash.com/photo-1580330197548-6d9fa05e39d8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib29rJTIwY2hhcHRlciUyMHJlYWRpbmd8ZW58MXx8fHwxNzY3OTM0OTQ2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'}
            alt={chapter.title}
            object_cover={true}
          />
        </div>

        {/* Right Side - Content */}
        <div className="flex-1 pt-4 px-4 pb-4 flex flex-col gap-2.5">
          {/* Chapter Number Badge */}
          <Badge className="bg-primary/10 text-primary border-primary/20 rounded-full px-2.5 py-0.5 text-xs font-medium w-fit">
            Chapter {chapter.sequence}
          </Badge>

          {/* Chapter Title */}
          <h3 className="font-semibold text-sm tracking-tight line-clamp-2 leading-tight">
            {chapter.title}
          </h3>

          {/* Progress Bar */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Progress</span>
              <span className="text-xs font-medium text-primary">{progressPercentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-primary h-full rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Continue Reading Button */}
          <Button
            size="sm"
            className="w-full rounded-full text-xs h-8"
            onClick={(e) => {
              e.stopPropagation();
              onClick();
            }}
          >
            Continue Reading
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}