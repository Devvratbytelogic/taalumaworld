/**
 * Admin Users Tab
 * View and manage platform users
 */

import { useState, useEffect } from 'react';
import toast from '@/utils/toast';
import { AdminUsersHeader } from './AdminUsersHeader';
import { AdminUsersSearch } from './AdminUsersSearch';
import { UserListing } from './UserListing';
import { ViewProfileModal } from './ViewProfileModal';
import { SuspendUserDialog } from './SuspendUserDialog';
import { useGetAllUsersQuery } from '@/store/rtkQueries/adminGetApi';
import { useSuspendUserMutation } from '@/store/rtkQueries/adminPostApi';
import { useDebounce } from '@/hooks/useDebounce';
import { IAllUsersDataEntity } from '@/types/allUsers';


export function AdminUsersTab() {
  const [searchQuery, setSearchQuery] = useState('');
  const [profileUser, setProfileUser] = useState<IAllUsersDataEntity | null>(null);
  const [suspendUser, setSuspendUser] = useState<IAllUsersDataEntity | null>(null);
  const [page, setPage] = useState(1);
  const [pageLimit, setPageLimit] = useState(10);
  const debouncedSearch = useDebounce(searchQuery, 400);
  const queryParams = {
    page,
    limit: pageLimit,
    ...(debouncedSearch.trim() ? { search: debouncedSearch.trim() } : {}),
  };
  const { data, isLoading, isFetching } = useGetAllUsersQuery(queryParams);
  const [suspendUserMutation, { isLoading: isSuspending }] = useSuspendUserMutation();

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const users = data?.data ?? [];
  const pagination = data?.pagination;
  const totalUsers = pagination?.total ?? data?.totalUsers ?? 0;
  const totalPages = pagination?.totalPages ?? Math.max(1, Math.ceil(totalUsers / pageLimit));


  const handleViewProfile = (user: IAllUsersDataEntity) => {
    setProfileUser(user);
  };

  const handleSendEmail = (user: IAllUsersDataEntity) => {
    window.location.href = `mailto:${user.email}`;
  };

  const handleSuspend = (user: IAllUsersDataEntity) => {
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

  const handleSuspendFromProfile = (user: IAllUsersDataEntity) => {
    setProfileUser(null);
    setSuspendUser(user);
  };

  return (
    <div className="space-y-6">
      <AdminUsersHeader totalCount={totalUsers} />

      <AdminUsersSearch searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      <UserListing
        users={users}
        searchQuery={debouncedSearch}
        page={page}
        pageLimit={pageLimit}
        totalUsers={totalUsers}
        totalPages={totalPages}
        isLoading={isLoading}
        isFetching={isFetching}
        onPageChange={setPage}
        onPageLimitChange={(limit) => {
          setPageLimit(limit);
          setPage(1);
        }}
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
