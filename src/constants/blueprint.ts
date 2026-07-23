export const BLUEPRINT_STATUSES = ['Pending', 'Draft', 'Published', 'Review'] as const;

export type BlueprintStatus = (typeof BLUEPRINT_STATUSES)[number];

export const BLUEPRINT_STATUS_CONFIG: Record<
  BlueprintStatus,
  { badge: string; dot: string; label: string }
> = {
  Pending: {
    badge: 'bg-amber-50 text-amber-700 border-amber-200! hover:bg-amber-100',
    dot: 'bg-amber-500',
    label: 'Pending',
  },
  Draft: {
    badge: 'bg-yellow-50 text-yellow-700 border-yellow-200! hover:bg-yellow-100',
    dot: 'bg-yellow-500',
    label: 'Draft',
  },
  Published: {
    badge: 'bg-green-50 text-green-700 border-green-200! hover:bg-green-100',
    dot: 'bg-green-500',
    label: 'Published',
  },
  Review: {
    badge: 'bg-blue-50 text-blue-700 border-blue-200! hover:bg-blue-100',
    dot: 'bg-blue-500',
    label: 'Review',
  },
};

export const DEFAULT_BLUEPRINT_STATUS: BlueprintStatus = 'Draft';
