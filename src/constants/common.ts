export const USER_TYPE = {
  INSTITUTIONAL_CAREER_ARCHITECT: 'Institutional Career Architect',
  CAREER_ARCHITECT: 'Career Architect',
  MENTOR: 'Mentor',
  SUPER_ADMIN: 'Super Administrator',
} as const;

export type UserTypeValue = (typeof USER_TYPE)[keyof typeof USER_TYPE];

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
