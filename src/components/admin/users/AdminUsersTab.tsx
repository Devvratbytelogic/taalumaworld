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
import { useGetAllUsersQuery } from '@/store/rtkQueries/adminGetApi';
import { useSuspendUserMutation } from '@/store/rtkQueries/adminPostApi';
import type { IAllUsersDataEntity } from '@/types/allUsers';

function mapUserToAdminListUser(user: IAllUsersDataEntity): AdminListUser {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    avatar: user.profile_pic ?? '',
    role: user.role?.name ?? 'User',
    joinDate: user.joinDate ?? user.createdAt,
    purchases: user.purchases ?? 0,
    status: user.status,
  };
}

export function AdminUsersTab() {
  const [searchQuery, setSearchQuery] = useState('');
  const [profileUser, setProfileUser] = useState<AdminListUser | null>(null);
  const [suspendUser, setSuspendUser] = useState<AdminListUser | null>(null);

  const { data, isLoading } = useGetAllUsersQuery();
  const [suspendUserMutation, { isLoading: isSuspending }] = useSuspendUserMutation();

  const users: AdminListUser[] = (data?.data ?? []).map(mapUserToAdminListUser);

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleViewProfile = (user: AdminListUser) => {
    setProfileUser(user);
  };

  const handleSendEmail = (user: AdminListUser) => {
    window.location.href = `mailto:${user.email}`;
  };

  const handleSuspend = (user: AdminListUser) => {
    setSuspendUser(user);
  };

  const confirmSuspend = async () => {
    if (suspendUser) {
      try {
        await suspendUserMutation({ id: suspendUser.id }).unwrap();
        toast.success(`"${suspendUser.name}" has been suspended`);
      } catch {
        toast.error(`Failed to suspend "${suspendUser.name}"`);
      } finally {
        setSuspendUser(null);
        setProfileUser(null);
      }
    }
  };

  const handleSuspendFromProfile = (user: AdminListUser) => {
    setProfileUser(null);
    setSuspendUser(user);
  };

  return (
    <div className="space-y-8">
      <AdminUsersHeader totalCount={users.length} />

      <AdminUsersSearch searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      <UserListing
        users={filteredUsers}
        searchQuery={searchQuery}
        isLoading={isLoading}
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
        isLoading={isSuspending}
      />
    </div>
  );
}
