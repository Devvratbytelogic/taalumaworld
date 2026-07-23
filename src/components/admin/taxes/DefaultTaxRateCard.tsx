'use client';

import { useEffect, useState } from 'react';
import { Percent, Save } from 'lucide-react';
import { AdminPanel } from '@/components/admin/layout/AdminContent';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Button from '@/components/ui/Button';
import { useGetAdminGlobalSettingsQuery } from '@/store/rtkQueries/adminGetApi';
import { useUpdateGlobalSettingsMutation } from '@/store/rtkQueries/adminPostApi';
import toast from '@/utils/toast';

export function DefaultTaxRateCard() {
  const { data: res, isLoading } = useGetAdminGlobalSettingsQuery();
  const [updateGlobalSettings, { isLoading: isSaving }] = useUpdateGlobalSettingsMutation();
  const [taxRate, setTaxRate] = useState('');
  const [error, setError] = useState('');

  const savedRate = res?.data?.default_tax_rate;

  useEffect(() => {
    if (savedRate == null) return;
    setTaxRate(String(savedRate));
  }, [savedRate]);

  const handleSave = async () => {
    const parsed = Number(taxRate);
    if (Number.isNaN(parsed)) {
      setError('Default tax rate must be a number');
      return;
    }
    if (parsed < 0 || parsed > 100) {
      setError('Default tax rate must be between 0 and 100');
      return;
    }

    setError('');

    try {
      const formData = new FormData();
      const settings = res?.data;
      if (settings) {
        Object.entries(settings).forEach(([key, value]) => {
          if (value == null || typeof value === 'object') return;
          formData.append(key, String(value));
        });
      }
      formData.set('default_tax_rate', String(parsed));

      const updateRes = await updateGlobalSettings(formData).unwrap();
      if (updateRes?.http_status_code === 200 || updateRes?.http_status_code === 201) {
        toast.success(updateRes.message ?? 'Default tax rate updated successfully');
      }
    } catch (err) {
      console.error('Failed to update default tax rate', err);
    }
  };

  const isUnchanged =
    savedRate != null && Number(taxRate) === Number(savedRate) && taxRate !== '';

  return (
    <AdminPanel>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Percent className="h-[18px] w-[18px]" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-slate-900">Default Tax Rate</h2>
            <p className="mt-0.5 text-sm text-slate-500">
              Platform-wide fallback tax rate. This setting cannot be deleted.
            </p>
          </div>
        </div>

        <div className="flex w-full flex-col gap-2 sm:w-auto sm:min-w-[240px]">
          <Label htmlFor="default_tax_rate">Default Tax Rate (%)</Label>
          <div className="flex items-center gap-2">
            <Input
              id="default_tax_rate"
              type="number"
              min={0}
              max={100}
              step="0.01"
              value={taxRate}
              disabled={isLoading || isSaving}
              onChange={(e) => {
                setTaxRate(e.target.value);
                if (error) setError('');
              }}
              className="h-10"
            />
            <Button
              type="button"
              className="global_btn rounded_full bg_primary shrink-0"
              onPress={handleSave}
              isLoading={isSaving}
              isDisabled={isLoading || isUnchanged}
              startContent={<Save className="h-4 w-4" />}
            >
              Save
            </Button>
          </div>
          {error ? <p className="text-sm text-red-500">{error}</p> : null}
        </div>
      </div>
    </AdminPanel>
  );
}
