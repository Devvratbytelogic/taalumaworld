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
import type { IAllMentorTiersEntity } from '@/types/mentorTier';
import toast from '@/utils/toast';

interface MentorTierUpgradeModalProps {
  open: boolean;
  currentTierId?: string;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

function hasGate(value?: number | null) {
  return value != null && Number(value) !== 0;
}

function SelectedTierRequirements({ tier }: { tier: IAllMentorTiersEntity }) {
  const ratingGate = hasGate(tier.min_rating);
  const blueprintParts = [
    hasGate(tier.min_words_per_blueprint) ? `${tier.min_words_per_blueprint} words` : null,
    hasGate(tier.min_confirmed_sales) ? `${tier.min_confirmed_sales} confirmed sales` : null,
    hasGate(tier.min_days_since_published) ? `published ${tier.min_days_since_published}+ days ago` : null,
  ].filter(Boolean);

  if (!ratingGate && blueprintParts.length === 0) {
    return (
      <p className="text-xs text-slate-500">
        {tier.code} has no extra rating or Blueprint gates. Submit to send this request for review.
      </p>
    );
  }

  return (
    <div className="rounded-lg border border-slate-100 bg-slate-50/60 p-3 text-sm text-slate-600">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">To apply for {tier.code}</p>
      <ul className="mt-2 list-disc space-y-1 pl-4">
        {ratingGate ? <li>Overall rating of at least {tier.min_rating}</li> : null}
        {blueprintParts.length > 0 ? (
          <li>At least one published Blueprint meeting {blueprintParts.join(', ')}</li>
        ) : null}
      </ul>
    </div>
  );
}

export function MentorTierUpgradeModal({ open, currentTierId, onOpenChange, onSuccess }: MentorTierUpgradeModalProps) {
  const [requestedTierId, setRequestedTierId] = useState('');
  const { data, isLoading } = useGetAllMentorTiersQuery({ status: 'active' }, { skip: !open });
  const [applyMentorTierUpgrade, { isLoading: isSubmitting }] = useApplyMentorTierUpgradeMutation();

  const tiers = (data?.data?.data ?? []).filter((tier) => tier._id !== currentTierId);
  const selectedTier = tiers.find((tier) => tier._id === requestedTierId);
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
          <DialogDescription>
            Select a higher tier. Apply is blocked if your rating or Blueprint gates are not met — the API message will explain what is missing.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
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
              noOptionsMessage={() => 'No higher tiers available'}
              styles={SELECT_STYLES}
              menuPortalTarget={typeof document !== 'undefined' ? document.body : null}
              menuPosition="fixed"
            />
          </div>
          {selectedTier ? <SelectedTierRequirements tier={selectedTier} /> : null}
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
            isDisabled={!requestedTierId || isSubmitting}
            onPress={handleSubmit}
          >
            <Send className="h-4 w-4" />
            Submit request
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
