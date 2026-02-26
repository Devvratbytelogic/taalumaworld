/**
 * Admin Reviews Tab
 * Monitor and moderate user reviews
 */

import { useState } from 'react';
import toast from '@/utils/toast';
import type { ReviewEntry } from './ReviewListing';
import { AdminReviewsHeader } from './AdminReviewsHeader';
import { AdminReviewsSearch } from './AdminReviewsSearch';
import { ReviewListing } from './ReviewListing';

const mockReviews: ReviewEntry[] = [
  {
    id: '1',
    userName: 'Sarah Johnson',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    rating: 5,
    comment:
      'This focus area was incredibly insightful! The thought leader really knows their stuff.',
    itemTitle: 'Introduction to Career Growth',
    itemType: 'chapter',
    date: '2024-01-20',
  },
  {
    id: '2',
    userName: 'Michael Chen',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael',
    rating: 4,
    comment:
      'Great content, very relevant to young professionals. Would recommend!',
    itemTitle: 'Professional Development 101',
    itemType: 'book',
    date: '2024-01-18',
  },
];

export function AdminReviewsTab() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredReviews = mockReviews.filter(
    (review) =>
      review.comment.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.userName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleApprove = (review: ReviewEntry) => {
    toast.success(`Review by ${review.userName} approved`);
    // TODO: wire to API
  };

  const handleRemove = (review: ReviewEntry) => {
    toast.success(`Review by ${review.userName} removed`);
    // TODO: wire to API + confirm dialog
  };

  return (
    <div className="space-y-8">
      <AdminReviewsHeader totalCount={mockReviews.length} />

      <AdminReviewsSearch
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <ReviewListing
        reviews={filteredReviews}
        onApprove={handleApprove}
        onRemove={handleRemove}
      />
    </div>
  );
}
