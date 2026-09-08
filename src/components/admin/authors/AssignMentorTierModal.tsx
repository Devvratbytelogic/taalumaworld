'use client';

import { useEffect, useMemo, useState } from 'react';
import ReactSelect from 'react-select';
import { Award, Save, X } from 'lucide-react';
import Button from '@/components/ui/Button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { SELECT_STYLES, type SelectOption } from '@/constants/selectStyle';
import { useAssignMentorTierMutation, useGetAllMentorTiersQuery } from '@/store/rtkQueries/mentorApis';
import toast from '@/utils/toast';

interface AssignMentorTierModalProps {
  open: boolean;
  mentorId?: string | null;
  mentorName?: string | null;
  currentTierId?: string | null;
  currentTierCode?: string | null;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function AssignMentorTierModal({
  open,
  mentorId,
  mentorName,
  currentTierId,
  currentTierCode,
  onOpenChange,
  onSuccess,
}: AssignMentorTierModalProps) {
  const [tierId, setTierId] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const { data, isLoading } = useGetAllMentorTiersQuery(
    { status: 'active', limit: 100 },
    { skip: !open },
  );
  const [assignMentorTier, { isLoading: isSubmitting }] = useAssignMentorTierMutation();

  const tiers = data?.data?.data ?? [];
  const tierOptions: SelectOption[] = useMemo(
    () =>
      tiers.map((tier) => ({
        value: tier._id,
        label: `${tier.code}${tier.rank != null ? ` · Rank ${tier.rank}` : ''}${tier._id === currentTierId ? ' (current)' : ''}`,
      })),
    [tiers, currentTierId],
  );

  useEffect(() => {
    if (!open) {
      setTierId('');
      setAdminNotes('');
      return;
    }
    setTierId(currentTierId ?? '');
    setAdminNotes('');
  }, [open, currentTierId]);

  const handleSubmit = async () => {
    if (!mentorId) return;
    if (!tierId) {
      toast.error('tier_id (or tier_code) is required');
      return;
    }
    try {
      const res = await assignMentorTier({
        mentorId,
        tier_id: tierId,
        ...(adminNotes.trim() ? { admin_notes: adminNotes.trim() } : {}),
      }).unwrap();
      if (res?.http_status_code === 200 || res?.http_status_code === 201 || res?.success) {
        toast.success(res?.message ?? 'Mentor tier assigned');
        onOpenChange(false);
        onSuccess?.();
      }
    } catch (error) {
      console.error('Failed to assign mentor tier', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="admin_panel sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-primary" />
            Assign tier
          </DialogTitle>
          <DialogDescription>
            Place {mentorName || 'this mentor'} on any tier without eligibility checks. This does not issue equity.
            {currentTierCode ? ` Current tier: ${currentTierCode}.` : ''}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="assign_tier_id">
              Tier<span className="text-red-500">*</span>
            </Label>
            <ReactSelect
              inputId="assign_tier_id"
              name="assign_tier_id"
              classNamePrefix="react-select"
              options={tierOptions}
              value={tierOptions.find((option) => option.value === tierId) ?? null}
              onChange={(option) => setTierId(option?.value ?? '')}
              isDisabled={isLoading || isSubmitting}
              isLoading={isLoading}
              placeholder={isLoading ? 'Loading tiers...' : 'Select a tier'}
              noOptionsMessage={() => 'No tiers available'}
              styles={SELECT_STYLES}
              menuPortalTarget={typeof document !== 'undefined' ? document.body : null}
              menuPosition="fixed"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="assign_admin_notes">Admin notes</Label>
            <Textarea
              id="assign_admin_notes"
              rows={3}
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder="Manual Founding assign"
              disabled={isSubmitting}
            />
          </div>
        </div>

        <DialogFooter className="gap-3">
          <Button type="button" className="global_btn outline_primary rounded_full" onPress={() => onOpenChange(false)} disabled={isSubmitting}>
            <X className="h-4 w-4" />
            Cancel
          </Button>
          <Button
            type="button"
            className="global_btn bg_primary rounded_full"
            isLoading={isSubmitting}
            isDisabled={isSubmitting || !tierId || !mentorId}
            onPress={handleSubmit}
          >
            <Save className="h-4 w-4" />
            Assign tier
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
