import { Star, MessageSquare } from 'lucide-react';
import Button from '../../ui/Button';
import { Badge } from '../../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar';
import { Card, CardContent, CardHeader } from '../../ui/card';

export interface ReviewEntry {
  id: string;
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  itemTitle: string;
  itemType: 'chapter' | 'book';
  date: string;
}

interface ReviewListingProps {
  reviews: ReviewEntry[];
  searchQuery?: string;
  onApprove?: (review: ReviewEntry) => void;
  onRemove?: (review: ReviewEntry) => void;
}

export function ReviewListing({
  reviews,
  searchQuery = '',
  onApprove,
  onRemove,
}: ReviewListingProps) {
  return (
    <>
      <div className="space-y-4">
      {reviews.map((review) => (
        <Card key={review.id} className="rounded-3xl shadow-sm">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={review.userAvatar} />
                  <AvatarFallback>{review.userName[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{review.userName}</div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < review.rating
                              ? 'text-yellow-400 fill-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {review.date}
                    </span>
                  </div>
                </div>
              </div>
              <Badge variant="outline">
                {review.itemType === 'chapter' ? 'Focus Area' : 'Book'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-foreground mb-3">{review.comment}</p>
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                On:{' '}
                <span className="font-medium text-foreground">
                  {review.itemTitle}
                </span>
              </p>
              <div className="flex gap-2">
                <Button
                  className="global_btn rounded_full outline_primary"
                  onPress={() => onApprove?.(review)}
                >
                  Approve
                </Button>
                <Button
                  className="global_btn rounded_full danger_outline"
                  onPress={() => onRemove?.(review)}
                >
                  Remove
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
      </div>

      {reviews.length === 0 && (
        <div className="bg-white rounded-3xl p-12 shadow-sm">
          <div className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-accent rounded-full flex items-center justify-center">
              <MessageSquare className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h3 className="font-bold">No reviews found</h3>
              <p className="text-muted-foreground">
                {searchQuery
                  ? 'Try adjusting your search query'
                  : 'There are no reviews to display'}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
