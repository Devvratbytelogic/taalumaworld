import { useState } from 'react';
import { MessageSquare, Star, Search } from 'lucide-react';
import Button from '../ui/Button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Card, CardContent, CardHeader } from '../ui/card';

// Mock reviews data
const mockReviews = [
  {
    id: '1',
    userName: 'Sarah Johnson',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    rating: 5,
    comment: 'This focus area was incredibly insightful! The thought leader really knows their stuff.',
    itemTitle: 'Introduction to Career Growth',
    itemType: 'chapter',
    date: '2024-01-20',
  },
  {
    id: '2',
    userName: 'Michael Chen',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael',
    rating: 4,
    comment: 'Great content, very relevant to young professionals. Would recommend!',
    itemTitle: 'Professional Development 101',
    itemType: 'book',
    date: '2024-01-18',
  },
];

export function AdminReviewsTab() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredReviews = mockReviews.filter(review =>
    review.comment.toLowerCase().includes(searchQuery.toLowerCase()) ||
    review.userName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="bg-white rounded-3xl p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Reviews & Ratings
            </h1>
            <p className="text-muted-foreground">
              Monitor and moderate user reviews
            </p>
          </div>
          <Badge variant="outline" className="text-lg px-4 py-2">
            Total Reviews: {mockReviews.length}
          </Badge>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-3xl p-6 shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search reviews..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.map((review) => (
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
                      <span className="text-sm text-muted-foreground">{review.date}</span>
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
                  On: <span className="font-medium text-foreground">{review.itemTitle}</span>
                </p>
                <div className="flex gap-2">
                  <Button className="global_btn rounded_full outline_primary">
                    Approve
                  </Button>
                  <Button className="global_btn rounded_full danger_outline">
                    Remove
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
