export const USER_TYPE = {
  INSTITUTIONAL_CAREER_ARCHITECT: 'Institutional Career Architect',
  CAREER_ARCHITECT: 'Career Architect',
  MENTOR: 'Mentor',
  SUPER_ADMIN: 'Super Administrator',
} as const;

export type UserTypeValue = (typeof USER_TYPE)[keyof typeof USER_TYPE];

export function isCareerArchitectRole(role?: string | null): boolean {
  return role === USER_TYPE.CAREER_ARCHITECT || role === USER_TYPE.INSTITUTIONAL_CAREER_ARCHITECT;
}

export function isMentorRole(role?: string | null): boolean {
  return role === USER_TYPE.MENTOR;
}

/** Mentors can also shop as buyers, so they share the Career Architect dashboard. */
export function canAccessUserDashboard(role?: string | null): boolean {
  return isCareerArchitectRole(role) || isMentorRole(role);
}

export function isStaffAdminRole(role?: string | null): boolean {
  return Boolean(role) && !canAccessUserDashboard(role);
}

export function formatKes(amount: number) {
  return `KSh ${amount.toLocaleString()}`;
}

export function isZeroPrice(amount?: number | null) {
  return Number(amount ?? 0) <= 0;
}

export function formatKesOrFree(amount?: number | null) {
  const value = Number(amount ?? 0);
  return value > 0 ? formatKes(value) : 'FREE';
}
