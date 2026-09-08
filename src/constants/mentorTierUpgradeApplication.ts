export const MENTOR_TIER_UPGRADE_APPLICATION_STATUS = {
  PENDING_REVIEW: 'pending_review',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  WITHDRAWN: 'withdrawn',
} as const;

export const MENTOR_TIER_UPGRADE_APPLICATION_ACTION = {
  APPROVE: 'approve',
  REJECT: 'reject',
} as const;
