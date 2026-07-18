'use client';

import { useEffect, useMemo, useState } from 'react';
import ReactSelect from 'react-select';
import { ArrowUpCircle, Send, X } from 'lucide-react';
import Button from '@/components/ui/Button';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { SELECT_STYLES, type SelectOption } from '@/constants/selectStyle';
import { useGetAllMentorTiersQuery, useApplyMentorTierUpgradeMutation } from '@/store/rtkQueries/mentorApis';
import toast from '@/utils/toast';

interface MentorTierUpgradeModalProps {
  open: boolean;
  currentTierId?: string;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function MentorTierUpgradeModal({ open, currentTierId, onOpenChange, onSuccess }: MentorTierUpgradeModalProps) {
  const [requestedTierId, setRequestedTierId] = useState('');
  const { data, isLoading } = useGetAllMentorTiersQuery({ status: 'active' }, { skip: !open });
  const [applyMentorTierUpgrade, { isLoading: isSubmitting }] = useApplyMentorTierUpgradeMutation();

  const tiers = (data?.data?.data ?? []).filter((tier) => tier._id !== currentTierId);
  const tierOptions: SelectOption[] = useMemo(
    () => tiers.map((tier) => ({ value: tier._id, label: `${tier.code}${tier.is_verified_tier ? ' (Verified)' : ''}` })),
    [tiers],
  );

  useEffect(() => {
    if (!open) setRequestedTierId('');
  }, [open]);

  const handleSubmit = async () => {
    if (!requestedTierId) {
      toast.error('Please select a tier to request.');
      return;
    }
    try {
      const res = await applyMentorTierUpgrade({ requested_tier_id: requestedTierId }).unwrap();
      toast.success(res?.message ?? 'Tier upgrade request submitted successfully!');
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      console.error('Failed to submit tier upgrade request. Please try again.', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="admin_panel sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ArrowUpCircle className="h-5 w-5 text-primary" />
            Request tier upgrade
          </DialogTitle>
          <DialogDescription>Select the tier you&apos;d like to be upgraded to. An admin will review your request.</DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <Label htmlFor="requested_tier_id">
            Requested tier<span className="text-red-500"> *</span>
          </Label>
          <ReactSelect
            inputId="requested_tier_id"
            name="requested_tier_id"
            classNamePrefix="react-select"
            options={tierOptions}
            value={tierOptions.find((option) => option.value === requestedTierId) ?? null}
            onChange={(option) => setRequestedTierId(option?.value ?? '')}
            isDisabled={isLoading || isSubmitting}
            isLoading={isLoading}
            placeholder={isLoading ? 'Loading tiers...' : 'Select a tier'}
            noOptionsMessage={() => 'No other tiers available'}
            styles={SELECT_STYLES}
            menuPortalTarget={typeof document !== 'undefined' ? document.body : null}
            menuPosition="fixed"
          />
        </div>

        <DialogFooter className="gap-3">
          <Button type="button" className="global_btn outline_primary rounded_full" onPress={() => onOpenChange(false)} disabled={isSubmitting}>
            <X className="h-4 w-4" />
            Cancel
          </Button>
          <Button type="button" className="global_btn bg_primary rounded_full" isLoading={isSubmitting} onPress={handleSubmit}>
            <Send className="h-4 w-4" />
            Submit request
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
