import { Users, MoreVertical, Eye, Mail, Ban, CircleCheck } from 'lucide-react';
import Button from '../../ui/Button';
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar';
import { Badge } from '../../ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../ui/dropdown-menu';
import { AdminEmptyState, AdminTableShell } from '@/components/admin/layout/AdminContent';
import { AdminPagination } from '@/components/admin/shared/AdminPagination';
import { IAllUsersDataEntity } from '@/types/allUsers';

interface UserListingProps {
  users: IAllUsersDataEntity[];
  searchQuery: string;
  page: number;
  pageLimit: number;
  totalUsers: number;
  totalPages: number;
  isLoading?: boolean;
  isFetching?: boolean;
  onPageChange: (page: number) => void;
  onPageLimitChange: (limit: number) => void;
  onViewProfile?: (user: IAllUsersDataEntity) => void;
  onSendEmail?: (user: IAllUsersDataEntity) => void;
  onSuspend?: (user: IAllUsersDataEntity) => void;
}

export function UserListing({
  users,
  searchQuery,
  page,
  pageLimit,
  totalUsers,
  totalPages,
  isLoading,
  isFetching = false,
  onPageChange,
  onPageLimitChange,
  onViewProfile,
  onSendEmail,
  onSuspend,
}: UserListingProps) {
  return (
    <>
    <AdminTableShell>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Join Date</TableHead>
            <TableHead>Purchases</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading
            ? Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 7 }).map((__, j) => (
                    <TableCell key={j}>
                      <div className="h-4 bg-gray-100 rounded animate-pulse" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            : users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="max-w-40">
                <div className="flex items-center gap-3 min-w-0">
                  <Avatar className="shrink-0">
                    <AvatarImage src={user.profile_pic ?? ''} />
                    <AvatarFallback>{user.name?.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <span className="font-medium truncate">{user.name}</span>
                </div>
              </TableCell>
              <TableCell className="max-w-48 truncate">{user.email}</TableCell>
              <TableCell>
                <Badge>
                  {user.role?.name ?? '-'}
                </Badge>
              </TableCell>
              <TableCell className="whitespace-nowrap">{user.joinDate}</TableCell>
              <TableCell>{user.purchases}</TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className={user.status === 'suspended'
                    ? 'bg-red-50 text-red-700 border-red-200'
                    : 'bg-green-50 text-green-700 border-green-200'
                  }
                >
                  {user.status || 'active'}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button isIconOnly={true} className="icon_btn text-primary">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onSelect={() => onViewProfile?.(user)}>
                      <Eye className="h-4 w-4 mr-2" />
                      View Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => onSendEmail?.(user)}>
                      <Mail className="h-4 w-4 mr-2" />
                      Send Email
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className={user.status === 'suspended' ? 'text-green-600' : 'text-destructive'}
                      onSelect={() => onSuspend?.(user)}
                    >
                      {user.status === 'suspended' ? (
                        <>
                          <CircleCheck className="h-4 w-4 mr-2" />
                          Activate User
                        </>
                      ) : (
                        <>
                          <Ban className="h-4 w-4 mr-2" />
                          Suspend User
                        </>
                      )}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {!isLoading && users.length === 0 && (
        <AdminEmptyState
          icon={Users}
          title="No users found"
          description={
            searchQuery.trim()
              ? 'Try adjusting your search query.'
              : 'There are no users to display.'
          }
        />
      )}
    </AdminTableShell>

    {!isLoading && totalUsers > 0 && (
      <AdminPagination
        page={page}
        limit={pageLimit}
        total={totalUsers}
        totalPages={totalPages}
        itemLabel="users"
        disabled={isFetching}
        onPageChange={onPageChange}
        onLimitChange={onPageLimitChange}
      />
    )}
    </>
  );
}
