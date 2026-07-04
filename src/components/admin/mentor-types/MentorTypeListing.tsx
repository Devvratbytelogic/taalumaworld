import { Award, Edit, Plus } from 'lucide-react';
import { Button } from '@heroui/react';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { AdminEmptyState, AdminTableShell } from '@/components/admin/layout/AdminContent';
import type { MentorType } from '@/components/admin/mentor-types/data/mentorTypesData';
import { MENTOR_TYPE_BADGE_COLORS } from '@/components/admin/mentor-types/data/mentorTypesData';

interface MentorTypeListingProps {
  types: MentorType[];
  totalCount: number;
  searchQuery: string;
  onCreateType: () => void;
  onEdit: (type: MentorType) => void;
}

export function MentorTypeListing({
  types,
  totalCount,
  searchQuery,
  onCreateType,
  onEdit,
}: MentorTypeListingProps) {
  if (types.length === 0) {
    return (
      <AdminTableShell>
        <AdminEmptyState
          icon={Award}
          title="No mentor types found"
          description={
            searchQuery.trim()
              ? 'Try adjusting your search query.'
              : 'Create your first mentor type to get started.'
          }
          action={
            !searchQuery.trim() ? (
              <Button
                color="primary"
                className="rounded-xl"
                onPress={onCreateType}
                startContent={<Plus className="h-4 w-4" />}
              >
                Add mentor type
              </Button>
            ) : undefined
          }
        />
      </AdminTableShell>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-slate-500">
        Showing <span className="font-medium text-slate-900">{types.length}</span>
        {types.length !== totalCount ? (
          <> of <span className="font-medium text-slate-900">{totalCount}</span></>
        ) : null}{' '}
        mentor types
      </p>

      <AdminTableShell>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12 px-4">#</TableHead>
              <TableHead className="px-4">Mentor type</TableHead>
              <TableHead className="px-4">Revenue share</TableHead>
              <TableHead className="px-4">Badge</TableHead>
              <TableHead className="px-4">Active mentors</TableHead>
              <TableHead className="px-4">Agreement</TableHead>
              <TableHead className="px-4">Status</TableHead>
              <TableHead className="w-20 px-4 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {types.map((type, idx) => (
              <TableRow key={type.id}>
                <TableCell className="px-4 text-sm text-muted-foreground">{idx + 1}</TableCell>
                <TableCell className="px-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <Award className="h-4 w-4 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-slate-900">{type.name}</p>
                      <p className="text-xs text-muted-foreground">{type.slug}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="px-4 whitespace-nowrap text-sm text-slate-700">
                  {type.mentorSharePercent}% Mentor / {type.taalumaSharePercent}% Taaluma
                </TableCell>
                <TableCell className="px-4">
                  <Badge
                    variant="outline"
                    className={MENTOR_TYPE_BADGE_COLORS[type.slug] ?? 'border-slate-200 text-slate-600'}
                  >
                    {type.badgeLabel}
                  </Badge>
                </TableCell>
                <TableCell className="px-4 whitespace-nowrap text-sm text-slate-700">
                  {type.activeMentorCount}
                  {type.maxActiveMentors ? (
                    <span className="text-slate-400"> / {type.maxActiveMentors}</span>
                  ) : null}
                </TableCell>
                <TableCell className="px-4">
                  <p className="text-sm text-slate-700">{type.agreementVersion}</p>
                  <p className="text-xs text-slate-400">{type.schedules.length} schedules</p>
                </TableCell>
                <TableCell className="px-4">
                  <Badge
                    variant="outline"
                    className={
                      type.isActive
                        ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                        : 'border-slate-200 bg-slate-100 text-slate-600'
                    }
                  >
                    {type.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                  <p className="mt-1 text-xs text-slate-400">
                    {type.startDate ? new Date(type.startDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                    {type.endDate ? ` – ${new Date(type.endDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}` : ''}
                  </p>
                </TableCell>
                <TableCell className="px-4">
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => onEdit(type)}
                      aria-label={`Edit ${type.name}`}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-primary transition-colors hover:bg-primary/5"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </AdminTableShell>
    </div>
  );
}
