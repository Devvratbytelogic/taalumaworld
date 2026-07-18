/** Raw API values returned by the `status` field on a verified-mentor application */
export const VERIFIED_MENTOR_APPLICATION_STATUS = {
  PENDING_REVIEW: 'pending_review',
  APPROVED: 'approved',
  REJECTED: 'rejected',
} as const;

export type VerifiedMentorApplicationStatus =
  (typeof VERIFIED_MENTOR_APPLICATION_STATUS)[keyof typeof VERIFIED_MENTOR_APPLICATION_STATUS];
