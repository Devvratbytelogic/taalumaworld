'use client';

import { X } from 'lucide-react';
import {
  AdminSearchInput,
  AdminSearchPanel,
  adminFilterPillClass,
  adminSelectClass,
} from '@/components/admin/layout/AdminContent';
import { CAMPAIGN_SOURCE_OPTIONS } from '@/constants/campaignAttribution';
import { cn } from '@/components/ui/utils';

interface AdminCampaignUsersSearchProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  utmSource: string;
  onUtmSourceChange: (value: string) => void;
  utmCampaign: string;
  onUtmCampaignChange: (value: string) => void;
}

export function AdminCampaignUsersSearch({
  searchQuery,
  onSearchChange,
  utmSource,
  onUtmSourceChange,
  utmCampaign,
  onUtmCampaignChange,
}: AdminCampaignUsersSearchProps) {
  const hasActiveFilters = Boolean(utmSource || utmCampaign);

  const clearFilters = () => {
    onUtmSourceChange('');
    onUtmCampaignChange('');
  };

  return (
    <AdminSearchPanel>
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <AdminSearchInput
          value={searchQuery}
          onChange={onSearchChange}
          placeholder="Search by name or email…"
        />

        <div className="flex flex-wrap items-center gap-2 lg:shrink-0">
          <select
            value={utmSource}
            onChange={(e) => onUtmSourceChange(e.target.value)}
            className={cn(adminSelectClass, 'min-w-36')}
            aria-label="Filter by source"
          >
            <option value="">All sources</option>
            {CAMPAIGN_SOURCE_OPTIONS.map((source) => (
              <option key={source} value={source}>
                {source}
              </option>
            ))}
          </select>

          <input
            type="search"
            value={utmCampaign}
            onChange={(e) => onUtmCampaignChange(e.target.value)}
            placeholder="Campaign name"
            aria-label="Filter by campaign"
            className={cn(adminSelectClass, 'min-w-44')}
          />

          {hasActiveFilters ? (
            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex h-9 items-center gap-1.5 whitespace-nowrap rounded-lg border border-red-200 px-3 text-sm text-red-600 transition-colors hover:bg-red-50"
            >
              <X className="h-3.5 w-3.5" />
              Clear
            </button>
          ) : null}
        </div>
      </div>

      {hasActiveFilters ? (
        <div className="flex flex-wrap gap-2">
          {utmSource ? (
            <span className={adminFilterPillClass}>
              Source: {utmSource}
              <button type="button" onClick={() => onUtmSourceChange('')} className="hover:text-primary/70">
                <X className="h-3 w-3" />
              </button>
            </span>
          ) : null}
          {utmCampaign ? (
            <span className={adminFilterPillClass}>
              Campaign: {utmCampaign}
              <button type="button" onClick={() => onUtmCampaignChange('')} className="hover:text-primary/70">
                <X className="h-3 w-3" />
              </button>
            </span>
          ) : null}
        </div>
      ) : null}
    </AdminSearchPanel>
  );
}
