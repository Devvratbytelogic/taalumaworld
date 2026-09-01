export const AGREEMENT_TOUCHPOINTS = {
  CAREER_ARCHITECT_REGISTRATION: 'career_architect_registration',
  INSTITUTIONAL_CAREER_ARCHITECT_REGISTRATION: 'institutional_career_architect_registration',
  UNIVERSITY_REGISTRATION: 'university_registration',
  MENTOR_REGISTRATION: 'mentor_registration',
  BLUEPRINT_UPLOAD: 'blueprint_upload',
  CHECKOUT: 'checkout',
  MENTOR_PAYOUT_SETUP: 'mentor_payout_setup',
  NEWSLETTER: 'newsletter',
  CONTACT_FORM: 'contact_form',
  VERIFIED_MENTOR_APPLICATION: 'verified_mentor_application',
  AUDIO_VIDEO_MENTORING: 'audio_video_mentoring',
};

export const AGREEMENT_TOUCHPOINT_OPTIONS = [
  { value: AGREEMENT_TOUCHPOINTS.CAREER_ARCHITECT_REGISTRATION, label: 'Career Architect Registration' },
  { value: AGREEMENT_TOUCHPOINTS.INSTITUTIONAL_CAREER_ARCHITECT_REGISTRATION, label: 'Institutional Career Architect Registration' },
  { value: AGREEMENT_TOUCHPOINTS.UNIVERSITY_REGISTRATION, label: 'University Registration' },
  { value: AGREEMENT_TOUCHPOINTS.MENTOR_REGISTRATION, label: 'Mentor Registration' },
  { value: AGREEMENT_TOUCHPOINTS.BLUEPRINT_UPLOAD, label: 'Blueprint Upload' },
  { value: AGREEMENT_TOUCHPOINTS.CHECKOUT, label: 'Checkout' },
  { value: AGREEMENT_TOUCHPOINTS.MENTOR_PAYOUT_SETUP, label: 'Mentor Payout Setup' },
  { value: AGREEMENT_TOUCHPOINTS.NEWSLETTER, label: 'Newsletter Signup' },
  { value: AGREEMENT_TOUCHPOINTS.CONTACT_FORM, label: 'Contact Form' },
  { value: AGREEMENT_TOUCHPOINTS.VERIFIED_MENTOR_APPLICATION, label: 'Verified Mentor Application' },
  { value: AGREEMENT_TOUCHPOINTS.AUDIO_VIDEO_MENTORING, label: 'Audio/Video Mentoring' },
];

export const AGREEMENT_VISIBLE_USER_TYPES = {
  SUPER_ADMIN: 'Super Admin',
  CAREER_ARCHITECT: 'Career Architect',
  INSTITUTIONAL_CA: 'Institutional Career Architect',
  MENTOR: 'Mentor'
};

export const AGREEMENT_STATUS_OPTIONS = ['active', 'inactive'];
