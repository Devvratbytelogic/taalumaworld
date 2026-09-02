export interface DummyMentorActionItem {
  id: string;
  name: string;
  detail: string;
  time: string;
  status: string;
}

export interface DummyMentorActionQueue {
  id: 'registrations' | 'conversions' | 'verification' | 'upgrades';
  model: string;
  title: string;
  description: string;
  hrefKey: 'authors' | 'mentor_applications' | 'mentor_verification' | 'mentor_tier_upgrades';
  pendingCount: number;
  tone: 'blue' | 'green' | 'purple' | 'orange';
  items: DummyMentorActionItem[];
}

export const DUMMY_MENTOR_ACTION_QUEUES: DummyMentorActionQueue[] = [
  {
    id: 'registrations',
    model: 'Mentors',
    title: 'New mentor registrations',
    description: 'Mentors who recently joined the platform.',
    hrefKey: 'authors',
    pendingCount: 5,
    tone: 'green',
    items: [
      { id: 'reg-1', name: 'Grace Hassan', detail: 'grace.hassan@example.com', time: '2 hours ago', status: 'New' },
      { id: 'reg-2', name: 'David Mwangi', detail: 'david.mwangi@example.com', time: '5 hours ago', status: 'New' },
      { id: 'reg-3', name: 'Amina Otieno', detail: 'amina.otieno@example.com', time: 'Yesterday', status: 'New' },
    ],
  },
  {
    id: 'conversions',
    model: 'Mentor Application',
    title: 'Career Architect → Mentor',
    description: 'Conversion requests awaiting review.',
    hrefKey: 'mentor_applications',
    pendingCount: 8,
    tone: 'blue',
    items: [
      { id: 'conv-1', name: 'Faith Wanjiku', detail: 'Requested mentor access', time: '1 hour ago', status: 'Pending review' },
      { id: 'conv-2', name: 'Samuel Kariuki', detail: 'Requested mentor access', time: '4 hours ago', status: 'Pending review' },
      { id: 'conv-3', name: 'Naomi Chebet', detail: 'Requested mentor access', time: 'Yesterday', status: 'Pending review' },
    ],
  },
  {
    id: 'verification',
    model: 'Mentor Verification',
    title: 'Mentor verification',
    description: 'Applications for Verified Mentor status.',
    hrefKey: 'mentor_verification',
    pendingCount: 3,
    tone: 'purple',
    items: [
      { id: 'ver-1', name: 'James Ochieng', detail: 'ID and credentials submitted', time: '3 hours ago', status: 'Pending review' },
      { id: 'ver-2', name: 'Linda Njoroge', detail: 'Verification documents uploaded', time: 'Yesterday', status: 'Pending review' },
      { id: 'ver-3', name: 'Peter Mutua', detail: 'Verification documents uploaded', time: '2 days ago', status: 'Pending review' },
    ],
  },
  {
    id: 'upgrades',
    model: 'Mentor Tier Upgrade',
    title: 'Mentor tier upgrade applications',
    description: 'Requests to move to a higher mentor tier.',
    hrefKey: 'mentor_tier_upgrades',
    pendingCount: 4,
    tone: 'orange',
    items: [
      { id: 'upg-1', name: 'Helen Achieng', detail: 'STANDARD → VERIFIED', time: '6 hours ago', status: 'Pending review' },
      { id: 'upg-2', name: 'Brian Kimani', detail: 'STANDARD → PREMIUM', time: 'Yesterday', status: 'Pending review' },
      { id: 'upg-3', name: 'Mercy Atieno', detail: 'PREMIUM → VERIFIED', time: '3 days ago', status: 'Pending review' },
    ],
  },
];
