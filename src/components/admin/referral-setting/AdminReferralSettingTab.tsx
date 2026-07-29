'use client';

import { useEffect, useState } from 'react';
import { Link2, Save } from 'lucide-react';
import {
  AdminPage,
  AdminPageHeader,
  AdminPanel,
  adminSelectClass,
} from '@/components/admin/layout/AdminContent';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Button from '@/components/ui/Button';
import {
  useAddUpdateAffiliateReferalMutation,
  useGetAffiliateReferalQuery,
} from '@/store/rtkQueries/affiliateReferralApis';
import toast from '@/utils/toast';

export function AdminReferralSettingTab() {
  const { data: res, isLoading } = useGetAffiliateReferalQuery();
  const [saveReferral, { isLoading: isSaving }] = useAddUpdateAffiliateReferalMutation();

  const [referalType, setReferalType] = useState('percentage');
  const [referalValues, setReferalValues] = useState('');
  const [error, setError] = useState('');

  // Fill form when API data loads
  useEffect(() => {
    if (!res?.data) return;
    setReferalType(res.data.referalType || 'percentage');
    setReferalValues(String(res.data.referalValues ?? ''));
  }, [res?.data]);

  const handleSave = async () => {
    const value = Number(referalValues);

    if (referalValues.trim() === '' || Number.isNaN(value)) {
      setError('Please enter a valid number');
      return;
    }
    if (value < 0) {
      setError('Value cannot be negative');
      return;
    }
    if (referalType === 'percentage' && value > 100) {
      setError('Percentage must be between 0 and 100');
      return;
    }

    setError('');

    try {
      const result = await saveReferral({
        referalType,
        referalValues: value,
      }).unwrap();

      if (result?.http_status_code === 200 || result?.http_status_code === 201) {
        toast.success(result.message || 'Saved successfully');
      }
    } catch (err) {
      console.error('Failed to save referral setting', err);
    }
  };

  const busy = isLoading || isSaving;

  return (
    <AdminPage>
      <AdminPageHeader
        title="Referral Setting"
        description="Set the default commission for affiliate referrals."
      />

      <AdminPanel>
        <div className="flex items-start gap-3 mb-6">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Link2 className="h-4.5 w-4.5" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-slate-900">Commission</h2>
            <p className="mt-0.5 text-sm text-slate-500">
              Choose percentage or fixed amount, then enter the value.
            </p>
          </div>
        </div>

        <div className="grid max-w-md gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="referalType">Type</Label>
            <select
              id="referalType"
              value={referalType}
              disabled={busy}
              onChange={(e) => {
                setReferalType(e.target.value);
                setError('');
              }}
              className={`${adminSelectClass} h-10 w-full min-w-0`}
            >
              <option value="percentage">Percentage</option>
              <option value="fixed">Fixed amount</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="referalValues">
              Value {referalType === 'percentage' ? '(%)' : '(KES)'}
            </Label>
            <Input
              id="referalValues"
              type="number"
              min={0}
              max={referalType === 'percentage' ? 100 : undefined}
              step="0.01"
              value={referalValues}
              disabled={busy}
              onChange={(e) => {
                setReferalValues(e.target.value);
                setError('');
              }}
              className="h-10"
              placeholder={referalType === 'percentage' ? '10' : '100'}
            />
          </div>
        </div>

        {error ? <p className="mt-3 text-sm text-red-500">{error}</p> : null}

        <div className="mt-6">
          <Button
            type="button"
            className="global_btn rounded_full bg_primary"
            onPress={handleSave}
            isLoading={isSaving}
            isDisabled={busy}
            startContent={<Save className="h-4 w-4" />}
          >
            Save
          </Button>
        </div>
      </AdminPanel>
    </AdminPage>
  );
}
