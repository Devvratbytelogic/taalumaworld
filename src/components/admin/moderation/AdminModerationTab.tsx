/**
 * Admin Moderation Tab
 * Review and moderate flagged content
 */

import { useState } from 'react';
import type { FlaggedItem } from './ModerationListing';
import { AdminModerationHeader } from './AdminModerationHeader';
import { AdminModerationSearch } from './AdminModerationSearch';
import { ModerationPendingBanner } from './ModerationPendingBanner';
import { ModerationListing } from './ModerationListing';

const flaggedItemsData: FlaggedItem[] = [
  { id: 1, type: 'review', content: 'Inappropriate language in review', user: 'John Doe', item: 'Leadership Book', flagged: '2 hours ago', severity: 'high' },
  { id: 2, type: 'comment', content: 'Spam comment detected', user: 'Jane Smith', item: 'Career Chapter', flagged: '5 hours ago', severity: 'medium' },
  { id: 3, type: 'review', content: 'Potential fake review', user: 'Bob Johnson', item: 'Communication Skills', flagged: '1 day ago', severity: 'low' },
];

export function AdminModerationTab() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = flaggedItemsData.filter(
    (item) =>
      item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.item.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <AdminModerationHeader />
      <AdminModerationSearch
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      <ModerationPendingBanner count={filteredItems.length} />
      <ModerationListing
        items={filteredItems}
        searchQuery={searchQuery}
      />
    </div>
  );
}
