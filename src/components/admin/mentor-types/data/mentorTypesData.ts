export interface MentorType {
  id: string;
  name: string;
  slug: string;
  mentorSharePercent: number;
  taalumaSharePercent: number;
  badgeLabel: string;
  eligibilityCriteria: string;
  startDate?: string;
  endDate?: string;
  isActive: boolean;
  maxActiveMentors?: number;
  agreementVersion: string;
  schedules: string[];
  activeMentorCount: number;
}

export const INITIAL_MENTOR_TYPES: MentorType[] = [
  {
    id: 'mt_standard',
    name: 'Standard Mentor',
    slug: 'standard-mentor',
    mentorSharePercent: 80,
    taalumaSharePercent: 20,
    badgeLabel: 'Mentor',
    eligibilityCriteria: 'Approved mentor application with completed profile and accepted agreements.',
    startDate: '2026-01-01',
    isActive: true,
    agreementVersion: 'v1.2',
    schedules: ['Schedule A – Revenue Share', 'Schedule C – Community & Content Standards', 'Schedule D – Mentor Verification Policy'],
    activeMentorCount: 42,
  },
  {
    id: 'mt_verified',
    name: 'Verified Mentor',
    slug: 'verified-mentor',
    mentorSharePercent: 80,
    taalumaSharePercent: 20,
    badgeLabel: 'Verified Mentor',
    eligibilityCriteria: 'Completed verification review with approved documents or professional links.',
    startDate: '2026-01-01',
    isActive: true,
    agreementVersion: 'v1.2',
    schedules: ['Schedule A – Revenue Share', 'Schedule C – Community & Content Standards', 'Schedule D – Mentor Verification Policy'],
    activeMentorCount: 18,
  },
  {
    id: 'mt_founding',
    name: 'Founding Mentor',
    slug: 'founding-mentor',
    mentorSharePercent: 90,
    taalumaSharePercent: 10,
    badgeLabel: 'Founding Mentor',
    eligibilityCriteria: 'Manually assigned by Super Admin. Maximum 10 active Founding Mentors. 5-year program duration.',
    startDate: '2026-03-01',
    endDate: '2031-03-01',
    isActive: true,
    maxActiveMentors: 10,
    agreementVersion: 'v1.0',
    schedules: ['Schedule A – Revenue Share', 'Schedule B – Founding Mentor Program', 'Schedule C – Community & Content Standards', 'Schedule D – Mentor Verification Policy'],
    activeMentorCount: 7,
  },
  {
    id: 'mt_institutional',
    name: 'Institutional Mentor',
    slug: 'institutional-mentor',
    mentorSharePercent: 75,
    taalumaSharePercent: 25,
    badgeLabel: 'Institutional Mentor',
    eligibilityCriteria: 'Represents a university or accredited institution partner. Requires institutional agreement.',
    startDate: '2026-01-01',
    isActive: true,
    agreementVersion: 'v1.1',
    schedules: ['Schedule A – Revenue Share', 'Schedule C – Community & Content Standards'],
    activeMentorCount: 5,
  },
  {
    id: 'mt_corporate',
    name: 'Corporate Mentor',
    slug: 'corporate-mentor',
    mentorSharePercent: 70,
    taalumaSharePercent: 30,
    badgeLabel: 'Corporate Mentor',
    eligibilityCriteria: 'Enterprise or corporate partner with signed corporate mentor agreement.',
    startDate: '2026-01-01',
    isActive: true,
    agreementVersion: 'v1.0',
    schedules: ['Schedule A – Revenue Share', 'Schedule C – Community & Content Standards'],
    activeMentorCount: 3,
  },
];

export const MENTOR_TYPE_BADGE_COLORS: Record<string, string> = {
  'standard-mentor': 'bg-slate-100 text-slate-700 border-slate-200',
  'verified-mentor': 'bg-sky-50 text-sky-700 border-sky-200',
  'founding-mentor': 'bg-amber-50 text-amber-800 border-amber-200',
  'institutional-mentor': 'bg-violet-50 text-violet-700 border-violet-200',
  'corporate-mentor': 'bg-indigo-50 text-indigo-700 border-indigo-200',
};
