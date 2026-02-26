/**
 * Admin Users Tab
 * View and manage platform users
 */

import { useState } from 'react';
import toast from '@/utils/toast';
import type { AdminListUser } from './UserListing';
import { AdminUsersHeader } from './AdminUsersHeader';
import { AdminUsersSearch } from './AdminUsersSearch';
import { UserListing } from './UserListing';
import { ViewProfileModal } from './ViewProfileModal';
import { SuspendUserDialog } from './SuspendUserDialog';

const mockUsers: AdminListUser[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah.j@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    role: 'Premium User',
    joinDate: '2024-01-15',
    purchases: 12,
    status: 'active',
  },
  {
    id: '2',
    name: 'Michael Chen',
    email: 'michael.c@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael',
    role: 'Free User',
    joinDate: '2024-02-20',
    purchases: 3,
    status: 'active',
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    email: 'emily.r@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily',
    role: 'Premium User',
    joinDate: '2024-01-10',
    purchases: 25,
    status: 'active',
  },
];

export function AdminUsersTab() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredUsers = mockUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const [profileUser, setProfileUser] = useState<AdminListUser | null>(null);
  const [suspendUser, setSuspendUser] = useState<AdminListUser | null>(null);

  const handleViewProfile = (user: AdminListUser) => {
    setProfileUser(user);
  };

  const handleSendEmail = (user: AdminListUser) => {
    window.location.href = `mailto:${user.email}`;
  };

  const handleSuspend = (user: AdminListUser) => {
    setSuspendUser(user);
  };

  const confirmSuspend = () => {
    if (suspendUser) {
      toast.success(`"${suspendUser.name}" has been suspended`);
      setSuspendUser(null);
      setProfileUser(null);
    }
  };

  const handleSuspendFromProfile = (user: AdminListUser) => {
    setProfileUser(null);
    setSuspendUser(user);
  };

  return (
    <div className="space-y-8">
      <AdminUsersHeader totalCount={mockUsers.length} />

      <AdminUsersSearch searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      <UserListing
        users={filteredUsers}
        searchQuery={searchQuery}
        onViewProfile={handleViewProfile}
        onSendEmail={handleSendEmail}
        onSuspend={handleSuspend}
      />

      <ViewProfileModal
        user={profileUser}
        open={!!profileUser}
        onOpenChange={(open) => !open && setProfileUser(null)}
        onSendEmail={handleSendEmail}
        onSuspend={handleSuspendFromProfile}
      />

      <SuspendUserDialog
        user={suspendUser}
        open={!!suspendUser}
        onOpenChange={(open) => !open && setSuspendUser(null)}
        onConfirm={confirmSuspend}
      />
    </div>
  );
}
