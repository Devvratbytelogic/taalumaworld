import { AlertCircle, Check, X, Eye } from 'lucide-react';
import Button from '../../ui/Button';
import { Card } from '../../ui/card';
import { Badge } from '../../ui/badge';

export interface FlaggedItem {
  id: number;
  type: string;
  content: string;
  user: string;
  item: string;
  flagged: string;
  severity: 'high' | 'medium' | 'low';
}

const severityColors = {
  high: 'destructive',
  medium: 'default',
  low: 'secondary',
} as const;

interface ModerationListingProps {
  items: FlaggedItem[];
  searchQuery: string;
  onApprove?: (item: FlaggedItem) => void;
  onRemove?: (item: FlaggedItem) => void;
  onReview?: (item: FlaggedItem) => void;
}

export function ModerationListing({
  items,
  searchQuery = '',
  onApprove,
  onRemove,
  onReview,
}: ModerationListingProps) {
  return (
    <>
      <div className="space-y-4">
        {items.map((item) => (
          <Card key={item.id} className="p-6 rounded-3xl shadow-sm">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant={severityColors[item.severity]}>
                      {item.severity} severity
                    </Badge>
                    <Badge variant="outline">{item.type}</Badge>
                  </div>
                  <h4 className="font-semibold">{item.content}</h4>
                  <p className="text-sm text-muted-foreground">
                    By {item.user} on {item.item} · Flagged {item.flagged}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  className="global_btn rounded_full bg_primary"
                  onPress={() => onApprove?.(item)}
                >
                  <Check className="h-4 w-4" />
                  Approve
                </Button>
                <Button
                  className="global_btn rounded_full danger_outline"
                  onPress={() => onRemove?.(item)}
                >
                  <X className="h-4 w-4" />
                  Remove
                </Button>
                <Button
                  className="global_btn rounded_full outline_primary"
                  onPress={() => onReview?.(item)}
                >
                  <Eye className="h-4 w-4" />
                  Review
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {items.length === 0 && (
        <div className="bg-white rounded-3xl p-12 shadow-sm">
          <div className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-accent rounded-full flex items-center justify-center">
              <AlertCircle className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h3 className="font-bold">No flagged items found</h3>
              <p className="text-muted-foreground">
                {searchQuery
                  ? 'Try adjusting your search query'
                  : 'There are no items pending moderation'}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
