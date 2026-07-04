export type ApplicationStatus =
  | 'Pending Review'
  | 'Approved'
  | 'Waitlisted'
  | 'Rejected'
  | 'Suspended';

export type MentorConversionApplication = {
  id: string;
  applicantName: string;
  applicantEmail: string;
  submittedAt: string;
  linkedinUrl?: string;
  facebookUrl?: string;
  xUrl?: string;
  personalWebsite?: string;
  careerSummary: string;
  yearsOfExperience: number;
  bankName: string;
  accountName: string;
  accountNumber: string;
  taxId?: string;
  status: ApplicationStatus;
  adminNotes?: string;
};

export type MentorVerificationApplication = {
  id: string;
  mentorName: string;
  mentorEmail: string;
  submittedAt: string;
  mentorType: string;
  notes?: string;
  status: ApplicationStatus;
  adminNotes?: string;
};

export const APPLICATION_STATUS_COLORS: Record<ApplicationStatus, string> = {
  'Pending Review': 'bg-sky-50 text-sky-700 border-sky-200',
  Approved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Waitlisted: 'bg-amber-50 text-amber-700 border-amber-200',
  Rejected: 'bg-red-50 text-red-700 border-red-200',
  Suspended: 'bg-slate-100 text-slate-600 border-slate-200',
};

export const INITIAL_CONVERSION_APPLICATIONS: MentorConversionApplication[] = [
  {
    id: 'mca_001',
    applicantName: 'Grace Wanjiku',
    applicantEmail: 'grace.wanjiku@example.com',
    submittedAt: '2026-06-28T10:30:00Z',
    linkedinUrl: 'https://linkedin.com/in/gracewanjiku',
    personalWebsite: 'https://gracewanjiku.dev',
    careerSummary:
      'Career coach with 8 years helping professionals transition into tech and leadership roles across East Africa.',
    yearsOfExperience: 8,
    bankName: 'Equity Bank',
    accountName: 'Grace Wanjiku',
    accountNumber: '****4521',
    taxId: 'A001234567B',
    status: 'Pending Review',
  },
  {
    id: 'mca_002',
    applicantName: 'James Otieno',
    applicantEmail: 'j.otieno@example.com',
    submittedAt: '2026-06-20T14:00:00Z',
    facebookUrl: 'https://facebook.com/james.otieno.mentor',
    xUrl: 'https://x.com/jamesotieno',
    careerSummary: 'Former HR director mentoring graduates on employability, interviews, and workplace readiness.',
    yearsOfExperience: 12,
    bankName: 'KCB Bank',
    accountName: 'James Otieno',
    accountNumber: '****8890',
    status: 'Approved',
    adminNotes: 'Strong profile. Activated mentor role.',
  },
  {
    id: 'mca_003',
    applicantName: 'Amina Hassan',
    applicantEmail: 'amina.h@example.com',
    submittedAt: '2026-06-10T09:15:00Z',
    linkedinUrl: 'https://linkedin.com/in/aminahassan',
    careerSummary: 'Early-career applicant. Needs more professional experience before mentor activation.',
    yearsOfExperience: 3,
    bankName: 'Co-operative Bank',
    accountName: 'Amina Hassan',
    accountNumber: '****3312',
    status: 'Waitlisted',
    adminNotes: 'Revisit in 6 months.',
  },
];

export const INITIAL_VERIFICATION_APPLICATIONS: MentorVerificationApplication[] = [
  {
    id: 'mva_001',
    mentorName: 'Dr. Peter Kamau',
    mentorEmail: 'p.kamau@example.com',
    submittedAt: '2026-06-25T11:00:00Z',
    mentorType: 'Standard Mentor',
    notes: 'Published 4 blueprints with strong engagement metrics.',
    status: 'Pending Review',
  },
  {
    id: 'mva_002',
    mentorName: 'Sarah Mwangi',
    mentorEmail: 's.mwangi@example.com',
    submittedAt: '2026-06-15T16:45:00Z',
    mentorType: 'Standard Mentor',
    status: 'Approved',
    adminNotes: 'Verified via teamtaaluma@taaluma.world. Assigned VERIFIED tier (75/25).',
  },
];
