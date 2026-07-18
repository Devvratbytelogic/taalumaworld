/** Raw API values returned by the `status` field on a verified-mentor application */
export const VERIFIED_MENTOR_APPLICATION_STATUS = {
  PENDING_REVIEW: 'pending_review',
  APPROVED: 'approved',
  REJECTED: 'rejected',
} as const;

/** Values accepted by the `action` field when reviewing an application */
export const VERIFIED_MENTOR_APPLICATION_ACTION = {
  APPROVE: 'approve',
  REJECT: 'reject',
} as const;