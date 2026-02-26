import { Badge } from '../../ui/badge';

interface AdminUsersHeaderProps {
  totalCount: number;
}

export function AdminUsersHeader({ totalCount }: AdminUsersHeaderProps) {
  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            User Management
          </h1>
          <p className="text-muted-foreground">
            View and manage all users on the platform
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="text-lg px-4 py-2">
            Total Users: {totalCount}
          </Badge>
        </div>
      </div>
    </div>
  );
}
