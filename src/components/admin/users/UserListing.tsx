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

export interface AdminListUser {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
  joinDate: string;
  purchases: number;
  status: string;
}

interface UserListingProps {
  users: AdminListUser[];
  searchQuery: string;
  isLoading?: boolean;
  onViewProfile?: (user: AdminListUser) => void;
  onSendEmail?: (user: AdminListUser) => void;
  onSuspend?: (user: AdminListUser) => void;
}

export function UserListing({
  users,
  searchQuery,
  isLoading,
  onViewProfile,
  onSendEmail,
  onSuspend,
}: UserListingProps) {
  return (
    <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
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
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback>{user.name[0]}</AvatarFallback>
                  </Avatar>
                  <span className="font-medium truncate">{user.name}</span>
                </div>
              </TableCell>
              <TableCell className="max-w-48 truncate">{user.email}</TableCell>
              <TableCell>
                <Badge variant={user.role === 'Premium User' ? 'default' : 'outline'}>
                  {user.role}
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

      {users.length === 0 && (
        <div className="p-12">
          <div className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-accent rounded-full flex items-center justify-center">
              <Users className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h3 className="font-bold">No users found</h3>
              <p className="text-muted-foreground">
                {searchQuery
                  ? 'Try adjusting your search query'
                  : 'There are no users to display'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
